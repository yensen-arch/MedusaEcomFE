// components/account/OrdersTab.jsx
import { Link } from "react-router-dom";

const OrdersTab = () => {
  return (
    <div className="flex flex-col items-center justify-center h-80 space-y-6">
      <h2 className="text-xs">NO ORDERS YET</h2>
      <Link
        to="/search/home"
        className="border text-xs text-white bg-black border-black py-3 px-6 hover:bg-white hover:text-black transition-colors"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
};

export default OrdersTab;