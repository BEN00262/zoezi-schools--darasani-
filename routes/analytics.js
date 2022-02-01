const router = require('express').Router();
const mongoose = require('mongoose');

const { 
    SecondTierModel, 
    MultiLevelModel, UserDataModel:UserDetailsModel, 
    specialPaperHistoryModel: SpecialPaperHistory, 
    SubSubAccountModel,
    StudentModel
} = require("../models");

// child account stuff middlewares
const { IsSchoolAuthenticated } = require('../configs');


router.use([IsSchoolAuthenticated]);

// TODO: write validators for paths in this route

/*
    SUBJECT ANALYTICS

*/

router.get("/subject/:classId/:subject_name", async (req, res) => {
    try {
        const { classId, subject_name } = req.params;

        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }


        let [normal_plottable, plottable] = await Promise.all([
            UserDetailsModel.aggregate([
                { 
                    $match: {
                        subsubAccountID: current_sub_sub_account._id.toString(),
                        subjectName: subject_name
                    }
                },
                {
                    $group: {
                        _id: { studentId: "$studentID", gradeName: "$gradeName"},
                        performance: { $push: '$$CURRENT' }
                    }
                }
            ]),
            SpecialPaperHistory.aggregate([
                { 
                    $match: {
                        subsubAccountID: current_sub_sub_account._id.toString(),
                        isMarked: true,
                        subject: subject_name
                    }
                },
                {
                    $project: { "attemptTree.pages": 0 }
                },
                {
                    $group: {
                        _id: { studentId: "$studentID", gradeName: "$gradeName"},
                        performance: { $push: '$$CURRENT' }
                    }
                }
            ])
        ])


        // old data format
        normal_plottable = normal_plottable.reduce((acc, x) => {
            let element = acc.find(y => y.studentId === x._id.studentId);
    
            if (element) {
                element.grades = [
                    ...(element.grades || []),
                    {
                        name: x._id.gradeName,
                        is_special: false,
                        subject: x.performance.map(t => ({
                            subjectName: t.subjectName,
                            ups: t.ups,
                            downs: t.downs,
                            total: t.totalQuestionsAttempted
                        }))
                    }
                ]
                return acc
            }
    
            return [
                ...acc,
                {
                    studentId: x._id.studentId,
                    grades: [
                        {
                            name: x._id.gradeName,
                            is_special: false,
                            subject: x.performance.map(t => ({
                                subjectName: t.subjectName,
                                ups: t.ups,
                                downs: t.downs,
                                total: t.totalQuestionsAttempted
                            }))
                        }
                    ]
                }
            ]
    
        }, []);


        // new data format
        // fetch the special ones and then do the operations
        plottable = plottable.reduce((acc, x) => {
            let element = acc.find(y => y.studentId === x._id.studentId);
    
            if (element) {
                element.grades = [
                    ...(element.grades || []),
                    {
                        name: x._id.gradeName,
                        is_special: true,
                        subject: x.performance.map(t => ({
                            subjectName: t.subject,
                            category: t.category,
                            secondTier: t.secondTier,
                            ups: t.attemptTree.score.passed,
                            downs: t.attemptTree.score.total - t.attemptTree.score.passed,
                            total: t.attemptTree.score.total
                        }))
                    }
                ]
                return acc
            }
    
            return [
                ...acc,
                {
                    studentId: x._id.studentId,
                    grades: [
                        {
                            name: x._id.gradeName,
                            is_special: true,
                            subject: x.performance.map(t => ({
                                subjectName: t.subject,
                                category: t.category,
                                secondTier: t.secondTier,
                                ups: t.attemptTree.score.passed,
                                downs: t.attemptTree.score.total - t.attemptTree.score.passed,
                                total: t.attemptTree.score.total
                            }))
                        }
                    ]
                }
            ]
    
        }, []);



        let final_plottable = await Promise.all([...normal_plottable, ...plottable].reduce((acc, x) => {
            let element = acc.find(y => y.studentId === x.studentId);

            if (element) {
                element.grades = [ ...element.grades, ...x.grades ]
                return acc;
            }

            return [ ...acc, x ]
        }, []).map(async x => ({
            ...x,
            student: await StudentModel.findOne({ _id: x.studentId }).select("firstname lastname")
        })));

        
        return res.json({ plottable: final_plottable })
    } catch(error) {
        console.log(error);
        return res.status(500).json([])
    }
})

