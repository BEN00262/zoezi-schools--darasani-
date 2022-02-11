const router = require("express").Router();
const mongoose = require("mongoose");
const moment = require("moment");
const humanTime = require("human-time");
const { 
    SubSubAccountModel,
    LibpaperModel,
    specialPaperHistoryModel: SpecialPaperHistory 
} = require("../models");
const { IsSchoolAuthenticated, IsTeacherAuthenticated } = require("../configs");

// start building the fetching of the library
// fetching the papers in the libraries :)
const getMaxDate = (a, b) => moment(a).isAfter(moment(b)) ? a : b

// TODO: write better code bana :)
class ZoeziBaseError extends Error {
    constructor(message) {
        super(message)
    }
}

router.get("/special_paper/:studentId/:paperId/:savedStateId", [
    IsTeacherAuthenticated
], async (req, res) => {
    try {
        // in this case we really dont care about the prev
        let [paper, prevState ] = await Promise.all([
            SpecialPaperModel.findOne({ _id: req.params.paperId }).populate('questions'),

            SpecialPaperHistory.findOne({ 
                paperID: req.params.paperId,  
                _id: req.params.savedStateId,
                studentID: req.params.studentId,
                isMarked: true 
            }).lean()
        ]);

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

        return res.status(200).json({ status: true, paper, prevState })
    } catch(error) {
        console.log(error);
        return res.status(500).json({})
    }
})

router.get('/normal_paper/:studentId/:paperId', [
    IsTeacherAuthenticated
], async(req, res) => {
    try {
        // get the paper we are after
        // const { _id: currentSubAccountID } = JSON.parse(req.session.current_sub_account);
        
        let content = await LibpaperModel.findOne({
            studentID: req.params.studentId,
            // subsubAccountID: currentSubAccountID, // we can ignore this one
            _id: req.params.paperId
        }).populate('content.content.question');

        res.json(content)
    } catch (error) {
        console.log(error);
        return res.status(500).json({})
    }
})


// we need to get the subscriptions stuff on the current default account
router.get('/:classId/:studentId', [
    IsTeacherAuthenticated
], async(req, res) => {
    // we get the subscriptions filter from the current account context
    // we need to get the current sub sub account
    let subsubaccount = await SubSubAccountModel.findOne({
        parentID: mongoose.Types.ObjectId(req.params.classId),
        schoolOrOrganizationID: req.school._id
    });

    // if there is no any just crash
    if (!subsubaccount) {
        throw new ZoeziBaseError("The subscription object does not exist");
    }

    try {
        let [library, special_paper_library] = await Promise.all([
                // normal library papers
                LibpaperModel.aggregate([
                    { 
                        $match: {
                            studentID: req.params.studentId,
                            subsubAccountID: subsubaccount._id.toString(),
                            // grade: { $in: activeSubscriptions } 
                        } 
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$when" } },
                            papers: {
                                $push: {
                                    grade: "$grade",
                                    subject: "$subject",
                                    score: "$score",
                                    when: "$when",
                                    _id: "$_id"
                                }
                            }
                        }
                    }
                ]),

                // special papers library
                SpecialPaperHistory.aggregate([
                    { 
                        $match: {
                            studentID: req.params.studentId,
                            subsubAccountID: subsubaccount._id.toString(), 
                            isMarked: true,
                        } 
                    },
                    { 
                        $project: {
                            gradeName: 1,
                            secondTier: 1,
                            category: 1,
                            subject: 1,
                            paperID: 1,
                            updatedAt: 1, // ignore the created at because we want the final time 
                            "attemptTree.score": 1
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                            library_paper: { $push: '$$CURRENT' }
                        }
                    },
                    { $unwind: "$library_paper" },
                    {
                        $group: {
                            _id: {
                                gradeName: "$library_paper.gradeName",
                                secondTier: "$library_paper.secondTier",
                                category: "$library_paper.category",
                                date: "$_id"
                            },
                            papers: {
                                $push: {
                                    scores: "$library_paper.attemptTree.score",
                                    subject: "$library_paper.subject",
                                    paperID: "$library_paper.paperID",
                                    when: "$library_paper.updatedAt",
                                    historyID: "$library_paper._id"
                                }
                            }
                        }
                    }
                ])
        ]);

        // work to remove this completely
        library = library.map(item => ({
            ...item,
            papers: item.papers.reduce((acc, x) => ({
                    ...acc,
                    [x.grade]: acc[x.grade] ? [ ...acc[x.grade], x ] : [x]
            }), {})
        }))


        // the navigation is a stupid idea ... should remove it
        let newLib = library.map(library_item => {
            return ({
                ...library_item,
                papers: Object.entries(library_item.papers).map(([key, gradesWithin]) => {
                    return {
                        grade: key,
                        papers: gradesWithin,
                    }
                })
            })
        });

        let dates = [...new Set([...newLib.map(({ _id, papers }) => _id), ...special_paper_library.map(({ _id }) => _id.date )])]
        
        // the date we need to work on it too
        let library_mappings = dates.map(date => {
            let n_papers = [].concat(...newLib.filter(x => x._id === date).map(x => x.papers));
            let special_papers = special_paper_library.filter(x => x._id.date === date);

            // get the latest date for the display
            let timeAgo = [...n_papers, ...special_papers].map(
                    x => x.papers.map(y => y.when).reduce(getMaxDate, new Date(2016,8,10))
                ).reduce(getMaxDate, new Date(2016,8,10));

            // get the data
            return ({
                _id: date,
                howManyDaysAgo: humanTime(timeAgo),
                // sort by the time
                papers:n_papers.sort(
                    (y,z) => moment(y.when).isAfter(moment(z.when)) ? -1 : 1
                ),
                // sort by the time
                special_papers: special_papers.sort(
                    (y,z) => moment(y.when).isAfter(moment(z.when)) ? -1 : 1
                )
            })
        }).sort( (first, second) => moment(first._id).isAfter(moment(second._id)) ? -1 : 1 );

        return res.json({ library: library_mappings });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            status: false,
            message: "Failed to fetch the library papers"
        })
    }
});

module.exports = router;