import { Layout } from "@/components/layout";
import { useStore } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  ShieldCheck, 
  Award, 
  Target, 
  DollarSign, 
  CheckCircle2, 
  Briefcase,
  TrendingUp,
  Mail,
  Calendar
} from "lucide-react";

export default function WorkerProfile() {
  const { currentUser, payouts, submissions } = useStore();

  if (!currentUser || currentUser.role !== 'worker') {
    return <Layout><div className="py-20 text-center font-black uppercase tracking-widest text-slate-400">Access Restricted</div></Layout>;
  }

  const workerPayouts = payouts.filter(p => p.workerId === currentUser.id);
  const totalEarned = workerPayouts.reduce((sum, p) => sum + p.amount, 0);
  const totalTasks = submissions.filter(s => s.workerId === currentUser.id && s.status === 'approved').length;
  const isCertified = currentUser.completedModules.length === 4;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Header Profile Section */}
        <div className="relative">
          <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
          <div className="px-10 -mt-16 flex flex-col md:flex-row items-end gap-8 relative z-10">
            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-2xl">
              <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-400">
                {currentUser.name[0]}
              </div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{currentUser.name}</h1>
                {isCertified && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Certified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Data Specialist</span>
                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> {currentUser.email}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" /> Joined Feb 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[2rem] premium-shadow border-slate-200/60 overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy Rating</p>
                    <p className="text-2xl font-black text-slate-900">{currentUser.accuracyScore}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Units</p>
                    <p className="text-2xl font-black text-slate-900">{currentUser.approvedSubmissions || 45}</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Yield</p>
                    <p className="text-2xl font-black text-slate-900">${totalEarned.toFixed(2)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] bg-slate-900 text-white border-none premium-shadow overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award className="h-32 w-32" />
              </div>
              <CardHeader className="p-8 relative z-10">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">Academy Status</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-tight">{isCertified ? "Senior Auditor" : "In Training"}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tier 1 Specialist</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Course Progress</span>
                    <span>{currentUser.completedModules.length}/4 Modules</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(currentUser.completedModules.length/4)*100}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] premium-shadow border-slate-200/60 bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Active Certifications</CardTitle>
                  <p className="text-sm font-medium text-slate-500 mt-1">Verified skills and platform authorizations.</p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: "Enterprise Auditing", level: "Expert", status: isCertified, icon: ShieldCheck },
                    { title: "Compliance Protocol", level: "Advanced", status: isCertified, icon: ShieldCheck },
                    { title: "Bulk Data Handling", level: "Standard", status: true, icon: CheckCircle2 },
                    { title: "Ethical Sourcing", level: "Expert", status: true, icon: CheckCircle2 },
                  ].map((cert, i) => (
                    <div key={i} className={`p-6 rounded-[1.5rem] border ${cert.status ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 opacity-50'} flex items-center gap-4`}>
                      <div className={`p-3 rounded-xl ${cert.status ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                        <cert.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{cert.title}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cert.level} • {cert.status ? 'Verified' : 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-[2rem] premium-shadow border-slate-200/60 bg-white overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">System Access Logs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-20 text-center space-y-4">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                    <User className="h-8 w-8 opacity-20" />
                  </div>
                  <p className="text-slate-400 font-medium italic">Detailed activity telemetry will appear as tasks are processed.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
