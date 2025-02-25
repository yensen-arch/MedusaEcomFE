import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SHIPPING_METHODS,
  CHECKOUT_SHIPPING_ADDRESS_UPDATE,
  SHIPPING_METHOD_UPDATE,
} from "../graphql/queries";
import { getStateFromZip } from "../utils/constants";

export default function CheckoutShipping({
  activeSection,
  setActiveSection,
  handleContinue,
  setShippingMethodId,
  setBillingAddress,
  onShippingMethodUpdate,
}) {
  const [updateShippingMethod, { loading: updatingShippingMethod }] =
    useMutation(SHIPPING_METHOD_UPDATE);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedMethod) setShippingMethodId(selectedMethod.id);
  }, [selectedMethod]);

  const handleShippingMethodSelection = async (method) => {
    setSelectedMethod(method);

    try {
      const response = await updateShippingMethod({
        variables: {
          checkoutId,
          shippingMethodId: method.id,
        },
      });

      if (response.data?.checkoutShippingMethodUpdate?.errors?.length > 0) {
        const errors = response.data.checkoutShippingMethodUpdate.errors;
        setAddressError(errors.map((err) => err.message).join(", "));
        return;
      }

      // Call the callback to update the parent component
      if (onShippingMethodUpdate) {
        onShippingMethodUpdate();
      }
    } catch (error) {
      setAddressError(error.message || "Error updating shipping method");
      console.error("Error updating shipping method:", error);
    }
  };
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    postalCode: "",
    country: "US",
    countryArea: "",
    phone: "",
  });

  useEffect(() => {
    if (address) setBillingAddress(address);
  }, [address]);

  const [addressError, setAddressError] = useState("");
  const [shippingMethods, setShippingMethods] = useState([]);
  const checkoutId =
    typeof window !== "undefined" ? localStorage.getItem("checkoutId") : null;

  const { refetch: refetchShippingMethods } = useQuery(GET_SHIPPING_METHODS, {
    variables: { checkoutId },
    skip: true,
  });

  const [updateShippingAddress] = useMutation(CHECKOUT_SHIPPING_ADDRESS_UPDATE);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => {
      const newAddress = { ...prev, [name]: value };
      if (name === "country") {
        newAddress.postalCode = "";
        newAddress.countryArea = "";
      } else if (name === "postalCode") {
        const state = getStateFromZip(value);
        newAddress.countryArea = state || prev.countryArea;
      }
      return newAddress;
    });
    setAddressError("");
  };

  const validateAddress = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "streetAddress1",
      "city",
      "postalCode",
      "countryArea",
      "phone",
    ];
    const missingFields = requiredFields.filter((field) => !address[field]);

    if (missingFields.length > 0) {
      setAddressError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    if (!address.phone.startsWith("+")) {
      setAddressError("Phone number must start with +");
      return false;
    }

    return true;
  };

  const handleAddressUpdate = async () => {
    if (!checkoutId) {
      setAddressError("No checkout ID found");
      return;
    }

    if (!validateAddress()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateShippingAddress({
        variables: {
          checkoutId,
          shippingAddress: address,
        },
      });

      if (response.data?.checkoutShippingAddressUpdate?.errors?.length > 0) {
        const errors = response.data.checkoutShippingAddressUpdate.errors;
        setAddressError(errors.map((err) => err.message).join(", "));
        return;
      }

      const shippingMethodsResponse = await refetchShippingMethods({
        checkoutId,
      });

      if (shippingMethodsResponse.data?.checkout?.shippingMethods) {
        setShippingMethods(
          shippingMethodsResponse.data.checkout.shippingMethods
        );
        setActiveSection("delivery");
        setAddressError("");
      }
    } catch (error) {
      setAddressError(error.message || "Error updating shipping address");
      console.error("Error updating shipping address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="border-b border-black pb-6">
      <div className="flex items-center gap-4">
        <h2
          className={
            activeSection === "shipping" ? "font-medium" : "text-black"
          }
        >
          2. SHIPPING
        </h2>
        {activeSection !== "shipping" && activeSection === "payment" && (
          <button
            onClick={() => setActiveSection("shipping")}
            className="text-sm uppercase text-gray-500 hover:text-black"
          >
            Edit
          </button>
        )}
      </div>

      {addressError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {addressError}
        </div>
      )}

      {activeSection === "shipping" && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name *"
              className="border border-black p-3"
              name="firstName"
              value={address.firstName}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Last Name *"
              className="border border-black p-3"
              name="lastName"
              value={address.lastName}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Address Line 1 *"
              className="col-span-2 border border-black p-3"
              name="streetAddress1"
              value={address.streetAddress1}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              className="col-span-2 border border-black p-3"
              name="streetAddress2"
              value={address.streetAddress2}
              onChange={handleAddressChange}
            />
            <select
              className="border border-black p-3 bg-white"
              name="country"
              value={address.country}
              onChange={handleAddressChange}
            >
              <option value="US">UNITED STATES</option>
              <option value="CA">CANADA</option>
            </select>

            <input
              type="text"
              placeholder={
                address.country === "US" ? "ZIP Code *" : "Postal Code *"
              }
              className="border border-black p-3"
              name="postalCode"
              value={address.postalCode}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="City *"
              className="border border-black p-3"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              readOnly
              placeholder={address.country === "US" ? "State *" : "Province *"}
              className="border border-black p-3 bg-gray-50"
              name="countryArea"
              value={address.countryArea}
            />
            <input
              type="text"
              placeholder="Phone Number * (e.g., +11234567890)"
              className="col-span-2 border border-black p-3"
              name="phone"
              value={address.phone}
              onChange={handleAddressChange}
            />
          </div>
          <button
            onClick={handleAddressUpdate}
            disabled={isLoading}
            className="w-full bg-black text-white py-3 hover:bg-black/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? "PROCESSING..." : "CONTINUE TO DELIVERY"}
          </button>
        </div>
      )}

      {activeSection === "delivery" && (
        <div className="mt-4 space-y-4">
          <h3 className="font-medium">Shipping Options</h3>
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <label
                key={method.id}
                className="block border border-black p-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={selectedMethod?.id === method.id}
                    onChange={() => handleShippingMethodSelection(method)}
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

          <button
            onClick={() => handleContinue("shipping")}
            className="w-full bg-black text-white py-3 hover:bg-black/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!selectedMethod}
          >
            CONTINUE TO PAYMENT
          </button>
        </div>
      )}
    </section>
  );
}
