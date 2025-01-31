import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../Components/Footer";

const LogIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state?.path;
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <>
      <div className="h-60"></div>
      <div className="w-4/5 mx-auto text-xs">
        <div className="w-full flex justify-between items-start">
          <div className="w-full md:w-1/2 lg:w-2/5 pr-8">
            <h2 className="text-lg font-bold mb-4">LOG IN</h2>
            <form action="" className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1">
                  E-MAIL
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-black pb-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-black pb-1"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-black text-white px-16 py-2 text-base cursor-pointer hover:bg-slate-600"
              >
                LOG IN
              </button>
            </form>

            <div className="mt-8">
              <button
                onClick={() => navigate("/signin")}
                className="w-full bg-white text-black px-4 py-2 text-base cursor-pointer border border-black hover:bg-slate-100"
              >
                REGISTER
              </button>
            </div>
          </div>
          <div className="hidden md:block w-full lg:w-3/5 h-full">
            <img
              src="https://static.zara.net/assets/public/db26/41d6/33aa45648676/89e13512dc01/image-landscape-db634aec-f379-4adf-972a-f0a121c0e167-default_0/image-landscape-db634aec-f379-4adf-972a-f0a121c0e167-default_0.jpg?ts=1728999719440&w=665"
              alt="Zara fashion"
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
