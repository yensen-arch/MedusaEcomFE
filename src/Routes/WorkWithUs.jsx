import React from "react";
import Footer from "../Components/Footer";

const WorkWithUs = () => {
  return (
    <>
      <div className="mt-28 h-screen mx-auto p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase">Work With Us</h2>
        <p className="text-xs uppercase">
          At Clothd, we're always looking for passionate individuals who share our 
          vision for sustainable fashion and community impact. Our team members are 
          creative, driven, and committed to making a difference.
          <br />
          <br />
          We offer opportunities across various departments including:
          <br />
          - Design & Product Development
          <br />
          - Retail & Customer Experience
          <br />
          - Sustainability & Community Outreach
          <br />
          - Technology & Digital Innovation
          <br />
          <br />
          Join us in our mission to transform fashion while making a positive impact 
          on our community.
          <br />
          Reach us at: relations@clothd.co
        </p>
      </div>
      <Footer />
    </>
  );
};

export default WorkWithUs;