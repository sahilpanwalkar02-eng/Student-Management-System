import { useState } from "react";
import {
  getAISummary,
  getCourseRecommendations,
  getStudyTips,
} from "../services/aiService";

const TABS = [
  { key: "summary",        label: "Summary",   icon: "✨", color: "#a5b4fc" },
  { key: "recommendations", label: "Courses",  icon: "📚", color: "#67e8f9" },
  { key: "tips",           label: "Study Tips", icon: "💡", color: "#6ee7b7" },
];

/**
 * AISummary — 3-tab AI tool panel embedded in each student card.
 */
const AISummary = ({ student }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [results, setResults] = useState({ summary: "", recommendations: "", tips: "" });
  const [loading, setLoading] = useState({ summary: false, recommendations: false, tips: false });

  const fetchMap = {
    summary:         () => getAISummary(student).then((r) => r.data.summary),
    recommendations: () => getCourseRecommendations(student).then((r) => r.data.recommendations),
    tips:            () => getStudyTips(student).then((r) => r.data.tips),
  };

  const handleTab = async (key) => {
    if (activeTab === key) { setActiveTab(null); return; }
    setActiveTab(key);
    if (results[key]) return; // already fetched

    setLoading((p) => ({ ...p, [key]: true }));
    try {
      const data = await fetchMap[key]();
      setResults((p) => ({ ...p, [key]: data }));
    } catch {
      setResults((p) => ({ ...p, [key]: "⚠️ Failed to generate. Check your API key." }));
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
    }
  };

  const activeColor = TABS.find((t) => t.key === activeTab)?.color || "#a5b4fc";

  return (
    <div>
      {/* Tab buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTab(tab.key)}
            disabled={loading[tab.key]}
            className="flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150 disabled:opacity-50"
            style={{
              background: activeTab === tab.key ? `${tab.color}18` : "rgba(255,255,255,0.04)",
              color: activeTab === tab.key ? tab.color : "#6b7280",
              border: `1px solid ${activeTab === tab.key ? `${tab.color}40` : "transparent"}`,
            }}
          >
            <span className="text-base">{loading[tab.key] ? "⟳" : tab.icon}</span>
            <span style={{ fontSize: "10px" }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Result panel */}
      {activeTab && (
        <div
          className="mt-2 p-3 rounded-xl text-xs leading-relaxed slide-in-right"
          style={{
            background: `${activeColor}08`,
            border: `1px solid ${activeColor}20`,
            color: "#d1d5db",
          }}
        >
          {loading[activeTab] ? (
            <div className="flex items-center gap-2" style={{ color: activeColor }}>
              <span
                className="inline-block"
                style={{ animation: "spin 1s linear infinite", display: "inline-block" }}
              >
                ⟳
              </span>
              <span>Generating with Gemini AI...</span>
            </div>
          ) : (
            <p className="whitespace-pre-line">{results[activeTab]}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AISummary;
