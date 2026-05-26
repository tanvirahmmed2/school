export const metadata = { title: "Fee History | Student Portal" };
const fees = [
  { month:"May 2025",      amount:1500, status:"paid",    date:"May 5, 2025",    receipt:"RCP-2025-001" },
  { month:"April 2025",    amount:1500, status:"paid",    date:"Apr 3, 2025",    receipt:"RCP-2025-002" },
  { month:"March 2025",    amount:1500, status:"paid",    date:"Mar 6, 2025",    receipt:"RCP-2025-003" },
  { month:"February 2025", amount:1500, status:"paid",    date:"Feb 4, 2025",    receipt:"RCP-2025-004" },
  { month:"January 2025",  amount:1500, status:"paid",    date:"Jan 7, 2025",    receipt:"RCP-2025-005" },
  { month:"June 2025",     amount:1500, status:"pending", date:null,             receipt:null },
];
export default function StudentFees() {
  const paid   = fees.filter(f=>f.status==="paid").reduce((s,f)=>s+f.amount,0);
  const pending= fees.filter(f=>f.status!=="paid").reduce((s,f)=>s+f.amount,0);
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Fee History</h1>
        <p className="text-slate-500 text-sm">Monthly tuition fee payment records</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[["💰","Total Paid",`৳ ${paid.toLocaleString()}`,"#10B981"],["⏳","Pending",`৳ ${pending.toLocaleString()}`,"#F59E0B"],["📋","Records",fees.length,"#4F46E5"]].map(([icon,label,value,color])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-2xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-500 text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <table className="w-full">
          <thead><tr style={{ background:"#F8FAFC" }}>
            {["Month","Amount","Status","Paid Date","Receipt"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>)}
          </tr></thead>
          <tbody>
            {fees.map((f,i)=>(
              <tr key={i} style={{ borderBottom:i<fees.length-1?"1px solid #E2E8F0":"none" }}>
                <td className="px-5 py-4 font-medium text-slate-800 text-sm">{f.month}</td>
                <td className="px-5 py-4 font-bold text-slate-800 text-sm">৳ {f.amount.toLocaleString()}</td>
                <td className="px-5 py-4"><span className={`badge ${f.status==="paid"?"badge-success":"badge-warning"}`}>{f.status==="paid"?"✓ Paid":"⏳ Pending"}</span></td>
                <td className="px-5 py-4 text-sm text-slate-500">{f.date||"—"}</td>
                <td className="px-5 py-4 text-sm text-slate-500 font-mono">{f.receipt||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
