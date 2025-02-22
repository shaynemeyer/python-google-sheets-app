import {
  API_BASE_URL,
  ORDERS_WORKSHEET_NAME,
  SPREADSHEET_ID,
} from "@/lib/constants";
import { CartProduct } from "@/types/product";
import { useState } from "react";
import shortUUID from "short-uuid";

type CartProps = {
  cart: Array<CartProduct>;
  token: string;
  onClose: () => void;
  onRemoveFromCart: (cartItemId: number) => void;
  onSuccessfulCheckout: () => void;
};

function Cart({
  cart,
  onClose,
  onRemoveFromCart,
  token,
  onSuccessfulCheckout,
}: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalAmount = cart
    .reduce((sum, item) => sum + (Number(item?.price.replace("$", "")) || 0), 0)
    .toFixed(2);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const orderId = shortUUID.generate();
      await fetch(
        `${API_BASE_URL}/api/${SPREADSHEET_ID}/${ORDERS_WORKSHEET_NAME}/append?auto_increment_id=false`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(
            cart.map((item) => ({
              order_id: orderId,
              item_id: item.id,
              description: item.description,
              price: item.price,
              order_datetime: new Date().toISOString(),
            }))
          ),
        }
      );
      onSuccessfulCheckout();
    } catch (err) {
      console.error("Failed to checkout:", err);
    }
    setIsCheckingOut(false);
  };
  return (
    <div className="fixed inset-0 flex z-50">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>
      <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
        <div className="mt-4 px-4">
          {cart.length === 0 ? (
            <div>Your cart is empty.</div>
          ) : (
            <>
              {cart.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 object-cover rounded-full"
                      src={product.image_url}
                      alt={product.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-bold">{product.name}</h3>
                      <p className="text-gray-500">{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromCart(product.cartItemId)}
                    className="text-sm font-bold bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-8 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total: </span>
                  <span className="text-xl font-semibold">${totalAmount}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-green-500 text-white rounded-md font-bold py-2 px-4 hover:bg-green-600"
                disabled={cart.length === 0 || isCheckingOut}
              >
                {isCheckingOut
                  ? "Checking out..."
                  : `Checkout (${totalAmount})`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Cart;
