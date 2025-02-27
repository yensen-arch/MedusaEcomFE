import React from "react";
import { Link } from "react-router-dom";

const FooterLP = () => {
  return (
    <footer className=" p-1 text-center flex flex-col h-[80vh] justify-around">
      <div className="hover:underline">
        <Link to={"/newsletter"}>JOIN THE NEWSLETTER</Link>
      </div>
      <nav>
        {["INSTAGRAM", "TIKTOK"].map((platform) => (
          <a
            key={platform}
            href={`${
              platform === "INSTAGRAM"
                ? "https://www.instagram.com/clothd.co/"
                : "https://tiktok.com/@clothd"
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="md:mx-2 mx-1 lg:mx-3 text-[#333] text-xs hover:underline"
          >
            {platform}
          </a>
        ))}
      </nav>
      <div className="pb-44 flex justify-start text-left text-[9px] ml-7 md:ml-0">
        <div>
          <div>NAME AND ADDRESS OF THE MANUFACTURER :</div>
          <div>INDUSTRIA DE DISEÑO TEXTIL, S.A. (INDITEX, S.A.)</div>
          <div>
            AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A
            CORUÑA), SPAIN
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLP;
