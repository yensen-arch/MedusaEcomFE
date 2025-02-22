import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import CustomLoader from "../CustomLoader";
import { GET_CUSTOMER_ORDERS } from "../../graphql/queries";

const OrdersTab = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data, loading, error } = useQuery(GET_CUSTOMER_ORDERS, {
    context: {
      headers: { Authorization: `JWT ${token}` },
    },
    skip: !token,
  });

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  if (error) return <p>Error fetching orders.</p>;

  const orders = data?.me?.orders?.edges || [];

  return (
    <div className="flex flex-col items-center justify-center h-80 space-y-6">
      {orders.length === 0 ? (
        <>
          <h2 className="text-xs">NO ORDERS YET</h2>
          <Link
            to="/search/home"
            className="border text-xs text-white bg-black border-black py-3 px-6 hover:bg-white hover:text-black transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </>
      ) : (
        <div className="w-full space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80">
          {orders.map(({ node }) => (
            <div
              key={node.id}
              className="border border-gray-300 p-4 rounded shadow-sm"
            >
              <h3 className="text-sm font-bold">Order #{node.number}</h3>
              <p className="text-xs">Status: {node.status}</p>
              <p className="text-xs">
                Placed on: {new Date(node.created).toLocaleDateString()}
              </p>
              <p className="text-xs mb-2">
                Total: {node.total.gross.amount} {node.total.gross.currency}
              </p>
              <div className="mt-2 space-y-2">
                <h4 className="text-xs font-semibold">Items:</h4>
                {node.lines.map((line, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm">
                      {line.productName} x {line.quantity} —{" "}
                      {line.unitPrice.gross.amount}{" "}
                      {line.unitPrice.gross.currency}
                    </p>
                    <img
                      src={line.variant.product.thumbnail.url}
                      alt={line.productName}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
