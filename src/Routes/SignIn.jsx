import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Footer from "../Components/Footer";
import { REGISTER_MUTATION } from "../graphql/queries";

const SignIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const isFormValid =
    data.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    data.password.trim().length >= 8;
  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            channel: "default-channel",
          },
        },
      });

      if (response.data?.accountRegister?.errors?.length > 0) {
        const error = response.data.accountRegister.errors[0];
        setErrorMessage(`Error in ${error.field}: ${error.code}`);
      } else if (response.data?.accountRegister?.user) {
        const user = response.data.accountRegister.user;
        setSuccessMessage("Account created successfully!");

        if (!user.isConfirmed) {
          setSuccessMessage(
            "Account created! Please check your email to confirm your account."
          );
        }

        setTimeout(() => navigate("/"), 4000);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {successMessage && (
        <p className="text-green-600 text-center text-lg mt-28">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center text-lg mt-28">{errorMessage}</p>
      )}

      <div className="mt-60 flex mx-auto w-4/5 gap-10">
        <div className="w-3/5">
          <h3 className="text-left mb-8 text-xl">CREATE ACCOUNT</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                label: "E-MAIL",
                type: "email",
                key: "email",
                placeholder: "Enter Email",
              },
              {
                label: "PASSWORD",
                type: "password",
                key: "password",
                placeholder: "Minimum Length of 8 Characters",
              },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs mb-1">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={data[field.key]}
                  onChange={(e) =>
                    setData({ ...data, [field.key]: e.target.value })
                  }
                  className="w-full border-b border-gray-300 focus:border-black outline-none text-xs py-1"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`py-2 px-32 mt-8 text-sm border transition duration-300 ${
                isFormValid
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating Account..." : "CREATE ACCOUNT"}
            </button>

            {error && (
              <p className="text-red-500 text-xs mt-2">{error.message}</p>
            )}
          </form>
        </div>

        <div className="hidden md:block w-full lg:w-2/5 h-full">
          <video
            src="https://res.cloudinary.com/dmjhto8sd/video/upload/v1739850601/B444A4EE-6BBA-437C-947E-155D4BE435FD_xrt6pf.mov"
            autoPlay
            muted
            playsInline
            loop
            className="w-max object-fill"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
