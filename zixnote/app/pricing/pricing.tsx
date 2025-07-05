import { getUserAndRole } from "@/utils/getUserAndRole";
import { IconDiscountCheckFilled } from "@tabler/icons-react";
import { FeatureList } from "./FeatureList";
import { getSubscriptionServer } from "./getSubscriptionServer";
import Paynow from "./paynow";
import { createClient } from "@/utils/supabase/server";

const CheckIcon = <IconDiscountCheckFilled size={36} stroke={1} />;

async function Pricing() {
  const supabase = await createClient();
  const { user } = await getUserAndRole();
  const subscription = user && (await getSubscriptionServer(user.id));
  const planName =
    subscription && subscription.length !== 0 && subscription[0].plan_name;

  // 🔍 Check if payment_test is enabled
  const { data: paymentSetting } = await supabase
    .from("settings")
    .select("setting_status")
    .eq("setting_name", "payment_test")
    .single();

  const isPaymentTest = paymentSetting?.setting_status === "enabled";

  // 🔁 Use test prices if payment_test is enabled
  const monthlyPrice = isPaymentTest ? 1 : 700;

  const yearlyActualPrice = isPaymentTest ? 1 : 12 * 700;
  const yearlyPrice = isPaymentTest ? 1 : 6000;
  const yearlyDiscountPercentage =
    ((yearlyActualPrice - yearlyPrice) / yearlyActualPrice) * 100;

  const fiveYearActualPrice = isPaymentTest ? 1 : 60 * 700;
  const fiveYearPrice = isPaymentTest ? 1 : 14999;
  const fiveYearDiscountPercentage =
    ((fiveYearActualPrice - fiveYearPrice) / fiveYearActualPrice) * 100;

  return (
    <div className="container mx-auto p-2 lg:p-6 bg-gray-100 rounded-lg shadow-md mt-16">
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Monthly</h2>
            {planName === "monthly" && CheckIcon}
          </div>
          <div className="mb-8">
            <span className="text-2xl font-bold">₹{monthlyPrice}</span>
          </div>
          <FeatureList />
          <div className="self-end">
            <Paynow
              amount={monthlyPrice}
              planName={"monthly"}
              subscribed={planName === "monthly"}
            />
          </div>
        </div>

        {/* Yearly Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">Yearly</h2>
            {planName === "yearly" && CheckIcon}
          </div>
          <div className="mb-8">
            {!isPaymentTest && (
              <span className="text-lg text-gray-500 line-through">
                ₹{yearlyActualPrice}
              </span>
            )}
            <span className="text-2xl font-bold mx-2">₹{yearlyPrice}</span>
            {!isPaymentTest && (
              <span className="text-xs text-green-500 font-semibold">
                ({yearlyDiscountPercentage.toFixed(2)}% off)
              </span>
            )}
          </div>
          <FeatureList />
          <div className="self-end mt-4">
            <Paynow
              amount={yearlyPrice}
              planName={"yearly"}
              subscribed={planName === "yearly"}
            />
          </div>
        </div>

        {/* 5 Year Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start">
          <div className="self-end">
            {planName === "five_year" && CheckIcon}
          </div>
          <div>
            <h2 className="text-xl font-bold">5 years Plan</h2>
            <div className="mb-8">
              {!isPaymentTest && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{fiveYearActualPrice}
                </span>
              )}
              <span className="text-2xl font-bold mx-2">₹{fiveYearPrice}</span>
              {!isPaymentTest && (
                <span className="text-xs text-green-500 font-semibold">
                  ({fiveYearDiscountPercentage.toFixed(2)}% off)
                </span>
              )}
            </div>
            <FeatureList />
          </div>
          <div className="self-end mt-4">
            <Paynow
              amount={fiveYearPrice}
              planName={"five_year"}
              subscribed={planName === "five_year"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
