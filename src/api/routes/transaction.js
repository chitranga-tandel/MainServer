const express = require("express");
var jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

const router = express.Router();
router.options("*", (req, res) => res.send());

const fs = require("fs");
const filePath =
  "C:/Users/chitranga.tandel/Documents/Development/MyDevelopment/crypto-server/users.json";
const transactionPath =
  "C:/Users/chitranga.tandel/Documents/Development/MyDevelopment/crypto-server/transactions.json";

router.post("/login", (req, res, next) => {
  var isUserValid = false;
  const loginDetail = {
    userid: req.body.userid,
    password: req.body.password,
  };
  fs.readFile(filePath, "utf-8", function (err, data) {
    if (err) throw err;
    var registeredUsers = JSON.parse(data);
    console.log(
      "login email and password a[",
      loginDetail.userid,
      "][",
      loginDetail.password,
      "]"
    );
    console.log("");
    var validUser = registeredUsers.users.find(
      (e) => e.userid == loginDetail.userid
    );
    console.log("validuser::", validUser);

    if (!validUser) {
      return res.status(404).send({ message: "User Not found." });
    } else if (validUser.password != loginDetail.password) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    } else {
      var token = jwt.sign({ id: validUser.id }, config.secret, {
        // expiresIn: 86400 // 24 hours
        expiresIn: 100, // 24 hours
      });
      res.status(200).send({
        username: loginDetail.userid,
        accessToken: token,
      });
    }
    //  res.json({ returnCode : 100  , token: 'test123', msg : 'login successfully from server!'});
  });
});

router.post("/addTransaction", (req, res, next) => {
  fs.readFile(transactionPath, "utf-8", function (err, data) {
    if (err) throw err;
    console.log("new transaction data [", req.body, "]");

    var newTransaction = JSON.parse(data);
    newTransaction.push({
      id: req.body.id,
      username: req.body.username,
      amount: req.body.amount,
      status: req.body.status,
      gateway: req.body.gateway,
      date: req.body.date,
    });

    console.log(newTransaction);
    fs.writeFile(
      transactionPath,
      JSON.stringify(newTransaction),
      "utf-8",
      function (err) {
        if (err) throw err;
        console.log("Done!");
      }
    );
    res.json({ returnCode: 100, msg: "transaction added successfully!" });
  });
});

router.post("/editTransaction", (req, res, next) => {
  fs.readFile(transactionPath, "utf-8", function (err, data) {
    if (err) throw err;
    console.log("edit transaction data [", req.body, "]");

    var newTransactionData = JSON.parse(data);

    newTransactionData.some(function (obj) {
      if (obj.id === req.body.id) {
        //change the value here
        obj.username = req.body.username;
        obj.amount = req.body.amount;
        obj.status = req.body.status;
        obj.gateway = req.body.gateway;
        obj.date = req.body.date;
        return true; //breaks out of he loop
      }
    });
    console.log("transaction data ::::::::::::::::", newTransactionData);

    fs.writeFile(
      transactionPath,
      JSON.stringify(newTransactionData),
      "utf-8",
      function (err) {
        if (err) throw err;
        console.log("Done!");
      }
    );
    res.json({ returnCode: 100, msg: "transaction edited successfully!" });
  });
});

router.get("/getTransactions", (req, res, next) => {
  var transactionData;
  fs.readFile(transactionPath, "utf-8", function (err, data) {
    if (err) throw err;
    transactionData = JSON.parse(data);
    console.log("transactionData :", transactionData);
    // res.json({returnCode : 100  ,transactionDataResult : transactionData})
    return res.status(200).send({
      data: transactionData,
    });
  });
});

router.delete("/deleteTransaction", (req, res, next) => {
  fs.readFile(transactionPath, "utf-8", function (err, data) {
    if (err) throw err;
    console.log("edit transaction data [", req.body, "]");

    var transactionData = JSON.parse(data);

    var updatedTransactionData = transactionData.filter(
      (item) => item.id !== req.body.id
    );

    fs.writeFile(
      transactionPath,
      JSON.stringify(updatedTransactionData),
      "utf-8",
      function (err) {
        if (err) throw err;
        console.log("Done!");
      }
    );
    res.json({ returnCode: 100, msg: "Transaction deleted successfully!" });
  });
});

// router.get('/:userId' , (req , res , next) =>{
//     const id = req.params.userId
//     res.json({id : 'user id in the request is '+id})
// });

module.exports = router;
