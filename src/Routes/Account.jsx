// Routes/Account.jsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Footer from "../Components/Footer";
import {
  REFRESH_TOKEN_MUTATION,
  GET_USER_QUERY,
  GET_CART_ITEMS,
} from "../graphql/queries";
import CustomLoader from "../Components/CustomLoader";
import OrdersTab from "../Components/account/OrdersTab";
import AccountTab from "../Components/account/AccountTab";
import CartTab from "../Components/account/CartTab";
import TabNavigation from "../Components/account/TabNavigation";
import { useAuth } from "../context/AuthContext";

const Account = () => {
  const [activeTab, setActiveTab] = useState(
    () => new URLSearchParams(window.location.search).get("tab") || "orders"
  );
  const [userData, setUserData] = useState(null);
  const { isAuth, token, setToken } = useAuth();
  const refreshToken = localStorage.getItem("refreshToken");
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  const { loading: userLoading, error: userError, data, refetch } = useQuery(GET_USER_QUERY, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    onCompleted: (data) => {
      if (data.me === null) {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } else {
        setUserData(data.me);
      }
    },
    onError: async (error) => {
      if (error.message.includes("Signature has expired")) {
        try {
          const { data: refreshData } = await refreshTokenMutation({
            variables: { refreshToken },
          });

          if (refreshData?.tokenRefresh?.token) {
            const newToken = refreshData.tokenRefresh.token;
            setToken(newToken);
            localStorage.setItem("token", newToken);
            refetch();
          } else {
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else if (error.message.includes("Signature verification failed")) {
        console.error("Invalid token detected:", error.message);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } else {
        console.error("GraphQL error:", error.message);
      }
    },
  });

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART_ITEMS, {
    variables: { checkoutId },
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    skip: !checkoutId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!userLoading && !token) {
      console.log("No token found, redirecting to login");
      window.location.href = "/login";
    }
  }, [userLoading, token]);

  // Show loader while any data is loading or while refreshing token
  const isLoading = userLoading || cartLoading || !isAuth;

  if (isLoading) {
    return (
      <div className="h-screen mt-4 flex flex-col items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  // Show error only if we have a non-token related error
  const hasError = userError && !userError.message.includes("Signature has expired") && !userError.message.includes("Signature verification failed");

  if (hasError) {
    return (
      <div className="h-screen mt-4 flex flex-col items-center justify-center">
        <p className="text-xs text-red-500 uppercase">ERROR LOADING ACCOUNT</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen mt-4 flex flex-col items-center px-4 border border-black">
        <div className="w-full max-w-[600px] h-screen mt-16 space-y-12 border border-black border-y">
          <div className="text-center space-y-8">
            <h1 className="text-xs py-2">{userData?.email}</h1>

            <div className="flex justify-center border-y border-black">
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>

          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "account" && <AccountTab userData={userData} />}
          {activeTab === "cart" && (
            <CartTab
              cartData={cartData}
              cartLoading={cartLoading}
              cartError={cartError}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
