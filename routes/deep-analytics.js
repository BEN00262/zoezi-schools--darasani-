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
        // return the correct number of students that did the papers :)
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
                { $project: { content: 1, studentID: 1 } },
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
                { $project: { "attemptTree.pages.content": 1, studentID: 1 } }
            ])
        ]);

        // lets get the students who participated
        let students_who_did_the_papers = [
            ...new Set([...paper_content.map(x => x.studentID), ...special_paper_content.map(x => x.studentID)])
        ]

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
                } else if (y.questionType === "comprehension") {
                    // TODO: compress this operation later
                    let questionFound = acc[y.content.question.toString()];

                    // comprehension stuff ( now reduce the question children )
                    // return the data there ( we need to process the comprehension questions further )

                    if (questionFound) {
                        // also loop through the children and form something :)
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
                            type: "comprehension",
                            family: [y.content]
                        } 
                    }
                }
    
                // we will ignore the old type of questions for now :)
                return acc;
            }, {});

            return { ...top_level_acc, ..._top_level }
        }, {});

        // we need to pre-process the comprehension questions a little further
        // we just return the same stuff apart from the comprehension questions
        _result = Object.entries(_result).reduce((acc, [questionId, { type: questionType, family }]) => {
            if (questionType === "comprehension") {
                // go through the entire family and gather the data :)
                // what do we do :)
                
                return { 
                    ...acc, 
                    [questionId]:{ 
                        type: questionType, 
                        family, /*family.reduce((f_acc, x) => {
                            // the children are sort of the content in the normal type of question 
                            // the way we handle them is by doing what we do in the normal questions :)
                            return [...f_acc, ...x.children]
                        }, [])*/
                        children: family.reduce((parent_acc, u) => {
                            return ({
                                ...parent_acc,
                                ...u.children.reduce((children_acc, y) => {
                                    // NOTE: all the children are of normal type so we dont have to check :)
                                    let questionFound = parent_acc[y.question.toString()];
            
                                    if (questionFound) {
                                        return {
                                            ...children_acc,
                                            [y.question.toString()]: {
                                                ...questionFound,
                                                family: [
                                                    ...questionFound.family, // whatever was there before 
                                                    y // the child's content
                                                ]
                                            }
                                        }
                                    }
                    
                                    return { 
                                        ...children_acc, 
                                        [y.question.toString()]: {
                                            type: "normal", // NOTE: we can leave this here irregardless :)
                                            family: [y]
                                        } 
                                    }
                                }, {})
                            })
                        }, {})
                    }
                }
            }

            // just return it :)
            return { ...acc, [questionId]:{ type: questionType, family, children: {} }}
        }, {});

        // TODO: handle all question types :)
        let stats = Object.entries(_result).map(([questionId, {type: questionType, family, children: comp_children}]) => {
            /*
                choiceId: count
            */

            // this is the processing for the normal paper questions :)
            if (questionType === "comprehension") {
                // process the comprehension questions here
                // process the data now :)
                // we use the same tactic as we use in the normal questions ( by default comprehension questions have only the default stuff );
                // we need to resolve the children and do whatever man
                // different ball game here
                let _compStats = Object.entries(comp_children).map(([childQuestionId, { type: childQuestionType, family: childFamily }]) => {
                    // we dont care for the type
                    let _childStats = childFamily.reduce((acc, x) => {
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
                    },{ passed: 0, failed: 0, choices: {} });

                    return ({
                        questionId: childQuestionId,
                        students: family.length, // after we take the latest per student ( this will give the correct number )
                        ..._childStats // shows the passed / failed 
                    })
                });

                // for the perfomance and the analytics 
                return ({
                    questionId,
                    students: family.length, // after we take the latest per student ( this will give the correct number )
                    children_stats: _compStats, // shows the passed / failed
                    ..._compStats.reduce((acc, x) => ({
                        failed: acc.failed + x.failed,
                        passed: acc.passed + x.passed
                    }), { failed: 0, passed: 0})
                })
            }

            // the stats ( the stats )
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

        // students who did the paper :)
        return res.json({ 
            status: true, 
            paper: {
                stats,
                students_who_did: students_who_did_the_papers.length,
                students: sub_sub_account.students.length // the number of students in the class :)
            } 
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Unknown error!"})
    }
})


module.exports = router;