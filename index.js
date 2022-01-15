const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors')
const app = express();


// production for build 

app.use(express.static('public'))



app.use(cors())
app.use(express.json())
const PORT = process.env.PORT||5000
const url = "mongodb+srv://deepak:dipak@1243@cluster0.o7rmv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then((res)=>{
    console.log("we have a new connection")
}).catch((err)=>{
    console.log(err)
})
require('./models/index')
require("./models/posts")
const router = app.use(require("./routing/router"))

// production (connecting the buid to backend)

app.use(express.static('build'))
const path = require ('path');
const { connected } = require('process');
app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'build','index.html'))
    console.log("production connected")
})



// running the port

router.listen(PORT,(req,res)=>{
    console.log(`server running at port ${PORT}`)
})