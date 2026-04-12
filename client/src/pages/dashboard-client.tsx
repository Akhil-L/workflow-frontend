import { Layout } from "@/components/layout";
import { useStore, Task } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Briefcase,
  PieChart as PieIcon,
  Search,
  Users
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function ClientDashboard() {
  const { currentUser, tasks, clientSubmitTask } = useStore();
  const { toast } = useToast();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    payPerRow: "0.10", 
    dataFields: "", 
    maxRows: "100",
    slaHours: "48",
    priority: "medium"
  });

  if (!currentUser || currentUser.role !== "client") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-slate-500">Only clients can access this portal.</p>
        </div>
      </Layout>
    );
  }

  const myTasks = tasks.filter(t => t.clientId === currentUser.id);
  const totalRowsRequested = myTasks.reduce((sum, t) => sum + (t.maxRows || 0), 0);
  const pendingProjects = myTasks.filter(t => t.status === 'pending_review').length;
  
  const PIE_DATA = [
    { name: 'Completed', value: myTasks.filter(t => t.status === 'approved').length || 1, color: '#10b981' },
    { name: 'In Progress', value: myTasks.filter(t => t.status === 'open' || t.status === 'assigned' || t.status === 'submitted').length || 0, color: '#3b82f6' },
    { name: 'Pending', value: pendingProjects || 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const handleCreateTask = () => {
    clientSubmitTask({
      title: newTask.title,
      description: newTask.description,
      payPerRow: parseFloat(newTask.payPerRow),
      maxRows: parseInt(newTask.maxRows),
      dataFields: newTask.dataFields.split(",").map(s => s.trim()),
      sourceDataUrl: "/data/client_source_data.csv",
      slaHours: parseInt(newTask.slaHours),
      priority: newTask.priority as any,
      revisionPolicy: "Standard"
    });
    setIsNewTaskOpen(false);
    toast({ title: "Task Submitted", description: "Your project is queued for review with the requested SLA." });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Client Portal</h1>
            <p className="text-slate-500">Manage your data entry projects and track progress.</p>
          </div>
          
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-200 h-12 px-6">
                <Plus className="h-5 w-5" /> Submit New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Submit Project for Review</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Project Title</Label><Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g., Customer List Cleanup" /></div>
                <div className="grid gap-2"><Label>Requirements</Label><Textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Describe what needs to be done..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Budget per Row ($)</Label><Input type="number" step="0.01" value={newTask.payPerRow} onChange={e => setNewTask({...newTask, payPerRow: e.target.value})} /></div>
                  <div className="grid gap-2"><Label>Estimated Rows</Label><Input type="number" value={newTask.maxRows} onChange={e => setNewTask({...newTask, maxRows: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Desired Turnaround (Hours)</Label>
                    <Input type="number" value={newTask.slaHours} onChange={e => setNewTask({...newTask, slaHours: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Priority Level</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newTask.priority}
                      onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Standard</option>
                      <option value="medium">Expedited</option>
                      <option value="high">Urgent (Priority SLA)</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2"><Label>Required Columns (comma separated)</Label><Input placeholder="Name, Email, Status" value={newTask.dataFields} onChange={e => setNewTask({...newTask, dataFields: e.target.value})} /></div>
                <div className="grid gap-2">
                  <Label>Source File</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-slate-500">
                    <Briefcase className="h-6 w-6 mx-auto mb-2 opacity-30" />
                    Click to upload source data
                  </div>
                </div>
              </div>
              <DialogFooter><Button onClick={handleCreateTask} className="w-full h-12 font-bold">Submit for Admin Review</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Client Stats & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl border border-slate-200/60 bg-white group rounded-2xl">
            <CardContent className="p-8">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50 w-fit mb-6 transition-transform group-hover:rotate-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Active Projects</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{myTasks.length}</h3>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl border border-slate-200/60 bg-white group rounded-2xl">
            <CardContent className="p-8">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 w-fit mb-6 transition-transform group-hover:rotate-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Processed Volume</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalRowsRequested.toLocaleString()}</h3>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl border border-slate-200/60 bg-white group rounded-2xl">
            <CardContent className="p-8">
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100/50 w-fit mb-6 transition-transform group-hover:rotate-3">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Pending Review</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{pendingProjects}</h3>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl border border-slate-200/60 bg-white group rounded-2xl">
            <CardContent className="p-8">
              <div className="p-4 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100/50 w-fit mb-6 transition-transform group-hover:rotate-3">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Active Specialists</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">12</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">Campaign Manager</h2>
                <p className="text-sm font-medium text-slate-500">Monitor real-time progress of your data projects</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input className="pl-10 h-10 w-64 bg-white border-slate-200/60 rounded-xl font-medium text-sm focus:ring-blue-500/20" placeholder="Filter projects..." />
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {myTasks.length === 0 ? (
                <div className="col-span-full py-24 text-center bg-white border border-dashed border-slate-300 rounded-[2rem] gap-4 flex flex-col items-center">
                  <div className="p-5 rounded-2xl bg-slate-50 text-slate-300">
                    <FileText className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">Deployment Pipeline Empty</h3>
                    <p className="text-sm font-medium text-slate-500">Initialize your first campaign to begin data verification.</p>
                  </div>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-500 font-black rounded-xl px-8" onClick={() => setIsNewTaskOpen(true)}>
                    Initialize Project
                  </Button>
                </div>
              ) : (
                myTasks.map(task => (
                  <Card key={task.id} className="hover:shadow-2xl transition-all duration-500 border border-slate-200/60 bg-white group rounded-3xl premium-shadow hover:translate-y-[-4px] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${task.status === "pending_review" ? "text-amber-600 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
                          {task.status === "pending_review" ? "Auth Required" : "System Live"}
                        </Badge>
                        <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Plus className="h-4 w-4" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-black text-slate-900 tracking-tight leading-snug">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 space-y-6">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {new Date(task.createdAt).toLocaleDateString()}</span>
                        <span className="text-blue-600 font-black">${task.payPerRow.toFixed(2)} / UNIT</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Progress</span>
                          <span className="text-sm font-black text-slate-900">{task.status === 'approved' ? '100%' : '0%'}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-blue-600 transition-all duration-1000 ${task.status === 'approved' ? 'w-full' : 'w-0'}`} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-8 pb-8 pt-2">
                      <Button variant="outline" className="w-full h-11 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all">
                        Configure Protocol
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-10">
            <Card className="border-slate-200/60 premium-shadow rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <PieIcon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Asset Distribution</CardTitle>
                </div>
                <CardDescription className="font-medium text-slate-500">Real-time status of your global data pipeline</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          padding: '12px 16px',
                          fontWeight: 800,
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {PIE_DATA.map((item, i) => (
                    <div key={i} className="text-center space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.name}</p>
                      <p className="text-sm font-black text-slate-900" style={{color: item.color}}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white premium-shadow rounded-[2rem] border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <CardHeader className="p-10 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-3 tracking-tight">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  Enterprise Grade
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-4">
                <p className="text-blue-100 font-medium leading-relaxed">
                  Your projects are prioritized for <span className="text-white font-black underline underline-offset-4 decoration-blue-400 decoration-2">Verified Tier-1</span> specialists, ensuring a <span className="text-white font-black">99.4%</span> base accuracy.
                </p>
                <Button className="mt-8 w-full h-12 bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl shadow-xl shadow-blue-900/20">
                  Upgrade Service Level
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
