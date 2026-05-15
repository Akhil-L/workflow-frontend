import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api", (_req, res) => {
    res.json({
      status: "Backend running"
    });
  });

  app.post("/api/register", async (req, res) => {
    const { name, email, role } = req.body;

    return res.json({
      success: true,
      name,
      email,
      role
    });
  });

  app.post("/api/login", async (req, res) => {
    const { email } = req.body;

    return res.json({
      success: true,
      email,
      role: "worker",
      name: "Akhil"
    });
  });

  return httpServer;
}