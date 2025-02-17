import { useState } from "react";
import Footer from "../Components/Footer";
function Account() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <>
      <div className="h-screen mt-4 flex flex-col items-center px-4 border border-black">
        <div className="w-full max-w-[600px] h-screen mt-16 space-y-12 border border-black border-y">
          <div className="text-center space-y-8">
            <h1 className="text-sm py-2">WELCOME</h1>

            <div className="flex justify-center border-y border-black">
              <nav className="flex items-center ">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-3 text-xs hover:bg-slate-200  ${
                    activeTab === "orders" ? "bg-slate-300" : ""
                  }`}
                >
                  ORDERS
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`px-4 py-3 text-xs hover:bg-slate-200 ${
                    activeTab === "account" ? "bg-slate-300" : ""
                  }`}
                >
                  ACCOUNT
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "orders" ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-6">
              <h2 className="text-sm">NO ORDERS YET</h2>
              <button className="border text-sm text-white bg-black border-black py-3 px-6 hover:bg-white hover:text-black transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              <section className="space-y-6">
                <h2 className="text-center text-sm">PERSONAL INFO</h2>
                <div className="space-y-6 text-center">
                  <div className="space-y-1 px-2">
                    <p className="text-xs text-black">First Name</p>
                  </div>
                  <div className="space-y-1 px-2">
                    <p className="text-xs text-black">Last Name</p>
                  </div>
                  <div className="space-y-1 px-2">
                    <p className="text-xs text-black">E-Mail address</p>
                  </div>
                  <button className="w-full border text-sm text-white bg-black border-black py-3 hover:bg-white hover:text-black transition-colors">
                    EDIT PROFILE
                  </button>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-center text-xs">PASSWORD</h2>
                <div className="space-y-6">
                  <button className="w-full border text-white bg-black text-sm border-black py-3 hover:bg-white hover:text-black transition-colors">
                    CHANGE PASSWORD
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Account;
