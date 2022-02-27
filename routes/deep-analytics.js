const mongoose = require("mongoose");
const { IsTeacherAuthenticated } = require("../configs");
const { SubSubAccountModel, LibpaperModel, ZoeziQuestionModel } = require("../models");

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
            [],
            LibpaperModel.aggregate([
                {
                    $match: {
                        subsubAccountID: sub_sub_account._id.toString(), 
                        grade: req.params.grade, 
                        // fuzzy match this inorder to get all the subjects with the subject within it
                        subject: req.params.subjectName 
                    }
                },
                { $project: { studentID: 1, score: 1 } }
            ])
        ]);

        let active_students = [...new Set(normal_papers.map(x => x.studentID))].length;
        let active_mean = normal_papers.reduce((acc, x) => acc + (x.score.passed / x.score.total), 0) / active_students;

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
router.get("/:classId/:grade/:subjectName/:isSpecial?", [
    IsTeacherAuthenticated
], async (req, res) => {
    try {
        let { isSpecial } = req.params;
        isSpecial = isSpecial ? isSpecial.toLowerCase() === "special" : false;

        // get the sub sub account id
        let sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        });

        if (!sub_sub_account) {
            throw new Error("Failed to fetch grade");
        }


        if (isSpecial) {
            // fetch the special questions
            // start work on the special papers later :)
            return res.json({ 
                status: true, 
                paper: {
                    stats: [],
                    students: sub_sub_account.students.length // the number of students in the class :)
                } 
            })
        }

        // fetch the normal questions from the library papers
        // subsubAccountID
        let paper_content = await LibpaperModel.aggregate([
            { 
                $match: { 
                    subsubAccountID: sub_sub_account._id.toString(), 
                    grade: req.params.grade, 
                    subject: req.params.subjectName 
                }
            },
            { $project: { content: 1 } }
        ]);

        // create a function to do whatever we want :)
        // how do we do this :)
        // we loop and find unique ids and do whatever
        // look at the types of the questions also
        // we need to have a way :) resolve the data later :)
        // group the questions by their id
        /*
            questionId: {
                type: "normal" | "comprehension" (later probs kesho),
                family: []
            }
        */
    //    TODO: use proper names :)
        let _result = paper_content.reduce((top_level_acc, u) => {
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
        }, {})

        // do the magic of finding the 
        // console.log(
        //     _result.map(x => ({
        //         ...x,
        //         passed: x.status
        //     }))
        // )
        // we are assuming that we are working with normal questions :)
        let stats = Object.entries(_result).map(([questionId, {type: questionType, family}]) => {
            // go into the family and gather analytics
            // selected choices :)
            // this is an array of the selected choices which we can then use to find the percentages

            // the choices are an array of choice statistics
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

        // console.log(stats);

        // resolve the questions
        stats = await Promise.all(stats.map(async (x) => ({
            ...x,
            question: await ZoeziQuestionModel.findOne({ _id: x.questionId })
        })));

        // // filter the top five results and then return them :)
        // console.log({
        //     stats,
        //     students: sub_sub_account.students.length // the number of students in the class :)
        // });

        // console.log(stats);


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