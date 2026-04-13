import { Layout } from "@/components/layout";
import { useStore, Task, TRAINING_MODULES, User } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function WorkerDashboard() {
  const { currentUser, tasks = [], assignTask } = useStore();
  const [, setLocation] = useLocation();

  // ✅ FIX 1: prevent crash on first render
  if (!currentUser) {
    return (
      <div className="p-10 text-center">
        Loading dashboard...
      </div>
    );
  }

  // ✅ FIX 2: role safety
  if (currentUser.role !== "worker") {
    return (
      <Layout>
        <div className="p-10 text-center">
          You are not authorized for this page
        </div>
      </Layout>
    );
  }

  // ✅ SAFE DATA (no undefined crash)
  const completedModules = currentUser.completedModules || [];
  const isFullyTrained =
    completedModules.length === TRAINING_MODULES.length;

  const myTasks = tasks.filter(
    (t) =>
      t.assignedTo === currentUser.id &&
      t.status !== "approved" &&
      t.status !== "rejected"
  );

  const availableTasks = tasks.filter((t) => t.status === "open");

  const completedTasks = tasks.filter(
    (t) =>
      t.assignedTo === currentUser.id &&
      t.status === "approved"
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">
          Welcome, {currentUser.name || "User"}
        </h1>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent>
              ${currentUser.balance?.toFixed(2) || "0.00"}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {completedTasks.length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {myTasks.length}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">
            Available Tasks
          </h2>

          {availableTasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            availableTasks.map((task: Task) => (
              <Card key={task.id} className="mb-3">
                <CardContent className="p-4 flex justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {task.description}
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      isFullyTrained
                        ? assignTask(task.id, currentUser.id)
                        : setLocation("/training")
                    }
                  >
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
