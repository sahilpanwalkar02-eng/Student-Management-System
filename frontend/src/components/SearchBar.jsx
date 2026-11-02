/**
 * Search bar for filtering students by name.
 * @param {string} query - Current search string
 * @param {function} onChange - Callback to update parent state
 */
const SearchBar = ({ query, onChange }) => (
  <div className="relative w-full max-w-md">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
    <input
      type="text"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search students by name..."
      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition"
    />
  </div>
);

export default SearchBar;