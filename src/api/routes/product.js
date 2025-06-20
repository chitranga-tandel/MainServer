const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

const productListPath =
  "C:/Users/chitranga.tandel/Documents/Development/MyDevelopment/crypto-server/product.json";
const productDetailPath =
  "C:/Users/user/Documents/Development/MyDevelopment/React-Native/BeautiflyServer/product_details.json";

router.get("/getProduct", (req, res, next) => {
  let token = req.headers["x-access-token"];
  console.log("token", token);
  //console.log("req[",JSON.stringify(req));
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
  });
  var productForDeal;
  fs.readFile(productListPath, "utf-8", function (err, data) {
    if (err) throw err;
    productForDeal = JSON.parse(data);
    console.log("productForDeal :", productForDeal);
    // res.json({returnCode : 100  ,productForDealResult : productForDeal})
    return res.status(200).send({
      data: productForDeal,
    });
  });
  //  console.log("productForDeal  outside:" , productForDeal)
});

router.post("/getProductBasedOnCategory", (req, res, next) => {
  var categoryId = req.body.categoryId;

  fs.readFile(productListPath, "utf-8", function (err, data) {
    if (err) throw err;
    console.log("categoryId [", categoryId, "]");
    var productList = JSON.parse(data);
    var categorisedList = [];
    console.log(productList);
    for (index in productList) {
      if (productList[index].categoryid == categoryId) {
        categorisedList.push(productList[index]);
      }
    }
    res.json({
      returnCode: 100,
      getProductBasedOnCategoryResult: categorisedList,
    });
  });
});

router.post("/getProductDetail", (req, res, next) => {
  var productId = req.body.productId;

  fs.readFile(productDetailPath, "utf-8", function (err, data) {
    if (err) throw err;
    console.log("productId [", productId, "]");
    var productDetailArr = JSON.parse(data);
    var productDetail = [];
    //console.log(productDetailArr);
    for (index in productDetailArr) {
      if (productDetailArr[index].id == productId) {
        productDetail.push(productDetailArr[index]);
      }
    }
    res.json({
      returnCode: 100,
      productDetailResult: productDetail,
      msg: "getting ProductBasedOnCategory",
    });
  });
});

// router.get('/getProductByGet' , (req , res , next) =>{
//   let token = req.headers["x-access-token"];
//   console.log("token",token);
//   //console.log("req[",JSON.stringify(req));
//   if (!token) {
//     return res.status(403).send({
//       message: "No token provided!"
//     });
//   }
//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({
//         message: "Unauthorized!"
//       });
//     }
//   });
//   var productForDeal ;
//   fs.readFile(productListPath, 'utf-8', function(err, data) {
//       if (err) throw err
//       productForDeal = JSON.parse(data)
//       console.log("productForDeal :" , productForDeal)
//       // res.json({returnCode : 100  ,productForDealResult : productForDeal})
//       return res.status(200).send({
//           data: productForDeal
//       });
//     });
//   //  console.log("productForDeal  outside:" , productForDeal)

// });

router.get("url");

router.get("/items", (req, res) => {
  fs.readFile(
    "C:/Users/chitranga.tandel/Documents/Development/crypto-server/product.json",
    (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
    }
  );
});

module.exports = router;
