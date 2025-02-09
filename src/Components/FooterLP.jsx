import React from "react";
import { Link } from "react-router-dom";

const FooterLP = () => {
  return (
    <footer className="mt-56 p-1 text-center flex flex-col h-[80vh] justify-around  font-system-ui">
      <div className="hover:underline">
        <Link to={"/newsletter"}>JOIN THE NEWSLETTER</Link>
      </div>
      <nav>
        {["INSTAGRAM", "FACEBOOK", "X", "PINTEREST", "YOUTUBE", "SPOTIFY"].map(
          (platform) => (
            <a
              key={platform}
              href={`https://www.${
                platform.toLowerCase() === "x"
                  ? "twitter"
                  : platform.toLowerCase()
              }.com/${
                platform === "X"
                  ? "zara"
                  : platform === "YOUTUBE"
                  ? "user/ZARA"
                  : "zara"
              }`}
              className="md:mx-2 mx-1 lg:mx-3 text-[#333] text-xs hover:underline"
            >
              {platform}
            </a>
          )
        )}
      </nav>
      <div className="pb-10 flex justify-start text-left text-[9px] ml-7 md:ml-0">
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
