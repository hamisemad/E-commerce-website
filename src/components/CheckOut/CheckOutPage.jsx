import React from "react";
import { useCheckOutLogic } from "./CheckOutLogic";
import { Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";


const FormInput = ({ name, placeholder, formik }) => (
  <>
    <input
      name={name}
      placeholder={placeholder}
      onChange={formik.handleChange}
      value={formik.values[name]}
      onBlur={formik.handleBlur}
      className="w-full border p-2 rounded-lg"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-sm">{formik.errors[name]}</div>
    )}
  </>
);

const PaymentOption = ({ value, label, currentMethod, updateMethod }) => (
  <label
    className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition ${
      currentMethod === value
        ? "border-purple-500 bg-purple-50"
        : "border-gray-300"
    }`}
  >
    <input
      type="radio"
      value={value}
      checked={currentMethod === value}
      onChange={(e) => updateMethod(e.target.value)}
      className="w-4 h-4 text-purple-600"
    />
    <span className="font-medium">{label}</span>
  </label>
);

const CardInputs = () => (
  <div className="mt-4 space-y-3 p-4 border rounded-lg bg-gray-50">
    <h4 className="font-medium text-gray-700">Card Details (Stripe)</h4>
    <input disabled placeholder="Card Number" className="w-full p-2 border rounded-lg" />
    <div className="flex gap-2">
      <input disabled placeholder="MM/YY" className="w-1/2 p-2 border rounded-lg" />
      <input disabled placeholder="CVV" className="w-1/2 p-2 border rounded-lg" />
    </div>
    <input disabled placeholder="Card Holder Name" className="w-full p-2 border rounded-lg" />
  </div>
);


export default function CheckOutPage() {
  const {
    cart,
    addresses,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    selectedAddress,
    isOrderLoading,
    addressLoading,
    formik,
    setPaymentMethod,
    setSelectedAddress,
    removeAddress,
    handleOrderSubmission,
  } = useCheckOutLogic();

  if (!cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#6b46c1" size={80} />
      </div>
    );
  }

  const isOrderDisabled =
    isOrderLoading ||
    !cart?.data?.products?.length ||
    !selectedAddress;

  const AddressCard = ({ address }) => (
    <div className="flex items-start">
      <label
        className={`flex-1 flex items-center border p-3 rounded-l-lg cursor-pointer ${
          selectedAddress === address._id
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          checked={selectedAddress === address._id}
          onChange={() => setSelectedAddress(address._id)}
          className="mr-3"
        />
        <div>
          <p className="font-medium">{address.name}</p>
          <p className="text-sm text-gray-600">
            {address.details}, {address.city}
          </p>
        </div>
      </label>
      <button
        onClick={() => removeAddress(address._id)}
        disabled={addressLoading}
        className="p-3 border rounded-r-lg bg-red-50 text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Checkout | SuperKart</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* -------------------- ORDER SUMMARY -------------------- */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3">
              Order Summary
            </h2>

            {cart.data.products.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-14 h-14 object-contain border rounded"
                  />
                  <div>
                    <p className="font-medium">
                      {item.product.title.slice(0, 30)}...
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.count}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">{item.price} EGP</p>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Shipping</span>
              <span>{shippingFee.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between mt-4 font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>

          {/* -------------------- ADDRESS & PAYMENT -------------------- */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4 border-b pb-3">
              Delivery Address
            </h2>

            <div className="space-y-3 mb-6">
              {addresses.length ? (
                addresses.map((address) => (
                  <AddressCard key={address._id} address={address} />
                ))
              ) : (
                <p className="text-gray-500">No saved addresses yet</p>
              )}
            </div>

            <form
              onSubmit={formik.handleSubmit}
              className="space-y-3 border p-4 rounded-xl bg-gray-50"
            >
              <FormInput name="name" placeholder="Name" formik={formik} />
              <FormInput name="city" placeholder="City" formik={formik} />
              <FormInput name="details" placeholder="Address" formik={formik} />
              <FormInput name="phone" placeholder="Phone" formik={formik} />

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-gray-800 text-white py-2 rounded-lg"
              >
                Save Address
              </button>
            </form>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Payment Method</h3>
              <PaymentOption
                value="cash"
                label="Cash on Delivery"
                currentMethod={paymentMethod}
                updateMethod={setPaymentMethod}
              />
              <PaymentOption
                value="card"
                label="Online Payment (Stripe)"
                currentMethod={paymentMethod}
                updateMethod={setPaymentMethod}
              />
              {paymentMethod === "card" && <CardInputs />}
            </div>

            <button
              onClick={handleOrderSubmission}
              disabled={isOrderDisabled}
              className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl font-bold"
            >
              {isOrderLoading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Complete Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
