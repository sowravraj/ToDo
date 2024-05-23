const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

//create an instance
const app = express() 
app.use(express.json()) // Use express.json() middleware to parse JSON payloads
app.use(cors())

// define a route
app.get('/',(req,res)=>{
    res.send("Hello Sree Avanthiga")
})

// sample in memory
// let todos= []

// connecting mongodb
mongoose.connect("mongodb+srv://sowravraj:ew3os17BUZ4IrGH4@cluster0.pyf21rh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("DB connect agirichu")
})
.catch((err)=>{
    console.log(err)
})

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

// create a model
const todoModel = mongoose.model('Todo',todoSchema)

//create a todo item
app.post("/todos",async(req,res)=>{
   const{title,description}=req.body
//    const newTodo = {
//     id:todos.length+1,
//     title,
//     description
//    }
//    todos.push(newTodo)
//    console.log(todos)


   try {
    const newTodo = new todoModel({title,description})
    await newTodo.save()
    res.status(201).json(newTodo)
   } catch (error) {
     console.log(error)
     res.status(500).json({message:error.message})
   }

   
}) 

// get all items
app.get("/todos",async(req,res)=>{

    try {
        const todos = await todoModel.find()
        res.json(todos)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// update the item

app.put("/todos/:id",async(req,res)=>{
    try {
        const {title,description}=req.body
        const id = req.params.id
        const updatedTodo=await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
        )
        if (!updatedTodo) {
            return res.status(401).json({message:"item not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// delete a item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const {title,description} = req.params
        const id= req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    
    } catch (error) {
        res.status(501).json({message:error.message})
    }
})


// start a server
const port = 8000
app.listen(port,()=>{
   console.log("Server is listening to port"+port)
})

