const axios = require("axios");

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const callGeminiAPI = async (prompt) => {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from .env file");
    }

    const response = await axios.post(
      `${GEMINI_BASE_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;

  } catch (error) {
    // Print full error in terminal for debugging
    console.error("Gemini API Error:", error.response?.data || error.message);

    if (error.response?.status === 400) {
      throw new Error("Bad request to Gemini API");
    } else if (error.response?.status === 403) {
      throw new Error("Invalid Gemini API key — check your .env file");
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit reached — please wait and try again");
    } else {
      throw new Error(error.message || "Gemini API call failed");
    }
  }
};

const generateStudentSummary = async (student) => {
  const prompt = `
You are a professional academic advisor.
Write a professional 3-sentence academic summary for this student.

Student Details:
- Name: ${student.name}
- Age: ${student.age}
- Course: ${student.course}

Rules:
- Write ONLY 3 sentences
- Be professional and encouraging
- No headings or bullet points
- Under 100 words
  `;
  return await callGeminiAPI(prompt);
};

const chatWithAI = async (message) => {
  const prompt = `
You are EduBot, a friendly academic assistant for a 
Student Management System called EduManager.

Help with questions about:
- Academic courses and education
- Study tips and techniques  
- Student management
- Career advice for students

Keep responses under 80 words. Be friendly and helpful.

User message: ${message}
  `;
  return await callGeminiAPI(prompt);
};

const getCourseRecommendation = async (student) => {
  const prompt = `
Suggest 3 related courses for a student studying ${student.course}.

Format:
1. [Course Name]: One sentence why it's valuable
2. [Course Name]: One sentence why it's valuable
3. [Course Name]: One sentence why it's valuable

Under 100 words total.
  `;
  return await callGeminiAPI(prompt);
};

const getStudyTips = async (student) => {
  const prompt = `
Give 3 specific study tips for a ${student.course} student.

Format:
Tip 1: [specific tip]
Tip 2: [specific tip]
Tip 3: [specific tip]

Under 80 words total.
  `;
  return await callGeminiAPI(prompt);
};

module.exports = {
  generateStudentSummary,
  chatWithAI,
  getCourseRecommendation,
  getStudyTips,
};