"use client";
import { useState } from "react";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { BASE_URL } from "@/utils/helper";

function Paynow({ amount }: { amount: number }) {
  const [orderId, setOrderId] = useState(9999999);
  let cashfree: any;

  let insitialzeSDK = async function () {
    cashfree = await load({
      mode: "production",
    });
  };

  insitialzeSDK();

  const getSessionId = async () => {
    console.log("inside get session");
    try {
      let res = await fetch(`${BASE_URL}/api/payment`, {
        method: "POST",
        body: JSON.stringify({
          amount: amount,
        }),
      });
      const data = await res.json();
      console.log("session responnse is ", JSON.stringify(data));
      if (data && data.payment_session_id) {
        console.log(data);
        setOrderId(data.order_id);
        return data.payment_session_id;
      }
    } catch (error) {
      console.log("error is ", error);
      // alert(error);
    }
  };

  

  const handleClick = async (e: any) => {
    e.preventDefault();
    console.log("inside handle click");
    try {
      let sessionId = await getSessionId();
      console.log("session id is", sessionId);
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((res: any) => {
        console.log("response object is ..." ,JSON.stringify(res));
        const verifyPayment = async () => {
          console.log("order id is ", orderId);
          try {
            let res = await fetch(`${BASE_URL}/api/verify`, {
              method: "POST",
              body: JSON.stringify({
                orderid: orderId,
              }),
            });
            const data = await res.json();
            if (res && data) {
              console.log(JSON.stringify(data));
              alert("payment verified");
            }
          } catch (error) {
            console.log(error);
          }
        };
        verifyPayment();
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
        Order id is {orderId}
      </div>
    </>
  );
}

export default Paynow;
