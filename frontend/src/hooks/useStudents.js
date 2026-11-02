import { useState, useEffect, useCallback } from "react";
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";

/**
 * Custom hook for managing all student state and CRUD operations.
 */
const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStudents();
      setStudents(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const createStudent = async (formData) => {
    const res = await addStudent(formData);
    setStudents((prev) => [res.data.data, ...prev]);
    return res.data.data;
  };

  const editStudent = async (id, formData) => {
    const res = await updateStudent(id, formData);
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? res.data.data : s))
    );
    return res.data.data;
  };

  const removeStudent = async (id) => {
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s._id !== id));
  };

  return {
    students,
    loading,
    error,
    createStudent,
    editStudent,
    removeStudent,
    reload: loadStudents,
  };
};

export default useStudents;