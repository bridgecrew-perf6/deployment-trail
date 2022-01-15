const express = require("express")

const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const Users = mongoose.model("users");

module.exports=(req,res,next)=>{
    const {authorization}= req.headers;
    if(!authorization){
        res.status(401).json({error:"you must be login first"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,"laksjldkjflkjasljdflk",(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be login first"} )
        }else{
            const {_id}=payload;
            Users.findById({_id}).then((userdata)=>{
                req.user = userdata
                next() 
            })
            
        }
    })
}

// module.exports=(req,res,next)=>{
//     const {authorization}= req.headers;
//     if(!authorization){
//         res.status(401).json({error:"you must be login first"})
//     }
//     const token = authorization.replace("Bearer ","")
//     jwt.verify(token,"laksjldkjflkjasljdflk",(err,payload)=>{
//         if(err){
//             return res.status(401).json({error:"you must be login first"} )
//         }else{
//             const {_id}=payload;
//             Users.findById({_id}).then((userdata)=>{
//                 req.user = userdata
//             })
//             next() 
//         }
//     })
// }