import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const REQUEST_RESET_PASSWORD = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        field
        message
      }
    }
  }
`;

const AccountTab = ({ userData }) => {
  const [requestReset] = useMutation(REQUEST_RESET_PASSWORD);
  const [status, setStatus] = useState("");

  const handleReset = async () => {
    try {
      const { data } = await requestReset({
        variables: {
          email: userData?.email,
          redirectUrl: "https://clothd.co/reset-password",
        },
      });
      if (data.requestPasswordReset.errors.length) {
        setStatus("Error sending reset link.");
      } else {
        setStatus("Reset link sent to your email.");
      }
    } catch {
      setStatus("Failed to send reset link.");
    }
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h2 className="text-center text-sm">PERSONAL INFO</h2>
        <div className="text-center">
          <p className="text-xs text-black">Email: {userData?.email}</p>
        </div>
      </section>
      <button onClick={handleReset} className="w-full border text-white bg-black text-sm border-black py-3 hover:bg-white hover:text-black transition-colors">
        CHANGE PASSWORD
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default AccountTab;
