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
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                className="border border-gray-300 p-3"
              />
              <input
                type="text"
                placeholder="Last Name *"
                className="border border-gray-300 p-3"
              />
              <input
                type="text"
                placeholder="Address *"
                className="col-span-2 border border-gray-300 p-3"
              />
              <input
                type="text"
                placeholder="City *"
                className="border border-gray-300 p-3"
              />
              <input
                type="text"
                placeholder="Postal Code *"
                className="border border-gray-300 p-3"
              />
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
    );
  }