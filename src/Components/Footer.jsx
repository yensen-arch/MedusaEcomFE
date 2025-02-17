import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footer = () => {
  return (
    <Container className="footer">
      <div className="hidden md:flex flex-start gap-5">
        <div className="footer_rows">
          <h4 className="font-bold">HELP</h4>
          <div>
            <Link to={"/help/"}>MY Clothd ACCOUNT</Link>
          </div>

          <div>
            <Link to={"/help/items-and-sizes"}>ITEMS AND SIZES</Link>
          </div>
          <div>
            <Link to={"/help/gift-card"}>GIFT OPTIONS</Link>
          </div>
          <div>
            <Link to={"/help/payment-invoice"}>PAYMENTS AND INVOICES</Link>
          </div>
          <div>
            <Link to={"/help/shipping"}>SHIPPING</Link>
          </div>
          <div>
            <Link to={"/help/myOrders"}>MY PURCHASES</Link>
          </div>
          <div>
            <Link to={"/help/exchanges"}>EXCHANGES, RETURNS AND REFUNDS</Link>
          </div>
        </div>
        <div className="footer_rows">
          <h4 className="font-bold">FOLLOW US</h4>
          <div>
            <Link to={"/newsletter"}>NEWSLETTER</Link>
          </div>
          {/* REPLACE WITH YOUR ACCOUNTS*/}
          <div><a href="https://www.instagram.com/Clothd">INSTAGRAM</a></div>
          <div><a href="https://www.facebook.com/Clothd">FACEBOOK</a></div>
          <div><a href="https://www.x.com/Clothd">X</a></div>
          <div><a href="http://pinterest.com/Clothdofficial/">PINTEREST</a></div>
          <div><a href="https://www.youtube.com/@Clothd">YOUTUBE</a></div>
        </div>
        <div className="footer_rows">
          <h4 className="font-bold">COMPANY</h4>
          <div>
            <Link to={"/about"}>ABOUT US</Link>
          </div>
          <div>JOIN LIFE</div>
          <div>
            <Link to={"/career"}>WORK WITH US</Link>
          </div>
        </div>
        <div className="footer_rows">
          <h4 className="font-bold">POLICIES</h4>
          <div>
            <Link to={"/privacy"}>PRIVACY POLICY</Link>
          </div>
          <div>PURCHASE CONDITIONS</div>
          <div>GIFT CARD CONDITIONS</div>
        </div>
      </div>

      <div className="mt-40 md:flex flex-start text-[9px]">
        <div>
          <div>NAME AND ADDRESS OF THE MANUFACTURER :</div>
          <div>INDUSTRIA DE DISEÑO TEXTIL, S.A. (INDITEX, S.A.)</div>
          <div>
            AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A
            CORUÑA), SPAIN
          </div>
        </div>
      </div>
    </Container>
  );
};
const Container = styled.div`
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  font-size: 11px;
  margin: 8rem auto 4rem auto;
  line-height: 20px;
  .footer_display {
    display: flex;
    align-items: flex-start;
    gap: 5rem;
  }

  .english_cookies_setting {
    display: flex;
    gap: 20px;
  }

  .footer_bottom {
    display: flex;
    justify-content: flex-start;
    font-size: 9px;
  }

  .footer_rows {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export default Footer;
