import { Layout } from "@/components/layout";
import { useStore, Payout } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function PayoutsPage() {
  const { currentUser, payouts } = useStore();
  const [, setLocation] = useLocation();
  
  if (!currentUser) return <Layout><div>Please log in</div></Layout>;

  if (currentUser.role !== 'worker') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Wrong Section</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">Administrators manage payments through the admin portal. Personal earning statements are for worker accounts only.</p>
          <Button onClick={() => setLocation("/admin")} className="font-semibold">
            Go to Admin Portal
          </Button>
        </div>
      </Layout>
    );
  }

  const workerPayouts = payouts.filter(p => p.workerId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const totalEarned = workerPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = workerPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = workerPayouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout>
      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Treasury & Settlements</h1>
            <p className="text-slate-500 font-medium text-lg">Secure verification of your earned capital assets.</p>
          </div>
          <div className="bg-white border border-slate-200/60 p-2 rounded-2xl premium-shadow flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-xs font-black text-emerald-600">Secure Protocol Active</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 rounded-3xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50">
                <DollarSign className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Lifetime Yield</p>
                <h3 className="text-3xl font-black text-slate-900">${totalEarned.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 rounded-3xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100/50">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">In Transit</p>
                <h3 className="text-3xl font-black text-slate-900">${pendingAmount.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 rounded-3xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Settled Assets</p>
                <h3 className="text-3xl font-black text-slate-900">${paidAmount.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200/60 shadow-sm premium-shadow bg-white rounded-3xl overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Settlement Ledger</CardTitle>
                <CardDescription className="text-slate-500 font-medium mt-1">Audit log of all financial disbursements and pending claims.</CardDescription>
              </div>
              <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200 hover:bg-slate-50">
                Export Statement
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="px-10 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Reference Hash</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Value</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Timestamp</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">System State</TableHead>
                  <TableHead className="text-right px-10 font-black text-[10px] uppercase tracking-widest text-slate-400">Verification Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workerPayouts.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0">
                    <TableCell className="px-10 py-6 font-mono text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase">{p.id}</TableCell>
                    <TableCell className="font-black text-slate-900 text-lg">${p.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${p.status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                        {p.status === 'paid' ? 'Settled' : 'In Progress'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-10 text-slate-400 font-medium">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {workerPayouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-24 text-slate-400">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-slate-50 text-slate-200">
                          <DollarSign className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="font-medium italic">No financial activity recorded in current cycle.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
