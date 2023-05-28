var express = require("express");
var router = express.Router();
const productHelper = require("../helpers/productHelpers");
const userHelpers = require("../helpers/userHelpers");
const accountSid = "AC4ef830ccb0c57b3561a7385f8bc15f3b";
const authToken = "f2df494f5e37eb3f8afdb62e440c1de1";
const client = require("twilio")(accountSid, authToken);


/* GET home page. */
router.get("/", function (req, res) {
  console.log("session at userhome",req.session)
  productHelper.getFeaturedProduct().then((fProduct)=>{
    var featuredProduct = fProduct
     productHelper.getTrendingFeaturedForUserHome().then((product) => {
       res.render("users/user-viewproducts", {
         product,
         featuredProduct,
         admin: false,
       });
     });
  })
 
});

router.post('/signup',(req,res)=>{

 try{
  console.log(req.body)
  req.session.name = req.body.name;
  req.session.phone = req.body.phone;
  req.session.email = req.body.email
  req.session.OTP = Math.floor(Math.random() * 9999);
  const phoneNumber = "+91" + req.session.phone;
  req.session.save();
  client.messages.create({
    body: `  ${req.session.OTP} is the verification code for create  Melocia account`,
    to: "whatsapp:" + phoneNumber,
    from: "whatsapp:+14155238886",
  });
 }
 catch(err){
  console.log("error at adding user",err)
 }


})
router.post('/otp',(req,res)=>{
   req.session.OTP = Math.floor(Math.random() * 9999);
   const phoneNumber = "+91" + req.body.phone;
  req.session.save();
  client.messages
    .create({
      body: `  ${req.session.OTP} is the verification code to login to your Melocia account`,
      to: "whatsapp:" + phoneNumber,
      from: "whatsapp:+14155238886",
    })
    .then((message) => {
     

    })
    .catch((err) => console.log(err));
});

router.post('/verify',(req,res)=>{
  console.log("at verify ",req.session)

 if(req.session.OTP == req.body.otp)
 {
  console.log("ootp verified")
  res.redirect('/')
 }
 else
 {
    console.log("ootp  not verified");
    res.redirect('/');
 }

});

router.get('/mobile',(req,res)=>{


  productHelper.getMobiles().then((mobiles)=>{
    console.log(mobiles)
      res.render("users/user-category-mobile", { admin: false,mobiles });
  })

})

module.exports = router;
