import { DatabaseService } from "./DatabaseService";
import { PayPalService } from "./PayPalService";
import { TaskAssignment, PaymentStatus } from "../models/Task";

export class PaymentService {
  private db: DatabaseService;
  private paypal: PayPalService;

  constructor() {
    this.db = new DatabaseService();
    this.paypal = new PayPalService();
  }

  public async processPayment(assignmentId: string): Promise<TaskAssignment> {
    const assignment = await this.db.getAssignment(assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (assignment.status !== "completed") {
      throw new Error("Cannot process payment for incomplete assignment");
    }

    const amount = this.calculatePaymentAmount(assignment);
    const description = `Payment for task: ${assignment.taskId}`;

    try {
      // Create PayPal order
      const orderId = await this.paypal.createPayment(amount, description);

      // Update payment status to processing
      const paymentUpdate: PaymentStatus = {
        status: "processing",
        amount,
        transactionId: orderId,
      };

      const updatedAssignment = await this.db.updateAssignment(assignmentId, {
        payment: paymentUpdate,
      });

      if (!updatedAssignment) {
        throw new Error("Failed to update assignment");
      }

      // Capture the payment
      const captureResult = await this.paypal.capturePayment(orderId);

      // Update payment status to completed
      const finalPayment: PaymentStatus = {
        status: "completed",
        amount,
        processedDate: new Date(),
        transactionId: orderId,
      };

      return (await this.db.updateAssignment(assignmentId, {
        payment: finalPayment,
      })) as TaskAssignment;
    } catch (error) {
      // Update payment status to failed
      const failedPayment: PaymentStatus = {
        status: "failed",
        amount,
        processedDate: new Date(),
      };

      await this.db.updateAssignment(assignmentId, {
        payment: failedPayment,
      });

      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  public async getPaymentStatus(
    assignmentId: string
  ): Promise<PaymentStatus | null> {
    const assignment = await this.db.getAssignment(assignmentId);
    return assignment?.payment || null;
  }

  private calculatePaymentAmount(assignment: TaskAssignment): number {
    const baseAmounts = {
      low: 100,
      medium: 250,
      high: 500,
    };

    return baseAmounts.medium; // Default to medium complexity amount
  }
}
