import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <section className="section-padding" style={{ background: "#fff" }}>
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #4C1D95 100%)",
          }}
        >
          {/* Orbs */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
          />

          <div className="relative z-10">
            <span
              className="inline-block text-sm font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-6 text-white"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              🎓 Admissions Open — 2025-26 Session
            </span>

            <h2
              className="text-4xl sm:text-5xl font-black text-white mb-5"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Give Your Child the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Best Start
              </span>
            </h2>

            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Join our growing family of 1,200+ students. Register now for the 2025-26 academic session 
              and secure your child's spot at our award-winning school.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admission"
                className="inline-flex items-center justify-center gap-2 font-bold text-white px-8 py-4 rounded-xl hover:opacity-90 hover:shadow-2xl transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
              >
                Apply Now — Free Registration
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-semibold text-white px-8 py-4 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                📞 Call: +880 1700-000000
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-slate-400 text-sm">
              {["✅ NCTB Certified", "🏆 Award Winning", "🔒 Safe Environment", "📱 Online Portals"].map((b) => (
                <span key={b} className="flex items-center gap-1 text-white/70 text-xs font-medium">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
