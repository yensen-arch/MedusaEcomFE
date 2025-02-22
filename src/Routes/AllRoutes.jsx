import LogIn from "../Routes/LogIn";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Help from "../Components/Help";
import SignIn from "../Routes/SignIn";
import Homepage from "./Homepage";
import AboutUs from "./AboutUs";
import Careers from "./Careers";
import NewsLetter from "./NewsLetter";
import ItemsAvailabilityHelp from "./ItemsAvailabilityHelp";
import GiftCardHelp from "./GiftCardHelp";
import ShippingHelp from "./ShippingHelp";
import PaymentInvoiceHelp from "./PaymentInvoiceHelp";
import ExchangesHelp from "./ExchangesHelp";
import ClothdExperiencesHelp from "./ClothdExperiencesHelp";
import Privacy from "./Privacy";
import NotFound from "./NotFound";
import MyOrdersHelp from "./MyOrdersHelp";
import SearchHome from "./SearchHome";
import Products from "./Products";
import CategoryPage from "./CategoryPage";
import Account from "./Account";
import Checkout from "./Checkout";
import Mission from "./Mission";
import Donations from "./Donations";
import ResetPass from "./ResetPass";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />}></Route>
      <Route path="about" element={<AboutUs />}></Route>
      <Route path="/mission" element={<Mission />}></Route>
      <Route path="/help" element={<Help />}></Route>
      <Route path="newsletter" element={<NewsLetter />}></Route>
      <Route path="/login" element={<LogIn />} />
      <Route path="/account" element={<Account />}></Route>
      <Route path="/checkout" element={<Checkout />}></Route>
      <Route path="/donations" element={<Donations />}></Route>
      <Route path="/reset-password" element={<ResetPass />}></Route>

      <Route
        path="/help/items-and-sizes"
        element={<ItemsAvailabilityHelp />}
      ></Route>
      <Route path="/help/gift-card" element={<GiftCardHelp />}></Route>
      <Route path="/help/myorders" element={<MyOrdersHelp />}></Route>
      <Route path="/help/shipping" element={<ShippingHelp />}></Route>
      <Route
        path="/help/payment-invoice"
        element={<PaymentInvoiceHelp />}
      ></Route>
      <Route
        path="/help/Clothd-experiences"
        element={<ClothdExperiencesHelp />}
      ></Route>
      <Route path="/help/exchanges" element={<ExchangesHelp />}></Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/search/home" element={<SearchHome />}></Route>
      <Route path="career" element={<Careers />}></Route>
      <Route path="/privacy" element={<Privacy />}></Route>
      <Route path="products/:productId" element={<Products />} />
      <Route path="category/:categoryId" element={<CategoryPage />} />
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
};

export default AllRoutes;
