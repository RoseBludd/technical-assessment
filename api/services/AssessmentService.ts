import { DatabaseService } from "./DatabaseService";
import { TaskAssignment, TaskEvaluation } from "../models/Task";

export class AssessmentService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  public async updateProgress(
    assignmentId: string,
    progress: any
  ): Promise<TaskAssignment> {
    const assignment = await this.db.getAssignment(assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const updates = {
      status: progress.status,
      completedDate: progress.status === "completed" ? new Date() : undefined,
    };

    return await this.db.updateAssignment(assignmentId, updates);
  }

  public async getProgress(
    assignmentId: string
  ): Promise<TaskAssignment | null> {
    return await this.db.getAssignment(assignmentId);
  }

  public async getCandidateProgress(candidateId: string): Promise<any> {
    return await this.db.getCandidateProgress(candidateId);
  }

  public async submitEvaluation(
    assignmentId: string,
    evaluation: TaskEvaluation
  ): Promise<TaskAssignment> {
    const assignment = await this.db.getAssignment(assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    // Calculate overall score
    const scores = [
      evaluation.speed,
      evaluation.accuracy,
      evaluation.communication,
      evaluation.problem_solving,
      evaluation.code_quality,
      evaluation.independence,
      evaluation.alignment,
      evaluation.efficiency,
      evaluation.initiative,
      evaluation.collaboration,
    ];

    const overall_score =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const evaluationWithScore = { ...evaluation, overall_score };

    return await this.db.updateAssignment(assignmentId, {
      evaluation: evaluationWithScore,
    });
  }

  public async getEvaluation(
    assignmentId: string
  ): Promise<TaskEvaluation | null> {
    const assignment = await this.db.getAssignment(assignmentId);
    return assignment?.evaluation || null;
  }
}
