import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { LOGIN_MUTATION } from "../graphql/queries";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state?.path || "/";
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({ email: "", password: "" });

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (response) => {
      const { token, refreshToken, accountErrors } = response.tokenCreate;
      if (accountErrors.length > 0) {
        setErrorMessage(accountErrors[0].message);
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        navigate(path);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    await login({ variables: { email: data.email, password: data.password } });
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const isFormValid =
    data.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    data.password.trim().length >= 8;

  return (
    <>
      <div className="text-xs">
        <div className="w-3/5 mx-auto h-screen mt-60 flex justify-between items-start">
          <div className="w-full md:w-3/5 lg:w-2/5 pr-8">
            <h2 className="text-sm mb-8">LOG IN</h2>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-1">
                  E-MAIL
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full  border-b border-black focus:outline-none focus:border-black pb-1"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="w-full border-b border-black focus:outline-none focus:border-black pb-1 pr-10"
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
                className={`w-full px-16 py-2 text-xs cursor-pointer transition ${
                  isFormValid && !loading
                    ? "bg-black text-white hover:bg-slate-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {loading ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>

            <div className="mt-4">
              <button
                onClick={() => navigate("/signin")}
                className="w-full bg-white text-black px-4 py-2 text-xs cursor-pointer border border-black hover:bg-black hover:text-white"
              >
                REGISTER
              </button>
            </div>
          </div>
          <div className="absolute top-40 right-60  hidden md:block w-full lg:w-1/5 h-full">
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

export default LogIn;
