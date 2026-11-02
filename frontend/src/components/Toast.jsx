import { useEffect, useState } from "react";

const STYLES = {
  success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)",  text: "#6ee7b7", icon: "✓", bar: "#10b981" },
  error:   { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",   text: "#fca5a5", icon: "✕", bar: "#ef4444" },
  info:    { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)",  text: "#a5b4fc", icon: "i", bar: "#6366f1" },
  warning: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)",  text: "#fcd34d", icon: "!", bar: "#f59e0b" },
};

/**
 * Toast — auto-dismissing notification with progress bar.
 */
const Toast = ({ message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(false);
  const s = STYLES[type] || STYLES.info;
  const DURATION = 3000;

  useEffect(() => {
    // Fade in
    setTimeout(() => setVisible(true), 10);
    // Fade out then close
    const t1 = setTimeout(() => setVisible(false), DURATION - 300);
    const t2 = setTimeout(onClose, DURATION);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  return (
    <div
      className="relative overflow-hidden rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl transition-all duration-300"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: "blur(16px)",
        minWidth: "260px",
        maxWidth: "340px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(20px)",
      }}
    >
      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: `${s.bar}20`, color: s.text }}
      >
        {s.icon}
      </div>

      {/* Message */}
      <p className="text-sm font-medium flex-1" style={{ color: s.text }}>
        {message}
      </p>

      {/* Close */}
      <button
        onClick={onClose}
        className="text-xs opacity-50 hover:opacity-100 transition shrink-0"
        style={{ color: s.text }}
      >
        ✕
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-b-xl"
        style={{
          background: s.bar,
          width: "100%",
          animation: `progressFill ${DURATION}ms linear reverse`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

/**
 * ToastContainer — stacks multiple toasts in the corner.
 */
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
    {toasts.map((t) => (
      <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

export default Toast;
