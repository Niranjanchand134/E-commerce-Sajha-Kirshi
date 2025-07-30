import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../../Context/AuthContext";
import cartService from "../../../services/OtherServices/cartService";
import { useNavigate } from "react-router-dom";
import { ErrorMessageToast } from "../../../utils/Tostify.util";
import { getKycByUserId } from "../../../services/buyer/BuyerApiService";

const ProductCard = ({
  item,
  onUpdate,
  onRemove,
  onToggleLike,
  isSelected,
  onSelect,
}) => {
  const [count, setCount] = useState(item.quantity || 1);
  const [liked, setLiked] = useState(item.liked || false);

  const increase = async () => {
    const newCount = count + 1;
    setCount(newCount);
    try {
      await onUpdate(item.id, { quantity: newCount });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setCount(count);
    }
  };

  const decrease = async () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      try {
        await onUpdate(item.id, { quantity: newCount });
      } catch (error) {
        console.error("Failed to update quantity:", error);
        setCount(count);
      }
    }
  };

  const handleRemove = async () => {
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    try {
      await onToggleLike(item.id, newLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setLiked(liked);
    }
  };

  // Calculate discounted price using discountPercentage from cart data
  const originalPrice = item.price;
  const discountPercentage = item.discountPercentage || 0;
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);
  const totalDiscountAmount = (originalPrice - discountedPrice) * count;
  const totalPrice = discountedPrice * count;

  return (
    <div className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
      <input
        type="checkbox"
        className="form-checkbox"
        checked={isSelected}
        onChange={() => onSelect(item.id)}
      />
      <img
        src={
          item.imageUrl ||
          "https://www.collinsdictionary.com/images/full/apple_158989157.jpg"
        }
        alt={item.productName}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h5 className="font-semibold">{item.productName}</h5>
        <p className="text-sm text-gray-500">{item.description}</p>
        <p className="text-xs text-gray-400">{item.location}</p>
        {discountPercentage > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-green-600 font-medium">
              {discountPercentage}% OFF
            </span>
            <span className="text-xs text-gray-400 ">
              Rs. {originalPrice.toFixed(2)} each
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center justify-between space-y-2">
          <div className="text-right">
            <div className="text-green-600 font-semibold">
              Rs. {totalPrice.toFixed(2)}
            </div>
            {discountPercentage > 0 && (
              <div className="text-xs text-green-500">
                Save Rs. {totalDiscountAmount.toFixed(2)}
              </div>
            )}
          </div>
          <div className="flex gap-4 items-center text-gray-500 text-xl">
            <button
              onClick={toggleLike}
              className="hover:text-red-500 transition-all duration-200"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
            <button
              onClick={handleRemove}
              className="hover:text-red-600 transition-all duration-200"
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 font-semibold text-lg">
          <button onClick={decrease} className="bg-[#DAF8D9] p-1 rounded">
            <GrSubtract size={16} />
          </button>
          <span className="text-xl min-w-[2rem] text-center">{count}</span>
          <button onClick={increase} className="bg-[#DAF8D9] p-1 rounded">
            <IoMdAdd size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCartItems(user.id);
      console.log("Fetched cart items:", response.data);

      // Group items by farmName
      const groupedItems = response.data.reduce((acc, item) => {
        const farm = item.farmName || "Unknown Farm";
        if (!acc[farm]) acc[farm] = [];
        acc[farm].push(item);
        return acc;
      }, {});

      setCartItems(
        Object.entries(groupedItems).map(([farm, items]) => ({ farm, items }))
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (itemId, data) => {
    try {
      await cartService.updateCartItem(itemId, data);
      await fetchCartItems();
    } catch (error) {
      throw error;
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await cartService.removeCartItem(itemId);
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      await fetchCartItems();
    } catch (error) {
      throw error;
    }
  };

  const handleToggleLike = async (itemId, liked) => {
    try {
      await cartService.updateCartItem(itemId, { liked });
      await fetchCartItems();
    } catch (error) {
      throw error;
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectFarm = (farmItems) => {
    const farmItemIds = farmItems.map((item) => item.id);
    const allSelected = farmItemIds.every((id) => selectedItems.includes(id));
    if (allSelected) {
      setSelectedItems((prev) =>
        prev.filter((id) => !farmItemIds.includes(id))
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        ...farmItemIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleCheckout = async () => {
    if (!user || !user.id) {
      ErrorMessageToast("Please log in to proceed to checkout!");
      navigate("/Buyer-login");
      return;
    }

    if (selectedItems.length === 0) {
      ErrorMessageToast(
        "Please select at least one item to proceed to checkout."
      );
      return;
    }

    try {
      const kycData = await getKycByUserId(user.id);
      if (!kycData || !kycData.id) {
        ErrorMessageToast("Please fill the KYC form before proceeding.");
        setError("KYC not found");
        return;
      }

      const checkoutItems = selectedCartItems.map((item) => ({
        ...item,
        originalPrice: item.price,
        discountedPrice:
          item.price * (1 - (item.discountPercentage || 0) / 100),
        totalDiscountAmount:
          ((item.price * (item.discountPercentage || 0)) / 100) * item.quantity,
      }));

      navigate("/buynow", {
        state: {
          checkoutItems,
          itemTotal: subtotal,
          discountAmount: totalDiscountAmount,
          deliveryFee,
          total,
        },
      });
    } catch (error) {
      console.error("Checkout error details:", error);
      if (error.status === 404) {
        ErrorMessageToast("Please fill the KYC form before proceeding.");
        setError("KYC not found");
      } else {
        const errorMessage =
          error.message || "An error occurred during checkout.";
        ErrorMessageToast(errorMessage);
        setError(errorMessage);
      }
    }
  };

  // Get selected cart items
  const selectedCartItems = cartItems
    .flatMap((farm) => farm.items)
    .filter((item) => selectedItems.includes(item.id));

  // Calculate totals more efficiently
  const calculations = selectedCartItems.reduce(
    (acc, item) => {
      const originalPrice = item.price;
      const discountPercentage = item.discountPercentage || 0;
      const discountedPrice = originalPrice * (1 - discountPercentage / 100);
      const itemTotal = discountedPrice * item.quantity;
      const itemDiscount = (originalPrice - discountedPrice) * item.quantity;
      const itemSubtotal = originalPrice * item.quantity;

      return {
        subtotal: acc.subtotal + itemSubtotal,
        totalAfterDiscount: acc.totalAfterDiscount + itemTotal,
        totalDiscountAmount: acc.totalDiscountAmount + itemDiscount,
      };
    },
    { subtotal: 0, totalAfterDiscount: 0, totalDiscountAmount: 0 }
  );

  const { subtotal, totalAfterDiscount, totalDiscountAmount } = calculations;
  const deliveryFee = selectedItems.length > 0 ? 135 : 0;
  const total = totalAfterDiscount + deliveryFee;

  if (loading) return <div className="text-center p-4">Loading cart...</div>;

  if (!user) {
    return (
      <>
        <Header />
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">
            Please log in to view your cart
          </h2>
          <button
            onClick={() => navigate("/Buyer-login")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-start min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 px-4">
          <div className="lg:w-2/3 space-y-6">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-4">
                  Add some products to get started
                </p>
                <button
                  onClick={() => navigate("/buyer-shop")}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((farm, index) => {
                const farmItemIds = farm.items.map((item) => item.id);
                const isFarmSelected = farmItemIds.every((id) =>
                  selectedItems.includes(id)
                );

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={isFarmSelected}
                          onChange={() => handleSelectFarm(farm.items)}
                        />
                        <h2 className="text-green-600 font-semibold text-lg">
                          {farm.farm}
                        </h2>
                        <MdOutlineKeyboardArrowRight
                          className="text-gray-400 text-xl"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {farm.items.map((item) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          onUpdate={handleUpdate}
                          onRemove={handleRemove}
                          onToggleLike={handleToggleLike}
                          isSelected={selectedItems.includes(item.id)}
                          onSelect={handleSelectItem}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:w-1/3 bg-white rounded-lg shadow-sm p-6 sticky top-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Items ({selectedItems.length}{" "}
                  {selectedItems.length === 1 ? "item" : "items"})
                </span>
                <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
              </div>
              {totalDiscountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Discount</span>
                  <span className="font-medium text-green-600">
                    -Rs. {totalDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rs. {totalAfterDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  Rs. {deliveryFee.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">Total</p>
                  <p className="text-xs text-gray-400">All taxes included</p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  Rs. {total.toFixed(2)}
                </p>
              </div>
            </div>
            {totalDiscountAmount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800 font-medium">
                  🎉 You're saving Rs. {totalDiscountAmount.toFixed(2)} with
                  current discounts!
                </p>
              </div>
            )}
            <button
              onClick={handleCheckout}
              className={`w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedItems.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
              disabled={selectedItems.length === 0}
            >
              Proceed to Checkout ({selectedItems.length} items)
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddCart;
