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
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center justify-between space-y-2">
          <div className="text-green-500 font-semibold">Rs. {item.price}</div>
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
          <button onClick={decrease} className="bg-[#DAF8D9] p-1">
            <GrSubtract size={16} />
          </button>
          <span className="text-xl">{count}</span>
          <button onClick={increase} className="bg-[#DAF8D9] p-1">
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
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }

    try {
      // Filter selected items for checkout
      const checkoutItems = cartItems
        .flatMap((farm) => farm.items)
        .filter((item) => selectedItems.includes(item.id));

      // Call moveToCheckout (backend updates status to CHECKOUT)
      // await cartService.moveToCheckout(user.id);

      // Navigate to Buynow page with selected items
      navigate("/buynow", { state: { checkoutItems } });
    } catch (error) {
      setError(error.message);
      alert(`Checkout failed: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please log in to view your cart</div>;

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-4xl space-y-10 p-4">
          {cartItems.map((farm, index) => {
            const farmItemIds = farm.items.map((item) => item.id);
            const isFarmSelected = farmItemIds.every((id) =>
              selectedItems.includes(id)
            );

            return (
              <div key={index}>
                <div className="flex items-center gap-1 mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox mb-1"
                    checked={isFarmSelected}
                    onChange={() => handleSelectFarm(farm.items)}
                  />
                  <h2 className="text-green-600 font-semibold text-lg">
                    {farm.farm}
                  </h2>
                  <MdOutlineKeyboardArrowRight
                    className="text-gray-400 text-xl mb-1"
                    size={20}
                  />
                </div>
                <div className="bg-white shadow-md rounded p-4 space-y-4">
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
          })}
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddCart;
