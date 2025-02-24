import { Link } from "react-router-dom";
import CustomLoader from "../CustomLoader";
import { useMutation } from "@apollo/client";
import { CHECKOUT_LINES_UPDATE } from "../../graphql/queries";

const CartTab = ({ cartData, cartLoading, cartError }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const checkoutId = typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  const [updateCheckoutLines, { loading: updateLoading }] = useMutation(
    CHECKOUT_LINES_UPDATE, {
      update(cache, { data: { checkoutLinesUpdate } }) {
        // Update the cache with new totals after quantity change
        cache.modify({
          id: cache.identify({ __typename: 'Checkout', id: checkoutId }),
          fields: {
            totalPrice: () => checkoutLinesUpdate.checkout.totalPrice
          }
        });
      }
    }
  );

  const handleQuantityChange = async (variantId, quantity) => {
    if (quantity < 1) {
      quantity = 0;
    }
    try {
      await updateCheckoutLines({
        variables: {
          checkoutId,
          lines: [{ variantId, quantity }],
        },
        context: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      });
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  return (
    <div className="relative h-[32rem] flex flex-col">
      <div className="flex-1 space-y-4  overflow-y-auto">
        {cartLoading || updateLoading ? (
          <div className="flex justify-center">
            <CustomLoader />
          </div>
        ) : cartError ? (
          <p className="text-xs uppercase text-center text-red-500">
            Error loading cart
          </p>
        ) : cartData?.checkout?.lines?.length > 0 ? (
          <ul className="space-y-4">
            {cartData.checkout.lines.map((item) => (
              <li key={item.id} className="text-sm border-b px-2 border-black pb-2">
                <div className="flex justify-between items-center ">
                  <img
                    src={item.variant.product.thumbnail.url}
                    alt={item.variant.product.thumbnail.alt || "Product Image"}
                    className="w-16 h-16 object-cover border border-black"
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
                    <div className="flex items-center gap-2 text-xs uppercase">
                      <span>Quantity:</span>
                      <button
                        className="px-2 hover:opacity-70"
                        onClick={() =>
                          handleQuantityChange(item.variant.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 hover:opacity-70"
                        onClick={() =>
                          handleQuantityChange(item.variant.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p>${item.variant.pricing.price.gross.amount}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-center">NO ITEMS IN CART</p>
        )}
      </div>
      
      {cartData?.checkout?.lines?.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-black">
          <p className="text-xs font-medium flex justify-between p-4">
            <span>TOTAL:</span>
            <span>${cartData.checkout.totalPrice.gross.amount}</span>
          </p>
          <Link
            to="/checkout"
            className="block text-xs text-center bg-black text-white border border-black py-2 hover:bg-white hover:text-black transition-all"
          >
             CONFIRM CHECKOUT
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartTab;