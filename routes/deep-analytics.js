const mongoose = require("mongoose");
const { IsTeacherAuthenticated } = require("../configs");
const { 
    SubSubAccountModel, LibpaperModel, 
    ZoeziQuestionModel, SpecialPaperModel, 
    specialPaperHistoryModel 
} = require("../models");

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
                        subject: req.params.subjectName,
                        isMarked: true
                    }
                },
                { $project: { studentID: 1, score: "$attemptTree.score", updatedAt: 1 } },
                {
                    $group: { 
                        _id: "$studentID",
                        lastPaper: {
                            $max: {
                                updatedAt: "$updatedAt",
                                score: "$score",
                                studentID: "$studentID"
                            }
                        },
                    }
                },
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

        special_papers = special_papers.filter(x => x).map(x => x.lastPaper);
        let combined_papers = [...special_papers,...normal_papers];

        // this is bad :)
        let performance_percentages = combined_papers.map(({ studentID, score }) => ({
            studentID,
            perf: +(((score.passed / score.total) * 100).toFixed(0))
        }))
        
        // remove the hard coding here :) do it later though
        performance_percentages = performance_percentages.reduce((acc, current) => {
            if (current.perf > 79) {
                acc['80 - 100'] += 1;
            }else if (current.perf > 64) {
                acc['65 - 79'] += 1;
            } else if (current.perf > 49) {
                acc['50 - 64'] += 1;
            } else {
                acc['0 - 49'] += 1;
            }

            return acc
        }, { '0 - 49': 0, '50 - 64': 0, '65 - 79': 0, '80 - 100': 0 });

        let active_students = [...new Set(combined_papers.map(x => x.studentID))].length;
        let active_mean = combined_papers.reduce((acc, x) => acc + (x.score.passed / x.score.total), 0) / active_students;

        return res.json({ 
            status: true, 
            analytics: {
                mean: active_mean,
                active: active_students,
                total: sub_sub_account.students.length,
                performance_percentages
            }
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Unknown error!"})
    }
});


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
            // special paper history :)
            // we want to group the papers by the student id and pick the latest of the two :)
            // find the position of the questions and also get their names :)
            // gradeName | secondTier | category
            specialPaperHistoryModel.aggregate([
                {
                    $match: { 
                        subsubAccountID: sub_sub_account._id.toString(),
                        subject: req.params.subjectName,
                        isMarked: true // ensure the tree is marked buana :)
                    }
                },

                // how do we group and take the latest addition
                // just get the paper id and then display the selected question :)
                { 
                    $project: { 
                        "attemptTree.pages": 1, 
                        studentID: 1, 
                        updatedAt: 1, 
                        gradeName: 1, secondTier: 1, category: 1,
                        paperID: 1
                    } 
                },
                {
                    $group: { 
                        _id: "$studentID",
                        lastPaper: {
                            $max: {
                                updatedAt: "$updatedAt",
                                attemptTree: "$attemptTree",
                                studentID: "$studentID",

                                // i know it looks ugly ---> i will modify it when i get time
                                gradeName: "$gradeName", secondTier: "$secondTier", category: "$category",
                                paperID: "$paperID"
                            }
                        },
                    }
                },
            ])
        ]);

        // we are done with this ( we are fetching the new papers done by the students :) )
        special_paper_content = special_paper_content.filter(x => x).map(x => x.lastPaper);

        // lets get the students who participated
        let students_who_did_the_papers = [
            ...new Set([...paper_content.map(x => x.studentID), ...special_paper_content.map(x => x.studentID)])
        ]

        // get the pages boundaries and then compute the question positions
        const compute_position = (() => {
            let pages = [] // page:questions

            return (page, page_content) => {
                let questions_upto = pages[page];

                if (!!!questions_upto) {
                    pages[page] = page_content.reduce((acc, _page_content) => {
                        return acc + (
                            _page_content.questionType === 'comprehension' ?
                            _page_content.content.children.length : 1
                        );
                    }, 0);
                }

                // lets assume that the pages are ranked from the 0 to (pageLength - 1)
                // return questions_upto;
                return pages.slice(0,page).reduce((acc, _page_questions) => 
                    acc + _page_questions, 0
                )
            }
        })();

        // this can be slow ( optimize it later )
        // the questions are still numbered i think :)
        special_paper_content = special_paper_content.map(({ 
            attemptTree, gradeName, secondTier, category, paperID 
        }, position) => {
            return ({
                content: attemptTree.pages.reduce((acc, x) => {
                    let start_page_boundary = compute_position(x.page, x.content); // remove one page :(
                
                    return [
                        ...acc,
                        ...x.content.map((y, question_offset_position) => {
                            // compute the pages :)
                            return ({
                                ...y,
                                position: start_page_boundary + question_offset_position + 1
                            })
                        })
                    ]
                }, []),

                // the general paper name
                paperName: `${gradeName.toUpperCase()} | ${secondTier} | ${category}`,
                paperID,
                position: position + 1 // this is useless
            })
        }).reduce((acc, y) => ({ 
            content: [ ...acc.content, ...y.content],

            // metadata
            paperName: y.paperName,
            paperID: y.paperID,
            position: y.position // this is wrong for now
        }), { content: [], paperID: "", paperName: "", position: 0 });
        
        /*
            questionId: {
                type: "normal" | "comprehension" (later probs kesho),
                family: [],
                paperName: null,
                paperID: null,
                position: 0
            }
        */
        // TODO: use proper names :)
        // TODO: use the optionIndex in the special paper content options
        let _result = [...paper_content, special_paper_content].reduce((top_level_acc, u) => {
            const { paperName, paperID } = u;

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
                            family: [y.content],
                            paperName, // if not present ( this will be null in the case of non special questions )
                            paperID, // this suffers the same fate as stated above
                            questionPosition: y.position // suffers the same fate
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
                            family: [y.content],
                            paperName, // if not present ( this will be null in the case of non special questions )
                            paperID, // this suffers the same fate as stated above
                            questionPosition: y.position// suffers the same fate
                        } 
                    }
                }
    
                // we will ignore the old type of questions for now :)
                return acc;
            }, {});

            return ({ ...top_level_acc, ..._top_level })
        }, {});

        // we need to pre-process the comprehension questions a little further
        // we just return the same stuff apart from the comprehension questions
        _result = Object.entries(_result).reduce((acc, [questionId, { type: questionType, family, paperName, paperID, questionPosition }]) => {
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
                        paperName, paperID, questionPosition,
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
            return { ...acc, [questionId]:{ 
                type: questionType, 
                family, 
                children: {}, 
                paperName, paperID, questionPosition }}
        }, {});

        // TODO: handle all question types :)
        let stats = Object.entries(_result).map(([questionId, {type: questionType, family, children: comp_children, paperName, paperID, questionPosition,}]) => {
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
                    paperName, paperID, questionPosition,
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
                paperName, paperID, questionPosition,
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

        // console.log(stats);

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

router.get("/paper/:paperID", [
    IsTeacherAuthenticated
], async (req, res) => {
    try {
        // get the paper and then resolve the questions and then return it
        let paper = await SpecialPaperModel.findOne({ 
            _id: req.params.paperID 
        }).populate('questions');

        return res.json({ status: true, paper });
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Unknown error!"})
    }
})


module.exports = router;