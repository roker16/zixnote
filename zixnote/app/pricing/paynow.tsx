"use client";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { BASE_URL } from "@/utils/helper";
import { showNotifications } from "@/components/Notification";
import { notifications } from "@mantine/notifications";
import { IconDiscountCheckFilled } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";

function Paynow({ amount, planName }: { amount: number; planName: planType }) {
  let cashfree: any;

  let insitialzeSDK = async function () {
    cashfree = await load({
      mode: "production",
    });
  };

  insitialzeSDK();

  const getSessionId = async () => {
    try {
      let res = await fetch(`${BASE_URL}/api/payment`, {
        method: "POST",
        body: JSON.stringify({
          amount: amount,
        }),
      });
      const data = await res.json();
      if (data && data.payment_session_id) {
        return { sessionId: data.payment_session_id, orderId: data.order_id };
      }
    } catch (error) {
      console.log("error is ", error);
      // alert(error);
    }
  };

  const verifyPayment = async (orderId: string) => {
    try {
      let res = await fetch(`${BASE_URL}/api/verify`, {
        method: "POST",
        body: JSON.stringify({
          orderid: orderId,
        }),
      });
      const data = await res.json();
      if (res && data) {
        // update database
        console.log("payment detail is ", JSON.stringify(data));
        const endDate = calculateEndDate(planName);
        const supabase = createClient();
        const userId = (await supabase.auth.getUser()).data.user?.id;
        const { error } = await supabase.from("subscription").insert({
          amount: data[0].payment_amount,
          payment_id: data[0].cf_payment_id,
          status: "",
          plan_name: planName,
          user_id: userId,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        });
        // showNotifications("Payment verified");
        notifications.show({
          title: "Payment verified",
          message: "Your subscription is active now!",
          icon: <IconDiscountCheckFilled />,
          color: "green",
        });
        // alert("payment verified");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    try {
      let data = await getSessionId();
      let checkoutOptions = {
        paymentSessionId: data?.sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((res: any) => {
        verifyPayment(data?.orderId);
      });
    } catch (error) {
      console.log("error is ", error);
    }
  };
  return (
    <>
      <div>
        <Button onClick={handleClick}>Pay now</Button>
        {/* Order id is {orderId} */}
      </div>
    </>
  );
}

export default Paynow;

type planType = "monthly" | "yearly" | "five_year";

const calculateEndDate = (
  duration: planType
): Date => {
  const endDate = new Date();
  if (duration === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1); // Add one month
  } else if (duration === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1); // Add one year
  } else if (duration === "five_year") {
    endDate.setFullYear(endDate.getFullYear() + 5); // Add five years
  }
  return endDate;
};