// UTILS
// i.e if the guy is really subbed into the grade they are trying to pull the data for
// params is an array of the parameters arranged in ( gradeName, subType, subsubType ) way
// if empty we assume initial fetch and only return the grades ( this enables us to ensure the person is really subbed to the grade )
const modelFactory = async (params, user) => {
    // first filter the array to remove null | undefined shit
    params = params.filter(unit => unit).map(unit => `${unit}`) // prevents some exploits --> i think

    if (params.length === 0) {
        let grades_found = user.subscriptions.filter(
            x => x.status
            ).map(x => ({ grade: x.gradeName, is_special: x.is_special, _id: x.gradeID })
        ).reduce(
            (acc, element) => 
                acc.find(
                    x => (x.grade === element.grade) && (x.is_special === element.is_special)
                ) ? acc : [ ...acc, element ]
        , []);

        return grades_found
    }

    switch (params.length) {
        case 1:
            {
                // /kcpe | the _id is what we are using :)
                // console.log(params)
                let subTypes = await MultiLevelModel.findOne({ _id: params[0] }).populate("children", "name");
                
                return (subTypes.children || []).map(({ _id, name }) => ({
                    _id, subType: name
                }));
            }
        case 2:
            {
                // /kcpe/Past Paper ( we have the _id )
                let subsubTypes = await SecondTierModel.findOne({ _id: params[1] }).populate("midTiers", "name");

                return (subsubTypes.midTiers || []).map(({ _id, name }) => ({
                    _id, subsubType: name
                }));
            }
        default:
            {
                // this my people is a bug | or someone trying to fuck with us 
                return []
            }
    }    
}

// use for both grade analytics and the individual analytics
// using this ---> its easy for us to ensure that you are registered for this grade :)
router.get("/:studentId/:classId/special_paper_stats/:gradeName?/:subType?", async (req, res) => {
    const { gradeName, subType } = req.params;

    try {
        // here we have to actually fetch the grades from the system and ensure they are bought
        // pass the current sub sub account to get the mterics on that :)
        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }

        let stats = await modelFactory([ gradeName, subType ], current_sub_sub_account);

        return res.json(stats);
    } catch(error) {
        console.log(error);
        return res.status(500).json([])
    }
});

/*
    GRADE ANALYTICS
*/

// pass the classId and fetch the analytics of the student
// fetch the analytics for a given class only
router.get("/:classId/report_analytics/:grade", async (req, res) => {
    try {
        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }

        // old stuff ( group and do other stuffs :) )
        let plottable = await UserDetailsModel.aggregate([
            { 
                $match: {
                    subsubAccountID: current_sub_sub_account._id.toString(),
                    gradeName: req.params.grade 
                }
            },
            {
                $group: {
                    _id: "$subjectName",
                    performance: { $push: '$$CURRENT' }
                }
            },
            {
                $project: {
                    studentID: 0,
                    subsubAccountID: 0,
                    subjectID: 0,
                    __v: 0,
                    dateCollected: 0,
                }
            }
        ])

        // do the summations here :)
        plottable = plottable.map(x => {
            // get the totals and the ups to compute the performance %
            let { ups, total } = x.performance.reduce((acc, y) => ({
                ups: y.ups + acc.ups,
                total: y.totalQuestionsAttempted + acc.total
            }),{ ups: 0, total: 0})
            
            return ({
                subject: x._id,
                performance: Math.ceil((ups / (total || 1)) * 100)
            })
        })

        return res.json(plottable)
    } catch(error) {
        console.log(error);

        return res.json([])
    }
});

