import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ImpactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tighter text-on-surface font-h2 flex items-center">
            <img
              alt="Aarogya AI Logo"
              className="h-10 w-10 object-contain inline-block mr-2 mb-1"
              src="/logo-icon.png"
            />
            Aarogya AI
          </Link>
          <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/features`}>Features</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/technology`}>Technology</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/impact`}>Impact</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/about`}>About</Link>
            <Link className="text-error font-bold hover:text-error/80 transition-colors duration-200 flex items-center gap-1.5" href={`/${locale}/emergency`}>
              <svg viewBox="0 0 100 100" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="15" fill="currentColor"/><path d="M 35 15 H 65 V 35 H 85 V 65 H 65 V 85 H 35 V 65 H 15 V 35 H 35 Z" fill="white"/></svg> Emergency
            </Link>
          </div>
          <Link 
            className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-xl font-medium transition-all active:scale-95 duration-150"
            href={`/${locale}/chat`}
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-6 hero-gradient min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-semibold mb-8 transition-colors bg-white/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-primary/20 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-10 md:p-16 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            {/* New UI top section */}
            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-semibold text-sm mb-6 border border-orange-100">
                <span className="material-symbols-outlined text-sm">favorite</span>
                Real Numbers. Real Lives.
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#111827] mb-4 font-h1 tracking-tight">
                Transforming <br />
                <span className="text-orange-600">Rural Healthcare</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium mt-6">
                Real numbers. Real lives. Real change across India's most underserved districts.
              </p>
            </div>

            <div className="space-y-6 text-on-surface-variant text-lg font-body-lg relative z-10">
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white/50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-center">
                  <div className="text-5xl font-extrabold text-primary mb-4">200k+</div>
                  <strong className="text-on-surface block text-lg mb-2 font-h2">Lives Impacted</strong>
                  <p className="text-sm">through early detection and preliminary diagnosis in remote regions.</p>
                </div>

                <div className="bg-white/50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-center">
                  <div className="text-5xl font-extrabold text-primary mb-4">15:1</div>
                  <strong className="text-on-surface block text-lg mb-2 font-h2">Return on Investment</strong>
                  <p className="text-sm">for rural health systems by reducing unnecessary clinical visits and prioritizing severe cases.</p>
                </div>

                <div className="bg-white/50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-center">
                  <div className="text-5xl font-extrabold text-primary mb-4">10k+</div>
                  <strong className="text-on-surface block text-lg mb-2 font-h2">ASHA Workers</strong>
                  <p className="text-sm">empowered with real-time data insights to better manage their village populations.</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: PROBLEM - Migrated from home page */}
            <div className="mt-24 relative z-10 bg-[#0F172A] rounded-[3rem] p-12 md:p-16 text-white overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
              <div className="text-center space-y-12 relative z-10">
                <div className="space-y-4">
                  <h2 className="font-h2 text-4xl md:text-5xl text-slate-100">600 million Indians have no doctor nearby</h2>
                  <p className="text-slate-400 font-body-lg max-w-2xl mx-auto">Rural India faces a critical shortage of medical professionals. The first mile of healthcare is broken by distance and language.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-error/50 transition-all group">
                    <div className="text-error text-5xl font-h1 mb-2 group-hover:scale-110 transition-transform">600M+</div>
                    <p className="font-label-caps text-slate-400">Rural Indians</p>
                  </div>
                  <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all group">
                    <div className="text-primary text-5xl font-h1 mb-2 group-hover:scale-110 transition-transform">22</div>
                    <p className="font-label-caps text-slate-400">Official Languages</p>
                  </div>
                  <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-secondary/50 transition-all group">
                    <div className="text-secondary text-5xl font-h1 mb-2 group-hover:scale-110 transition-transform">₹2,100 Cr</div>
                    <p className="font-label-caps text-slate-400">Economic Value Lost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7: TEAM / TESTIMONIALS - Migrated from home page */}
            <div className="mt-24 relative z-10">
              <div className="text-center mb-16">
                <h2 className="font-h2 text-4xl text-on-surface mb-4">Voices from the Ground</h2>
                <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/50 p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                  <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <div className="flex-1">
                    <p className="font-indian-script text-lg text-on-surface leading-relaxed mb-4 italic">"अब मुझे डॉक्टर के पास जाने के लिए शहर नहीं जाना पड़ता। आरोग्य एआई ने मेरी मदद की।"</p>
                    <p className="text-sm text-on-surface-variant mb-8 italic">"Now I don't have to go to the city to see a doctor. Aarogya AI helped me."</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl">R</div>
                    <div>
                      <p className="font-bold text-on-surface">Ramesh Kumar</p>
                      <p className="text-xs text-on-surface-variant">Vidisha, Madhya Pradesh</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/50 p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                  <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <div className="flex-1">
                    <p className="font-body-md text-on-surface leading-relaxed mb-8 italic">"As an ASHA worker, this tool helps me track my village's health data instantly. It's like having a specialist in my pocket."</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">S</div>
                    <div>
                      <p className="font-bold text-on-surface">Sunita Devi</p>
                      <p className="text-xs text-on-surface-variant">Ranchi, Jharkhand</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/50 p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                  <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <div className="flex-1">
                    <p className="font-body-md text-on-surface leading-relaxed mb-8 italic">"The AI triage is remarkably accurate. It allows us to focus our resources on the most critical cases first, saving precious time."</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">A</div>
                    <div>
                      <p className="font-bold text-on-surface">Dr. Arjun Rao</p>
                      <p className="text-xs text-on-surface-variant">Apollo Hospitals, Hyderabad</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
