const express = require("express");
const app = express();
const port = 3001;
//const IPAdress = '0.0.0.0';
//const IPAdress = '192.168.43.253';
const IPAdress = "192.168.1.7";
//http://192.168.29.22:3001/transaction/login/


const morgan = require("morgan"); // To handle error
var cors = require("cors"); // to remove cross origin error
const bodyParser = require("body-parser"); // To read request in json format
var path = require("path");

const { error } = require("console");
//route which for module wise API
const authRoute = require("./api/routes/auth");
const productRoute = require("./api/routes/product");
const transactionRoute = require("./api/routes/transaction");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // Configuring body parser middleware
app.use(bodyParser.json());

app.use(express.static("./assets/images"));

app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/transaction", transactionRoute);

app.get("/", (req, res) => {
  res.json({ id: "Hello.. from Crypto server..!" });
});

// For Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, IPAdress, () => {
  console.log(`Example app listening at 
  =${IPAdress + ":" + port}`);
});

module.exports = app;
