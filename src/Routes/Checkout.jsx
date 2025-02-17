"use client"

import { useState } from "react"

function Checkout() {
  const [activeSection, setActiveSection] = useState("email")
  const [email, setEmail] = useState("")

  const handleContinue = (section) => {
    if (section === "email" && email) {
      setActiveSection("shipping")
    } else if (section === "shipping") {
      setActiveSection("payment")
    }
  }

  return (
    <div className="min-h-screen mt-28 grid md:grid-cols-[1fr,400px]">
      {/* Main Checkout Form */}
      <main className="p-8 max-w-[800px] mx-auto w-full space-y-4">
        {/* Email Section */}
        <section className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-medium">1. EMAIL</h2>
            {activeSection !== "email" && email && (
              <button onClick={() => setActiveSection("email")} className="text-sm text-gray-500 hover:text-black">
                Edit
              </button>
            )}
          </div>

          {activeSection === "email" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please enter your email address to log in or checkout as guest. If you would like to create an account,
                you will be able to do it later.
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <label htmlFor="email">Email Address (for order updates)</label>
                  <span className="text-gray-500">*required</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-3"
                  required
                />
              </div>
              <button
                onClick={() => handleContinue("email")}
                className="w-full bg-black text-white py-3 hover:bg-black/90"
              >
                CONTINUE
              </button>
              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
              <button className="w-full border border-gray-300 p-3 flex items-center justify-center gap-2">
                <span className="text-[24px] leading-none">G</span>
                LOGIN WITH GOOGLE
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{email}</p>
          )}
        </section>

        {/* Shipping Section */}
        <section className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <h2 className={activeSection === "shipping" ? "font-medium" : "text-gray-400"}>2. SHIPPING</h2>
            {activeSection !== "shipping" && activeSection === "payment" && (
              <button onClick={() => setActiveSection("shipping")} className="text-sm text-gray-500 hover:text-black">
                Edit
              </button>
            )}
          </div>
          {activeSection === "shipping" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name *" className="border border-gray-300 p-3" />
                <input type="text" placeholder="Last Name *" className="border border-gray-300 p-3" />
                <input type="text" placeholder="Address *" className="col-span-2 border border-gray-300 p-3" />
                <input type="text" placeholder="City *" className="border border-gray-300 p-3" />
                <input type="text" placeholder="Postal Code *" className="border border-gray-300 p-3" />
              </div>
              <button
                onClick={() => handleContinue("shipping")}
                className="w-full bg-black text-white py-3 hover:bg-black/90"
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}
        </section>

        {/* Payment Section */}
        <section>
          <h2 className={activeSection === "payment" ? "font-medium" : "text-gray-400"}>3. PAYMENT</h2>
          {activeSection === "payment" && (
            <div className="mt-4 space-y-4">
              <div className="space-y-4">
                <input type="text" placeholder="Card Number *" className="w-full border border-gray-300 p-3" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Expiry Date *" className="border border-gray-300 p-3" />
                  <input type="text" placeholder="CVV *" className="border border-gray-300 p-3" />
                </div>
              </div>
              <button className="w-full bg-black text-white py-3 hover:bg-black/90">PLACE ORDER</button>
            </div>
          )}
        </section>
      </main>

      {/* Order Summary Sidebar */}
      <aside className="border-l border-gray-200 p-6 bg-white">
        <div className="space-y-6">
          <h2 className="font-medium">ORDER SUMMARY</h2>
          <div className="space-y-4 border-b border-gray-200 pb-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-100" />
              <div className="flex-1">
                <h3 className="font-medium">LE CITY SMALL BAG WITH PINS</h3>
                <p className="text-sm text-gray-600">Color: Black</p>
                <p className="text-sm text-gray-600">Size: U</p>
                <p className="text-sm text-gray-600">Quantity: 1</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-b border-gray-200 pb-6">
            <div className="flex justify-between">
              <span>SUBTOTAL</span>
              <span>$ 4,150.00</span>
            </div>
            <div className="flex justify-between">
              <span>SHIPPING</span>
              <span>$ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>SALES TAX</span>
              <span className="text-sm">CALCULATED AT CHECKOUT</span>
            </div>
            <div className="flex justify-between font-medium pt-2">
              <span>TOTAL (TAX EXCL.)</span>
              <span>$ 4,150.00</span>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li>Free shipping, returns and exchanges</li>
            <li>30 days free return</li>
            <li>30 days free online exchange</li>
            <li>Balenciaga signature packaging</li>
          </ul>

          <div className="space-y-4">
            <p className="font-medium text-center">WE ACCEPT</p>
            <div className="flex justify-center gap-2">
              {["visa", "mastercard", "amex", "paypal", "klarna", "bitpay", "apple-pay"].map((payment) => (
                <div key={payment} className="w-10 h-6 bg-black rounded" />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="font-medium">CUSTOMER SUPPORT</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Checkout

