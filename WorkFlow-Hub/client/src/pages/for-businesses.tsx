import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Users, 
  MessageSquare,
  ArrowRight,
  Database,
  Search,
  FileSpreadsheet
} from "lucide-react";
import { Link } from "wouter";

export default function ForBusinesses() {
  return (
    <Layout>
      <div className="space-y-24 pb-20">
        {/* Business Hero */}
        <section className="relative py-20 overflow-hidden bg-slate-50 rounded-3xl border border-slate-100">
          <div className="container mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1 text-sm font-bold">Lexington for Enterprise</Badge>
              <h1 className="text-5xl lg:text-6xl font-heading font-black text-slate-900 leading-tight">
                Scale Your Data Operations with <span className="text-blue-600">Guaranteed Accuracy</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Offload your manual data entry, verification, and auditing tasks to our certified global workforce. Quality-controlled results, delivered at scale.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-blue-600 shadow-xl shadow-blue-200">Get a Quote</Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-slate-200">View Documentation</Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" 
                alt="Business Data Processing" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our streamlined process ensures your data is handled with precision and delivered on time.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Define Your Project", 
                desc: "Specify your data fields, validation rules, and required accuracy levels via our enterprise portal.",
                icon: Database
              },
              { 
                step: "02", 
                title: "Workforce Execution", 
                desc: "Our certified specialists process your data in our secure, audited environment.",
                icon: Users
              },
              { 
                step: "03", 
                title: "Quality Audit", 
                desc: "All submissions pass through our multi-layer verification system before final delivery.",
                icon: ShieldCheck
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-6xl font-black text-slate-50 absolute -top-4 -left-4 z-0 select-none">{item.step}</div>
                <div className="relative z-10 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services & Pricing */}
        <section className="bg-slate-900 rounded-3xl p-12 lg:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Volume Pricing for Any Use Case</h2>
              <div className="space-y-6">
                {[
                  { title: "Standard Data Entry", price: "From $0.05", unit: "/ row", icon: FileSpreadsheet },
                  { title: "Verification & Auditing", price: "From $0.08", unit: "/ row", icon: CheckCircle2 },
                  { title: "Complex Research", price: "From $0.15", unit: "/ row", icon: Search }
                ].map((tier, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><tier.icon className="h-5 w-5" /></div>
                      <span className="font-bold text-lg">{tier.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-400">{tier.price}</span>
                      <span className="text-xs text-slate-400 block">{tier.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 italic text-sm">*Custom enterprise rates available for volumes exceeding 1M rows/month.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-slate-900 space-y-6">
              <h3 className="text-2xl font-bold">Contact Sales</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Enter your company" />
                </div>
                <div className="space-y-2">
                  <Label>Project Volume</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm">
                    <option>Select volume...</option>
                    <option>10k - 50k rows</option>
                    <option>50k - 200k rows</option>
                    <option>200k+ rows</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Tell us about your data needs" className="min-h-[100px]" />
                </div>
                <Button className="w-full h-12 bg-blue-600 text-lg font-bold">Request Business Access</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
