export default function CheckoutPayment({ activeSection }) {
    return (
      <section>
        <h2
          className={
            activeSection === "payment" ? "font-medium" : "text-gray-400"
          }
        >
          3. PAYMENT
        </h2>
        {activeSection === "payment" && (
          <div className="mt-4 space-y-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number *"
                className="w-full border border-gray-300 p-3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Expiry Date *"
                  className="border border-gray-300 p-3"
                />
                <input
                  type="text"
                  placeholder="CVV *"
                  className="border border-gray-300 p-3"
                />
              </div>
            </div>
            <button className="w-full bg-black text-white py-3 hover:bg-black/90">
              PLACE ORDER
            </button>
          </div>
        )}
      </section>
    );
  }