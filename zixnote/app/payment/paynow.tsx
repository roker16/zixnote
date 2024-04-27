"use client";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { BASE_URL } from "@/utils/helper";
import { showNotifications } from "@/components/Notification";
import { notifications } from "@mantine/notifications";
import { IconDiscountCheckFilled } from "@tabler/icons-react";

function Paynow({ amount }: { amount: number }) {
  // const [orderId, setOrderId] = useState(9999999);
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

  const verifyPayment = async (orderId:string) => {
    try {
      let res = await fetch(`${BASE_URL}/api/verify`, {
        method: "POST",
        body: JSON.stringify({
          orderid: orderId,
        }),
      });
      const data = await res.json();
      if (res && data) {
        // showNotifications("Payment verified");
        notifications.show({
          title:"Payment verified",
          message: "Your payment is verified",
          icon: <IconDiscountCheckFilled />,
          color:"green"
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
      <div className="card">
        <button
          className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-cyan-600 focus:outline-none border-none"
          onClick={handleClick}
        >
          Pay now
        </button>
        {/* Order id is {orderId} */}
      </div>
    </>
  );
}

export default Paynow;
