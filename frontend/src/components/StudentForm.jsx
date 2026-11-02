import { useState, useEffect } from "react";

const EMPTY = { name: "", email: "", course: "", age: "" };

const COURSES = [
  "Computer Science", "Data Science", "Software Engineering",
  "Cybersecurity", "Artificial Intelligence", "Web Development",
  "Mobile Development", "Cloud Computing", "Mathematics",
  "Physics", "Business Administration", "Design",
];

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "#6b7280" }}>
      {label}
    </label>
    {children}
    {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
  </div>
);

/**
 * StudentForm — add/edit with inline validation and live preview.
 */
const StudentForm = ({ editingStudent, onSubmit, onCancel }) => {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    setForm(editingStudent
      ? { name: editingStudent.name, email: editingStudent.email, course: editingStudent.course, age: editingStudent.age }
      : EMPTY
    );
    setErrors({});
  }, [editingStudent]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                    e.name   = "Name is required";
    if (!form.email.includes("@"))            e.email  = "Enter a valid email";
    if (!form.course)                         e.course = "Select a course";
    if (!form.age || form.age < 10 || form.age > 100) e.age = "Age must be 10–100";
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, age: Number(form.age) });
      setForm(EMPTY);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const initials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const isEdit = !!editingStudent;

  return (
    <div
      className="glass rounded-2xl overflow-hidden noise"
      style={{ borderColor: isEdit ? "rgba(99,102,241,0.3)" : "var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center gap-3 border-b"
        style={{
          borderColor: "var(--border)",
          background: isEdit ? "rgba(99,102,241,0.06)" : "transparent",
        }}
      >
        {/* Live preview avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all"
          style={{
            background: form.name
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "rgba(255,255,255,0.06)",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {initials}
        </div>
        <div>
          <h2
            className="font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {isEdit ? "Edit Student" : "Add New Student"}
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {form.name || "Fill in the details below"}
            {form.course && ` · ${form.course}`}
          </p>
        </div>

        {isEdit && (
          <span
            className="ml-auto tag"
            style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}
          >
            Editing
          </span>
        )}
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Name */}
          <Field label="Full Name" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              placeholder="e.g. Jane Doe"
              className="input-field"
              style={errors.name ? { borderColor: "rgba(239,68,68,0.5)" } : {}}
            />
          </Field>

          {/* Email */}
          <Field label="Email Address" error={errors.email}>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="jane@example.com"
              className="input-field"
              style={errors.email ? { borderColor: "rgba(239,68,68,0.5)" } : {}}
            />
          </Field>

          {/* Course dropdown */}
          <Field label="Course / Major" error={errors.course}>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className="input-field"
              style={{
                ...(errors.course ? { borderColor: "rgba(239,68,68,0.5)" } : {}),
                appearance: "none",
              }}
            >
              <option value="">Select a course...</option>
              {COURSES.map((c) => (
                <option key={c} value={c} style={{ background: "#0d1220" }}>{c}</option>
              ))}
            </select>
          </Field>

          {/* Age */}
          <Field label="Age" error={errors.age}>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              onFocus={() => setFocused("age")}
              onBlur={() => setFocused(null)}
              placeholder="e.g. 21"
              min="10"
              max="100"
              className="input-field"
              style={errors.age ? { borderColor: "rgba(239,68,68,0.5)" } : {}}
            />
          </Field>
        </div>

        {/* Progress indicator */}
        {!isEdit && (
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>Form completion</span>
              <span>
                {[form.name, form.email, form.course, form.age].filter(Boolean).length} / 4
              </span>
            </div>
            <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${([form.name, form.email, form.course, form.age].filter(Boolean).length / 4) * 100}%`,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading
              ? "Saving..."
              : isEdit
              ? "✓ Update Student"
              : "＋ Add Student"}
          </button>
          {isEdit && (
            <button type="button" onClick={onCancel} className="btn-ghost px-5">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
