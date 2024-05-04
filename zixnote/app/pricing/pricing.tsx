import { getUserAndRole } from "@/utils/getUserAndRole";
import { IconDiscountCheckFilled } from "@tabler/icons-react";
import { FeatureList } from "./FeatureList";
import { getSubscriptionServer } from "./getSubscriptionServer";
import Paynow from "./paynow";

const CheckIcon = (
  <IconDiscountCheckFilled  size={36} stroke={1}  />
);

async function Pricing() {
  const user = await getUserAndRole();
  const subscription = user.user && (await getSubscriptionServer(user.user.id));
  const planName =
    subscription && subscription.length !== 0 && subscription[0].plan_name;
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
    <div className="container mx-auto p-2 lg:p-6 bg-gray-100 rounded-lg shadow-md mt-16">
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>
      {/* {user.user?.id}
      {JSON.stringify(subscription)} */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start ">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Monthly</h2>
            {planName && planName === "monthly" && CheckIcon}
          </div>
          {/* <div> */}

          <div className="mb-8">
            <span className="text-2xl font-bold">₹{monthlyPrice}</span>
          </div>
          <FeatureList />
          {/* </div> */}
          <div className=" self-end">
            <Paynow
              amount={monthlyPrice}
              planName={"monthly"}
              subscribed={planName && planName === "monthly" ? true : false}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">Yearly</h2>
            {planName && planName === "yearly" && CheckIcon}
          </div>
          <div>
            <div className="mb-8">
              <span className="text-lg text-gray-500 line-through">
                ₹{yearlyActualPrice}
              </span>
              <span className="text-2xl font-bold mx-2">₹{yearlyPrice}</span>
              <span className="text-xs text-green-500 mb-6 font-semibold">
                ({yearlyDiscountPercentage.toFixed(2)}% off)
              </span>
            </div>
            <FeatureList />
          </div>
          <div className="self-end mt-4">
            <Paynow
              amount={yearlyPrice}
              planName={"yearly"}
              subscribed={planName && planName === "yearly" ? true : false}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-start">
          <div className="self-end">
            {planName && planName === "five_year" && CheckIcon}
          </div>
          <div>
            <h2 className="text-xl font-bold ">5 years Plan</h2>
            <div className="pb-8">
              <span className="text-lg text-gray-500 line-through">
                ₹{fiveYearActualPrice}
              </span>
              <span className="text-2xl font-bold mx-2">₹{fiveYearPrice}</span>
              <span className="text-xs text-green-500 mb-6 font-semibold">
                ({fiveYearDiscountPercentage.toFixed(2)}% off)
              </span>
            </div>
            <FeatureList />
          </div>
          <div className="self-end mt-4">
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
