import StudentCard from "./StudentCard";

const SkeletonCard = () => (
  <div className="glass rounded-2xl p-5 space-y-4 overflow-hidden">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-lg shimmer w-3/4" />
        <div className="h-3 rounded-lg shimmer w-1/2" />
      </div>
      <div className="h-5 w-10 rounded-full shimmer" />
    </div>
    <div className="h-6 rounded-lg shimmer w-2/5" />
    <div className="h-8 rounded-lg shimmer" />
    <div className="grid grid-cols-2 gap-2">
      <div className="h-8 rounded-lg shimmer" />
      <div className="h-8 rounded-lg shimmer" />
    </div>
  </div>
);

const EmptyState = ({ query }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 fade-in-up">
    {/* Animated icon */}
    <div className="relative mb-6">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl float"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        🎓
      </div>
      <div
        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
      >
        0
      </div>
    </div>

    {query ? (
      <>
        <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          No results for "{query}"
        </p>
        <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
          Try a different name or clear the search to see all students.
        </p>
      </>
    ) : (
      <>
        <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          No students yet
        </p>
        <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
          Add your first student using the form above. They'll appear here as cards.
        </p>
      </>
    )}
  </div>
);

/**
 * StudentList — renders skeleton, empty state, or student cards grid.
 */
const StudentList = ({ students, onEdit, onDelete, loading, query }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {students.length === 0
        ? <EmptyState query={query} />
        : students.map((s, i) => (
            <div key={s._id} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <StudentCard
                student={s}
                index={i}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))
      }
    </div>
  );
};

export default StudentList;
