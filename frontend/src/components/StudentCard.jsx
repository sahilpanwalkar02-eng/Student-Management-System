import { useState } from "react";
import AISummary from "./AISummary";

const COURSE_THEMES = [
  { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.25)",  tag: "rgba(99,102,241,0.2)",  tagText: "#a5b4fc", avatar: "from-indigo-500 to-violet-600"  },
  { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", tag: "rgba(139,92,246,0.2)", tagText: "#c4b5fd", avatar: "from-violet-500 to-purple-600"  },
  { bg: "rgba(6,182,212,0.10)",  border: "rgba(6,182,212,0.25)",  tag: "rgba(6,182,212,0.2)",  tagText: "#67e8f9", avatar: "from-cyan-500 to-blue-600"     },
  { bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.25)", tag: "rgba(16,185,129,0.2)", tagText: "#6ee7b7", avatar: "from-emerald-500 to-teal-600"  },
  { bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)", tag: "rgba(245,158,11,0.2)", tagText: "#fcd34d", avatar: "from-amber-500 to-orange-600"  },
  { bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)",  tag: "rgba(239,68,68,0.2)",  tagText: "#fca5a5", avatar: "from-red-500 to-rose-600"      },
];

/**
 * Get initials from a full name
 */
const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

/**
 * StudentCard — full-featured card with expand/collapse,
 * AI tools, edit/delete, and status badge.
 */
const StudentCard = ({ student, onEdit, onDelete, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const theme = COURSE_THEMES[index % COURSE_THEMES.length];
  const initials = getInitials(student.name);

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 300)); // brief visual feedback
    onDelete(student._id);
  };

  // Format join date
  const joinDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "—";

  return (
    <div
      className={`
        relative glass glass-hover rounded-2xl overflow-hidden
        transition-all duration-300 noise
        ${deleting ? "opacity-0 scale-95" : "opacity-100 scale-100"}
        ${expanded ? "ring-1 ring-indigo-500/30" : ""}
      `}
      style={{ background: theme.bg, borderColor: theme.border }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.tagText}, transparent)` }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white font-bold text-sm`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {initials}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#060910]" />
          </div>

          {/* Name & email */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-white truncate leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px" }}
            >
              {student.name}
            </h3>
            <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
              {student.email}
            </p>
          </div>

          {/* Age badge */}
          <span
            className="tag shrink-0 text-xs"
            style={{ background: theme.tag, color: theme.tagText }}
          >
            {student.age}y
          </span>
        </div>

        {/* Course tag */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="tag text-xs"
            style={{ background: theme.tag, color: theme.tagText }}
          >
            📚 {student.course}
          </span>
          <span
            className="tag text-xs ml-auto"
            style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
          >
            {joinDate}
          </span>
        </div>

        {/* Expand button → shows AI tools */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            background: expanded ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
            color: expanded ? "#a5b4fc" : "#6b7280",
            border: `1px solid ${expanded ? "rgba(99,102,241,0.3)" : "transparent"}`,
          }}
        >
          <span className="flex items-center gap-1.5">
            <span>✨</span> AI Tools
          </span>
          <span
            className="transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </button>

        {/* AI Summary panel — expands smoothly */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: expanded ? "600px" : "0px" }}
        >
          <div className="pt-3">
            <AISummary student={student} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(student)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.2)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.1)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.18)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
            }}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
