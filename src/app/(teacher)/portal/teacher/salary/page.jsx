export const metadata = { title: "Salary | Teacher Portal" };
const records = [
  { month:"May 2025",  amount:25000, status:"paid",    date:"May 30, 2025" },
  { month:"Apr 2025",  amount:25000, status:"paid",    date:"Apr 30, 2025" },
  { month:"Mar 2025",  amount:25000, status:"paid",    date:"Mar 30, 2025" },
  { month:"Feb 2025",  amount:25000, status:"paid",    date:"Feb 28, 2025" },
  { month:"Jan 2025",  amount:25000, status:"paid",    date:"Jan 31, 2025" },
  { month:"Jun 2025",  amount:25000, status:"pending", date:null },
];
export default function TeacherSalary() {
  const totalPaid = records.filter(r=>r.status==="paid").reduce((s,r)=>s+r.amount,0);
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Salary</h1>
        <p className="text-slate-500 text-sm">Monthly salary disbursement records</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl col-span-1" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
          <p className="text-2xl mb-2">💰</p>
          <p className="text-2xl font-black mb-0.5 text-indigo-600" style={{ fontFamily:"Poppins" }}>৳ 25,000</p>
          <p className="text-slate-500 text-sm">Monthly Salary</p>
        </div>
        <div className="p-5 rounded-2xl col-span-2" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
          <p className="text-2xl mb-2">✅</p>
          <p className="text-2xl font-black mb-0.5 text-emerald-500" style={{ fontFamily:"Poppins" }}>৳ {totalPaid.toLocaleString()}</p>
          <p className="text-slate-500 text-sm">Total received — 2025</p>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead><tr style={{ background:"#F8FAFC" }}>
            {["Month","Amount","Status","Date"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>)}
          </tr></thead>
          <tbody>
            {records.map((r,i)=>(
              <tr key={i} style={{ borderBottom:i<records.length-1?"1px solid #E2E8F0":"none" }}>
                <td className="px-5 py-4 font-medium text-slate-800 text-sm">{r.month}</td>
                <td className="px-5 py-4 font-bold text-slate-800 text-sm">৳ {r.amount.toLocaleString()}</td>
                <td className="px-5 py-4"><span className={`badge ${r.status==="paid"?"badge-success":"badge-warning"}`}>{r.status==="paid"?"✓ Paid":"⏳ Pending"}</span></td>
                <td className="px-5 py-4 text-sm text-slate-500">{r.date||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
