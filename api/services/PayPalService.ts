import { loadScript } from "@paypal/paypal-js";

export class PayPalService {
  private clientId: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || "";
    if (!this.clientId) {
      throw new Error("PayPal client ID is required");
    }
  }

  public async initializePayPal(): Promise<any> {
    try {
      return await loadScript({
        "client-id": this.clientId,
        currency: "USD",
      });
    } catch (error) {
      console.error("Failed to load PayPal script:", error);
      throw new Error("Failed to initialize PayPal");
    }
  }

  public async createPayment(
    amount: number,
    description: string
  ): Promise<string> {
    try {
      const paypal = await this.initializePayPal();
      const order = await paypal.createOrder({
        purchase_units: [
          {
            amount: {
              value: amount.toString(),
              currency_code: "USD",
            },
            description,
          },
        ],
      });
      return order.id;
    } catch (error) {
      console.error("Failed to create PayPal payment:", error);
      throw new Error("Failed to create payment");
    }
  }

  public async capturePayment(orderId: string): Promise<any> {
    try {
      const paypal = await this.initializePayPal();
      return await paypal.captureOrder(orderId);
    } catch (error) {
      console.error("Failed to capture PayPal payment:", error);
      throw new Error("Failed to capture payment");
    }
  }
}
