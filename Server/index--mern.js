const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


const app =  express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080
const schemaData = mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
},{
    timestamp: true
})
const userModel = mongoose.model("user",schemaData)

//Read
app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success: true, data: data})
})
// Create Data
app.post("/create",async(req,res)=>{
    console.log(req.body)
    const data =  new userModel(req.body)
    await data.save()
    res.send({success:true,message :  "Data save successfully"})
})

// Update Data
app.put("/update", async(req,res)=>{
    console.log(req.body)
    const { id, ...rest} = req.body
    console.log(rest)

    const data = await userModel.updateOne({_id: req.body.id},rest)
    res.send({success:true, message: "Data update successfully", data: data})
})

// Delete API

app.delete("/delete/::id", async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id: id})
    res.send({success:true, message: "Data Deleted successfully", data: data})
})

mongoose.connect("mongodb://localhost:27017/crudoperation")
.then(()=>{
    console.log("connect to DB")
})
.catch((err)=>{
    console.log(err)
} )

app.listen(PORT,()=>console.log("Server is running"))
