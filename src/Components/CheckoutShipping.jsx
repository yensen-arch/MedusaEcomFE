export default function CheckoutShipping({ activeSection, setActiveSection, handleContinue }) {
    return (
      <section className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <h2
            className={
              activeSection === "shipping" ? "font-medium" : "text-gray-400"
            }
          >
            2. SHIPPING
          </h2>
          {activeSection !== "shipping" && activeSection === "payment" && (
            <button
              onClick={() => setActiveSection("shipping")}
              className="text-sm text-gray-500 hover:text-black"
            >
              Edit
            </button>
          )}
        </div>
        {activeSection === "shipping" && (
          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="ZIP Code *"
              className="border border-gray-300 p-3 w-full"
            />
            <select className="border border-gray-300 p-3 w-full">
              <option>State</option>
              <option>Texas</option>
              <option>California</option>
              <option>New York</option>
              {/* Add other states here */}
            </select>
            <button
              onClick={() => setActiveSection("delivery")}
              className="w-full bg-black text-white py-3 hover:bg-black/90"
            >
              CONTINUE TO DELIVERY
            </button>
          </div>
        )}
        {activeSection === "delivery" && (
          <div className="mt-4 space-y-4">
            <h3>Shipping Options</h3>
            <div>
              <p>Reduced Carbon Delivery (Orders placed by 4pm est will deliver in 1-5 business days via FedEx with the least impact on the environment.)</p>
              <p>Free</p>
              <p>le city small bag with pins - Quantity: 1 - Delivery by: 02/24/2025</p>
              <p>credit square folded wallet - Quantity: 1 - Delivery by: 02/24/2025</p>
            </div>
            <div>
              <p>Standard Delivery (Orders placed by 4pm est will deliver in 1-5 business days via FedEx.)</p>
              <p>Free</p>
              <p>le city small bag with pins - Quantity: 1 - Delivery by: 02/21/2025</p>
              <p>credit square folded wallet - Quantity: 1 - Delivery by: 02/21/2025</p>
            </div>
            <div>
              <p>Pick up in store</p>
              <p>Free</p>
              <p>Pick-up usually available within 2 working days</p>
            </div>
            <h3>Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name *" className="border border-gray-300 p-3" defaultValue="IADA" />
              <input type="text" placeholder="Last Name *" className="border border-gray-300 p-3" defaultValue="BADDI" />
              <input type="text" placeholder="Address *" className="col-span-2 border border-gray-300 p-3" />
              <input type="text" placeholder="City *" className="border border-gray-300 p-3" />
              <input type="text" placeholder="Postal Code *" className="border border-gray-300 p-3" />
              <input type="text" placeholder="Phone Number *" className="border border-gray-300 p-3" />
            </div>
            <p>BALENCIAGA SIGNATURE PACKAGING Orders arrive in signature grey packaging that ensures product safety and provides optional storage, marked with a centered logo.</p>
            <p>Buying a gift? Add a ribbon a personalised gift message</p>
            <button
              onClick={() => handleContinue("shipping")}
              className="w-full bg-black text-white py-3 hover:bg-black/90"
            >
              CONTINUE TO PAYMENT
            </button>
          </div>
        )}
      </section>
    );
  }
