import React from "react";
import Footer from "../Components/Footer";
function Privacy() {
  return (
    <div className="mt-60 ">
      <div className>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-4">
          Your privacy is important to us. This privacy policy explains how we
          collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Information We Collect
        </h2>
        <p className="text-gray-600 mb-4">
          We may collect personal information that you provide to us, such as
          your name, email address, and phone number. We also collect
          non-personal information like browser type and IP address to improve
          our services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-5 text-gray-600 mb-4">
          <li>To provide and improve our services</li>
          <li>To personalize your experience</li>
          <li>To communicate with you about updates and offers</li>
          <li>To ensure the security of our platform</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Sharing Your Information
        </h2>
        <p className="text-gray-600 mb-4">
          We do not sell, trade, or rent your personal information to third
          parties. We may share your information with trusted partners to
          provide services on our behalf, but only under strict confidentiality
          agreements.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Your Choices
        </h2>
        <p className="text-gray-600 mb-4">
          You have the right to access, update, or delete your personal
          information. If you wish to exercise these rights, please contact us.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Data Security
        </h2>
        <p className="text-gray-600 mb-4">
          We implement appropriate technical and organizational measures to
          protect your information against unauthorized access, alteration,
          disclosure, or destruction.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Changes to This Policy
        </h2>
        <p className="text-gray-600 mb-4">
          We reserve the right to update this privacy policy at any time. We
          will notify you of any significant changes by posting the new policy
          on this page.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions or concerns about this privacy policy,
          please contact us at:{" "}
          <a
            href="mailto:clothd@example.com"
            className="text-blue-600 hover:underline"
          >
            clothd@connect.com
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Privacy;
