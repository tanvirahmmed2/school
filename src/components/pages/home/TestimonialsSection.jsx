import React from "react";

const testimonials = [
  {
    name: "Rahim Uddin",
    role: "Parent of Class 4 Student",
    emoji: "👨",
    text: "The school has transformed my child's learning experience. The teachers are incredibly dedicated and the facilities are excellent. My son now loves going to school every day!",
    rating: 5,
    color: "#4F46E5",
  },
  {
    name: "Jahanara Begum",
    role: "Parent of Class 2 Student",
    emoji: "👩",
    text: "Excellent teachers and a very safe, clean environment. The SMS notification system keeps me informed about my daughter's attendance and activities at all times.",
    rating: 5,
    color: "#7C3AED",
  },
  {
    name: "Selim Khan",
    role: "Former Student (2020 Batch)",
    emoji: "🧑",
    text: "This school gave me the foundation I needed. The education quality is superb and the teachers genuinely care about each student's future. I'm proud to be an alumnus.",
    rating: 5,
    color: "#F59E0B",
  },
  {
    name: "Shapna Akter",
    role: "Parent of Class 1 Student",
    emoji: "👩‍👧",
    text: "My daughter started here this year and has already made so much progress. The pre-school and Class 1 teachers are wonderful — patient, caring, and very professional.",
    rating: 5,
    color: "#10B981",
  },
  {
    name: "Kamal Hossain",
    role: "Parent of Class 5 Student",
    emoji: "👨‍👦",
    text: "Best school in the area without question. The online portal makes checking results and attendance so easy. My son is preparing for PSC with great confidence.",
    rating: 5,
    color: "#F43F5E",
  },
  {
    name: "Minu Khatun",
    role: "Community Member",
    emoji: "👩‍🦳",
    text: "This school has been a pillar of our community for 40 years. The quality of education and the character they build in students is truly commendable.",
    rating: 5,
    color: "#0EA5E9",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#EEF2FF", color: "#4F46E5" }}
          >
            Testimonials
          </span>
          <h2
            className="text-4xl font-black text-slate-800 mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            What{" "}
            <span className="gradient-text">Parents & Alumni</span>
            <br />
            Say About Us
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Hear from those who have experienced the transformative impact of our school community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="card-hover p-7 rounded-2xl flex flex-col gap-5"
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-base" style={{ color: "#F59E0B" }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                <span className="text-2xl font-serif text-indigo-200 leading-none mr-1">"</span>
                {t.text}
                <span className="text-2xl font-serif text-indigo-200 leading-none ml-1">"</span>
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${t.color}15` }}
                >
                  {t.emoji}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <div
                  className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: t.color }}
                >
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
