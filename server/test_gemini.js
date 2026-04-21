const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  for (const m of models) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Say hello");
      const resp = await result.response;
      console.log(`✅ Success with ${m}: ${resp.text()}`);
    } catch (e) {
      console.log(`❌ Failed with ${m}: ${e.message}`);
    }
  }
}

test();
