const { IsSchoolAuthenticated } = require("../configs");
const { ZoeziGradesModel, MultiLevelModel, PricingModel, SubSubAccountModel, ClassModel, SubscriptionModel } = require("../models");
const { paymentFunction } = require("../utils");
const mongoose = require("mongoose");
const moment = require("moment");

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

// get the grade to be bought :)
router.post("/purchase/:subscriptionGradeId/:subscriptionId", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let { grades, isSpecial:is_special  } = req.body;

        if (!grades) {
            throw new Error("No grades found");
        }

        grades = grades.split(",");

        // get the grades selected and return the data
        let [subscription, grades_found, sub_sub_accounts, subscription_grade] = await Promise.all([
            PricingModel.findOne({ _id: req.params.subscriptionId, isDarasani: true }),
            ClassModel.find({ _id: { $in: grades.map(x => mongoose.Types.ObjectId(x)) } }).populate("classRef"),
            SubSubAccountModel.find({ parentID: { $in: grades.map(x => mongoose.Types.ObjectId(x)) }}),
            (is_special ? MultiLevelModel : ZoeziGradesModel).findOne({ _id: req.params.subscriptionGradeId })
        ]);


        // get the number of students per each compute the money and then proceed to make the payment
        if (!subscription || !grades_found || !sub_sub_accounts || !subscription_grade) {
            throw new Error("Payment failed");
        }

        let total_payable = subscription.price * sub_sub_accounts.reduce((acc, x) => acc + x.students.length, 0)

        // pass a stuff to indicate that this is a school payment
        let payment_result = await paymentFunction(
            req.school._id.toString(),
            req.school.mpesaNumber,
            total_payable, // the price :)
            subscription.days,
            subscription_grade._id.toString(), 
            (is_special ? subscription_grade.name : subscription_grade.grade), 
            is_special, 
            sub_sub_accounts.map(x => x._id.toString()) // get the ids of the stuffs to be subscribed :)
        )

        if (!payment_result || payment_result.status.toLowerCase() !== "pendingconfirmation") {
            return res.json({ status: false, message: `Payment Failed. ${payment_result.description}` })
        }

        // create the transaction stuff :)
        // this has a pending status by default :)
        await SubscriptionModel.create({
            schoolID: req.school._id,
            price: subscription.price,
            subscriptionItem: (is_special ? subscription_grade.name : subscription_grade.grade),
            grades: grades_found.map(x => ({
                name: `${x.name}${x.stream ? "| " + x.stream + " " : ""} | ${x.year}`,
                students: x.classRef.students.length
            })),
            transactionId: payment_result.transactionId,
            total: total_payable,
            subscriptionEnd: moment().add(subscription.days,'d'),
            subscriptionType: subscription.pricingType // specifying the type of the subscription :) 
        })

        // send the payument to afrr
        // send a message indicating that we are making the payments :)
        return res.json({ status: true })
    } catch(error) {
        console.log(error)
        return res.status(500).json({})   
    }
})

router.get("/checkout/:subscriptionId", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let { grades } = req.query;

        if (!grades) {
            throw new Error("No grades found");
        }

        grades = grades.split(",");

        // get the grades selected and return the data
        let [subscription, grades_found] = await Promise.all([
            PricingModel.findOne({ _id: req.params.subscriptionId, isDarasani: true }),
            ClassModel.find({ _id: { $in: grades }}).populate("classRef")
        ]);

        return res.json({ subscription, grades: grades_found })
    } catch(error) {
        console.log(error);
        return res.json([]);
    }
})

router.get("/subscriptions", async (req, res) => {
    try {
        let prices = await PricingModel.find({ isDarasani: true });
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
                name: x.name, stream: x.stream, year: x.year, _id: x._id
            }));

        return res.json({ grades: grade_names })
    } catch(error) {
        console.log(error)
        return res.status(500).json({})
    }
})


module.exports = router