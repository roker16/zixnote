import Link from 'next/link';
import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-28">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-lg mb-6">
        This Privacy Policy explains how our website collects, uses, and protects your personal information.
        We are committed to ensuring the privacy and security of your information.
      </p>
      <p className="text-lg mb-6">
        When you register for an account or subscribe to our newsletter, we may collect personal information
        such as your name, email address, and contact details. Please note that we do not share this information
        with third parties under any circumstances.
      </p>
      <p className="text-lg mb-6">
        Your personal information is used solely to provide you with the services you request, such as processing
        orders and sending you updates about our products and promotions. We do not use your information for any
        other purpose without your explicit consent.
      </p>
      <p className="text-lg mb-6">
        We take appropriate security measures to protect your personal information from unauthorized access,
        disclosure, alteration, or destruction. Our website is regularly monitored and updated to ensure
        compliance with industry standards for data security.
      </p>
      <p className="text-lg">
        By using our website, you consent to the collection and use of your personal information as described
        in this Privacy Policy. If you have any questions or concerns about our Privacy Policy, please feel free
        to <Link href={'/contact'} className='text-cyan-500'>contact</Link> us.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
