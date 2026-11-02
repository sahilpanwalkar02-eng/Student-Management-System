/**
 * Analytics — visual breakdown of student data using pure CSS charts.
 */
const Analytics = ({ students }) => {
  if (!students.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 fade-in-up">
        <div className="text-5xl mb-4 float">📊</div>
        <p className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          No data yet
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Add students to see analytics
        </p>
      </div>
    );
  }

  // Course distribution
  const courseCounts = students.reduce((acc, s) => {
    acc[s.course] = (acc[s.course] || 0) + 1;
    return acc;
  }, {});

  const courseData = Object.entries(courseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCount = Math.max(...courseData.map(([, v]) => v));

  // Age distribution
  const ageBuckets = { "10-17": 0, "18-22": 0, "23-27": 0, "28+": 0 };
  students.forEach((s) => {
    if (s.age < 18) ageBuckets["10-17"]++;
    else if (s.age <= 22) ageBuckets["18-22"]++;
    else if (s.age <= 27) ageBuckets["23-27"]++;
    else ageBuckets["28+"]++;
  });

  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

  return (
    <div className="space-y-6 fade-in-up">

      {/* Course distribution bar chart */}
      <div className="glass rounded-2xl p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-bold text-white mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Students per Course
        </h3>
        <div className="space-y-3">
          {courseData.map(([course, count], i) => (
            <div key={course} className="flex items-center gap-3">
              <div className="w-28 text-xs text-right truncate shrink-0" style={{ color: "var(--text-muted)" }}>
                {course}
              </div>
              <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="h-full rounded-lg flex items-center px-3 progress-bar"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <span className="text-xs font-semibold text-white">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Age distribution */}
        <div className="glass rounded-2xl p-6" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-white mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Age Groups
          </h3>
          <div className="flex items-end gap-3 h-32">
            {Object.entries(ageBuckets).map(([range, count], i) => {
              const maxVal = Math.max(...Object.values(ageBuckets)) || 1;
              const pct = (count / maxVal) * 100;
              return (
                <div key={range} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: COLORS[i] }}>{count}</span>
                  <div
                    className="w-full rounded-t-lg chart-bar"
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      background: `linear-gradient(180deg, ${COLORS[i]}, ${COLORS[i]}88)`,
                    }}
                  />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{range}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course pie-style donut */}
        <div className="glass rounded-2xl p-6" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-white mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Course Breakdown
          </h3>
          <div className="space-y-2.5">
            {courseData.slice(0, 5).map(([course, count], i) => {
              const pct = Math.round((count / students.length) * 100);
              return (
                <div key={course}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 truncate">{course}</span>
                    <span style={{ color: COLORS[i % COLORS.length] }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-1.5 rounded-full progress-bar"
                      style={{
                        width: `${pct}%`,
                        background: COLORS[i % COLORS.length],
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent activity table */}
      <div className="glass rounded-2xl p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Recent Enrollments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                <th className="text-left pb-3">Student</th>
                <th className="text-left pb-3">Course</th>
                <th className="text-left pb-3">Age</th>
                <th className="text-left pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {[...students]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((s, i) => (
                  <tr key={s._id} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i+1) % COLORS.length]})` }}
                        >
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs">{s.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className="tag text-xs"
                        style={{ background: `${COLORS[i % COLORS.length]}18`, color: COLORS[i % COLORS.length] }}
                      >
                        {s.course}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-300">{s.age}</td>
                    <td className="py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
