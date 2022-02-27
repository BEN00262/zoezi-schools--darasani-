const mongoose = require("mongoose");
const { IsTeacherAuthenticated } = require("../configs");
const { SubSubAccountModel, LibpaperModel, ZoeziQuestionModel, SpecialPaperModel, specialPaperHistoryModel } = require("../models");

const router = require("express").Router();

router.get("/subject-mean/:classId/:grade/:subjectName", [
    IsTeacherAuthenticated
], async (req, res) => {
    try {
        // somehow compute the mean of the class per the subject ( irregardless of whether its special or not :) )
         // get the sub sub account id
        let sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        });

        if (!sub_sub_account) {
            throw new Error("Failed to fetch grade");
        }

        let [special_papers, normal_papers] = await Promise.all([
            specialPaperHistoryModel.aggregate([
                {
                    $match: {
                        subsubAccountID: sub_sub_account._id.toString(),
                        // fuzzy match this inorder to get all the subjects with the subject within it
                        subject: req.params.subjectName 
                    }
                },
                { $project: { studentID: 1, score: "$attemptTree.score" } }
            ]),
            LibpaperModel.aggregate([
                {
                    $match: {
                        subsubAccountID: sub_sub_account._id.toString(), 
                        // fuzzy match this inorder to get all the subjects with the subject within it
                        subject: req.params.subjectName 
                    }
                },
                { $project: { studentID: 1, score: 1 } }
            ])
        ]);

        let combined_papers = [...special_papers,...normal_papers];
        
        let active_students = [...new Set(combined_papers.map(x => x.studentID))].length;
        let active_mean = combined_papers.reduce((acc, x) => acc + (x.score.passed / x.score.total), 0) / active_students;

        return res.json({ 
            status: true, 
            analytics: {
                mean: active_mean,
                active: active_students,
                total: sub_sub_account.students.length
            }
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Unknown error!"})
    }
})


// fetch most failed questions for a given subscription
// fetch on the sub sub account id and the subject only :) --> that will always be linked to the given grade
router.get("/:classId/:grade/:subjectName", [
    IsTeacherAuthenticated
], async (req, res) => {
    try {
        // get the sub sub account id
        let sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        });

        if (!sub_sub_account) {
            throw new Error("Failed to fetch grade");
        }

        // getting the paper_content ( normal papers ) and the special_paper_content ( special papers (kcpe for now) )
        let [paper_content, special_paper_content] = await Promise.all([
            LibpaperModel.aggregate([
                {
                    $match: { 
                        subsubAccountID: sub_sub_account._id.toString(),
                        subject: req.params.subjectName 
                    }
                },
                { $project: { content: 1 } },
            ]),
            
            // fetch the special papers and extract the questions from there 
            specialPaperHistoryModel.aggregate([
                {
                    $match: { 
                        subsubAccountID: sub_sub_account._id.toString(),
                        subject: req.params.subjectName,
                        isMarked: true // ensure the tree is marked buana :)
                    }
                },
                { $project: { "attemptTree.pages.content": 1 } }
            ])
        ]);

        special_paper_content = special_paper_content.map(({ attemptTree }) => {
            return ({
                content: attemptTree.pages.reduce((acc, x) => [
                    ...acc,
                    ...x.content
                ], [])
            })
        }).reduce((acc, y) => ({
            content: [ ...acc.content, ...y.content]
        }), { content: [] });

        /*
            questionId: {
                type: "normal" | "comprehension" (later probs kesho),
                family: []
            }
        */
    //    TODO: use proper names :)
            // TODO: use the optionIndex in the special paper content options
        let _result = [...paper_content, special_paper_content].reduce((top_level_acc, u) => {
            let _top_level = u.content.reduce((acc, y) => {
                if (y.questionType === "normal") {
                    let questionFound = acc[y.content.question.toString()];
    
                    if (questionFound) {
                        return {
                            ...acc,
                            [y.content.question.toString()]: {
                                ...questionFound,
                                family: [
                                    ...questionFound.family,
                                    y.content
                                ]
                            }
                        }
                    }
    
                    return { 
                        ...acc, 
                        [y.content.question.toString()]: {
                            type: "normal",
                            family: [y.content]
                        } 
                    }
                }
    
                return acc;
            }, {});

            return { ...top_level_acc, ..._top_level }
        }, {});

        // TODO: handle all question types :)
        let stats = Object.entries(_result).map(([questionId, {type: questionType, family}]) => {
            /*
                choiceId: count
            */

            let stats = family.reduce((acc, x) => {
                return ({
                    passed: acc.passed + (x.status ? 1 : 0),
                    failed: acc.failed + (!x.status ? 1 : 0),
                    choices: {
                        ...acc.choices,
                        ...x.attempted_options.reduce((c_acc, y) => ({
                            ...c_acc,
                            [y.optionID]: 1 + (acc.choices[y.optionID] ? acc.choices[y.optionID] : 0)
                        }), {})
                    }
                })
            },{ passed: 0, failed: 0, choices: {} })

            return ({
                questionId,
                students: family.length, // after we take the latest per student ( this will give the correct number )
                ...stats // shows the passed / failed 
            })
        })
            .filter(x => x.failed > 0).sort((first, second) => (first.failed/first.students) < (second.failed/second.students) ? 1 : -1).slice(0,5); // take the top 5 questions

        // resolve the questions
        stats = await Promise.all(stats.map(async (x) => ({
            ...x,
            question: await ZoeziQuestionModel.findOne({ _id: x.questionId })
        })));

        return res.json({ 
            status: true, 
            paper: {
                stats,
                students: sub_sub_account.students.length // the number of students in the class :)
            } 
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Unknown error!"})
    }
})


module.exports = router;