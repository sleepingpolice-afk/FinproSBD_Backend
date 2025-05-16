const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const rute = require("./src/routes/userroute");

const cors = require("cors");
dotenv.config();

const port = process.env.PORT || 5434;
const app = express();

var corsOption = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/voter", cors(corsOption), rute);
app.use("/candidate", cors(corsOption), require("./src/routes/candidateroute"));
app.use("/main", cors(corsOption), require("./src/routes/mainroute"));
app.use("/branch", cors(corsOption), require("./src/routes/branchroute"));

app.listen(port, () => {
  console.log(`Running on port ${port}!`);
});