/*
  Snippet generated by johnnesta2018@gmail.com
*/
require("dotenv").config()

const mongoose = require("mongoose")
const cors = require("cors");
const express = require("express");
const path = require("path");

const { 
  TeacherRoute, SchoolRoute, ClassRoute, 
  StudentRoute, SubjectRoute, AnalyticsRoute, 
  MarketRoute, 
  LibraryRoute,
  SubscriptionsRoute,
  MiscRoute
} = require("./routes");
const { SubscriptionsListener } = require("./listeners")

const PORT = process.env.PORT || 3500
const app = express()

const server = require('http').createServer(app);

// this is the function to do the informing through socket io :)
const checkIfOnlineAndInform = require("./socketio")(server); // socketIO

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cors())

// simple routes
app.use(express.static(path.join(__dirname, 'public/build')));

app.use("/api/school", SchoolRoute);
app.use("/api/teacher", TeacherRoute);
app.use("/api/misc", MiscRoute);
app.use("/api/grade", ClassRoute);
app.use("/api/library", LibraryRoute);
app.use("/api/learner", StudentRoute);
app.use("/api/subject", SubjectRoute);
app.use("/api/analytics", AnalyticsRoute);
app.use("/api/market", MarketRoute); // for purchasing stuff in the school solution :)
app.use("/api/subscriptions", SubscriptionsRoute);

// capture the remaining routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});

// start mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(_ => {
      // listen for the subscriptions :)
      SubscriptionsListener(checkIfOnlineAndInform);
      // run the server
      server.listen(PORT, () => {
        console.log("server started listening on port: "+PORT)
      })
  })
  .catch(console.error)