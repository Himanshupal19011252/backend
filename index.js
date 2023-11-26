const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const validator = require('aadhaar-validator')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000

const schemaData = mongoose.Schema({
    code:String,
    name :String,
    email :String,
    mobile : String,
    dob: Date, 
    doj: Date, 
    qualification:String,
    aadharNo:String,
    username: String,
    password: String,
},{
    timestamps :true
})

const userModel = mongoose.model("user",schemaData)

//read data
app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data :data})
})

//crate data //same data in mongodb
app.post("/create",async(req,res)=>{
    
   try {
    console.log(req.body);

    // Validate Aadhar number
    const isValidAadhar = aadharValidator.isValidNumber('123456789');
    console.log(isValidAadhar);
    console.log("hi")

    if (isValidAadhar) {
      // Aadhar number is valid, proceed with saving the data
      const data = new userModel(req.body);
      await data.save();
      return res.json({ success: true, message: "Data saved successfully", data: data });
    } else {
      // Aadhar number is not valid, send an error response
      return res.status(400).json({ success: false, message: "Invalid Aadhar number" });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error saving data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
})

//update
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const {_id,...rest} = req.body
    console.log(rest)
    const data = await userModel.updateOne({_id:_id},rest)
    res.send({success : true, message : "data update successfully",data : data})
})

//delete
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id: id})
    res.send({success : true, message : "data deleted successfully",data : data})
})

mongoose.connect("mongodb://127.0.0.1:27017/members")
.then(()=>{console.log("connect to DB")
app.listen(PORT, () => console.log(`Server is running ${PORT}`));})
.catch((err)=>console.log(err))

