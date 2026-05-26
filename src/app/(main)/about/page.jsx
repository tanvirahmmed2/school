import Link from "next/link";

export const metadata = { title: "About Us | Govt. Primary School", description: "Learn about our school history, mission, vision, and achievements." };

const achievements = [
  { icon: "🏆", value: "12+", label: "National Awards" },
  { icon: "🎓", value: "98%", label: "Pass Rate" },
  { icon: "👨‍🏫", value: "60+", label: "Qualified Staff" },
  { icon: "📅", value: "40+", label: "Years of Service" },
];

const facilities = [
  { icon: "🖥️", name: "Digital Classrooms" },
  { icon: "🔬", name: "Science Laboratory" },
  { icon: "📚", name: "Library" },
  { icon: "🏃", name: "Sports Ground" },
  { icon: "🎨", name: "Arts & Crafts Room" },
  { icon: "💊", name: "First Aid Room" },
  { icon: "🚌", name: "Transport" },
  { icon: "🌿", name: "Green Campus" },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative py-24 flex items-center justify-center text-white text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0F172A,#1E1B4B,#312E81)" }}>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle,#7C3AED,transparent)" }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
            About Our School
          </span>
          <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "Poppins" }}>Our Story &amp; Mission</h1>
          <p className="text-indigo-300 text-lg max-w-xl mx-auto">40+ years of nurturing young minds with quality education, modern facilities, and unwavering dedication.</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full"><svg viewBox="0 0 1440 60" fill="#F8FAFC"><path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"/></svg></div>
      </div>

      {/* History */}
      <section className="section-padding" style={{ background: "#F8FAFC" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#EEF2FF", color: "#4F46E5" }}>Our History</span>
            <h2 className="text-4xl font-black text-slate-800 mb-5" style={{ fontFamily: "Poppins" }}>Established in <span className="gradient-text">1985</span></h2>
            <p className="text-slate-600 leading-relaxed mb-4">Govt. Primary School was established in 1985 with a vision to provide quality primary education to every child in the community, regardless of socioeconomic background.</p>
            <p className="text-slate-600 leading-relaxed mb-4">Over four decades, we have grown from a small institution with 5 teachers and 120 students to a premier school with 60+ qualified staff and 1,200+ students.</p>
            <p className="text-slate-600 leading-relaxed">We follow the National Curriculum and Textbook Board (NCTB) curriculum and have consistently ranked among the top primary schools in the district.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((a) => (
              <div key={a.label} className="card-hover p-6 rounded-2xl text-center" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
                <span className="text-4xl block mb-2">{a.icon}</span>
                <p className="text-3xl font-black text-indigo-600 mb-1" style={{ fontFamily: "Poppins" }}>{a.value}</p>
                <p className="text-slate-500 text-sm">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding" style={{ background: "#fff" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: "🎯", title: "Our Mission", color: "#4F46E5", bg: "#EEF2FF", text: "To provide inclusive, high-quality primary education that empowers every student to reach their full potential through innovative teaching, a nurturing environment, and strong community partnerships." },
            { icon: "🌟", title: "Our Vision", color: "#7C3AED", bg: "#F5F3FF", text: "To be the leading primary institution in Bangladesh, recognized for academic excellence, character development, and producing well-rounded graduates who contribute positively to society." },
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-2xl" style={{ background: item.bg }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5" style={{ background: "#fff" }}>{item.icon}</div>
              <h3 className="font-black text-2xl text-slate-800 mb-4" style={{ fontFamily: "Poppins" }}>{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principal Message */}
      <section className="section-padding" style={{ background: "#F8FAFC" }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-10 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0F172A,#1E1B4B)" }}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle,#F59E0B,transparent)" }} />
            <div className="relative flex flex-col md:flex-row gap-8 items-start">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>👨‍💼</div>
              <div>
                <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">Message from the Principal</p>
                <blockquote className="text-white text-lg leading-relaxed mb-4 italic">
                  "Education is not just about textbooks — it's about building character, curiosity, and compassion. At Govt. Primary School, we are committed to creating an environment where every child feels valued, inspired, and equipped to face the future with confidence."
                </blockquote>
                <p className="text-white font-bold">Md. Rafiqul Islam</p>
                <p className="text-indigo-300 text-sm">Head Teacher &amp; Principal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding" style={{ background: "#fff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#EEF2FF", color: "#4F46E5" }}>Campus Facilities</span>
            <h2 className="text-4xl font-black text-slate-800" style={{ fontFamily: "Poppins" }}>World-Class <span className="gradient-text">Infrastructure</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {facilities.map((f) => (
              <div key={f.name} className="card-hover flex flex-col items-center p-6 rounded-2xl text-center" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <span className="text-3xl mb-3">{f.icon}</span>
                <p className="font-semibold text-slate-700 text-sm">{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: "#F8FAFC" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4" style={{ fontFamily: "Poppins" }}>Ready to Join Our Community?</h2>
          <p className="text-slate-500 mb-8">Apply for admission today and give your child the best start in life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admission" className="inline-flex items-center justify-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl text-white" style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)" }}>Apply for Admission →</Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl text-indigo-600" style={{ background: "#EEF2FF" }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
