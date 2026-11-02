import { useState } from "react";

const NAV_ITEMS = [
  { key: "dashboard", icon: "⊞", label: "Dashboard" },
  { key: "students",  icon: "🎓", label: "Students"  },
  { key: "analytics", icon: "📊", label: "Analytics" },
  { key: "courses",   icon: "📚", label: "Courses"   },
  { key: "settings",  icon: "⚙",  label: "Settings"  },
];

const Sidebar = ({ activePage, onNavigate, studentCount }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-30 flex flex-col glass border-r
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-56"}
      `}
      style={{ borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="relative w-8 h-8 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm float">
            E
          </div>
        </div>
        {!collapsed && (
          <div className="fade-in-up">
            <p className="font-bold text-sm text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              EduManager
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Student Portal</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
              border transition-all duration-150 text-sm font-medium
              ${activePage === item.key
                ? "nav-active border-indigo-500/30"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }
            `}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {!collapsed && <span className="fade-in-up">{item.label}</span>}
            {!collapsed && item.key === "students" && studentCount > 0 && (
              <span className="ml-auto tag" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                {studentCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5 transition text-sm"
        >
          <span className="text-base shrink-0">{collapsed ? "→" : "←"}</span>
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User profile */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 ${collapsed ? "justify-center" : ""}`}>
          <div className="avatar-ring shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
          {!collapsed && (
            <div className="fade-in-up overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Admin</p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>admin@edu.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
