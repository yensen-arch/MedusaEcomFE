import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import CustomLoader from "../CustomLoader";
import { GET_CUSTOMER_ORDERS } from "../../graphql/queries";
import jsPDF from "jspdf";

const OrdersTab = () => {
  const [token, setToken] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_ORDERS, {
    context: {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    },
    skip: !token,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Orders query completed:", data);
      if (data?.me?.orders?.edges) {
        console.log("Number of orders:", data.me.orders.edges.length);
      }
    },
    onError: (error) => {
      console.error("Orders query error:", error);
    }
  });

  // Check if we need to refetch orders
  useEffect(() => {
    const checkRefetch = () => {
      const shouldRefetchOrders = localStorage.getItem("shouldRefetchOrders");
      if (shouldRefetchOrders === "true") {
        console.log("Refetching orders...");
        localStorage.removeItem("shouldRefetchOrders");
        refetch();
      }
    };

    // Check immediately and set up an interval
    checkRefetch();
    const interval = setInterval(checkRefetch, 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Force refetch when component mounts
  useEffect(() => {
    if (token) {
      console.log("Initial orders fetch...");
      refetch();
    }
  }, [token, refetch]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  if (error) return <p>Error fetching orders.</p>;

  const orders = data?.me?.orders?.edges || [];
  console.log("Orders array:", orders);

  const generatePDF = (order) => {
    const doc = new jsPDF();

    // Green Background for Logo
    doc.setFillColor(0, 255, 0);
    doc.rect(0, 10, doc.internal.pageSize.getWidth(), 15, "F");

    // Company Name
    doc.setFontSize(24);
    doc.setFont("courier", "bold");
    doc.text("Clothd.co", 105, 20, { align: "center" });

    // Order Summary
    doc.setFontSize(16);
    doc.setFont("courier", "normal");
    doc.text("ORDER SUMMARY", 105, 35, { align: "center" });

    // Order Details
    doc.setFontSize(12);
    doc.text(`ORDER #: ${order.number.toString().toUpperCase()}`, 20, 50);
    doc.text(`STATUS: ${order.status.toUpperCase()}`, 20, 60);
    doc.text(
      `PLACED ON: ${new Date(order.created)
        .toLocaleDateString()
        .toUpperCase()}`,
      20,
      70
    );
    doc.text(
      `TOTAL: ${order.total.gross.amount} ${order.total.gross.currency}`.toUpperCase(),
      20,
      80
    );
    doc.text(`PAYMENT STATUS: ${order.paymentStatus.toUpperCase()}`, 20, 90);

    // Shipping Address
    doc.setFont("courier", "bold");
    doc.text("SHIPPING ADDRESS:", 20, 115);
    doc.setFont("courier", "normal");
    doc.text(
      `${order.shippingAddress.firstName.toUpperCase()} ${order.shippingAddress.lastName.toUpperCase()}`,
      20,
      125
    );
    doc.text(order.shippingAddress.streetAddress1.toUpperCase(), 20, 135);
    doc.text(
      `${order.shippingAddress.city.toUpperCase()}, ${order.shippingAddress.postalCode.toUpperCase()}`,
      20,
      145
    );
    doc.text(order.shippingAddress.country.country.toUpperCase(), 20, 155);

    // Items List
    doc.setFont("courier", "bold");
    doc.text("ITEMS:", 20, 170);
    doc.setFont("courier", "normal");
    let y = 180;
    order.lines.forEach((item) => {
      doc.text(`${item.productName.toUpperCase()} X ${item.quantity}`, 20, y);
      doc.text(
        `${item.unitPrice.gross.amount} ${item.unitPrice.gross.currency}`.toUpperCase(),
        160,
        y,
        { align: "right" }
      );
      y += 10;
    });

    // Subtotal & Shipping Charges
    y += 10;
    doc.setFont("courier", "bold");
    doc.text("SUBTOTAL:", 20, y);
    doc.text(
      `${order.subtotal.gross.amount} ${order.subtotal.gross.currency}`.toUpperCase(),
      160,
      y,
      { align: "right" }
    );

    y += 10;
    doc.text("SHIPPING CHARGES:", 20, y);
    doc.text(
      `${order.shippingPrice.gross.amount} ${order.shippingPrice.gross.currency}`.toUpperCase(),
      160,
      y,
      { align: "right" }
    );

    y += 10;
    doc.text("TOTAL:", 20, y);
    doc.text(
      `${order.total.gross.amount} ${order.total.gross.currency}`.toUpperCase(),
      160,
      y,
      { align: "right" }
    );

    // Footer
    doc.setFontSize(10);
    doc.text("WELCOME TO THE CLOTHD.CO FAMILY.", 105, y + 20, {
      align: "center",
    });

    // Save PDF
    doc.save(`order-${order.number}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
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
        <div
          className="w-full overflow-y-auto h-[29rem]"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE/Edge */,
          }}
          onScroll={(e) => (e.currentTarget.style.scrollbarWidth = "none")}
        >
          {orders.map(({ node }) => (
            <div key={node.id} className="border border-black px-2">
              <h3 className="text-sm font-bold">ORDER #{node.number}</h3>
              <p className="text-xs">STATUS: {node.status}</p>
              <p className="text-xs">
                PLACED ON: {new Date(node.created).toLocaleDateString()}
              </p>
              <p className="text-xs mb-2">
                TOTAL: {node.total.gross.amount} {node.total.gross.currency}
              </p>
              <div className="mt-2 p-2">
                <h4 className="text-xs font-semibold">ITEMS:</h4>
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
                      className="w-16 h-16 object-cover  border border-black"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => generatePDF(node)}
                className="my-3 px-4 py-2 text-xs bg-black text-white hover:bg-white hover:text-black border border-black transition-colors"
              >
                DOWNLOAD
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
