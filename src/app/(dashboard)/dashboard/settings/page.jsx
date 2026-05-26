"use client";
import React, { useState } from "react";

export default function SettingsPage() {
  const [school, setSchool] = useState({ name:"Govt. Primary School", address:"123 School Road, Uttara, Dhaka-1230", phone:"+880 1700-000000", email:"info@govtprimary.edu.bd", established:"1985", principal:"Md. Rafiqul Islam" });
  const [saved, setSaved] = useState(false);

  function handleSave(e) { e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false),2000); }

  return (
    <div className="space-y-5 max-w-3xl">
      <div><h1 className="text-2xl font-black text-white" style={{ fontFamily:"Poppins" }}>Settings</h1>
        <p className="text-slate-400 text-sm">Manage school information and system settings</p></div>

      {saved && <div className="p-3 rounded-xl text-sm font-medium" style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#34D399" }}>✅ Settings saved successfully!</div>}

      <form onSubmit={handleSave} className="p-6 rounded-2xl space-y-4" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <h3 className="font-bold text-white text-lg mb-2">School Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {[["name","School Name"],["principal","Principal Name"],["phone","Phone Number"],["email","Email Address"],["established","Established Year"]].map(([key,label])=>(
            <div key={key}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">{label}</label>
              <input value={school[key]} onChange={(e)=>setSchool((s)=>({...s,[key]:e.target.value}))}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                style={{ background:"#0F172A", border:"1px solid #334155" }} />
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Address</label>
            <input value={school.address} onChange={(e)=>setSchool((s)=>({...s,address:e.target.value}))}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{ background:"#0F172A", border:"1px solid #334155" }} />
          </div>
        </div>
        <button type="submit" className="px-8 py-3 rounded-xl text-white font-bold text-sm" style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>Save Changes</button>
      </form>

      <div className="p-6 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <h3 className="font-bold text-white text-lg mb-4">Fee Structure</h3>
        <div className="space-y-3">
          {[["Pre-School","৳ 600"],["Class 1-2","৳ 800"],["Class 3-4","৳ 1,000"],["Class 5","৳ 1,200"],["Admission Fee","৳ 500 (one-time)"]].map(([cls,fee])=>(
            <div key={cls} className="flex items-center justify-between p-3 rounded-xl" style={{ background:"#0F172A" }}>
              <span className="text-slate-300 text-sm font-medium">{cls}</span>
              <span className="font-bold text-emerald-400 text-sm">{fee}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl" style={{ background:"#1E293B", border:"1px solid #334155" }}>
        <h3 className="font-bold text-white text-lg mb-4">User Roles</h3>
        <div className="space-y-3">
          {[["Admin","admin@school.edu.bd","admin123","#4F46E5"],["Teacher","rafiq@school.edu.bd","teacher123","#7C3AED"],["Student","sakib@student.edu.bd","student123","#10B981"]].map(([role,email,pw,color])=>(
            <div key={role} className="flex items-center justify-between p-4 rounded-xl" style={{ background:"#0F172A" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background:color }}>{role.charAt(0)}</div>
                <div><p className="text-white text-sm font-semibold">{role}</p><p className="text-slate-400 text-xs">{email}</p></div>
              </div>
              <span className="text-xs font-mono text-slate-500">{pw}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
