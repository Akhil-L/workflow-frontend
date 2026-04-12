import { Layout } from "@/components/layout";
import { useStore, Task, TRAINING_MODULES, User } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { DollarSign, Clock, CheckCircle2, TrendingUp, ArrowRight, FileText, ShieldAlert, GraduationCap, AlertTriangle, Star, Award, BarChart3, Zap, ShieldCheck, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Mon', earnings: 12 },
  { name: 'Tue', earnings: 18 },
  { name: 'Wed', earnings: 15 },
  { name: 'Thu', earnings: 25 },
  { name: 'Fri', earnings: 32 },
  { name: 'Sat', earnings: 28 },
  { name: 'Sun', earnings: 40 },
];

export function getWorkerRank(user: User) {
  const accuracy = user.accuracyScore || 0;
  const completed = user.approvedSubmissions || 0;
  
  if (completed > 50 && accuracy >= 98) return { label: "Top Performer", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (completed > 10 && accuracy >= 90) return { label: "Verified", color: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Beginner", color: "bg-slate-100 text-slate-700 border-slate-200" };
}

export default function WorkerDashboard() {
  const { currentUser, tasks, assignTask } = useStore();
  const [, setLocation] = useLocation();
  
  if (!currentUser) return <div className="p-8 text-center">Please log in</div>;

  if (currentUser.role !== 'worker') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Wrong Dashboard</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You are logged in as an administrator. Please use the admin portal to manage the platform.</p>
          <Button onClick={() => setLocation("/admin")} className="font-semibold">
            Go to Admin Portal
          </Button>
        </div>
      </Layout>
    );
  }

  const isFullyTrained = currentUser.completedModules.length === TRAINING_MODULES.length;
  const trainingProgress = Math.round((currentUser.completedModules.length / TRAINING_MODULES.length) * 100);
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status !== "approved" && t.status !== "rejected");
  const availableTasks = tasks.filter(t => t.status === "open" && t.sourceDataUrl); // Rule: Only show tasks with source data
  const completedTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status === "approved");
  const rejectedTasksCount = currentUser.rejectedSubmissions || 0;
  const approvedTasksCount = completedTasks.length;
  const totalSubmissions = approvedTasksCount + rejectedTasksCount;
  
  // Calculate dynamic accuracy score
  const accuracyScore = totalSubmissions > 0 
    ? Math.round((approvedTasksCount / totalSubmissions) * 100) 
    : 0;
    
  // Dynamic rank based on real stats
  const dynamicRankUser = { 
    ...currentUser, 
    accuracyScore, 
    approvedSubmissions: approvedTasksCount 
  };
  const rank = getWorkerRank(dynamicRankUser);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {!isFullyTrained && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900">Training in Progress ({trainingProgress}%)</h3>
              <p className="text-amber-700 text-sm">You must complete all training modules before you can accept and submit data entry tasks.</p>
            </div>
            <Link href="/training">
              <Button className="bg-amber-600 hover:bg-amber-500 font-bold gap-2">
                <GraduationCap className="h-4 w-4" /> Continue Training
              </Button>
            </Link>
          </div>
        )}

        {/* Welcome & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard</h1>
              <Badge variant="outline" className={`font-bold px-3 py-1 ${rank.color}`}>
                <Star className="h-3 w-3 mr-1.5 fill-current" /> {rank.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome back, {currentUser.name}. Here's your activity overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Balance:</span>
            <div className="text-2xl font-bold font-mono text-primary">${currentUser.balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full rounded-[2rem]">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50 shrink-0">
                <DollarSign className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">Total Balance</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-3xl font-black text-slate-900 truncate">${currentUser.balance.toFixed(2)}</h3>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full rounded-[2rem]">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 shrink-0">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">Tasks Completed</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-3xl font-black text-slate-900 truncate">{completedTasks.length}</h3>
                  <span className="text-[10px] font-bold text-slate-400 italic shrink-0">Total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full rounded-[2rem]">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <div className="p-4 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100/50 shrink-0">
                <Award className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">Quality Rating</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-3xl font-black text-slate-900 truncate">{accuracyScore}%</h3>
                  <div className="flex gap-0.5 shrink-0">
                    {[1,2,3,4,5].map(i => {
                      const isActive = i <= Math.round(accuracyScore / 20);
                      return <Star key={i} className={`h-3 w-3 ${isActive ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />;
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            <Card className="border-slate-200/60 premium-shadow rounded-2xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 px-8 pt-8">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Revenue Stream</CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Daily earnings performance over the last week</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-500 font-bold px-3 py-1">Weekly View</Badge>
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-10">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                        dy={15} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                          padding: '12px 16px' 
                        }}
                        itemStyle={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}
                        labelStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Tabs */}
            <Tabs defaultValue="available" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Work Hub</h2>
                  <p className="text-sm font-medium text-slate-500">Discover and manage your data entry assignments</p>
                </div>
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 h-auto">
                  <TabsTrigger value="available" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all">
                    Marketplace ({availableTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="my-tasks" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all">
                    Active Stack ({myTasks.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="available" className="space-y-6 focus-visible:outline-none">
                {availableTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl gap-4">
                    <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                      <Zap className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-slate-900">Marketplace empty</p>
                      <p className="text-sm text-slate-500">New high-priority tasks will appear here shortly.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {availableTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        actionLabel="Reserve Task"
                        onAction={() => isFullyTrained ? assignTask(task.id, currentUser.id) : setLocation("/training")}
                        variant="default"
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-tasks" className="space-y-6 focus-visible:outline-none">
                {myTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl gap-4">
                    <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                      <FileText className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-slate-900">Your stack is clear</p>
                      <p className="text-sm text-slate-500">Browse the marketplace to start earning now.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {myTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        actionLabel={task.status === "submitted" ? "Processing..." : "Complete Task"}
                        linkTo={`/task/${task.id}`}
                        variant="outline"
                        disabled={task.status === "submitted"}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Activity Feed */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 premium-shadow rounded-2xl overflow-hidden bg-white h-full">
              <CardHeader className="pb-2 pt-8 px-8">
                <CardTitle className="text-xl font-black text-slate-900">Activity Hub</CardTitle>
                <CardDescription className="font-medium text-slate-500">Live platform synchronization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 px-8 pb-8">
                {[
                  { title: 'Earnings Released', desc: 'Secure payout of $125.50 verified', time: '2h ago', icon: DollarSign, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { title: 'Task Approved', desc: 'Inventory Audit #882 accepted', time: '5h ago', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { title: 'Rank Escalation', desc: 'Promoted to "Top Performer" status', time: '1d ago', icon: Star, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                  { title: 'Security Audit', desc: 'Monthly privacy training recertified', time: '2d ago', icon: ShieldCheck, color: 'text-slate-600 bg-slate-50 border-slate-100' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group cursor-default">
                    <div className={`mt-1 h-10 w-10 rounded-xl border ${item.color} flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-0 border-t border-slate-50 bg-slate-50/50">
                <Button variant="ghost" className="w-full h-14 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-white transition-all rounded-none">
                  View full audit log <ArrowUpRight className="ml-2 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative rounded-3xl premium-shadow">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform hover:scale-110">
                <ShieldAlert className="h-24 w-24" />
              </div>
              <CardHeader className="pb-4 relative z-10 px-8 pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <CardTitle className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Compliance Advisory</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-8 pb-4">
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  Maintain an integrity score above <span className="text-white font-black underline decoration-blue-500 decoration-2 underline-offset-4">95.0%</span> to remain eligible for Tier-1 Enterprise Vault assignments.
                </p>
              </CardContent>
              <CardFooter className="relative z-10 px-8 pb-8">
                <Button variant="link" className="text-blue-400 p-0 h-auto font-black text-xs hover:text-blue-300 transition-colors group">
                  Audit Guidelines <ArrowUpRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function TaskCard({ task, actionLabel, onAction, linkTo, variant, disabled }: { task: Task, actionLabel: string, onAction?: () => void, linkTo?: string, variant?: "default" | "outline", disabled?: boolean }) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className="hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-slate-200/60 bg-white group rounded-3xl premium-shadow hover:translate-y-[-4px]">
      {children}
    </Card>
  );

  return (
    <CardWrapper>
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 w-fit font-black text-[10px] uppercase tracking-widest px-3 py-1">
              Data Audit
            </Badge>
            {task.priority === 'high' && (
              <Badge className="bg-red-50 text-red-700 border-red-100 w-fit text-[9px] font-black uppercase tracking-tighter h-6 px-2">
                <Zap className="h-3 w-3 mr-1 fill-red-600" /> Critical SLA
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-sm border border-emerald-100/50">
              ${task.payPerRow.toFixed(2)}<span className="text-[10px] opacity-60 ml-0.5">/row</span>
            </span>
          </div>
        </div>
        <CardTitle className="text-xl font-black text-slate-900 leading-tight mt-4 group-hover:text-blue-600 transition-colors">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-6 px-8">
        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 leading-relaxed">
          {task.description}
        </p>
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-500"><Clock className="h-3.5 w-3.5" /></div>
            <span>{task.slaHours || 24}h Window</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500"><ShieldCheck className="h-3.5 w-3.5" /></div>
            <span>{task.revisionPolicy || "Strict"} Audit</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400"><FileText className="h-3.5 w-3.5" /></div>
            <span>{task.dataFields.length} Channels</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-400"><TrendingUp className="h-3.5 w-3.5" /></div>
            <span>{task.maxRows} Payload</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-8 px-8">
        {linkTo && !disabled ? (
          <Link href={linkTo} className="w-full">
            <Button className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 transition-all hover:shadow-blue-500/20 active:scale-[0.98]" variant={variant || "default"}>
              {actionLabel} <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]" 
            variant={variant || "default"} 
            onClick={onAction}
            disabled={disabled}
          >
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </CardWrapper>
  );
}
