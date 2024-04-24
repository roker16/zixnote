import { headers } from "next/headers";
import { Cashfree } from "cashfree-pg";

export async function GET(request: Request) {
  Cashfree.XClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
  function generateOrderId() {
    const uniqueId = crypto.randomUUID();

    return uniqueId;
  }
  try {
    var request1 = {
      order_amount: 1.0,
      order_currency: "INR",
      order_id:  generateOrderId(),
      customer_details: {
        customer_id: "webcodder01",
        customer_phone: "9999999999",
        customer_name: "Web Codder",
        customer_email: "webcodder@example.com",
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request1);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response("An error occurred while processing your request.", {
      status: 500,
    });
  }
}
