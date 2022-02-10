const { IsSchoolAuthenticated } = require("../configs");
const { SubscriptionModel } = require("../models");
const humanTime = require("human-time");
const moment = require("moment");

const router = require("express").Router();

router.use([
    IsSchoolAuthenticated
]);

router.get("/", async (req, res) => {
    try {
        let subscriptions = await SubscriptionModel.aggregate([
            {
                $match: { schoolID: req.school._id }
            }
        ]);

        return res.json({ subscriptions: subscriptions.map(x => ({
            _id: x._id,
            subscriptionItem: x.subscriptionItem,
            status: x.status,
            updatedAt: moment(x.updatedAt).startOf('day'),
            grades: x.grades,
            subscriptionType: x.subscriptionType,
            remainingTime: humanTime(x.subscriptionEnd),
            isActive: moment(x.subscriptionEnd).isAfter(moment())
        })) })
    } catch(error) {
        console.log(error)
        return res.status(500).json({}) 
    }
})

router.get("/:transactionId", async (req, res) => {
    try {
        let subscription = await SubscriptionModel.findOne({ _id: req.params.transactionId });

        subscription = subscription ? subscription.toObject() : {}

        return res.json({ subscription: {
            ...subscription,
            remainingTime: humanTime(subscription.subscriptionEnd),
            isActive: moment(subscription.subscriptionEnd).isAfter(moment())
        } })
    } catch(error) {
        console.log(error)
        return res.status(500).json({}) 
    }
})



module.exports = router