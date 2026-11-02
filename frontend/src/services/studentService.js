import axios from "axios";

/**
 * ============================================
 * Student Service — API Layer for Students
 * ============================================
 * All HTTP requests related to students go
 * through this file. Components and hooks
 * never call axios directly — they use these
 * functions instead.
 *
 * Base URL: http://localhost:5000/api
 * ============================================
 */

// Create a reusable Axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs before every request — useful for adding
// auth tokens later if you add login feature
// ─────────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    // You can add auth token here later:
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs after every response — handles global
// errors like 401 unauthorized, 500 server error
// ─────────────────────────────────────────────
API.interceptors.response.use(
  (response) => {
    // Successful response — just return it
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} 
       ${error.config?.url} → ${error.response?.status} 
       ${error.response?.data?.message || error.message}`
    );
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// 1. GET ALL STUDENTS
// ─────────────────────────────────────────────

/**
 * Fetch all students from the backend.
 * Students are returned newest first (sorted by createdAt).
 *
 * @returns {Promise} - { success: true, data: [...students] }
 *
 * @example
 * const res = await fetchStudents();
 * console.log(res.data.data); // array of students
 */
export const fetchStudents = () => API.get("/students");

// ─────────────────────────────────────────────
// 2. GET SINGLE STUDENT BY ID
// ─────────────────────────────────────────────

/**
 * Fetch a single student by their MongoDB ID.
 *
 * @param {string} id - MongoDB ObjectId of the student
 * @returns {Promise} - { success: true, data: student }
 *
 * @example
 * const res = await fetchStudentById("64abc123...");
 * console.log(res.data.data); // single student object
 */
export const fetchStudentById = (id) => API.get(`/students/${id}`);

// ─────────────────────────────────────────────
// 3. CREATE NEW STUDENT
// ─────────────────────────────────────────────

/**
 * Create a brand new student record in the database.
 *
 * @param {Object} studentData - The student form data
 * @param {string} studentData.name   - Full name (required)
 * @param {string} studentData.email  - Email address (required, unique)
 * @param {string} studentData.course - Course/major (required)
 * @param {number} studentData.age    - Age between 10-100 (required)
 * @returns {Promise} - { success: true, data: newStudent }
 *
 * @example
 * const res = await addStudent({
 *   name: "Jane Doe",
 *   email: "jane@example.com",
 *   course: "Computer Science",
 *   age: 21
 * });
 * console.log(res.data.data); // newly created student with _id
 */
export const addStudent = (studentData) =>
  API.post("/students", studentData);

// ─────────────────────────────────────────────
// 4. UPDATE EXISTING STUDENT
// ─────────────────────────────────────────────

/**
 * Update an existing student's information by ID.
 * Only send the fields you want to update.
 *
 * @param {string} id           - MongoDB ObjectId of the student
 * @param {Object} studentData  - Updated fields to save
 * @param {string} [studentData.name]   - Updated name
 * @param {string} [studentData.email]  - Updated email
 * @param {string} [studentData.course] - Updated course
 * @param {number} [studentData.age]    - Updated age
 * @returns {Promise} - { success: true, data: updatedStudent }
 *
 * @example
 * const res = await updateStudent("64abc123...", {
 *   course: "Data Science",
 *   age: 22
 * });
 * console.log(res.data.data); // updated student object
 */
export const updateStudent = (id, studentData) =>
  API.put(`/students/${id}`, studentData);

// ─────────────────────────────────────────────
// 5. DELETE STUDENT
// ─────────────────────────────────────────────

/**
 * Permanently delete a student from the database by ID.
 *
 * @param {string} id - MongoDB ObjectId of the student to delete
 * @returns {Promise} - { success: true, message: "Student deleted" }
 *
 * @example
 * const res = await deleteStudent("64abc123...");
 * console.log(res.data.message); // "Student deleted successfully"
 */
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// ─────────────────────────────────────────────
// 6. SEARCH STUDENTS BY NAME
// ─────────────────────────────────────────────

/**
 * Search students by name using a query parameter.
 * The backend filters by name (case-insensitive).
 *
 * Note: In this project, search is done on the frontend
 * by filtering the already-fetched student list.
 * This function is here for when you upgrade to
 * server-side search in the future.
 *
 * @param {string} query - The search term (student name)
 * @returns {Promise} - { success: true, data: [...matchingStudents] }
 *
 * @example
 * const res = await searchStudents("jane");
 * console.log(res.data.data); // students whose name includes "jane"
 */
export const searchStudents = (query) =>
  API.get(`/students?search=${encodeURIComponent(query)}`);

// ─────────────────────────────────────────────
// EXPORTS SUMMARY
// ─────────────────────────────────────────────
/**
 * Exported functions:
 *
 * fetchStudents()          → GET    /api/students
 * fetchStudentById(id)     → GET    /api/students/:id
 * addStudent(data)         → POST   /api/students
 * updateStudent(id, data)  → PUT    /api/students/:id
 * deleteStudent(id)        → DELETE /api/students/:id
 * searchStudents(query)    → GET    /api/students?search=query
 */