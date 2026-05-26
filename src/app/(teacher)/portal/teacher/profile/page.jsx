export const metadata = { title: "My Profile | Teacher Portal" };
export default function TeacherProfile() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Profile</h1></div>
      <div className="p-6 rounded-2xl" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black" style={{ background:"linear-gradient(135deg,#7C3AED,#4F46E5)" }}>R</div>
          <div><h2 className="text-xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Md. Rafiqul Islam</h2>
            <p className="text-slate-500 text-sm">Head Teacher · Emp ID: T001</p>
            <span className="badge badge-success mt-1">Active</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[["Emp ID","T001"],["Role","Head Teacher"],["Subject","Math & Science"],["Classes","Class 4–5"],["Phone","01711000001"],["Email","rafiq@school.edu.bd"],["Salary","৳ 25,000/month"],["Experience","18 years"],["Join Date","January 10, 2007"],["Address","Uttara, Dhaka"]].map(([label,value])=>(
            <div key={label} className="p-3 rounded-xl" style={{ background:"#F8FAFC" }}>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="font-semibold text-slate-800 text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
