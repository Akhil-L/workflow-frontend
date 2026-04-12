import { Layout } from "@/components/layout";

export default function PolicyPage({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 border-b pb-4">{title}</h1>
        <div className="prose prose-slate max-w-none">
          {content}
        </div>
      </div>
    </Layout>
  );
}

export const TermsPage = () => (
  <PolicyPage 
    title="Terms & Conditions" 
    content={
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>Welcome to Lexington Global. By accessing our platform, you agree to be bound by these terms.</p>
        <h3 className="text-xl font-bold text-slate-900">1. Specialist Certification</h3>
        <p>All workers must complete the Lexington Global Training Academy and pass all certification exams before being eligible for task assignments.</p>
        <h3 className="text-xl font-bold text-slate-900">2. Quality Standards</h3>
        <p>Accuracy is the primary metric of Lexington Global. Submissions failing to meet the 99% accuracy threshold may be rejected without payout.</p>
        <h3 className="text-xl font-bold text-slate-900">3. Account Integrity</h3>
        <p>Users are prohibited from maintaining multiple accounts or sharing credentials. Violation results in immediate permanent suspension.</p>
      </div>
    } 
  />
);

export const PrivacyPage = () => (
  <PolicyPage 
    title="Privacy Policy" 
    content={
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>At Lexington Global, we take the privacy of our workers and clients seriously.</p>
        <h3 className="text-xl font-bold text-slate-900">1. Data Collection</h3>
        <p>We collect personal information necessary for identity verification and payout processing, including name, email, and payment details.</p>
        <h3 className="text-xl font-bold text-slate-900">2. Client Data</h3>
        <p>Specialists are prohibited from extracting, copying, or storing any client data processed on the platform.</p>
        <h3 className="text-xl font-bold text-slate-900">3. Data Usage</h3>
        <p>Your data is used solely for the operation of the Lexington Global platform and is never sold to third parties.</p>
      </div>
    } 
  />
);

export const PayoutPolicyPage = () => (
  <PolicyPage 
    title="Payout Policy" 
    content={
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>Our goal is to ensure timely and accurate compensation for our global workforce.</p>
        <h3 className="text-xl font-bold text-slate-900">1. Approval Cycle</h3>
        <p>Tasks are reviewed by our quality assurance team within 48-72 hours of submission. Once approved, earnings are credited to your pending balance.</p>
        <h3 className="text-xl font-bold text-slate-900">2. Payout Schedule</h3>
        <p>Payouts are processed weekly every Friday for all approved earnings. Minimum payout threshold is $20.00.</p>
        <h3 className="text-xl font-bold text-slate-900">3. Disputes</h3>
        <p>Any disputes regarding task rejection or payout amounts must be submitted via the Support portal within 7 days of the action.</p>
      </div>
    } 
  />
);
