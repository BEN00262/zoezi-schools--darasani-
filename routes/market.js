const { IsSchoolAuthenticated } = require("../configs");
const { ZoeziGradesModel, MultiLevelModel, PricingModel, SubSubAccountModel, ClassModel } = require("../models");

const router = require("express").Router();


// get all the grades that can be sold
router.get("/", [IsSchoolAuthenticated], async (req, res) => {
    try {
        // fetch the normal and the special grades at the same time
        let [normal_grades, special_grades] = await Promise.all([
            ZoeziGradesModel.aggregate([
                { $match: { available: true } },
                {
                    $project: {
                        subjects: 0,
                        __V: 0
                    }
                },
                { $sort: { 'gradeNumeric': 1 } }
            ]),

            MultiLevelModel.aggregate([
                { $match: { available: true } },
                { $project: { name: 1 } }
            ])
        ]);


        return res.json({ normal_grades, special_grades })
    } catch(error) {
        console.log(error)
        return res.status(500).json({})
    }
});

router.get("/checkout/:subscriptionId", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let { grades } = req.query;

        if (!grades) {
            throw new Error("No grades found");
        }

        grades = grades.split(",");

        // get the grades selected and return the data
        let [subscription, grades_found] = await Promise.all([
            PricingModel.findOne({ _id: req.params.subscriptionId }),
            ClassModel.find({ _id: { $in: grades }}).populate("classRef")
        ]);

        return res.json({ subscription, grades: grades_found })
    } catch(error) {
        console.log(error);
        return res.json([]);
    }
})

// TODO: filter the prices to schools ones
router.get("/subscriptions", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let prices = await PricingModel.find();
        return res.json(prices.sort((a, b) => a.price - b.price))
    } catch(error) {
        console.log(error);
        return res.json([]);
    }
})

// get all the classes / grades that dont have the requested subscription grade
router.get("/grades/:subscriptionId", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let grades = await SubSubAccountModel.find({ 
            schoolOrOrganizationID: req.school._id,
            'subscriptions.gradeID': { $ne: req.params.subscriptionId }
        }).populate({
            path: 'parentID',
            isClosed: false
        }).lean();

        let grade_names = grades.filter(x => x.parentID)
            .map(x => ({ ...x.parentID }))
            .map(x => ({
                name: x.name, stream: x.stream,
                year: x.year, _id: x._id
            }));

        return res.json({ grades: grade_names })
    } catch(error) {
        console.log(error)
        return res.status(500).json({})
    }
})


module.exports = router