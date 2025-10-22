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
    className={`flex items-center gap-3 cursor-pointer p-3 border rounded-lg transition ${currentMethod === value
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
    <h4 className="font-medium text-gray-700">Card Details (Mock UI)</h4>
    <input
      type="text"
      placeholder="Card Number"
      className="w-full p-2 border rounded-lg"
      disabled
    />
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="MM/YY"
        className="w-1/2 p-2 border rounded-lg"
        disabled
      />
      <input
        type="text"
        placeholder="CVV"
        className="w-1/2 p-2 border rounded-lg"
        disabled
      />
    </div>
    <input
      type="text"
      placeholder="Card Holder Name"
      className="w-full p-2 border rounded-lg"
      disabled
    />
  </div>
);
export default function CheckOutPage() {
  const {
    cart,
    addresses,
    singleProduct,
    productId,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    selectedAddress,
    isOrderLoading,
    addressLoading,
    singleProductLoading,
    formik,
    setPaymentMethod,
    setSelectedAddress,
    removeAddress,
    handleOrderSubmission,
  } = useCheckOutLogic();

  if ((!productId && !cart) || (productId && singleProductLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#6b46c1" size={80} />
      </div>
    );
  }

  const AddressCard = ({ address }) => (
    <div className="flex items-start">
      <label
        className={`flex-1 flex items-center border p-3 rounded-l-lg cursor-pointer transition ${selectedAddress === address._id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300"
          }`}
      >
        <input
          type="radio"
          name="address"
          value={address._id}
          checked={selectedAddress === address._id}
          onChange={() => setSelectedAddress(address._id)}
          className="mr-3 w-4 h-4 text-blue-600"
        />
        <div>
          <span className="font-medium">{address.name}</span>
          <div className="text-sm text-gray-600">
            {address.details}, {address.city}
          </div>
        </div>
      </label>
      <button
        onClick={() => removeAddress(address._id)}
        disabled={addressLoading}
        className="p-3 border border-gray-300 rounded-r-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 transition translate-y-6"
        title="Remove Address"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );

  const isOrderDisabled =
    isOrderLoading ||
    (!productId && !cart?.data?.products?.length) ||
    (productId && !singleProduct);

  return (
    <>
      <Helmet>
        <title>Checkout | SuperKart</title>
        <meta
          name="description"
          content="Review your order details and complete your purchase securely at SuperKart."
        />
        <meta property="og:title" content="Checkout - SuperKart" />
        <meta
          property="og:description"
          content="Complete your order and enjoy fast, reliable delivery with SuperKart."
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-10 px-6 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 order-1 self-start">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3 text-gray-800">
              Order Summary
            </h2>

            {/* Conditional rendering for products/cart */}
            {productId ? (
              singleProduct ? (
                <div
                  key={singleProduct.id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={singleProduct.imageCover}
                      alt={singleProduct.title}
                      className="w-14 h-14 object-contain rounded-md border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {singleProduct.title.slice(0, 30)}...
                      </p>
                      <p className="text-sm text-gray-500">Qty: 1 </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {singleProduct.price} EGP
                  </p>
                </div>
              ) : (
                <ClipLoader color="#6b46c1" size={80} />
              )
            ) : cart?.data?.products?.length ? (
              cart.data.products.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-14 h-14 object-contain rounded-md border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.product.title.slice(0, 30)}...
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.count}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">{item.price} EGP</p>
                </div>
              ))
            ) : null}

            <div className="flex justify-between font-semibold mt-4 text-lg">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between mt-2 text-lg text-gray-700">
              <span>Shipping Fee:</span>
              <span>{shippingFee.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between font-bold mt-4 text-xl border-t pt-3">
              <span>Total:</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 order-2">
            <h2 className="text-xl font-bold mb-4 border-b pb-3 text-gray-800">
              Delivery Address
            </h2>

            <div className="space-y-3 mb-6">
              {addresses.length ? (
                addresses.map((address) => (
                  <AddressCard key={address._id} address={address} />
                ))
              ) : (
                <p className="text-gray-500">
                  No saved addresses yet. Please enter one below.
                </p>
              )}
            </div>

            {/* New Address Form */}
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-3 mb-6 p-4 border rounded-xl bg-gray-50 mt-4"
            >
              <h3 className="font-semibold text-lg border-b pb-2 text-gray-700">
                New Address (Optional Save)
              </h3>
              <FormInput name="name" placeholder="Contact Name" formik={formik} />
              <FormInput name="city" placeholder="City" formik={formik} />
              <FormInput
                name="details"
                placeholder="Detailed Address (Street, Building, Floor/Apt)"
                formik={formik}
              />
              <FormInput
                name="phone"
                placeholder="Phone Number (01xxxxxxxxx)"
                formik={formik}
              />
              <button
                type="submit"
                disabled={formik.isSubmitting || addressLoading}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center font-semibold hover:bg-gray-700 disabled:opacity-60 transition shadow-md"
              >
                {formik.isSubmitting || addressLoading ? (
                  <ClipLoader color="white" size={20} className=" mr-2" />
                ) : (
                  "Save Address"
                )}
              </button>
            </form>

            {/* Payment Method Section */}
            <div className="mt-6 border-t pt-4">
              <h2 className="font-bold text-xl mb-3 text-gray-800">
                Payment Method
              </h2>
              <div className="flex flex-col gap-2">
                <PaymentOption
                  value="cash"
                  label="Cash on Delivery (COD)"
                  currentMethod={paymentMethod}
                  updateMethod={setPaymentMethod}
                />
                <PaymentOption
                  value="card"
                  label="Online Payment"
                  currentMethod={paymentMethod}
                  updateMethod={setPaymentMethod}
                />
                {paymentMethod === "card" && <CardInputs />}
              </div>
            </div>
            <button
              onClick={handleOrderSubmission}
              disabled={isOrderDisabled}
              className="bg-purple-600 text-white px-6 py-3 mt-8 rounded-xl w-full flex items-center justify-center font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 shadow-lg shadow-purple-200"
            >
              {isOrderLoading ? (
                <ClipLoader color="white" size={20} className="animate-spin mr-2" />
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