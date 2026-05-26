export const metadata = { title: "Results | Govt. Primary School" };
export default function ResultPage() {
  return (
    <div className="w-full">
      <div className="py-20 text-center text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0F172A,#1E1B4B,#312E81)" }}>
        <div className="relative max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-3" style={{ fontFamily: "Poppins" }}>Result Portal</h1>
          <p className="text-indigo-300 text-lg">Check your exam results online by entering your roll number</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full"><svg viewBox="0 0 1440 60" fill="#F8FAFC"><path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"/></svg></div>
      </div>
      <section className="section-padding" style={{ background: "#F8FAFC" }}>
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl mb-8" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
            <h2 className="font-bold text-slate-800 text-xl mb-6">Search Your Result</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Roll Number *</label><input type="text" placeholder="e.g. 101" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Class *</label><select className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none bg-white"><option>Select Class</option><option>Class 1</option><option>Class 2</option><option>Class 3</option><option>Class 4</option><option>Class 5</option></select></div>
              </div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Exam *</label><select className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none bg-white"><option>Half-Yearly 2025</option><option>Annual 2024</option><option>Monthly Test — April 2025</option></select></div>
              <button className="w-full py-3.5 rounded-xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>Search Result →</button>
            </div>
          </div>
          {/* Sample result card */}
          <div className="p-8 rounded-2xl" style={{ background: "#fff", border: "2px solid #4F46E5" }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Result Card</p>
                <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: "Poppins" }}>Sakib Hasan</h3>
                <p className="text-slate-500 text-sm">Roll: 101 | Class 5 | Half-Yearly 2025</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>A+</div>
                <p className="text-xs text-slate-400 mt-1">GPA</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[["Bangla","85"],["English","78"],["Math","92"],["Science","88"],["Social","80"]].map(([sub, marks])=>(
                <div key={sub} className="text-center p-3 rounded-xl" style={{ background: "#F8FAFC" }}>
                  <p className="text-lg font-black text-slate-800">{marks}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#EEF2FF" }}>
              <span className="font-bold text-slate-700">Total: <strong className="text-indigo-600">423 / 500</strong></span>
              <span className="font-bold text-slate-700">Percentage: <strong className="text-indigo-600">84.6%</strong></span>
              <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: "#ECFDF5", color: "#10B981" }}>✓ Passed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
