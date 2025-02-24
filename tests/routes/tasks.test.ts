import request from "supertest";
import { app } from "../../api";
import { DatabaseService } from "../../api/services/DatabaseService";
import { TaskPool } from "../../api/models/TaskPool";

describe("Task Routes", () => {
  const db = new DatabaseService();
  const taskPool = new TaskPool();

  describe("GET /api/tasks/pool", () => {
    it("should return all tasks", async () => {
      const response = await request(app).get("/api/tasks/pool");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/tasks/:assignmentId/progress", () => {
    it("should update task progress", async () => {
      // Create a test assignment
      const assignment = await db.createAssignment({
        taskId: "TEST-001",
        candidateId: "CAND-001",
        status: "assigned",
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000),
      });

      const response = await request(app)
        .post(`/api/tasks/${assignment.id}/progress`)
        .send({
          status: "in_progress",
          notes: "Making good progress",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("in_progress");
    });

    it("should return 400 for invalid status", async () => {
      const response = await request(app)
        .post("/api/tasks/TEST-001/progress")
        .send({
          status: "invalid_status",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/tasks/:assignmentId/evaluation", () => {
    it("should submit task evaluation", async () => {
      // Create a test assignment
      const assignment = await db.createAssignment({
        taskId: "TEST-002",
        candidateId: "CAND-001",
        status: "completed",
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000),
        completedDate: new Date(),
      });

      const evaluation = {
        speed: 4,
        accuracy: 4,
        communication: 5,
        problem_solving: 4,
        code_quality: 5,
        independence: 4,
        alignment: 5,
        efficiency: 4,
        initiative: 5,
        collaboration: 4,
        comments: "Excellent work",
      };

      const response = await request(app)
        .post(`/api/tasks/${assignment.id}/evaluation`)
        .send(evaluation);

      expect(response.status).toBe(200);
      expect(response.body.evaluation).toBeDefined();
      expect(response.body.evaluation.overall_score).toBeGreaterThan(0);
    });
  });

  describe("POST /api/tasks/:assignmentId/payment", () => {
    it("should process payment for completed task", async () => {
      // Create a test assignment
      const assignment = await db.createAssignment({
        taskId: "TEST-003",
        candidateId: "CAND-001",
        status: "completed",
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000),
        completedDate: new Date(),
      });

      const response = await request(app)
        .post(`/api/tasks/${assignment.id}/payment`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.payment).toBeDefined();
      expect(response.body.payment.status).toBe("completed");
      expect(response.body.payment.amount).toBeGreaterThan(0);
    });

    it("should return 400 for incomplete task", async () => {
      // Create a test assignment
      const assignment = await db.createAssignment({
        taskId: "TEST-004",
        candidateId: "CAND-001",
        status: "in_progress",
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000),
      });

      const response = await request(app)
        .post(`/api/tasks/${assignment.id}/payment`)
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
