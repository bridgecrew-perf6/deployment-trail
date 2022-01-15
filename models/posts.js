const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    PropertyTitle:{
        type:String,
        required:true
    },
    PropertyDescription:{
        type:String,
        required:true
    },
    PropertyStatus:{
        type:String,
        required:true
    },
    Propertytype:{
       type:String,
        required:true

    },
    Propertyrooms:{
       type:String,
        required:true

    },
    PropertyINR:{
       type:String,
        required:true

    },
    Propertysqft:{
       type:String,
        required:true

    },
    Propertyimage:{
       type:String,
        required:true

    },
    Propertyaddress:{
       type:String,
        required:true

    },
    Propertycity:{
       type:String,
        required:true

    },
    PropertyState:{
       type:String,
        required:true

    },
    Propertycountry:{
       type:String,
        required:true

    },
    PropertygLat:{
       type:String,
        required:true

    },
    PropertygLng:{
       type:String,
        required:true

    },
    PropertysAge:{
       type:String,
        required:true

    },
    PropertysRooms:{
       type:String,
        required:true

    },
    PropertysBathrooms:{
       type:String,
        required:true

    },
    Propertyname:{
       type:String,
        required:true

    },
    PropertyuName:{
       type:String,
        required:true

    },
    Propertyemail:{
       type:String,
        required:true

    },
    Propertyphone:{
       type:String,
        required:true

    },
    PropertyairCondition:{
       type:String,
        required:true

    },
    PropertyCentralHeating:{
       type:String,
        required:true

    },
    PropertySwimmingPool:{
       type:String,
        required:true

    },
    PropertySwimmingPool:{
       type:String,
        required:true

    },
    PropertyLaundryRoom:{
       type:String,
        required:true

    },
    PropertyWindowCovering:{
       type:String,
        required:true

    },
    PropertyRefrigerator:{
       type:String,
        required:true

    },
    PropertyAlarm:{
       type:String,
        required:true

    },
    PropertyGym:{
       type:String,
        required:true

    },
    PropertyMicroWave:{
       type:String,
        required:true

    }
    
    

    
})
mongoose.model("Posts",postSchema)