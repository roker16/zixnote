import React from "react";
import Paynow from "./paynow";
import { getSubscriptionServer } from "./getSubscriptionServer";
import { getUserAndRole } from "@/utils/getUserAndRole";
import { FeatureList } from "./FeatureList";
import {
  IconCheckbox,
  IconCircleCheckFilled,
  IconCircleCheck,
} from "@tabler/icons-react";

async function Pricing() {
  const user = await getUserAndRole();
  const subscription = user.user && (await getSubscriptionServer(user.user.id));
  const planName = subscription && subscription.length !==0 && subscription[0].plan_name;
  // Monthly plan price
  const monthlyPrice = 700;

  // Yearly plan price and discount percentage
  const yearlyActualPrice = 12 * monthlyPrice;
  const yearlyPrice = 6000;
  const yearlyDiscountPercentage =
    ((12 * monthlyPrice - yearlyPrice) / (12 * monthlyPrice)) * 100;

  // 5-year plan price and discount percentage
  const fiveYearActualPrice = 60 * monthlyPrice;
  const fiveYearPrice = 16000;
  const fiveYearDiscountPercentage =
    ((60 * monthlyPrice - fiveYearPrice) / (60 * monthlyPrice)) * 100;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-16">
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>
      {/* {user.user?.id}
      {JSON.stringify(subscription)} */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div className="self-end">
            {planName && planName === "monthly" && (
              <IconCircleCheck
                color="var(--mantine-color-green-5)"
                size={48}
                stroke={1}
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Monthly</h2>
            <FeatureList />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 md:gap-1 items-center justify-between mt-4">
            <span className="text-2xl font-bold mb-4">₹{monthlyPrice}</span>
            <Paynow
              amount={monthlyPrice}
              planName={"monthly"}
              subscribed={planName && planName === "monthly" ? true : false}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div className="self-end">
            {planName && planName === "yearly" && (
              <IconCircleCheck
                color="var(--mantine-color-green-5)"
                size={48}
                stroke={1}
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Yearly</h2>
            <FeatureList />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 md:gap-1 items-center justify-between mt-4">
            <div>
              <span className="text-lg text-gray-500 line-through mr-2">
                ₹{yearlyActualPrice}
              </span>
              <span className="text-2xl font-bold">₹{yearlyPrice}</span>
            </div>
            <span className="text-xs text-green-500 mb-6">
              ({yearlyDiscountPercentage.toFixed(2)}% off)
            </span>
            <Paynow
              amount={yearlyPrice}
              planName={"yearly"}
              subscribed={planName && planName === "yearly" ? true : false}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div className="self-end">
            {planName && planName === "five_year" && (
              <IconCircleCheck
                color="var(--mantine-color-green-5)"
                size={48}
                stroke={1}
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">5 years Plan</h2>
            <FeatureList />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 md:gap-1 items-center justify-between mt-4">
            <div>
              <span className="text-lg text-gray-500 line-through mr-2">
                ₹{fiveYearActualPrice}
              </span>
              <span className="text-2xl font-bold">₹{fiveYearPrice}</span>
            </div>
            <span className="text-sm text-green-500 mb-6">
              ({fiveYearDiscountPercentage.toFixed(2)}% off)
            </span>
            <Paynow
              amount={fiveYearPrice}
              planName={"five_year"}
              subscribed={planName && planName === "five_year" ? true : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
