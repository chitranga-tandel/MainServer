const express = require("express");
var jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

const router = express.Router();
router.options("*", (req, res) => res.send());

const fs = require("fs");
const filePath =
  "C:/Users/chitranga.tandel/Documents/Development/MyDevelopment/crypto-server/users.json";

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

router.post("/register", (req, res, next) => {
  fs.readFile(filePath, "utf-8", function (err, data) {
    if (err) throw err;
    console.log("register data [", req.body, "]");

    var registeredUsers = JSON.parse(data);
    registeredUsers.users.push({
      userEmail: req.body.userEmail,
      userMobileNo: req.body.userMobileNo,
      userName: req.body.userName,
      userPassword: req.body.userPassword,
    });

    console.log(registeredUsers);
    fs.writeFile(
      filePath,
      JSON.stringify(registeredUsers),
      "utf-8",
      function (err) {
        if (err) throw err;
        console.log("Done!");
      }
    );
  });

  res.json({ returnCode: 100, msg: "user registered successfully!" });
});

router.post("/getProfile", (req, res, next) => {
  const loginDetail = {
    userid: req.body.userid,
    password: req.body.password,
  };
  fs.readFile(filePath, "utf-8", function (err, data) {
    if (err) throw err;
    var registeredUsers = JSON.parse(data);
    var profileData;
    console.log(registeredUsers);
    console.log(
      "login email and password [",
      loginDetail.userid,
      "][",
      loginDetail.password,
      "]"
    );
    for (index in registeredUsers.users) {
      //console.log("register email and password [",registeredUsers.users[index].userEmail,"][",registeredUsers.users[index].userPassword,"]")
      if (
        registeredUsers.users[index].userEmail.toLowerCase() ==
          loginDetail.userid.toLowerCase() &&
        registeredUsers.users[index].userPassword == loginDetail.password
      ) {
        profileData = registeredUsers.users[index];
      }
    }
    res.json({ returnCode: 100, getProfileResult: profileData });
  });
});

// router.get('/:userId' , (req , res , next) =>{
//     const id = req.params.userId
//     res.json({id : 'user id in the request is '+id})
// });

module.exports = router;
