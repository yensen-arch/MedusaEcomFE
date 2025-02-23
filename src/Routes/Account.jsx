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

const Account = () => {
  const [activeTab, setActiveTab] = useState(
    () => new URLSearchParams(window.location.search).get("tab") || "orders"
  );
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  const { loading, error, data, refetch } = useQuery(GET_USER_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    onCompleted: (data) => {
      if (data.me === null) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    },
    onError: async (error) => {
      if (error.message.includes("Signature has expired")) {
        try {
          const { data: refreshData } = await refreshTokenMutation({
            variables: { refreshToken },
          });

          if (refreshData?.tokenRefresh?.token) {
            localStorage.setItem("token", refreshData.tokenRefresh.token);
            refetch();
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
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
        Authorization: `Bearer ${accessToken}`,
      },
    },
    skip: !checkoutId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
      window.location.href = "/login";
      return;
    }

    if (data?.me) {
      setUserData(data.me);
      setIsAuthenticated(true);
    }
  }, [data, accessToken, refreshToken]);

  if (!isAuthenticated) return null;

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

          {loading ? (
            <div className="flex justify-center items-center ">
              <CustomLoader />
            </div>
          ) : error && !error.message.includes("Signature has expired") ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-xs text-red-500 uppercase">ERROR</p>
            </div>
          ) : (
            <>
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "account" && <AccountTab userData={userData} />}
                {activeTab === "cart" && (
                  <CartTab
                    cartData={cartData}
                    cartLoading={cartLoading}
                    cartError={cartError}
                  />
                )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
