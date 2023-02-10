const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');
const {
    param,
    validationResult
} = require("express-validator")

const { 
    SecondTierModel, 
    MultiLevelModel, UserDataModel:UserDetailsModel, 
    specialPaperHistoryModel: SpecialPaperHistory, 
    MidTierLevelModel,
    SubSubAccountModel,
    StudentModel,
    LibpaperModel,
    SpecialPaperModel,
    ZoeziQuestionModel
} = require("../models");

// child account stuff middlewares
const { IsTeacherAuthenticated } = require('../configs');


router.use([IsTeacherAuthenticated]);

// TODO: write validators for paths in this route

/*
    SUBJECT ANALYTICS

*/

// new subjects analysis on per student basis ( much more efficient )
// as long as your are authenticated but for now we will scope it to a school
router.get("/subject/:classId/:studentId/:subject_name",[
    param('classId')
        .custom(value => {
            if (!mongoose.isValidObjectId(value)){
                throw new Error("Invalid classId");
            }
        }),
    param('studentId')
        .custom(value => {
            if (!mongoose.isValidObjectId(value)){
                throw new Error("Invalid studentId");
            }
        })
],async (req, res) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         status: false,
    //         errors: errors.map(({ param, msg }) => `${param} | ${msg}`)
    //     })
    // }


    try {
        const { classId, subject_name, studentId } = req.params;

        // we only need this and the student id :)
        let current_sub_sub_account = await SubSubAccountModel.findOne({ 
            parentID: mongoose.Types.ObjectId(classId),
            schoolOrOrganizationID: req.school._id
        })

        if (!current_sub_sub_account) {
            return res.status(404).json([])
        }

        // resolve both the normal and the special papers and do some rewrittings ( we should group them also ())
        // all the papers the student has done over the 
        let [normal_plottable, special_plottable, student] = await Promise.all([
            // normal plottable
            UserDetailsModel.aggregate([
                { 
                    $match: {
                        subsubAccountID: current_sub_sub_account._id.toString(),
                        subjectName: subject_name,
                        studentID: studentId
                    }
                },
            ]),

            // special plottable
            SpecialPaperHistory.aggregate([
                {
                    $match: {
                        subsubAccountID: current_sub_sub_account._id.toString(),
                        subject: subject_name,
                        studentID: studentId,
                        isMarked: true
                    }
                }
            ]),

            // restrict the data passed to the firstname, lastname and the profilePic 
            StudentModel.findOne({
                _id: mongoose.Types.ObjectId(studentId) 
            }).select('firstname lastname profilePic gender')
        ]);

        /*
            {
                subject: "",
                latestDone: "" // the date of the last update to use for our stuff :)
            }
        */
        // clean the normal_plottable ( use the update time :) )
        normal_plottable = normal_plottable.reduce((acc, x) => {
            let found = acc.find(y => y.subject === x.gradeName);

            if (found) {
                if (moment(x.updatedAt).isAfter(moment(found.latestDone))) {
                    found.latestDone = x.updatedAt;
                }
                return acc
            }

            return [
                ...acc,
                // the id for this one is the subjectName ---> its easier to fetch the data that way
                { subject: x.gradeName, latestDone: x.updatedAt, paperID: x.subjectName, isSpecial: false }
            ]
        }, []);

        special_plottable = special_plottable.reduce((acc, x) => {
            let _full_paper_name = `${x.gradeName} | ${x.secondTier} | ${x.category}`
            let found = acc.find(y => y.subject === _full_paper_name);

            if (found) {
                if (moment(x.updatedAt).isAfter(moment(found.latestDone))) {
                    found.latestDone = x.updatedAt;
                }
                return acc
            }
            return [
                ...acc,
                { subject: _full_paper_name, latestDone: x.updatedAt, paperID: x.paperID, isSpecial: true  }
            ]
        }, []);

        // combine the two datasets and then sort on the date :)
        // we have the papers that the student did sorted in a chronological order ;)
        return res.json({
            student,
            papersDone: [...normal_plottable, ...special_plottable].sort((a, b) => moment(a).isAfter(moment(b)) ? -1 : 1)
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json([])
    }
})



// fetch the analytics of a student per basis
// also resolve a part of the library at the same time :)
// analytics per learner :)
router.get("/learner/:studentId/:paperID/:isSpecial?", async (req, res) => {
    try {
        const { studentId, paperID, isSpecial } = req.params; // get the data and then ue it to fetch the data

        // we sort by the updatedAt and then take the top 3 stuff :)
        // we have the data already :)
        if (!isSpecial || !(isSpecial.toLowerCase() === "special")) {
            let plottable = await LibpaperModel.aggregate([
                {
                    $match: {
                        studentID: studentId,
                        subject: paperID
                    }
                },
                { $sort: { when: -1 } },
                { $limit: 3 },
                { $project: { subject: 1, score: 1, grade: 1, content: 1, userID: 1 } }
            ]);

            // fetch the papers :) and then resolve the paper one way :) what the hell ---> feels like a slow query but we have to do it
            // TODO: optimize the query later
            // we really dont care for the userID ---> so we just pass it :)
            // we get the _ids for the questions to resolve
            // get the first plottable, resolve the questions and we are good to go :)

            // let firstAttempt = plottable.length > 0 ? plottable[0].content.map(x => x.content.question) : [];
            let trees = await Promise.all(plottable.map(async (y) => {
                return ({
                    ...y,
                    content: await Promise.all(y.content.map(async (x) => ({
                        ...x,
                        content: {
                            ...x.content,
                            question: await ZoeziQuestionModel.findOne({ _id: x.content.question})
                        }
                    })))
                })
            })) // the trees ( which will be used )

            return res.json({ 
                time_per_question: 0, // this does not apply to this type of questions

                // we need an attempt tree :)
                attempt_trees: {
                    isSpecial: false,
                    paper: {},
                    trees,
                    prevStates: []
                },

                plottable: plottable.map(x => ({
                    ...x,
                    paperID: "",
                    grade: x.grade,
                    isSpecial: false
                }))
            }) // this part fulfills the contract we are all good :)
        }

        // we fetch the special one :)
        let plottable = await SpecialPaperHistory.aggregate([
            {
                $match: {
                    paperID: mongoose.Types.ObjectId(paperID),
                    isMarked: true, 
                    studentID: req.params.studentId,
                }
            },
            { $sort: { updatedAt: -1 } }, // sort by the last time the student did the paper 
            { $limit: 3 }, // get the top three ( the latest ones )
            // { 
            //     // we get the attemptTree and then use it :) for the purposes
            //     $project: { 
            //         subject: 1, createdAt: 1, 
            //         updatedAt: 1, gradeName: 1, 
            //         paperID: 1, attemptTree: 1 
            //     } 
            // },
        ]);

        let _times = plottable.map(x => ({ createdAt: x.createdAt, updatedAt: x.updatedAt }))
        
        // time per paper ( average time ) --> divide by the number of questions to get the data :)
        let time_per_paper = _times.reduce(
            (acc, y) => acc + moment(y.updatedAt).diff(moment(y.createdAt))
            , 0) / (_times.length || 1);


        // hpw the hell are we 
        let _firstPaperID = plottable.length > 0 ? plottable[0].paperID : null;

        return res.json({
            time_per_question: Math.ceil(
                time_per_paper / (plottable.length ? plottable[0].attemptTree.score.total : 1)
            ),
            // we need an attempt tree :)
            // for this we can resolve the questions one time and then merge the trees together :)
            // resolve the paper its kind of the questions :)
            // paperID
            /*
                if (prevState) {
                    prevState = {
                        ...prevState,
                        attemptTree: {
                            ...prevState.attemptTree,
                            pages: prevState.attemptTree.pages.reduce((acc, {page, content}) => ({
                                    ...acc,
                                    [page]: content
                            }), {})
                        }
                    }
                };
            */
            attempt_trees: {
                isSpecial: true,
                // this is the questions
                paper: _firstPaperID ? (await SpecialPaperModel.findOne({ _id: _firstPaperID }).populate("questions")) : {},
                
                prevStates: (plottable || []).map(x => ({
                    ...x,
                    attemptTree: {
                        ...x.attemptTree,
                        pages: x.attemptTree.pages.reduce((acc, {page, content}) => ({
                                ...acc,
                                [page]: content
                        }), {})
                    },
                })), // these are the trees to be used in rendering the paper :)
                // get the trees :)
                trees: []
            },
            plottable: plottable.map(x => ({
                _id: x._id,
                subject: x.subject,
                paperID: x.paperID,
                grade: x.gradeName,
                isSpecial: true,
                score: {
                    passed: x.attemptTree.score.passed,
                    total: x.attemptTree.score.total,
                }
            })) 
        });
    } catch(error) {
        // for special ones we just copy the code down here :)
        console.log("am the one")
        console.log(error);
        return res.status(500).json([])
    }
})



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

        // we need a way to get the data quickly
        // do the summations here :)
        plottable = plottable.map(x => {
            // get the totals and the ups to compute the performance %
            let { ups, total } = x.performance.reduce((acc, y) => ({
                ups: y.ups + acc.ups,
                total: y.totalQuestionsAttempted + acc.total
            }),{ ups: 0, total: 0})
            
            // we also need to find a way of computing this 
            return ({
                subject: x._id,
                // get the data and then return it :)
                performance: ((ups / (total || 1)) * 100) / current_sub_sub_account.students.length
            })
        })

        return res.json(plottable)
    } catch(error) {
        console.log(error);

        return res.json([])
    }
});

