import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Shield, Globe, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">Excellence in Global Data</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Lexington Global is a leading provider of enterprise data solutions, specializing in high-precision processing and human-in-the-loop verification.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Target className="h-6 w-6" /></div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">To bridge the gap between complex enterprise data needs and a talented global workforce, delivering unmatched accuracy and scalability.</p>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Shield className="h-6 w-6" /></div>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">We employ bank-grade encryption and rigorous security protocols to ensure that all client data is handled with the highest degree of confidentiality.</p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Founded in 2018, Lexington Global began with a simple observation: enterprise data is increasingly complex, and automated systems often fall short of the 100% accuracy required for critical operations. We built a platform that combines intelligent workflow management with a certified human workforce to provide the "last mile" of data precision.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Today, we serve Fortune 500 companies across logistics, finance, and technology, processing millions of records monthly while maintaining industry-leading accuracy scores.
          </p>
        </div>
      </div>
    </Layout>
  );
}
