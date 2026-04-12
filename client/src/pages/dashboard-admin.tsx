import { Layout } from "@/components/layout";
import { useStore, Submission, Payout, MOCK_USERS } from "@/lib/mock-data";
import { getWorkerRank } from "./dashboard-worker";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Eye, 
  Check, 
  X, 
  TrendingUp, 
  DollarSign,
  CreditCard,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Award,
  ShieldCheck,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const MOCK_PLATFORM_DATA = [
  { name: 'Jan', submissions: 400 },
  { name: 'Feb', submissions: 600 },
  { name: 'Mar', submissions: 800 },
  { name: 'Apr', submissions: 750 },
  { name: 'May', submissions: 900 },
  { name: 'Jun', submissions: 1200 },
];

export default function AdminDashboard() {
  const { currentUser, tasks, submissions, payouts, reviewSubmission, addTask, markAsPaid } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    payPerRow: "0.10", 
    dataFields: "", 
    maxRows: CONFIG.DEFAULT_MAX_ROWS.toString(),
    slaHours: "24",
    revisionPolicy: "Standard",
    priority: "medium"
  });

  const [reviewSub, setReviewSub] = useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-red-50 text-red-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Unauthorized Access</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You do not have the required administrative permissions to view this page.</p>
          <Button onClick={() => setLocation("/dashboard")} className="font-semibold">
            Return to My Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const pendingPayouts = payouts.filter(p => p.status === "pending");
  
  const totalApprovedEarnings = payouts.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPendingPayout = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const handleCreateTask = () => {
    addTask({
      title: newTask.title,
      description: newTask.description,
      payPerRow: parseFloat(newTask.payPerRow),
      maxRows: parseInt(newTask.maxRows),
      dataFields: newTask.dataFields.split(",").map(s => s.trim()),
      slaHours: parseInt(newTask.slaHours),
      revisionPolicy: newTask.revisionPolicy,
      priority: newTask.priority as any
    });
    setIsCreateOpen(false);
    toast({ title: "Job Created", description: "New task is now live with SLA tracking." });
  };

  const handleReview = (status: "approved" | "rejected") => {
    if (!reviewSub) return;
    reviewSubmission(reviewSub.id, status, status === 'rejected' ? rejectionReason : undefined);
    setReviewSub(null);
    setRejectionReason("");
    toast({ 
      title: status === 'approved' ? "Submission Approved" : "Submission Rejected",
      description: status === 'approved' ? "Worker earnings updated." : "Worker notified."
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Platform Analytics</h1>
            <p className="text-slate-500">Comprehensive overview of platform activity and finances.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> New Job Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="text-xl">Launch New Data Campaign</DialogTitle></DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Campaign Title</Label><Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g., Q1 Customer Feedback Processing" /></div>
                <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Instructions</Label><Textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Detailed steps for workers..." className="min-h-[100px]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Pay per Row ($)</Label><Input type="number" step="0.01" value={newTask.payPerRow} onChange={e => setNewTask({...newTask, payPerRow: e.target.value})} /></div>
                  <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Max Rows</Label><Input type="number" value={newTask.maxRows} onChange={e => setNewTask({...newTask, maxRows: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">SLA Turnaround (Hours)</Label>
                    <Input type="number" value={newTask.slaHours} onChange={e => setNewTask({...newTask, slaHours: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Priority</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newTask.priority}
                      onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Required Columns (comma separated)</Label><Input placeholder="Email, Name, ID" value={newTask.dataFields} onChange={e => setNewTask({...newTask, dataFields: e.target.value})} /></div>
              </div>
              <DialogFooter><Button onClick={handleCreateTask} className="w-full">Publish Job</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard title="Total Approved" value={`$${totalApprovedEarnings.toFixed(2)}`} icon={DollarSign} color="blue" />
          <AnalyticsCard title="Pending Payouts" value={`$${totalPendingPayout.toFixed(2)}`} icon={CreditCard} color="orange" />
          <AnalyticsCard title="Paid to Workers" value={`$${totalPaid.toFixed(2)}`} icon={CheckCircle2} color="emerald" />
          <AnalyticsCard title="Active Workers" value="2,541" icon={Users} color="slate" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <Card className="border-slate-200/60 premium-shadow rounded-3xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 px-8 pt-8">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Platform Throughput</CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Monthly data submission volume across all campaigns</CardDescription>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50">
                  <Activity className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-10">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_PLATFORM_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          padding: '12px 16px' 
                        }}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="submissions" radius={[6, 6, 0, 0]} barSize={40}>
                        {MOCK_PLATFORM_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === MOCK_PLATFORM_DATA.length - 1 ? '#2563eb' : '#e2e8f0'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="submissions" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Operations Control</h2>
                  <p className="text-sm font-medium text-slate-500">Monitor and authorize platform-wide activity</p>
                </div>
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 h-auto overflow-x-auto justify-start">
                  <TabsTrigger value="submissions" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all whitespace-nowrap">
                    Review Queue ({pendingSubmissions.length})
                  </TabsTrigger>
                  <TabsTrigger value="client-tasks" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all whitespace-nowrap">
                    Project Requests
                  </TabsTrigger>
                  <TabsTrigger value="payouts" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all whitespace-nowrap">
                    Payouts ({pendingPayouts.length})
                  </TabsTrigger>
                  <TabsTrigger value="workers" className="rounded-xl px-5 py-2.5 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all whitespace-nowrap">
                    Specialists
                  </TabsTrigger>
                </TabsList>
              </div>

          <TabsContent value="workers">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Worker Performance Directory</CardTitle>
                <CardDescription>Monitor accuracy scores and reward high-performing specialists.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="pl-6">Worker Name</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead className="text-right pr-6">Reliability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_USERS.filter(u => u.role === 'worker').map(worker => {
                      const rank = getWorkerRank(worker);
                      return (
                        <TableRow key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 font-medium">{worker.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`font-bold ${rank.color}`}>
                              {rank.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-bold ${worker.accuracyScore && worker.accuracyScore >= 95 ? 'text-emerald-600' : 'text-slate-900'}`}>
                              {worker.accuracyScore || 0}%
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-500">{worker.approvedSubmissions || 0} jobs</TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1">
                              {worker.accuracyScore && worker.accuracyScore >= 98 && <ShieldCheck className="h-4 w-4 text-blue-500" title="High Reliability" />}
                              {worker.approvedSubmissions && worker.approvedSubmissions > 20 && <Award className="h-4 w-4 text-purple-500" title="Veteran Status" />}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-tasks">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Project Approval Queue</CardTitle>
                <CardDescription>Review and approve projects submitted by enterprise clients.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="pl-6">Client ID</TableHead>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.filter(t => t.status === 'pending_review').map(task => (
                      <TableRow key={task.id}>
                        <TableCell className="pl-6 font-medium">{task.clientId || "N/A"}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell className="font-bold">${task.payPerRow.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Button size="sm" onClick={() => {
                            useStore.getState().approveTask(task.id);
                            toast({ title: "Project Approved", description: "This job is now available to workers." });
                          }}>Approve & Publish</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tasks.filter(t => t.status === 'pending_review').length === 0 && <div className="p-12 text-center text-slate-400 italic">No new project requests.</div>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Recent Submissions</CardTitle>
                <CardDescription>Review worker submissions and approve for payment.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="pl-6">Worker ID</TableHead>
                      <TableHead>File Source</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSubmissions.map(sub => (
                      <TableRow key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 font-medium">{sub.workerId}</TableCell>
                        <TableCell className="font-mono text-xs">{sub.fileName}</TableCell>
                        <TableCell><Badge variant="outline">{sub.rowCount} rows</Badge></TableCell>
                        <TableCell className="text-slate-500 text-sm">{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8" onClick={() => setReviewSub(sub)}>
                                <Eye className="h-3.5 w-3.5 mr-1.5" /> Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader><DialogTitle>Worker Submission Detail</DialogTitle></DialogHeader>
                              <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-slate-50 rounded-lg border">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Submission Volume</p>
                                    <p className="text-xl font-bold">{sub.rowCount} Data Rows</p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-lg border">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">File Name</p>
                                    <p className="text-xl font-bold truncate">{sub.fileName}</p>
                                  </div>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="bg-slate-100 px-4 py-2 border-b flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600">Sample Preview (Top 10)</span>
                                    <Badge className="bg-white text-slate-900 border-slate-300">Verified Format</Badge>
                                  </div>
                                  <div className="max-h-40 overflow-auto">
                                    <Table>
                                      <TableBody>
                                        {sub.previewData.map((row, i) => (
                                          <TableRow key={i} className="hover:bg-transparent">
                                            {Object.values(row).map((val: any, j) => <TableCell key={j} className="py-2 text-[11px] font-mono">{val}</TableCell>)}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold">Feedback / Rejection Reason</Label>
                                  <Textarea 
                                    placeholder="Provide feedback if rejecting..." 
                                    className="bg-slate-50 focus:bg-white min-h-[80px]" 
                                    value={rejectionReason} 
                                    onChange={e => setRejectionReason(e.target.value)} 
                                  />
                                </div>
                              </div>
                              <DialogFooter className="gap-2 sm:justify-between border-t pt-4">
                                <Button variant="ghost" onClick={() => setReviewSub(null)}>Cancel</Button>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleReview("rejected")}>
                                    <X className="h-4 w-4 mr-1.5" /> Reject Work
                                  </Button>
                                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => handleReview("approved")}>
                                    <Check className="h-4 w-4 mr-1.5" /> Approve & Payout
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {pendingSubmissions.length === 0 && <div className="p-12 text-center text-slate-400 italic">No submissions awaiting review.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Payout Management</CardTitle>
                <CardDescription>Release approved earnings to worker accounts.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="pl-6">Worker</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayouts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="pl-6 font-medium">{p.workerId}</TableCell>
                        <TableCell className="font-bold text-slate-900">${p.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 shadow-sm"
                            onClick={() => {
                              markAsPaid(p.id);
                              toast({ title: "Paid", description: "Worker payout marked as paid." });
                            }}
                          >
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Mark Paid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingPayouts.length === 0 && <div className="p-12 text-center text-slate-400 italic">No payouts currently in queue.</div>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-10">
            <Card className="border-slate-200/60 premium-shadow rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Live Telemetry</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {[
                  { title: 'Enterprise Project', desc: 'Acme Corp submitted "Q2 Audit"', time: 'Just now', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { title: 'Payout Released', desc: 'Sarah Worker: $75.50 released', time: '12m ago', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { title: 'System Audit', desc: 'Manual review of Batch #449 completed', time: '45m ago', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                  { title: 'New Specialist', desc: 'Michael R. passed Module 4', time: '1h ago', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group cursor-default">
                    <div className={`mt-1 h-12 w-12 rounded-2xl border ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-black text-slate-900 tracking-tight">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.time}</p>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button variant="ghost" className="w-full rounded-2xl h-12 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  Access Master Logs <ArrowUpRight className="ml-2 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-none rounded-[2rem] premium-shadow overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12">
                <TrendingUp className="h-32 w-32 text-white" />
              </div>
              <CardContent className="p-10 relative z-10 space-y-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 w-fit backdrop-blur-md">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-black text-xl text-white tracking-tight">Efficiency Protocol</h4>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Average approval latency has decreased by <span className="text-emerald-400 font-black">14.2%</span> this fiscal cycle through automated pre-sorting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AnalyticsCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100/50",
    orange: "bg-orange-50 text-orange-600 border-orange-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    slate: "bg-slate-100 text-slate-600 border-slate-200/50"
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl border border-slate-200/60 bg-white group rounded-[2rem] premium-shadow h-full flex flex-col">
      <CardContent className="p-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className={`p-5 rounded-2xl border ${colors[color]} transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-sm shrink-0`}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex flex-col items-end shrink-0">
            <Badge variant="outline" className="text-[10px] font-black text-emerald-600 bg-emerald-50 border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-widest">
              <TrendingUp className="h-3 w-3" /> +12.5%
            </Badge>
          </div>
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2 truncate">{title}</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter truncate">{value}</h3>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Audit</span>
          <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className="h-1 w-3 rounded-full bg-slate-100 group-hover:bg-blue-200 transition-colors" style={{transitionDelay: `${i*100}ms`}} />)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
