import { GoogleGenerativeAI } from "@google/generative-ai";

console.log(
  "API:",
  import.meta.env.VITE_GEMINI_API_KEY
);

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export const getGeminiResponse = async (
  message
) => {
  try {
    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const result =
      await model.generateContent(message);

    const response =
      await result.response;

    return response.text();
  } catch (error) {
    console.log(
      "Gemini Error:",
      error
    );

    return "❌ Gemini AI Error";
  }
};