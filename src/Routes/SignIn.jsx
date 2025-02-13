import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Footer from "../Components/Footer";
import { REGISTER_MUTATION } from "../graphql/queries";

const SignIn = () => {
  const [data, setData] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
    subscribe: false,
    termsAccepted: false,
  });

  const isFormValid =
  data.email.trim() &&
  data.password.trim() &&
  data.name.trim() &&
  data.phone.trim() &&
  data.termsAccepted;

  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.termsAccepted) return;

    try {
      const response = await registerUser({
        variables: {
          email: data.email,
          password: data.password,
          firstName: data.name,
          metadata: [
            { key: "phone", value: data.phone },
            { key: "subscribe_to_updates", value: data.subscribe.toString() },
          ],
          redirectUrl: window.location.origin, // Fix for redirectUrl error
        },
      });

      if (response.data.accountRegister.accountErrors.length === 0) {
        setSuccessMessage("Registered successfully!");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error("Registration Error:", err);
    }
  };

  return (
    <>
      {successMessage && (
        <p className="text-green-600 text-center text-lg my-4">
          {successMessage}
        </p>
      )}
      <div className="mt-60 flex mx-auto w-4/5 gap-10">
        <div className="w-3/5">
          <h3 className="text-left mb-8 text-xl">PERSONAL DETAILS</h3>
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
                placeholder: "Enter Password",
              },
              {
                label: "NAME",
                type: "text",
                key: "name",
                placeholder: "Enter Name",
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

            <div className="flex py-4">
              <div className="w-24 text-xs">
                <label className="block text-xs mb-1">PREFIX</label>
                <input
                  type="text"
                  placeholder="+123"
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full outline-none text-xs py-1"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1">TELEPHONE</label>
                <input
                  type="text"
                  placeholder="TELEPHONE"
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full border-b border-gray-300 focus:border-black outline-none text-xs py-1"
                />
              </div>
            </div>

            <div className="mt-8 space-y-2 text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={data.subscribe}
                  onChange={(e) =>
                    setData({ ...data, subscribe: e.target.checked })
                  }
                />
                <label>I WISH TO RECEIVE CLOTHD. NEWS</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={data.termsAccepted}
                  onChange={(e) =>
                    setData({ ...data, termsAccepted: e.target.checked })
                  }
                  required
                />
                <label>I ACCEPT THE PRIVACY STATEMENT</label>
              </div>
            </div>

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
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
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
