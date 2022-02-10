const consola = require('consola');
const IO = require("socket.io");

const { OnlineSchoolsModel } = require("../models");

const GetSocketIOServer = (server) => {
    // scope this one to this server only :)
    const socketIO = IO(server,{ cors:{ origin:"*" } })

    socketIO.on('connection',socket => {
        // ensure the guy is logged in ---> that is easy :)
        socket.on('online', async ({ current_school_id }) => {
            try {
                // preventing the system from saving the same state over and over again
                await OnlineSchoolsModel.findOneAndUpdate({ schoolID: current_school_id },{
                    $set: {
                        isOnline: true,
                        socketioID: socket.id
                    }
                }, { $upsert: true });
            }catch(error){
                consola.error(error);
            }
        })

        socket.on('disconnect', async () => {
            await OnlineSchoolsModel.findOneAndUpdate({ socketioID: socket.id }, {
                $set: { isOnline: false }
            })
        })
    });


    return async (schoolID, message) => {
        let isOnline = await OnlineSchoolsModel.findOne({ schoolID, isOnline: true });
    
        if (isOnline){
            // send the message :)
            // should we save the messages ama :)
            /*
                {
                    type: "payments", 
                    message: {
                        status: true | false ( boolean ),
                        message: string
                    }
                }
            */
            socketIO.to(isOnline.socketioID).emit(
                "notification", JSON.stringify(message)
            );
        }
    }
}

module.exports = GetSocketIOServer