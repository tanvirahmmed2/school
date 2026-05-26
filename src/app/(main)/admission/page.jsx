import Link from "next/link";
export const metadata = { title: "Admission | Govt. Primary School" };
export default function AdmissionPage() {
  return (
    <div className="w-full">
      <div className="py-20 text-center text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0F172A,#1E1B4B,#312E81)" }}>
        <div className="relative max-w-2xl mx-auto px-4">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#FCD34D" }}>🎉 Admissions Open — 2025-26</span>
          <h1 className="text-5xl font-black mb-3" style={{ fontFamily: "Poppins" }}>Apply for Admission</h1>
          <p className="text-indigo-300 text-lg">Join our family of 1,200+ students. Applications open until June 30, 2025.</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full"><svg viewBox="0 0 1440 60" fill="#F8FAFC"><path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"/></svg></div>
      </div>
      <section className="section-padding" style={{ background: "#F8FAFC" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 p-8 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
            <h2 className="font-black text-2xl text-slate-800 mb-6" style={{ fontFamily: "Poppins" }}>Online Admission Form</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">First Name *</label><input type="text" placeholder="First name" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Last Name *</label><input type="text" placeholder="Last name" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Date of Birth *</label><input type="date" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Gender *</label><select className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none bg-white"><option>Select Gender</option><option>Male</option><option>Female</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Applying for Class *</label><select className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none bg-white"><option>Select Class</option><option>Pre-School</option><option>Class 1</option><option>Class 2</option><option>Class 3</option><option>Class 4</option><option>Class 5</option></select></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Previous School</label><input type="text" placeholder="School name" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
              </div>
              <hr className="border-slate-100 my-2" />
              <h3 className="font-bold text-slate-700">Guardian Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Guardian Name *</label><input type="text" placeholder="Father/Mother name" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Phone Number *</label><input type="tel" placeholder="01XXXXXXXXX" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none" /></div>
              </div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Home Address *</label><textarea rows={2} placeholder="Full address" className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 outline-none resize-none" /></div>
              <button type="submit" className="w-full py-3.5 rounded-xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>Submit Application →</button>
            </form>
          </div>
          <div className="space-y-5">
            <div className="p-6 rounded-2xl" style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)" }}>
              <h3 className="font-bold text-slate-800 mb-4">Admission Info</h3>
              {[["📅","Session","2025-2026"],["⏰","Last Date","June 30, 2025"],["💳","Admission Fee","৳ 500"],["📱","Contact","+880 1700-000000"]].map(([icon,label,value])=>(
                <div key={label} className="flex items-center gap-3 py-2.5 border-b border-indigo-100 last:border-0">
                  <span>{icon}</span><span className="text-sm text-slate-600 flex-1">{label}</span><span className="text-sm font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
              <h3 className="font-bold text-slate-800 mb-3">Required Documents</h3>
              {["Birth certificate","2 passport photos","Previous result card","Parent NID copy","Transfer certificate"].map(doc=>(
                <div key={doc} className="flex items-start gap-2 py-1.5 text-sm text-slate-600"><span className="text-green-500 font-bold">✓</span>{doc}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
