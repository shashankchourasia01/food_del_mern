import mongoose from "mongoose";

// Scheme is describe Food Model properties
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
})


const foodModel = mongoose.model.food  || mongoose.model("food",foodSchema)

export default foodModel;