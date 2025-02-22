// components/account/CartTab.jsx
import { Link } from "react-router-dom";
import CustomLoader from "../CustomLoader";

const CartTab = ({ cartData, cartLoading, cartError }) => {
  return (
    <div className="space-y-4 ">
      {cartLoading ? (
        <p className="text-sm text-center">
          <CustomLoader />
        </p>
      ) : cartError ? (
        <p className="text-xs uppercase text-center text-red-500">
          Error loading cart
        </p>
      ) : cartData?.checkout?.lines?.length > 0 ? (
        <ul className="space-y-4">
          {cartData.checkout.lines.map((item) => (
            <li key={item.id} className="text-sm border-b pb-2">
              <div className="flex justify-between items-center">
                <img
                  src={item.variant.product.thumbnail.url}
                  alt={item.variant.product.thumbnail.alt || "Product Image"}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <p className="font-medium uppercase">
                    {item.variant.product.name}
                  </p>
                  <p className="text-gray-600 text-xs uppercase">
                    Category: {item.variant.product.category.name}
                  </p>
                  <p className="text-gray-600 text-xs uppercase">
                    Size: {item.variant.name}
                  </p>
                  <p className="text-gray-600 text-xs uppercase">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p>${item.variant.pricing.price.gross.amount}</p>
                </div>
              </div>
            </li>
          ))}
          <div className="pt-4 border-t">
            <p className="text-xs font-medium flex justify-between">
              <span>TOTAL:</span>
              <span>${cartData.checkout.totalPrice.gross.amount}</span>
            </p>
          </div>
        </ul>
      ) : (
        <p className="text-xs text-center">NO ITEMS IN CART</p>
      )}
      {cartData?.checkout?.lines?.length > 0 && (
        <Link
          to="/checkout"
          className="block text-center bg-black text-white border border-black py-2 hover:bg-white hover:text-black transition-all"
        >
          CHECKOUT
        </Link>
      )}
    </div>
  );
};

export default CartTab;
