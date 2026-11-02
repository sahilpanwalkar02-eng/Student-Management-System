const express = require("express");
const router = express.Router();
const {
  getSummary,
  chat,
  getRecommendation,
  getStudyTipsForStudent,
} = require("../controllers/aiController");

// POST /api/ai/summary    → Generate student summary
router.post("/summary", getSummary);

// POST /api/ai/chat       → Chatbot conversation
router.post("/chat", chat);

// POST /api/ai/recommend  → Course recommendations
router.post("/recommend", getRecommendation);

// POST /api/ai/studytips  → Study tips
router.post("/studytips", getStudyTipsForStudent);

module.exports = router;