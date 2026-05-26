export const metadata = { title: "Salary & Payroll | Admin Dashboard" };
const teachers = [
  { id:"T001",name:"Md. Rafiqul Islam",  role:"Head Teacher",      salary:25000, status:"paid",    month:"May 2025" },
  { id:"T002",name:"Nasrin Akter",       role:"Senior Teacher",    salary:20000, status:"paid",    month:"May 2025" },
  { id:"T003",name:"Karim Hossain",      role:"Assistant Teacher", salary:18000, status:"paid",    month:"May 2025" },
  { id:"T004",name:"Fatema Begum",       role:"Senior Teacher",    salary:20000, status:"pending", month:"May 2025" },
  { id:"T005",name:"Alam Hossain",       role:"Assistant Teacher", salary:16000, status:"paid",    month:"May 2025" },
];
const total = teachers.reduce((s,t)=>s+t.salary,0);
const paid  = teachers.filter(t=>t.status==="paid").reduce((s,t)=>s+t.salary,0);

export default function SalaryPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Salary & Payroll</h1>
          <p className="text-slate-400 text-sm">May 2025 payroll summary</p></div>
        <button className="text-sm font-bold px-5 py-2.5 rounded-xl text-white" style={{ background:"linear-gradient(135deg,#10B981,#059669)" }}>Disburse All</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[["💰","Total Payroll",`৳ ${total.toLocaleString()}`,"#4F46E5"],["✅","Disbursed",`৳ ${paid.toLocaleString()}`,"#10B981"],["⏳","Pending",`৳ ${(total-paid).toLocaleString()}`,"#F59E0B"]].map(([icon,label,value,color])=>(
          <div key={label} className="p-5 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-2xl font-black mb-0.5" style={{ color, fontFamily:"Poppins" }}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <table className="data-table">
          <thead><tr><th>Emp ID</th><th>Name</th><th>Role</th><th>Month</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {teachers.map(t=>(
              <tr key={t.id}>
                <td className="text-slate-400 font-mono text-xs">{t.id}</td>
                <td className="text-white font-medium">{t.name}</td>
                <td className="text-slate-400">{t.role}</td>
                <td className="text-slate-400">{t.month}</td>
                <td className="text-white font-bold">৳ {t.salary.toLocaleString()}</td>
                <td><span className={`badge badge-${t.status==="paid"?"success":"warning"}`}>{t.status==="paid"?"✓ Paid":"⏳ Pending"}</span></td>
                <td>{t.status!=="paid" && <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background:"rgba(16,185,129,0.15)",color:"#34D399" }}>Pay Now</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
