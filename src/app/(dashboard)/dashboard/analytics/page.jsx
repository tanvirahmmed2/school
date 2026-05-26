export const metadata = { title: "Analytics | Admin Dashboard" };

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const incomeData = [18000,22000,19500,25000,28400,31200,27800,29500,33100,30200,35000,38400];
const studentsData = [1150,1160,1170,1185,1200,1210,1220,1235,1240,1245,1247,1247];

export default function AnalyticsPage() {
  const maxIncome = Math.max(...incomeData);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Analytics</h1>
        <p className="text-slate-400 text-sm">Academic year 2025 performance overview</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[["💰","Total Revenue","৳ 3,84,000","#10B981","+18% vs last year"],["🎓","Total Students","1,247","#4F46E5","+97 this year"],["✅","Avg Attendance","91%","#F59E0B","Across all classes"],["🏆","Pass Rate","98%","#7C3AED","Half-Yearly 2025"]].map(([icon,label,value,color,sub])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-2xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-300 text-sm font-semibold">{label}</p>
            <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Income Chart */}
      <div className="p-6 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <h3 className="font-bold text-white mb-5">Monthly Income (৳)</h3>
        <div className="flex items-end gap-2 h-48">
          {incomeData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <p className="text-[9px] text-slate-500 hidden sm:block">{Math.round(val/1000)}k</p>
              <div
                className="w-full rounded-t-lg transition-all hover:opacity-80"
                style={{ height:`${(val/maxIncome)*180}px`, background:`linear-gradient(to top, #4F46E5, #7C3AED)`, minHeight:"4px" }}
              />
              <p className="text-[9px] text-slate-500">{months[i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student growth */}
      <div className="p-6 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <h3 className="font-bold text-white mb-4">Student Enrollment Growth</h3>
        <div className="space-y-2">
          {studentsData.map((val, i) => (
            <div key={i} className="flex items-center gap-3">
              <p className="text-xs text-slate-500 w-8">{months[i]}</p>
              <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background:"#334155" }}>
                <div className="h-full rounded-full" style={{ width:`${(val/1300)*100}%`, background:"linear-gradient(to right,#4F46E5,#7C3AED)" }} />
              </div>
              <p className="text-xs font-bold text-white w-14 text-right">{val.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
