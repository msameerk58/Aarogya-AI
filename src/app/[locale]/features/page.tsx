import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function FeaturesPage(props: { params: Promise<{ locale: string }> }) {
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
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-8 font-h1 tracking-tight relative z-10">Features</h1>
            <div className="space-y-6 text-on-surface-variant text-lg font-body-lg relative z-10">
              <p className="text-xl text-on-surface font-medium leading-relaxed">
                Discover the cutting-edge features of Aarogya AI, designed to bridge the healthcare gap in rural India.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <strong className="text-on-surface block text-xl mb-2 font-h2">Multilingual Voice</strong>
                  <p className="text-base">Native voice interface supporting 6 Indian languages natively without translation loss.</p>
                </div>

                <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <strong className="text-on-surface block text-xl mb-2 font-h2">Smart AI Triage</strong>
                  <p className="text-base">Instant symptom analysis cross-referenced with local ICMR medical datasets.</p>
                </div>

                <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <strong className="text-on-surface block text-xl mb-2 font-h2">Offline Capability</strong>
                  <p className="text-base">Accessible via IVRS and feature-phones for regions without reliable internet.</p>
                </div>

                <div className="bg-white/50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <strong className="text-on-surface block text-xl mb-2 font-h2">Direct Integration</strong>
                  <p className="text-base">Seamless synchronization with ASHA worker and PHC dashboards for quick response.</p>
                </div>
              </div>
            </div>
            
            {/* SECTION 3: SOLUTION - Migrated from home page */}
            <div className="mt-24 mb-16 text-center">
              <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-6 text-on-surface">How Aarogya AI works</h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="p-10 rounded-3xl bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-on-surface">Speak Your Language</h3>
                <p className="text-on-surface-variant font-body-md text-lg mb-8">No literacy required. Users just speak their symptoms into their phone like they're talking to a family member.</p>
                <div className="w-full h-12 bg-primary/5 rounded-lg flex items-center justify-center gap-1">
                  <div className="w-1.5 h-6 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-10 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-12 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
              <div className="p-10 rounded-3xl bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-secondary text-5xl">vital_signs</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-on-surface">Smart AI Triage</h3>
                <p className="text-on-surface-variant font-body-md text-lg mb-8">Advanced LLMs assess risk levels instantly, categorizing urgency from 'home care' to 'emergency visit'.</p>
                <div className="w-full h-4 bg-slate-100 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-primary to-tertiary rounded-full"></div>
                </div>
                <p className="text-xs font-label-caps font-bold text-on-surface-variant mt-3">MEDIUM RISK DETECTED</p>
              </div>
              <div className="p-10 rounded-3xl bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-tertiary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-on-surface">Connect to Care</h3>
                <p className="text-on-surface-variant font-body-md text-lg mb-8">The AI automatically finds the nearest clinic and alerts local ASHA health workers for follow-up.</p>
                <div className="w-full flex items-center justify-center">
                  <div className="relative w-12 h-12 bg-tertiary/20 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-tertiary/10 rounded-full animate-ping"></div>
                    <span className="material-symbols-outlined text-tertiary text-2xl">person_pin_circle</span>
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
