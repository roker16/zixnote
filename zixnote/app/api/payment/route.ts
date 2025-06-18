import { createClient } from "@/utils/supabase/server";
import { Cashfree } from "cashfree-pg";
import { cookies } from "next/headers";
import { metadata } from "../../layout";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const { amount } = await request.json();
  console.log("amount is ", amount);
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  const userId = user?.id;
  const email = user?.email;

  if (!user) {
    return new Response("user not logged in.", {
      status: 500,
    });
  }
  Cashfree.XClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

  const orderId = crypto.randomUUID();
  try {
    var request1 = {
      order_amount: 1,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: userId!,
        customer_phone: "9999999999",
        customer_name: "username",
        customer_email: email,
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
