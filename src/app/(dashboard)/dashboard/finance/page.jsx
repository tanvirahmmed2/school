export const metadata = { title: "Financial Reports | Admin Dashboard" };
const months = ["Jan","Feb","Mar","Apr","May"];
const data = [
  { month:"January 2025",  income:28000, expense:18000 },
  { month:"February 2025", income:31500, expense:19500 },
  { month:"March 2025",    income:29200, expense:17800 },
  { month:"April 2025",    income:33600, expense:20100 },
  { month:"May 2025",      income:38400, expense:22000 },
];

export default function FinancePage() {
  const totalIncome  = data.reduce((s,r)=>s+r.income,0);
  const totalExpense = data.reduce((s,r)=>s+r.expense,0);
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Financial Reports</h1>
        <p className="text-slate-400 text-sm">2025 income & expense overview</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[["💰","Total Income",`৳ ${totalIncome.toLocaleString()}`,"#10B981"],["💸","Total Expense",`৳ ${totalExpense.toLocaleString()}`,"#F43F5E"],["📈","Net Balance",`৳ ${(totalIncome-totalExpense).toLocaleString()}`,"#4F46E5"]].map(([icon,label,value,color])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-2xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <div className="px-5 py-4" style={{ borderBottom:"1px solid #334155" }}><p className="font-bold text-white">Monthly Breakdown</p></div>
        <table className="data-table">
          <thead><tr><th>Month</th><th>Income</th><th>Expense</th><th>Net</th></tr></thead>
          <tbody>
            {data.map(r=>(
              <tr key={r.month}>
                <td className="text-white font-medium">{r.month}</td>
                <td className="font-bold" style={{ color:"#34D399" }}>৳ {r.income.toLocaleString()}</td>
                <td className="font-bold" style={{ color:"#F87171" }}>৳ {r.expense.toLocaleString()}</td>
                <td className="font-bold" style={{ color: r.income-r.expense>0?"#34D399":"#F87171" }}>৳ {(r.income-r.expense).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
