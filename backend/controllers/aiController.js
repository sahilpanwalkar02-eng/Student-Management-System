const {
  generateStudentSummary,
  chatWithAI,
  getCourseRecommendation,
  getStudyTips,
} = require("../services/aiService");

const getSummary = async (req, res, next) => {
  try {
    const { student } = req.body;
    if (!student || !student.name || !student.course) {
      return res.status(400).json({
        success: false,
        message: "Student data with name and course is required",
      });
    }
    const summary = await generateStudentSummary(student);
    res.status(200).json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }
    const reply = await chatWithAI(message);
    res.status(200).json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

const getRecommendation = async (req, res, next) => {
  try {
    const { student } = req.body;
    if (!student || !student.course) {
      return res.status(400).json({
        success: false,
        message: "Student course is required",
      });
    }
    const recommendations = await getCourseRecommendation(student);
    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};

const getStudyTipsForStudent = async (req, res, next) => {
  try {
    const { student } = req.body;
    if (!student || !student.course) {
      return res.status(400).json({
        success: false,
        message: "Student course is required",
      });
    }
    const tips = await getStudyTips(student);
    res.status(200).json({ success: true, tips });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  chat,
  getRecommendation,
  getStudyTipsForStudent,
};