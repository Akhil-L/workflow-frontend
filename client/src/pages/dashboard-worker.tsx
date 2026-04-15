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

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ ACCEPT TASK
  const acceptTask = async (id: number) => {
    try {
      await fetch(
        `https://workflow-backend-mdfx.onrender.com/api/tasks/${id}/accept`,
        {
          method: "POST",
        }
      );

      // refresh tasks
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

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
                    <p>💰 ${task.amount}</p>
                    <p>Status: {task.status}</p>
                  </div>

                  <Button
                    onClick={() => acceptTask(task.id)}
                    disabled={task.status !== "open"}
                  >
                    {task.status === "open" ? "Take Task" : task.status}
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
