import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const SignIn = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
  });

  const onclickhandler = (e) => {
    console.log(data);
  };

  return (
    <>
      <div className="mt-60 flex mx-auto w-4/5 gap-10">
        <div className="w-3/5">
          <h3 className="text-left mb-8 text-xl ">PERSONAL DETAILS</h3>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-3/4">
              <form className="space-y-4">
                {[
                  {
                    label: "E-MAIL",
                    type: "email",
                    placeholder: "Enter Email",
                    onChange: (e) => setData({ ...data, email: e.target.value }),
                  },
                  {
                    label: "PASSWORD",
                    type: "password",
                    placeholder: "Enter Password",
                    onChange: (e) =>
                      setData({ ...data, password: e.target.value }),
                  },
                  {
                    label: "NAME",
                    type: "text",
                    placeholder: "NAME",
                    onChange: (e) => setData({ ...data, name: e.target.value }),
                  },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-xs mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      onChange={field.onChange}
                      className="w-full border-b border-gray-300 focus:border-black outline-none text-xs py-1"
                      required
                    />
                  </div>
                ))}
              </form>
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
            </div>
          </div>
          <div className="mt-8">
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>I WISH TO RECEIVE ZARA NEWS ON MY E-MAIL</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>I ACCEPT THE PRIVACY STATEMENT</label>
              </div>
            </div>
            <button
              type="submit"
              onClick={onclickhandler}
              className="bg-white text-black py-2 px-32 mt-8 text-sm hover:bg-gray-100 border-black border transition duration-300"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
        <div className="hidden md:block w-full lg:w-2/5 h-full">
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
      <Footer />
    </>
  );
};

export default SignIn;
