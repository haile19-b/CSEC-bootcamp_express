import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { requestSchema } from "./Validation.js";

const app = express();
dotenv.config();
app.use(express.json());
const MONGOURL = process.env.MONGO_URI;

const checkFOrError = (schema)=>(req, res, next)=>{
    const result = schema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({errors:result.error.format()})
    }
    next();
}

const productSchema = new mongoose.Schema({
     name:String,
     age:Number,
})

const list = mongoose.model("items",productSchema)

const connectDB = async()=>{
    try{
        await mongoose.connect(MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ database is connected successfully")
    }catch(err){
        console.log("❌ database is failed to connect: ",err)
        process.exit(1)
    }
}

connectDB();

app.get('/',(req,res)=>{
    res.send("hello every one this is Hailegebriel !")
})

app.get('/list', async (req, res) => {
    try {
        const lists = await list.find();
        if (!lists.length) {
            return res.status(404).json({ message: "No items found" });
        }
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get('/list/:id', async(req,res)=>{
    const item = await list.findById(req.params.id);
    if(!item){
        return res.status(404).json({message:"no data found with this id"})
    }
    res.status(201).send(item)
})

app.post('/list',checkFOrError(requestSchema),async(req,res)=>{
    const {name,age} = req.body
        const newData =  await list.create({name,age})
        res.status(201).json({message:"the given data is posted successfully", list:newData})
})

app.delete('/list/:id',async(req,res)=>{
    const item = await list.findByIdAndDelete(req.params.id)
    if (!item){
        return res.send("no item is founded with this id ")
    }
    res.json({message:"deleted successfully", item:item})
})


app.put('/list/:id',async(req,res)=>{
    const item = await list.findByIdAndUpdate(req.params.id,{age:req.body.age}, {new:true})
    if(!item){
        return res.json({message:"no data is founded in the give id",})
    }
    res.json({message:"the data is updated successfully", item:item})
})


const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`🚀 Server running at http://localhost:${port}/`));