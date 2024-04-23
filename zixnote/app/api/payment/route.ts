import { headers } from "next/headers";
import { Cashfree } from "cashfree-pg";
export async function GET(request: Request) {
  Cashfree.XClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

  try {
    var request1 = {
      order_amount: 1.0,
      order_currency: "INR",
      order_id: "d-d-d-111",
      customer_details: {
        customer_id: "webcodder01",
        customer_phone: "9999999999",
        customer_name: "Web Codder",
        customer_email: "webcodder@example.com",
      },
    };

    Cashfree.PGCreateOrder("2023-08-01", request1).then(response => {
        console.log(response.data);
        // res.json(response.data);

    }).catch(error => {
        console.error(error.response.data.message);
    })
  } catch (error) {
    console.log(error);
  }

  const headersList = headers();
  const referer = headersList.get("referer");

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: { referer: referer! },
  });
}
