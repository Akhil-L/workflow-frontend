import { Layout } from "@/components/layout";
import { useStore } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function WorkerDashboard() {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();

  const [tasks, setTasks] = useState<any[]>([]);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          "https://workflow-backend-mdfx.onrender.com/api/tasks"
        );
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  // ✅ SAFETY
  if (!currentUser) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (currentUser.role !== "worker") {
    return (
      <Layout>
        <div className="p-10 text-center">
          Not authorized
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">
          Welcome, {currentUser.email}
        </h1>

        {/* ✅ STATS (STATIC FOR NOW) */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              Balance: $0
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              Tasks: {tasks.length}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              Status: Active
            </CardContent>
          </Card>
        </div>

        {/* ✅ TASK LIST */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Available Tasks
          </h2>

          {tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="mb-3">
                <CardContent className="p-4 flex justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {task.description}
                    </p>
                    <p className="text-sm">
                      💰 ${task.amount}
                    </p>
                  </div>

                  <Button>
                    Take Task
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}
