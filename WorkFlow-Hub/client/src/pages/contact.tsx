import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Our support team will get back to you within 24 hours.",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-600">Have questions about our services or your account? We're here to help.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-8">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit"><Mail className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-slate-900">Email Us</h4>
                <p className="text-slate-500 text-sm">support@lexingtonglobal.com</p>
                <p className="text-slate-500 text-sm">sales@lexingtonglobal.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit"><MapPin className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-slate-900">Our Offices</h4>
                <p className="text-slate-500 text-sm">Lexington Avenue, Suite 1500</p>
                <p className="text-slate-500 text-sm">New York, NY 10174</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit"><Phone className="h-6 w-6" /></div>
              <div>
                <h4 className="font-bold text-slate-900">Call Support</h4>
                <p className="text-slate-500 text-sm">+1 (800) 555-0123</p>
                <p className="text-slate-500 text-sm">Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>
          </div>

          <Card className="md:col-span-2 border-slate-100 shadow-xl">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Question about my payout" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" required />
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-bold">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
