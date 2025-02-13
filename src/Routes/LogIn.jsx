import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
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
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

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
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              alt="Zara fashion"
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
