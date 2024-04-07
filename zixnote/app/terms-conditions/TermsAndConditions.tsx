import React from 'react';
import Link from 'next/link';

function TermsAndConditions() {
  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-28">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      <p className="text-lg mb-6">
        Welcome to our website! These Terms and Conditions govern your use of our website and services. By accessing
        or using our website, you agree to be bound by these Terms and Conditions.
      </p>
      <p className="text-lg mb-6">
        You must be at least 18 years old to use our website. By using our website, you represent and warrant that
        you are at least 18 years old and have the legal capacity to enter into a binding contract.
      </p>
      <p className="text-lg mb-6">
        Our website reserves the right to modify or terminate our services or your access to our website at any time,
        for any reason, without notice. We may also change or update these Terms and Conditions from time to time without
        notice. It is your responsibility to review these Terms and Conditions periodically for any changes.
      </p>
      <p className="text-lg mb-6">
        You agree to indemnify and hold harmless our website and its affiliates, officers, agents, and employees from
        any claim or demand arising out of your use of our website or violation of these Terms and Conditions. This
        includes, but is not limited to, any third-party claims arising from your use of our website or your violation
        of any law or rights of a third party.
      </p>
      <h2 className="text-2xl font-bold mb-4">Refund and Cancellation</h2>
      <p className="text-lg mb-6">
        We understand that circumstances may arise where you need to cancel or refund your order. Please review our
        Refund and Cancellation Policy for details on how to proceed in such cases. For specific information regarding
        the refund or cancellation policy for a product or service you purchase, kindly refer to the information provided
        when making your purchase, as it may vary depending on the subscription or product you select.
      </p>
      <p className="text-lg">
        If you have any questions or concerns about our Terms and Conditions, please feel free to{' '}
        <Link href="/contact" className="text-cyan-500">contact us</Link>. Thank you for using our website!
      </p>
    </div>
  );
}

export default TermsAndConditions;
