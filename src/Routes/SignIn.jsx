import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Footer from "../Components/Footer";
import { REGISTER_MUTATION } from "../graphql/queries";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const isFormValid =
    data.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    data.password.trim().length >= 8;

  const [showPassword, setShowPassword] = useState(false);
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
        setSuccessMessage("ACCOUNT CREATED");
        if (!user.isConfirmed) {
          setSuccessMessage("ACCOUNT CREATED");
        }
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="text-xs">
        <div className="w-full md:w-3/5 mx-auto h-screen mt-60 flex justify-between items-start">
          <div className="w-full md:w-3/5 lg:w-2/5">
            <div className="mx-auto flex flex-col items-center justify-start">
              <h3 className="text-sm mb-8">CREATE ACCOUNT</h3>
              {successMessage && (
                <p className="text-green-600 text-center text-sm mb-4">
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="text-red-600 text-center text-sm mb-4">
                  {errorMessage}
                </p>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                {/* Email Input */}
                <div>
                  <label className="block text-xs mb-1">E-MAIL</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full border-b border-black outline-none text-xs py-1 bg-white"
                    required
                  />
                </div>

                {/* Password Input with Toggle */}
                <div className="relative">
                  <label className="block text-xs mb-1">PASSWORD</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum Length of 8 Characters"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className="w-full border-b border-black outline-none text-xs py-1 bg-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-2 mt-8 text-xs border transition duration-300 ${
                    isFormValid
                      ? "bg-black text-white hover:bg-white hover:text-black border-black"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? "CREATING..." : "CREATE ACCOUNT"}
                </button>

                {error && (
                  <p className="text-red-500 text-xs mt-2">{error.message}</p>
                )}
              </form>
            </div>
          </div>

          <div className="absolute top-40 right-60 hidden md:block w-full lg:w-1/5 h-full">
            <video
              src="https://res.cloudinary.com/dmjhto8sd/video/upload/v1739850601/B444A4EE-6BBA-437C-947E-155D4BE435FD_xrt6pf.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-max object-fill"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;