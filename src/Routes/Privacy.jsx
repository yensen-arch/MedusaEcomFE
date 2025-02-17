import React from "react";
import Footer from "../Components/Footer";

function Privacy() {
  return (
    <div className="mt-28 px-6  mx-auto text-gray-800">
      <div>
        <h1 className="text-lg font-bold mb-4 uppercase">PRIVACY POLICY</h1>
        <p className="text-xs mb-4">
          YOUR PRIVACY IS IMPORTANT TO US. THIS PRIVACY POLICY EXPLAINS HOW WE
          COLLECT, USE, AND PROTECT YOUR INFORMATION.
        </p>

        <h2 className="text-sm font-semibold mb-2 uppercase">
          INFORMATION WE COLLECT
        </h2>
        <p className="text-xs mb-4">
          WE MAY COLLECT PERSONAL INFORMATION THAT YOU PROVIDE TO US, SUCH AS
          YOUR NAME, EMAIL ADDRESS, AND PHONE NUMBER. WE ALSO COLLECT
          NON-PERSONAL INFORMATION LIKE BROWSER TYPE AND IP ADDRESS TO IMPROVE
          OUR SERVICES.
        </p>

        <h2 className="text-sm font-semibold mb-2 uppercase">
          HOW WE USE YOUR INFORMATION
        </h2>
        <ul className="list-disc pl-5 text-xs mb-4">
          <li>TO PROVIDE AND IMPROVE OUR SERVICES</li>
          <li>TO PERSONALIZE YOUR EXPERIENCE</li>
          <li>TO COMMUNICATE WITH YOU ABOUT UPDATES AND OFFERS</li>
          <li>TO ENSURE THE SECURITY OF OUR PLATFORM</li>
        </ul>

        <h2 className="text-sm font-semibold mb-2 uppercase">
          SHARING YOUR INFORMATION
        </h2>
        <p className="text-xs mb-4">
          WE DO NOT SELL, TRADE, OR RENT YOUR PERSONAL INFORMATION TO THIRD
          PARTIES. WE MAY SHARE YOUR INFORMATION WITH TRUSTED PARTNERS TO
          PROVIDE SERVICES ON OUR BEHALF, BUT ONLY UNDER STRICT CONFIDENTIALITY
          AGREEMENTS.
        </p>

        <h2 className="text-sm font-semibold mb-2 uppercase">YOUR CHOICES</h2>
        <p className="text-xs mb-4">
          YOU HAVE THE RIGHT TO ACCESS, UPDATE, OR DELETE YOUR PERSONAL
          INFORMATION. IF YOU WISH TO EXERCISE THESE RIGHTS, PLEASE CONTACT US.
        </p>

        <h2 className="text-sm font-semibold mb-2 uppercase">DATA SECURITY</h2>
        <p className="text-xs mb-4">
          WE IMPLEMENT APPROPRIATE TECHNICAL AND ORGANIZATIONAL MEASURES TO
          PROTECT YOUR INFORMATION AGAINST UNAUTHORIZED ACCESS, ALTERATION,
          DISCLOSURE, OR DESTRUCTION.
        </p>

        <h2 className="text-sm font-semibold mb-2 uppercase">
          CHANGES TO THIS POLICY
        </h2>
        <p className="text-xs mb-4">
          WE RESERVE THE RIGHT TO UPDATE THIS PRIVACY POLICY AT ANY TIME. WE
          WILL NOTIFY YOU OF ANY SIGNIFICANT CHANGES BY POSTING THE NEW POLICY
          ON THIS PAGE.
        </p>

        <h2 className="text-sm font-semibold mb-2 uppercase">CONTACT US</h2>
        <p className="text-xs">
          IF YOU HAVE ANY QUESTIONS OR CONCERNS ABOUT THIS PRIVACY POLICY,
          PLEASE CONTACT US AT:{" "}
          <a
            href="mailto:clothd@example.com"
            className="underline"
          >
            CLOTHD@CONNECT.COM
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Privacy;
