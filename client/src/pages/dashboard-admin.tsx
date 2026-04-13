import { Layout } from "@/components/layout";
import { useStore } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Layout>
        <div className="p-10 text-center">
          Unauthorized Access
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <Card>
          <CardContent className="p-4">
            Admin panel working ✅
          </CardContent>
        </Card>

        <Button onClick={() => setLocation("/dashboard")}>
          Go to Worker Dashboard
        </Button>
      </div>
    </Layout>
  );
}
