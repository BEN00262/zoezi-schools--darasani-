/*
  Snippet generated by johnnesta2018@gmail.com
*/
require("dotenv").config()

const mongoose = require("mongoose")
const cors = require("cors");
const express = require("express");
const path = require("path");
const compression = require("compression");
const favicon = require("serve-favicon");
const helmet = require("helmet")
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
const app = express();

app.use(compression({ filter: (req, res) => {
  return req.headers['x-no-compression'] ? false : compression.filter(req, res)
}}))

app.use(helmet());
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'"],
      "style-src": ["'self'","'unsafe-inline'",'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
      "font-src": ["https://embed.tawk.to", 'https://fonts.gstatic.com', 'https://cdn.iconmonstr.com'],
      "img-src": ["'self'", "data:", "blob:", "https://*.zoezi-education.com"],
      "script-src-attr": ["'unsafe-inline'"],
      "script-src": ["'self'",'https://code.jquery.com', 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', "'unsafe-inline'", "'unsafe-eval'"]
    },
  }
}));

// enable loading of resources across domains
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Resource-Policy")
  res.removeHeader("Cross-Origin-Embedder-Policy")
  next()
})

const server = require('http').createServer(app);

// this is the function to do the informing through socket io :)
const checkIfOnlineAndInform = require("./socketio")(server); // socketIO

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// app.use(cors());

// simple routes
app.use('*/img', express.static(path.join(__dirname,'/public/img')));
app.use(favicon(path.join(__dirname, 'public', 'img/zoezi.ico')))
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