"use client";
import { useState } from "react";
import axios from "axios";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { BASE_URL } from "@/utils/helper";

function Paynow() {
  let cashfree: any;

  let insitialzeSDK = async function () {
    cashfree = await load({
      mode: "production",
    });
  };

  insitialzeSDK();

  const [orderId, setOrderId] = useState("");

  const getSessionId = async () => {
    console.log("inside get session");
    try {
      let res = await axios.get(`${BASE_URL}/api/payment`);
      console.log("session responnse is ", JSON.stringify(res));
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async () => {
    try {
      let res = await axios.post(`${BASE_URL}/api/verify`, {
        orderId: orderId,
      });

      if (res && res.data) {
        alert("payment verified");
      }
    } catch (error) {
      console.log(error);
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
        console.log("payment initialized");

        verifyPayment();
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Cashfree payment getway</h1>
      <div className="card">
        <button onClick={handleClick}>Pay now</button>
      </div>
    </>
  );
}

export default Paynow;
