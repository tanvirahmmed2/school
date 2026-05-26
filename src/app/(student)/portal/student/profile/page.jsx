export const metadata = { title: "My Profile | Student Portal" };
export default function StudentProfile() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div><h1 className="text-2xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>My Profile</h1>
        <p className="text-slate-500 text-sm">Your personal information and details</p></div>
      <div className="p-6 rounded-2xl" style={{ background:"#fff", border:"1px solid #E2E8F0" }}>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black" style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>S</div>
          <div><h2 className="text-xl font-black text-slate-800" style={{ fontFamily:"Poppins" }}>Sakib Hasan</h2>
            <p className="text-slate-500 text-sm">Class 5 · Section A · Roll 101</p>
            <span className="badge badge-success mt-1">Active</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[["Roll Number","101"],["Class","Class 5"],["Section","A"],["Batch","2025"],["Gender","Male"],["Guardian","Karim Hasan"],["Phone","01900000001"],["Address","Uttara, Dhaka"],["Join Date","January 15, 2020"],["Status","Active"]].map(([label,value])=>(
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
