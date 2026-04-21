const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function check() {
    try {
        console.log("Checking Gemini API key accessibility...");
        console.log(`Key starts with: ${String(process.env.GEMINI_API_KEY).substring(0, 5)}...`);
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, respond in 5 words.");
        const response = await result.response;
        const text = response.text();
        
        fs.writeFileSync('check_out.txt', `SUCCESS: ${text}`);
    } catch (e) {
        fs.writeFileSync('check_out.txt', `ERROR_MSG: ${e.message} STACK: ${e.stack}`);
    }
}

check();
