import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://static.zara.net/assets/public/96b3/0302/e44e4e019db2/65a192e9968c/image-landscape-web-60c40758-6e66-4050-a5e5-7a09d0374901-default_0/image-landscape-web-60c40758-6e66-4050-a5e5-7a09d0374901-default_0.jpg?ts=1737021733464&w=1263')",
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 text-center">
        <h1 className="text-5xl font-bold tracking-wide">404</h1>
        <p className="text-lg mt-2 uppercase">Page Not Found</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2 border border-white uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-all"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
