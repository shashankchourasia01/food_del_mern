import mongoose from "mongoose";


export const connectDB = async () => {
   try {
     await mongoose.connect('mongodb+srv://shashankchourasia:3RHCX6qmnYzTytv4@cluster0.s4no4.mongodb.net/FOOD-DELIVERY').then(() => console.log("DB Connected"));
   } catch (error) {
    console.error("MongoDB Connection error:",error)
   }
    
}