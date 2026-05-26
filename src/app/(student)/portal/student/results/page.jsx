export const metadata = { title: "Results | Student Portal" };
const exams = [
  { exam:"Half-Yearly 2025", bangla:85, english:78, math:92, science:88, social:80, total:423, gpa:"A+", pass:true },
  { exam:"Annual 2024",      bangla:80, english:75, math:88, science:82, social:76, total:401, gpa:"A",  pass:true },
  { exam:"Monthly — April",  bangla:72, english:70, math:85, science:78, social:68, total:373, gpa:"A",  pass:true },
];
const subColors = { bangla:"#4F46E5", english:"#F59E0B", math:"#10B981", science:"#7C3AED", social:"#0EA5E9" };
export default function StudentResults() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Results</h1>
        <p className="text-slate-500 text-sm">Exam results for Academic Year 2025</p></div>
      {exams.map((e)=>(
        <div key={e.exam} className="p-6 rounded-2xl" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">{e.exam}</h3>
            <div className="flex items-center gap-3">
              <span className="font-black text-2xl" style={{ color:e.gpa==="A+"?"#10B981":"#4F46E5" }}>{e.gpa}</span>
              <span className="badge badge-success">✓ Passed</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {[["Bangla",e.bangla,"bangla"],["English",e.english,"english"],["Math",e.math,"math"],["Science",e.science,"science"],["Social",e.social,"social"]].map(([sub,mark,key])=>(
              <div key={sub} className="text-center p-3 rounded-xl" style={{ background:"#F8FAFC" }}>
                <p className="text-xl font-black mb-1" style={{ color:subColors[key], fontFamily:"Poppins" }}>{mark}</p>
                <div className="h-1.5 rounded-full mb-1.5" style={{ background:"#E2E8F0" }}>
                  <div className="h-1.5 rounded-full" style={{ width:`${mark}%`, background:subColors[key] }} />
                </div>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"#EEF2FF" }}>
            <span className="font-bold text-slate-700 text-sm">Total: <strong className="text-indigo-600">{e.total}/500</strong></span>
            <span className="font-bold text-slate-700 text-sm">Percentage: <strong className="text-indigo-600">{((e.total/500)*100).toFixed(1)}%</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
}
