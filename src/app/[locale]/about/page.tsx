import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
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
        <div className="max-w-6xl mx-auto space-y-12">
          
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-semibold mb-2 transition-colors bg-white/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-primary/20 shadow-sm hover:shadow-md w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-lg border border-white/60 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-8 font-h1 tracking-tight relative z-10 text-center">About Us</h1>
            
            <div className="space-y-6 text-on-surface-variant text-lg font-body-lg relative z-10 max-w-4xl mx-auto text-center mb-20">
              <p className="text-xl text-on-surface font-medium leading-relaxed">
                We are Team Aarogya AI, a passionate group of engineers and healthcare advocates building technology for the next billion users.
              </p>
              <p className="mt-8 leading-relaxed">
                Our mission is to eliminate the linguistic and digital barriers to primary healthcare. For over 70% of India's rural population, accessing a doctor means traveling long distances, losing a day's wage, and struggling to communicate in a non-native language.
              </p>
            </div>

            {/* Quote Block */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-12 rounded-[2rem] shadow-xl relative z-10 max-w-4xl mx-auto mb-20">
              <span className="material-symbols-outlined text-5xl mb-6 opacity-40" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="text-2xl font-body-lg italic leading-relaxed mb-8 font-medium">
                "Our goal isn't just to build a chatbot. It's to build a lifeline. By using voice and local dialects, we're removing the last barrier between technology and the people who need it most."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-tertiary overflow-hidden border-2 border-white/20">
                  <img alt="Team" className="w-full h-full object-cover" src="/team/likith.jpg"/>
                </div>
                <div>
                  <p className="font-bold text-lg">Team Aarogya AI</p>
                </div>
              </div>
            </div>

            {/* Built by Visionaries */}
            <div className="text-center space-y-16 relative z-10 mb-24 mt-24">
              <div className="space-y-4">
                <h2 className="font-h2 text-4xl text-on-surface">Built by Visionaries</h2>
                <p className="text-on-surface-variant font-body-lg">Engineering for the next billion users.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                    <img alt="Sameer" className="w-full h-full object-cover" src="/team/sameer.jpg"/>
                  </div>
                  <p className="font-bold text-lg text-on-surface">Sameer</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                    <img alt="Nanditha" className="w-full h-full object-cover" src="/team/nandiths.jpg"/>
                  </div>
                  <p className="font-bold text-lg text-on-surface">Nanditha</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                    <img alt="Bhavana" className="w-full h-full object-cover" src="/team/bhavana.jpg"/>
                  </div>
                  <p className="font-bold text-lg text-on-surface">Bhavana</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                    <img alt="Likith Kumar" className="w-full h-full object-cover" src="/team/likith.jpg"/>
                  </div>
                  <p className="font-bold text-lg text-on-surface">Likith Kumar</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-center z-10 max-w-5xl mx-auto shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <h2 className="font-h1 text-5xl">Ready to save lives?</h2>
                <p className="text-slate-400 font-body-lg">Join us in making healthcare a fundamental human right, accessible to anyone, anywhere, in any language.</p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Link 
                    href={`/${locale}/chat`}
                    className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
                  >
                    Launch Demo
                  </Link>
                  <button className="bg-white/10 hover:bg-white/20 px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all border border-white/10 active:scale-95">
                    Contact Partners
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 w-full py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-bold text-on-surface flex items-center">
            <img
              alt="Aarogya AI Logo"
              className="h-8 w-8 object-contain inline-block mr-2 mb-1"
              src="/logo-icon.png"
            />
            Aarogya AI
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-['Plus_Jakarta_Sans'] text-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors" href="#">Contact Support</Link>
          </div>
          <div className="text-on-surface-variant text-sm">© 2026 Aarogya AI. Made with ❤️ in India</div>
        </div>
      </footer>
    </div>
  );
}
