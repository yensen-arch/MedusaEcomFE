import React, { useState } from "react";
import Footer from "../Components/Footer";

const AboutUs = () => {
  return (
    <>
      <div className="mt-28 h-screen mx-auto p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase">Our Mission</h2>
        <p className="text-xs  uppercase">
          At Clothd, we aim to foster a community by supplying sustainable,
          high-quality clothing and cultivating change for the less fortunate
          with a donation from each sale.
          <br />
          <br />
        </p>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
