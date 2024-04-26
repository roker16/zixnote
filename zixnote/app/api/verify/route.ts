import { Cashfree } from "cashfree-pg";


export async function POST(request: Request) {
  Cashfree.XClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
  try {
    const { orderId } = await request.json();

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        return new Response(JSON.stringify(response.data), { status: 200 });
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  } catch (error) {
    console.log(error);
  }
}
