import React from "react";

const features = [
  {
    icon: "📚",
    title: "NCTB Curriculum",
    description: "Fully aligned national curriculum with modern teaching methodologies and regular updates.",
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
  {
    icon: "🖥️",
    title: "Digital Classrooms",
    description: "Smart boards, computers, and multimedia projectors in every classroom for interactive learning.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: "🧪",
    title: "Science Laboratory",
    description: "Well-equipped science lab encouraging hands-on experiments and critical thinking.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: "🏃",
    title: "Sports & Activities",
    description: "Spacious playground, annual sports day, and co-curricular programs for holistic development.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: "📱",
    title: "Online Portals",
    description: "Student and teacher portals for results, attendance, notices, and fee management.",
    color: "#F43F5E",
    bg: "#FFF1F2",
  },
  {
    icon: "📢",
    title: "SMS Notifications",
    description: "Real-time SMS alerts for parents on attendance, results, fees and school announcements.",
    color: "#0EA5E9",
    bg: "#F0F9FF",
  },
];

const FeaturesSection = () => {
  return (
    <section className="section-padding" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            Why Choose Us
          </span>
          <h2
            className="text-4xl font-black text-slate-800 mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            World-Class Facilities &{" "}
            <span className="gradient-text">Features</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            We provide an environment where every student can thrive academically, socially, and physically.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-hover p-7 rounded-2xl group cursor-default"
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform group-hover:scale-110 duration-300"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
              <div
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-all duration-200 group-hover:gap-2"
                style={{ color: f.color }}
              >
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
