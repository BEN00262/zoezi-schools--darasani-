// listen for subscription update events and then broadcast them onto socket io
const consola = require("consola");
const { SubscriptionModel } = require("../models");

const listenThenInform = checkIfOnlineAndInform => {
    // listen for changes in the subscription model then report them to the guy :)
    consola.success("listening for the subscriptions has started :)");

    SubscriptionModel.watch([
        {
            $match: {
                operationType: "update",
            }
        },
    ]).on('change',async doc => {
        try {
            let subscription = await SubscriptionModel.findOne({ _id: doc.documentKey._id });
             /*
                {
                    type: "payments", 
                    message: {
                        status: true | false ( boolean ),
                        message: string
                    }
                }
            */

            if (subscription) {
                await checkIfOnlineAndInform(
                    subscription.schoolID,
                    {
                        type: "payments",
                        message: {
                            status: subscription.status.toLowerCase() === "success",
                            message: subscription.message
                        }
                    }
                )
            }
        } catch(error) {
            // we cant inform the school on a realtime stuff :)
            console.log(error);
        }
    })
}

module.exports = listenThenInform