import axios from "axios";

// Base Axios instance pointing to backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/**
 * Get AI-generated professional summary for a student
 * @param {Object} student - Full student object
 * @returns {Promise} - { success, summary }
 */
export const getAISummary = (student) =>
  API.post("/ai/summary", { student });

/**
 * Send a chat message to the AI academic assistant
 * @param {string} message - User's chat message
 * @returns {Promise} - { success, reply }
 */
export const sendChatMessage = (message) =>
  API.post("/ai/chat", { message });

/**
 * Get course recommendations for a student
 * @param {Object} student - Student object with course field
 * @returns {Promise} - { success, recommendations }
 */
export const getCourseRecommendations = (student) =>
  API.post("/ai/recommend", { student });

/**
 * Get personalized study tips for a student
 * @param {Object} student - Student object with course field
 * @returns {Promise} - { success, tips }
 */
export const getStudyTips = (student) =>
  API.post("/ai/studytips", { student });