const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model("users");
const sgMail = require('@sendgrid/mail');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/middleware");
const Posts = mongoose.model("Posts");
const crypto = require("crypto");
const config= require("./config");
const flash = require('connect-flash');

sgMail.setApiKey("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");

const client = require('twilio')(config.accountSID,config.authToken)


router.post('/signup',(req,res)=>{
    const {name,email,phone,password}=req.body;
   
    if(!email||!name||!password||!phone){
        return res.status(422).json({error:"Please fill all the fields"})
    }else{
        Users.findOne({
            $or: [
                   { email : email },
                   { phone:  phone }
                 ]
          }).then((savedUser)=>{
            if(savedUser){
                console.log(savedUser)
                return res.status(422).json({error:"email already or phone exists"})
            }
           else{
            bcrypt.hash(password,12).then((hashedPassword)=>{
                const user = new Users({
                    name,
                    email,
                    phone,
                    password:hashedPassword,
                    emailToken:crypto.randomBytes(64).toString("hex"),
                    isVerified:false
                })
        
                    res.status(200).json({message:"Successfully Signup"})
                    const msg ={
                        to: email,
                        from: 'deepakvemula123@gmail.com',
                        subject: 'Sending with SendGrid is Fun',
                        text: `http://${req.headers.host}`,
                        html: `<strong>please verify your email</strong>
                        <a href="http://${req.headers.host}/verify?token=${user.emailToken}">Click this link</a>
                        `,
                      };
                    sgMail.send(msg);
                      user.save()
                }) 
                    }    
        }).catch((err)=>{
            res.json(err)
        })
    }
})
router.get("/verify",async(req,res)=>{

 Users.findOneAndUpdate({emailToken: req.query.token}, {$set:{emailToken:null,isVerified:true}}, {new: true}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
    }
  res.json("successfully verified go to login page")
});
})

router.post("/signin",(req,res)=>{
    const {input,password} = req.body;
    if(!input||!password){
       return res.status(422).json({error:"Please fill all the fields"})
    }else{
         Users.findOne(  {
            $or: [
                   { email : input },
                   { phone:  input }
                 ]
          }).then((savedUser)=>{
            if(!savedUser){
                res.status(422).json({error:"Invalid email or password"})  
            }
            else{
                bcrypt.compare(password,savedUser.password).then((doMatch)=>{
                    if(doMatch){
                        const usertoken = jwt.sign({_id:savedUser._id},"laksjldkjflkjasljdflk");
                        const {_id,name,email}=savedUser;
                        res.json({usertoken,user:{_id,name,email}})
                    }
                    else{
                        res.status(422).json({error:"Invalid email or password"})
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
})

// mobile otp sending

router.get('/sendotp', (req,res) => {
    // console.log(req.query.phonenumber)
    if (req.query.phonenumber) {
       client
       .verify
       .services(config.serviceID)
       .verifications
       .create({
           to: `+91${req.query.phonenumber}`,
           channel: req.query.channel
       })
       .then(data => {
           res.status(200).json({
               message: "Otp is sent !!",
               phonenumber: req.query.phonenumber,
               data
           })
       }) 
    } else {
       res.status(400).json({
           message: "Wrong phone number !!",
           phonenumber: req.query.phonenumber,
           data
       })
    }
})

// mobile otp verification

router.get('/verifyotp', (req, res) => {
    // console.log(req.query.phonenumber)
    if (req.query.phonenumber && (req.query.code).length === 6) {
        client
            .verify
            .services(config.serviceID)
            .verificationChecks
            .create({
                to: `+91${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
                // console.log(data.status)
                if (data.status === "approved") {
                    res.status(200).json({
                        message: " Verified !! ",
                        
                        // data
                    })
                }
            })
    } else {
        res.status(400).json({
            error: "Wrong phone number or code ",
            phonenumber: req.query.phonenumber,
            // data
        })
        
       
    }
   
})


router.get("/allposts",requireLogin,(req,res)=>{
    Posts.find().populate("postedBy","_id name").sort("-createdAt").then((result)=>{
        res.json(result)
    })
})
router.get("/",(req,res)=>{
    
})



router.post("/createpost",(req,res)=>{

const {PropertyTitle,PropertyDescription,PropertyStatus,Propertytype,Propertyrooms,PropertyINR,Propertysqft,Propertyimage,Propertyaddress,Propertycity,PropertyState,Propertycountry,
        PropertygLat,PropertygLng,PropertysAge,PropertysRooms,PropertysBathrooms,Propertyname,PropertyuName,Propertyemail,Propertyphone,
        PropertyairCondition,PropertyCentralHeating,PropertySwimmingPool,PropertyLaundryRoom,PropertyWindowCovering,PropertyRefrigerator,PropertyAlarm,PropertyGym,PropertyMicroWave} = req.body

    if(!PropertyTitle|| !PropertyDescription|| !PropertyStatus || !Propertytype || !Propertyrooms || !PropertyINR || !Propertysqft || !Propertyimage || !Propertyaddress || !Propertycity || !PropertyState || !Propertycountry ||
        !PropertygLat || !PropertygLng || !PropertysAge  || !PropertysBathrooms || !Propertyname || !PropertyuName || !Propertyemail || !Propertyphone || !PropertysRooms ||
        !PropertyairCondition || !PropertyCentralHeating || !PropertySwimmingPool || !PropertyLaundryRoom || !PropertyWindowCovering || !PropertyRefrigerator || !PropertyAlarm || !PropertyGym || !PropertyMicroWave){
        res.status(422).json({error:"please fill all the fields"})
    }else{
        const posts = new Posts({PropertyTitle,PropertyDescription,PropertyStatus,Propertytype,Propertyrooms,PropertyINR,Propertysqft,Propertyimage,Propertyaddress,Propertycity,
                        PropertyState,Propertycountry,PropertygLat,PropertygLng,PropertysAge,PropertysRooms,PropertysBathrooms,Propertyname,PropertyuName,Propertyemail,Propertyphone,
                        PropertyairCondition,PropertyCentralHeating,PropertySwimmingPool,PropertyLaundryRoom,PropertyWindowCovering,PropertyRefrigerator,PropertyAlarm,PropertyGym,
                        PropertyMicroWave
        })
        posts.save().then((result)=>{
            res.status(200).json({message:"Post Created successfully"})
        }).catch((err)=>{
            console.log(err)
        })
        
    }
})

router.get("/myposts",requireLogin,(req,res)=>{
    Posts.find({postedBy:req.user._id}).populate("postedBy","_id name").then((result)=>{
        res.json({myposts:result})
    }).catch((err)=>{
        console.log(err)
    })
})
router.get("/myproperties",requireLogin,(req,res)=>{
    Posts.find().then((result)=>{
        res.json(result)
    })
})

router.delete('/deletepost/:id',requireLogin,(req,res)=>{
    const id = req.params.id;
    Posts.findOne({_id:id}).exec((err,post)=>{
        if(err || !post){
            res.status(422).json({error:err})
        }
        else{
            post.remove()
            .then((result)=>{
                res.json(result)
            }).catch(err=>console.log(err))
        }
    })
})
router.get('/updatepost/:id',(req,res)=>{
    const id = req.params.id;
    Posts.findOne({_id:id}).then((result)=>{
        res.json(result)
    })
})

router.put('/updatepost/:id',(req,res)=>{
    const editproperty = req.body;
    const _id = req.params.id
    Posts.findByIdAndUpdate(_id,editproperty,{useFindAndModify:false}).then((err,result)=>{
        res.json(result)
    })
})

module.exports= router