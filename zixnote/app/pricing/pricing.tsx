import React from "react";

function Pricing() {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">Monthly</h2>
            <p className="text-gray-600 mb-4">All Fetaures included.</p>
            <p className="text-gray-600 mb-4">
              All future updates shall be provied without any additinal
              charges.
            </p>
            <p className="text-gray-600 mb-4">No hidded charges.</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold">₹{monthlyPrice}</span>
            </div>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-cyan-600 focus:outline-none border-none">
              Select
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">Yearly</h2>
            <p className="text-gray-600 mb-4">All Fetaures included.</p>
            <p className="text-gray-600 mb-4">
              All future updates shall be provied without any additinal
              charges.
            </p>
            <p className="text-gray-600 mb-4">No hidded charges.</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-lg text-gray-500 line-through mr-2">
                ₹{yearlyActualPrice}
              </span>
              <span className="text-2xl font-bold">₹{yearlyPrice}</span>
              <span className="text-sm text-green-500 ml-2">
                ({yearlyDiscountPercentage.toFixed(2)}% off)
              </span>
            </div>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-cyan-600 focus:outline-none border-none">
              Select
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">5 years Plan</h2>
            <p className="text-gray-600 mb-4">All Fetaures included.</p>
            <p className="text-gray-600 mb-4">
              All future updates shall be provied without any additinal
              charges.
            </p>
            <p className="text-gray-600 mb-4">No hidded charges.</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-lg text-gray-500 line-through mr-2">
                ₹{fiveYearActualPrice}
              </span>
              <span className="text-2xl font-bold">₹{fiveYearPrice}</span>
              <span className="text-sm text-green-500 ml-2">
                ({fiveYearDiscountPercentage.toFixed(2)}% off)
              </span>
            </div>
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-cyan-600 focus:outline-none border-none">
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