// pass the subject name , category and the year
router.get("/:classId/special-paper-analytics/:multi_level/:second_tier/:mid_tier", async (req, res) => {
    const { multi_level, second_tier, mid_tier } = req.params;

    try {
        // group by subject ( for ease in access )
        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }

        // get an array of the latest data set ( not including the test stuff )
        // we need to build a powerful data aggregator

        let data = await SpecialPaperHistory.aggregate([
            {
                $match: {
                    gradeName: multi_level.split("_")[0], // e.g KCPE
                    secondTier: second_tier, // Past paper
                    category: mid_tier, // 2018
                    isMarked: true, // the paper is already finished
                    // userID: req.user._id.toString()
                    // studentID: req.params.studentId,
                    subsubAccountID: current_sub_sub_account._id.toString(),
                }
            },
            { $project: { subject: 1, createdAt: 1, updatedAt: 1, "attemptTree.score": 1 } },
            {
                $group: { 
                    _id: "$subject",
                    progress: { $push: '$$CURRENT' },
                }
            }
        ]);

        data = data.map(datapoint => ({
           subject: datapoint._id,
           progress: datapoint.progress.sort(
               (first, second) => (new Date(first.createdAt)).getTime() - (new Date(second.createdAt)).getTime()
            )
        }))

        return res.json({ data })
    } catch(error) {
        console.log(error);

        // returns nothing to the frontend
        return res.status(500).json({})
    }
})

/*

    STUDENT SPECIFIC ANALYTICS

*/

// grade fetching for the new analytics
router.get("/:studentId/:classId/report_analytics/:grade", async (req, res) => {
    try {
        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }

        let plottable = await UserDetailsModel.aggregate([
            { 
                $match: { 
                    // userID: req.user._id.toString(), ---> for other reasons
                    studentID: req.params.studentId,
                    subsubAccountID: current_sub_sub_account._id.toString(),
                    gradeName: req.params.grade 
                }
            },
            {
                $project: {
                    // userID: 0,
                    studentID: 0,
                    subsubAccountID: 0,
                    subjectID: 0,
                    _id: 0,
                    __v: 0,
                    dateCollected: 0,
                }
            }
        ])

        return res.json(plottable)
    } catch(error) {
        console.log(error);

        return res.json([])
    }
});

// pass the subject name , category and the year
router.get("/:studentId/:classId/special-paper-analytics/:multi_level/:second_tier/:mid_tier", async (req, res) => {
    const { multi_level, second_tier, mid_tier } = req.params;

    try {
        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }

        // get an array of the latest data set ( not including the test stuff )
        // we need to build a powerful data aggregator

        let data = await SpecialPaperHistory.aggregate([
            {
                $match: {
                    gradeName: multi_level.split("_")[0], // e.g KCPE
                    secondTier: second_tier, // Past paper
                    category: mid_tier, // 2018
                    isMarked: true, // the paper is already finished
                    // userID: req.user._id.toString()
                    studentID: req.params.studentId,
                    subsubAccountID: current_sub_sub_account._id.toString(),
                }
            },
            { $project: { subject: 1, createdAt: 1, updatedAt: 1, "attemptTree.score": 1 } },
            {
                $group: { 
                    _id: "$subject",
                    progress: { $push: '$$CURRENT' },
                }
            }
        ]);

        data = data.map(datapoint => ({
           subject: datapoint._id,
           progress: datapoint.progress.sort(
               (first, second) => (new Date(first.createdAt)).getTime() - (new Date(second.createdAt)).getTime()
            )
        }))

        return res.json({ data })
    } catch(error) {
        console.log(error);

        // returns nothing to the frontend
        return res.status(500).json({})
    }
})

module.exports = router;