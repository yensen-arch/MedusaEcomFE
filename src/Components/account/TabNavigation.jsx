// components/account/TabNavigation.jsx
const TabNavigation = ({ activeTab, setActiveTab }) => {
    return (
      <nav className="flex items-center">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-3 text-xs ${
            activeTab === "orders" ? "bg-black text-white" : ""
          }`}
        >
          ORDERS
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-3 text-xs ${
            activeTab === "account" ? "bg-black text-white" : ""
          }`}
        >
          ACCOUNT
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          className={`px-4 py-3 text-xs ${
            activeTab === "cart" ? "bg-black text-white" : ""
          }`}
        >
          CART
        </button>
      </nav>
    );
  };
  
  export default TabNavigation;