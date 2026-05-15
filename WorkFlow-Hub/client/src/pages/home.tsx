import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, DollarSign, Globe, CheckSquare, Target, Users, BarChart, UploadCloud, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 text-white mb-16 shadow-2xl">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/30 z-10"></div>
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-10"></div>
           <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Global Data Operations Center" 
            className="w-full h-full object-cover object-center opacity-70"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-10 py-24 md:py-36 flex flex-col items-start gap-8 max-w-5xl">
          <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-[10px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse inline-block"></span>
            Global Operations Center Active
          </Badge>
          
          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tight text-white max-w-4xl">
            Precision Data <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Operations at Scale
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-medium leading-relaxed">
            Lexington Global specializes in large-scale data processing, manual auditing, and high-fidelity verification for enterprise organizations worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <Link href="/businesses">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-none h-16 px-12 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 rounded-2xl transition-all hover:scale-[1.02]">
                Initiate Project
              </Button>
            </Link>
            <Link href="/auth?tab=register">
              <Button size="lg" variant="ghost" className="border border-slate-700 hover:bg-white/10 text-white hover:text-white font-black uppercase tracking-[0.2em] rounded-2xl backdrop-blur-md transition-all h-16 px-12 text-sm">
                Apply as Specialist
              </Button>
            </Link>
          </div>

          <div className="pt-12 flex items-center gap-12 border-t border-white/10 w-full mt-8">
            <div className="space-y-1">
              <p className="text-2xl font-black text-white tracking-tighter">99.9%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Fidelity</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-white tracking-tighter">24/7</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Uptime</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-white tracking-tighter">40+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regional Hubs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Scale Section */}
      <section className="mb-24 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-8">
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Enterprise Grade</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Infrastructure for Global Data Operations</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Lexington Global provides the structural backbone for organizations requiring high-volume data verification and processing. We eliminate operational bottlenecks through certified human-in-the-loop systems.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="flex gap-5 items-start group">
                <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-xl shadow-blue-500/10 border border-slate-50 group-hover:scale-110 transition-transform"><Target className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">99.9% Fidelity</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Rigorous multi-stage auditing for every data point.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start group">
                <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-xl shadow-blue-500/10 border border-slate-50 group-hover:scale-110 transition-transform"><ShieldCheck className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Bank-Grade Security</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Encrypted data handling with strict ISO compliance.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start group">
                <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-xl shadow-blue-500/10 border border-slate-50 group-hover:scale-110 transition-transform"><Users className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Certified Workforce</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Verified specialists trained in our Academy.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start group">
                <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-xl shadow-blue-500/10 border border-slate-50 group-hover:scale-110 transition-transform"><BarChart className="h-6 w-6" /></div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">Real-time Telemetry</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">Full visibility into processing speed and accuracy.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 blur-3xl -z-10 rounded-[3rem]"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white shadow-2xl premium-shadow">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                alt="Data Analytics Interface" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-widest">Global Dispatch</p>
                    <p className="text-blue-200 text-xs font-medium">Processing 1.2M rows/hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-24 bg-white rounded-[3rem] p-12 md:p-20 border border-slate-200/60 premium-shadow">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-slate-100 text-slate-900 border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">The Protocol</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How We Deliver Precision</h2>
          <p className="text-lg text-slate-500 font-medium">A streamlined deployment cycle for your data assets.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {[
            { step: '01', title: 'Asset Injection', desc: 'Securely upload your raw data assets to our encrypted cloud environment.', icon: UploadCloud },
            { step: '02', title: 'Specialist Audit', desc: 'Certified specialists verify and process data using our proprietary Academy protocols.', icon: ShieldCheck },
            { step: '03', title: 'Quality Settlement', desc: 'Final QA pass ensures 99.9% fidelity before assets are released for delivery.', icon: CheckCircle2 },
          ].map((item, i) => (
            <div key={i} className="relative z-10 space-y-6 group">
              <div className="h-16 w-16 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <item.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="text-blue-200 tabular-nums">{item.step}</span> {item.title}
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent -z-10"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden mb-12 shadow-2xl">
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-black text-[10px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full">Apply for Certification</Badge>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white">Ready to Scale Your Professional Impact?</h2>
          <p className="text-slate-400 mb-10 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
            Lexington Global is currently vetting certified data specialists for new enterprise contracts. Establish your professional profile today.
          </p>
          <Link href="/auth?tab=register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none px-16 h-16 font-black text-sm uppercase tracking-[0.2em] shadow-2xl rounded-2xl transition-all hover:scale-[1.05]">
              Initiate Specialist Profile
            </Button>
          </Link>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </section>
    </Layout>
  );
}
