import { Cashfree } from "cashfree-pg";

export async function POST(request: Request) {
  try {
    // Set Cashfree credentials
    Cashfree.XClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

    // Parse request body
    const body = await request.json();
    const { orderid } = body;
    console.log ("order is ",orderid)

    // Fetch payments
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderid);

    // Return response
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error("An error occurred:", error);
    return new Response("An error occurred while processing your request.", {
      status: 500,
    });
  }
}
