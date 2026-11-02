import { useEffect, useState } from "react";

/**
 * Animated counter hook
 */
const useCounter = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const StatCard = ({ icon, label, value, sub, color, delay = 0 }) => {
  const count = useCounter(typeof value === "number" ? value : 0, 800);

  const colors = {
    indigo: {
      accent: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.2)",
      line: "linear-gradient(90deg, #6366f1, #8b5cf6)",
      icon: "rgba(99,102,241,0.15)",
    },
    violet: {
      accent: "#8b5cf6",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      line: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
      icon: "rgba(139,92,246,0.15)",
    },
    cyan: {
      accent: "#06b6d4",
      bg: "rgba(6,182,212,0.08)",
      border: "rgba(6,182,212,0.2)",
      line: "linear-gradient(90deg, #06b6d4, #67e8f9)",
      icon: "rgba(6,182,212,0.15)",
    },
    emerald: {
      accent: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      line: "linear-gradient(90deg, #10b981, #34d399)",
      icon: "rgba(16,185,129,0.15)",
    },
  };

  const c = colors[color] || colors.indigo;

  return (
    <div
      className="relative glass glass-hover rounded-2xl p-5 overflow-hidden fade-in-up noise"
      style={{
        background: c.bg,
        borderColor: c.border,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
        style={{ background: c.icon }}
      >
        {icon}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span
          className="text-3xl font-bold count-up"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: c.accent }}
        >
          {typeof value === "number" ? count : value}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-gray-300">{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}

      {/* Bottom accent line */}
      <div
        className="stat-line progress-bar"
        style={{ background: c.line, width: "40%" }}
      />

      {/* Background glow */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-2xl"
        style={{ background: c.accent }}
      />
    </div>
  );
};

const StatsGrid = ({ students }) => {
  const totalStudents = students.length;
  const uniqueCourses = new Set(students.map((s) => s.course)).size;
  const avgAge = students.length
    ? Math.round(students.reduce((a, s) => a + s.age, 0) / students.length)
    : 0;
  const recent = students.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon="🎓" label="Total Students" value={totalStudents} sub="All enrolled" color="indigo" delay={0} />
      <StatCard icon="📚" label="Active Courses" value={uniqueCourses} sub="Unique programs" color="violet" delay={100} />
      <StatCard icon="📊" label="Average Age" value={avgAge} sub="Years old" color="cyan" delay={200} />
      <StatCard icon="✨" label="Added This Week" value={recent} sub="New enrollments" color="emerald" delay={300} />
    </div>
  );
};

export default StatsGrid;