// pass the subject name , category and the year
// we are at this point
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
                    gradeName: multi_level.split("_")[0],
                    secondTier: second_tier,
                    category: mid_tier,
                    isMarked: true,
                    subsubAccountID: current_sub_sub_account._id.toString(), // get the subscription on the class sub sub account id
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

        // we should sum it up progressively i think
        data = data.map(datapoint => ({
           subject: datapoint._id,
            //    the division by total number or 1 is to avoid zero division error crashes
            // we find the percentage then divide by the number of people 
            // i think this solves the issue totally :)
           performance: datapoint.progress.reduce((acc, x) => 
                acc + (x.attemptTree.score.passed / (x.attemptTree.score.total || 1))
            , 0) / (current_sub_sub_account.students.length || 1),

            // we have the data ( but i think we should just sum the performances )
            //    progress: datapoint.progress.sort(
            //        (first, second) => (new Date(first.createdAt)).getTime() - (new Date(second.createdAt)).getTime()
            //     )
        }))

        return res.json(data)
    } catch(error) {
        console.log(error);

        // returns nothing to the frontend
        return res.status(500).json({})
    }
})

/*

    STUDENT SPECIFIC ANALYTICS

*/

// grade fetching for the new analytics ( for the subject analysis the code is the same but bound to a given paper id for special papers and subject names for the other types )
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