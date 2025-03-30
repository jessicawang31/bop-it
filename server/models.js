import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const models = {};

console.log('connecting to db');
await mongoose.connect('mongodb+srv://taiiwin:tainguyen202103@cluster0.sse0u.mongodb.net/');
console.log('connected to db!');

// store each comment post in chatbox 
const chatBoxSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

// each game thats played, store the user & their score 
const scoresSchema = new mongoose.Schema({
    username: String, 
    score: Number, 
    score_date: { type: Date, default: Date.now }
});

models.ChatBox = mongoose.model('ChatBox', chatBoxSchema);
models.Scores = mongoose.model('Scores', scoresSchema);

export default models;