import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SHIPPING_METHODS,
  CHECKOUT_SHIPPING_ADDRESS_UPDATE,
} from "../graphql/queries";
import { zipToStateMap } from "../utils/constants";

export default function CheckoutShipping({
  activeSection,
  setActiveSection,
  handleContinue,
}) {
  const [zipCode, setZipCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  const { data, loading } = useQuery(GET_SHIPPING_METHODS, {
    variables: { checkoutId },
    skip: !checkoutId || activeSection !== "delivery",
  });

  const [updateShippingAddress] = useMutation(CHECKOUT_SHIPPING_ADDRESS_UPDATE);

  const handleZipChange = (e) => {
    const zip = e.target.value;
    setZipCode(zip);
    setSelectedState(zipToStateMap[zip] || "");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressUpdate = async () => {
    if (!checkoutId) return;
    try {
      await updateShippingAddress({
        variables: {
          checkoutId,
          shippingAddress: {
            ...address,
            state: selectedState,
            postalCode: zipCode,
          },
        },
      });
      setActiveSection("delivery");
    } catch (error) {
      console.error("Error updating shipping address:", error);
    }
  };

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
            value={zipCode}
            onChange={handleZipChange}
          />
          <select
            className="border border-gray-300 p-3 w-full"
            value={selectedState}
            readOnly
          >
            <option>{selectedState || "State"}</option>
          </select>
          <button
            onClick={handleAddressUpdate}
            className="w-full bg-black text-white py-3 hover:bg-black/90"
          >
            CONTINUE TO DELIVERY
          </button>
        </div>
      )}

      {activeSection === "delivery" && (
        <div className="mt-4 space-y-4">
          <h3 className="font-medium">Shipping Options</h3>
          {loading ? (
            <p className="text-gray-600">Loading shipping methods...</p>
          ) : (
            <div className="space-y-4">
              {data?.checkout?.shippingMethods?.map((method) => (
                <label
                  key={method.id}
                  className="block border border-gray-200 p-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedMethod?.id === method.id}
                      onChange={() => setSelectedMethod(method)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{method.name}</span>
                        <span>
                          {method.price.amount === 0
                            ? "Free"
                            : `$${method.price.amount}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Delivery in {method.minimumDeliveryDays}-
                        {method.maximumDeliveryDays} business days
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <h3 className="font-medium mt-6">Shipping Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name *"
              className="border border-gray-300 p-3"
              name="firstName"
              value={address.firstName}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Last Name *"
              className="border border-gray-300 p-3"
              name="lastName"
              value={address.lastName}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Address *"
              className="col-span-2 border border-gray-300 p-3"
              name="streetAddress"
              value={address.streetAddress}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="City *"
              className="border border-gray-300 p-3"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Postal Code *"
              className="border border-gray-300 p-3"
              name="postalCode"
              value={address.postalCode}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Phone Number *"
              className="border border-gray-300 p-3"
              name="phone"
              value={address.phone}
              onChange={handleAddressChange}
            />
          </div>

          <p className="text-xs text-gray-600 uppercase">
            Clothd Orders arrive in signature grey packaging that ensures
            product safety and provides optional storage, marked with a centered
            logo.
          </p>
          <p className="text-sm">
            Buying a gift? Add a ribbon and a personalised gift message
          </p>

          <button
            onClick={() => handleContinue("shipping")}
            className="w-full bg-black text-white py-3 hover:bg-black/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!selectedMethod}
          >
            CONTINUE TO PAYMENT
          </button>
        </div>
      )}
    </section>
  );
}
