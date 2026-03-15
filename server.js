import openai from "openai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const server = express();


server.use(cors());
server.use(express.json());

console.log("Server is running...");







const systemPrompt = "You are a helpful assistant that generates prompts for users based on their input. You will receive a user input and you need to generate a relevant prompt that can be used to get a response from an AI model. The prompt should be clear, concise, and relevant to the user's input.Assign the AI a role wherever applicable. Structure the tasks well. The prompt should also be designed to elicit a specific response from the AI model. Please generate a prompt based on the following user input: . It's critical that you send only the improved prompt. Nothing else. Make minimal assumptions about the user's intent.Work with what information is in the prompt especially if the prompt is vague. The user input is: ";

const deepseek = new openai.OpenAI({ 
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
    })


    server.post("/get-prompt", async (req, res) => {
        const userInput = req.body?.userInput;

        const requestedKey = req.get("serverkey"); //express way to get header

        if (requestedKey !== process.env.SERVER_KEY) {
            return res.status(401).json({
                error: "Invalid server key"
            });
        }


        if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
  return res.status(400).json({
    error: "User input is required"
  });
}

   

        try{const completion = await deepseek.chat.completions.create({
        messages: [
        { role: "system", content: systemPrompt} ,
       

        {role:"user",content:userInput},],

        model: "deepseek-chat",});


        


        res.send({response: completion.choices[0].message.content});

        }catch(error){
            console.log(error);
            res.status(500).json({
      error: "Failed to generate prompt"
    });
        }
            
    });


    server.get("/", (req, res) => {
        res.send("Hello from the server!");
    });


    

    server.get("/privacy-policy", (req, res) => {
       res.sendFile(path.join(__dirname, "promptify_privacy_policy.html"));
    });


    server.listen(process.env.PORT);

