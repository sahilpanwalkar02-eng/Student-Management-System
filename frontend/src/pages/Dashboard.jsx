import { useState, useMemo } from "react";
import useStudents from "../hooks/useStudents";
import StatsGrid from "../components/StatsGrid";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";
import Analytics from "../components/Analytics";
import { ToastContainer } from "../components/Toast";

let toastId = 0;

/**
 * Dashboard — main page, manages all state and renders sections
 * based on activePage passed from App.
 */
const Dashboard = ({ activePage }) => {
  const {
    students, loading, error,
    createStudent, editStudent, removeStudent,
  } = useStudents();

  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("newest");
  const [filterCourse, setFilterCourse]     = useState("all");
  const [toasts, setToasts]                 = useState([]);

  /* ── Toast helpers ── */
  const addToast = (message, type = "success") => {
    const id = ++toastId;
    setToasts((p) => [...p, { id, message, type }]);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  /* ── Unique courses for filter ── */
  const courses = useMemo(
    () => ["all", ...new Set(students.map((s) => s.course))],
    [students]
  );

  /* ── Filtered + sorted students ── */
  const filtered = useMemo(() => {
    let list = [...students];
    if (searchQuery) list = list.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterCourse !== "all") list = list.filter((s) => s.course === filterCourse);
    if (sortBy === "newest")  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "name")    list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "age")     list.sort((a, b) => a.age - b.age);
    return list;
  }, [students, searchQuery, filterCourse, sortBy]);

  /* ── CRUD handlers ── */
  const handleSubmit = async (data) => {
    try {
      if (editingStudent) {
        await editStudent(editingStudent._id, data);
        addToast(`${data.name} updated successfully!`, "success");
        setEditingStudent(null);
      } else {
        await createStudent(data);
        addToast(`${data.name} enrolled successfully!`, "success");
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const s = students.find((x) => x._id === id);
    if (!window.confirm(`Remove ${s?.name} from the system?`)) return;
    try {
      await removeStudent(id);
      addToast("Student removed.", "info");
    } catch {
      addToast("Failed to delete student.", "error");
    }
  };

  /* ── Select dropdown style ── */
  const selectStyle = {
    background: "rgba(13,18,30,0.8)",
    border: "1px solid rgba(99,102,241,0.15)",
    borderRadius: "10px",
    color: "#d1d5db",
    padding: "8px 12px",
    fontSize: "12px",
    outline: "none",
    cursor: "pointer",
  };

  /* ── Page title ── */
  const PAGE_TITLES = {
    dashboard: { title: "Dashboard",  sub: "Overview of your student system" },
    students:  { title: "Students",   sub: `${students.length} enrolled students` },
    analytics: { title: "Analytics",  sub: "Visual breakdown of student data" },
    courses:   { title: "Courses",    sub: "Manage academic programs" },
    settings:  { title: "Settings",   sub: "Configure your portal" },
  };

  const { title, sub } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  return (
    <div className="min-h-screen bg-mesh p-6 lg:p-8">

      {/* Page header */}
      <div className="mb-8 fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6366f1" }}>
          EduManager
        </p>
        <h1
          className="text-3xl sm:text-4xl font-extrabold gradient-text-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm fade-in-up"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── DASHBOARD PAGE ── */}
      {(activePage === "dashboard" || !activePage) && (
        <div className="space-y-8">
          <StatsGrid students={students} />

          {/* Quick add form */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <StudentForm
                editingStudent={editingStudent}
                onSubmit={handleSubmit}
                onCancel={() => setEditingStudent(null)}
              />
            </div>

            {/* Recent students preview */}
            <div className="lg:col-span-3 glass rounded-2xl p-5" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Recent Students
                </h3>
                <span className="tag" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                  {students.length} total
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl shimmer shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 rounded shimmer w-3/4" />
                        <div className="h-2.5 rounded shimmer w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-2">🎓</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No students yet. Add one!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...students]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((s, i) => (
                      <div
                        key={s._id}
                        className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-white/5 fade-in-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)` }}
                        >
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{s.name}</p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{s.course}</p>
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Age {s.age}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STUDENTS PAGE ── */}
      {activePage === "students" && (
        <div className="space-y-6">
          {/* Add/Edit Form */}
          <StudentForm
            editingStudent={editingStudent}
            onSubmit={handleSubmit}
            onCancel={() => setEditingStudent(null)}
          />

          {/* Filters & Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>
                🔍
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name..."
                className="input-field pl-9 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Course filter */}
            <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} style={selectStyle}>
              {courses.map((c) => (
                <option key={c} value={c} style={{ background: "#0d1220" }}>
                  {c === "all" ? "All Courses" : c}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="newest" style={{ background: "#0d1220" }}>Newest First</option>
              <option value="oldest" style={{ background: "#0d1220" }}>Oldest First</option>
              <option value="name"   style={{ background: "#0d1220" }}>Name A–Z</option>
              <option value="age"    style={{ background: "#0d1220" }}>Age ↑</option>
            </select>

            {/* Results count */}
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap"
              style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <span>Showing</span>
              <span className="font-bold">{filtered.length}</span>
              <span>of {students.length}</span>
            </div>
          </div>

          {/* Student grid */}
          <StudentList
            students={filtered}
            loading={loading}
            onEdit={setEditingStudent}
            onDelete={handleDelete}
            query={searchQuery}
          />
        </div>
      )}

      {/* ── ANALYTICS PAGE ── */}
      {activePage === "analytics" && <Analytics students={students} />}

      {/* ── COURSES PAGE ── */}
      {activePage === "courses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in-up">
          {[...new Set(students.map((s) => s.course))].map((course, i) => {
            const count = students.filter((s) => s.course === course).length;
            const avgAge = Math.round(students.filter((s) => s.course === course).reduce((a, s) => a + s.age, 0) / count);
            const COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444"];
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={course}
                className="glass glass-hover rounded-2xl p-5 noise"
                style={{ borderColor: `${color}25` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${color}15` }}
                >
                  📚
                </div>
                <h3 className="font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {course}
                </h3>
                <div className="flex gap-3 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{count}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>{avgAge}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Avg Age</p>
                  </div>
                </div>
                <div className="mt-3 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-1 rounded-full progress-bar" style={{ width: `${(count / students.length) * 100}%`, background: color }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {Math.round((count / students.length) * 100)}% of total
                </p>
              </div>
            );
          })}
          {students.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-4xl mb-3 float">📚</p>
              <p className="text-white font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No courses yet
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Courses appear automatically when you add students.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS PAGE ── */}
      {activePage === "settings" && (
        <div className="max-w-2xl space-y-5 fade-in-up">
          {[
            { title: "Portal Name",       desc: "The name displayed in the browser tab",     value: "EduManager" },
            { title: "Admin Email",       desc: "Primary contact for the system",            value: "admin@edu.com" },
            { title: "Default Course",    desc: "Pre-selected course in the student form",   value: "Computer Science" },
            { title: "Records Per Page",  desc: "How many student cards to show at once",    value: "12" },
          ].map((setting) => (
            <div
              key={setting.title}
              className="glass rounded-2xl p-5 flex items-center justify-between gap-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="font-semibold text-white text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {setting.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{setting.desc}</p>
              </div>
              <input
                defaultValue={setting.value}
                className="input-field text-right"
                style={{ width: "160px" }}
              />
            </div>
          ))}
          <button className="btn-primary">Save Settings</button>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
