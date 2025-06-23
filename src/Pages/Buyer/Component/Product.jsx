import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getProductByfarmer } from "../../../services/farmer/farmerApiService";
import { getAllProduct } from "../../../services/authService";

const Product = () => {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProduct();
        console.log("the reposnse od product..", response);
        setProduct(response);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProduct();
  }, []);

  return (
    <>
      <div>
        <div className="text-center p-4">
          <p className="text-[#EEC044]">Recently Added</p>
          <h2 className="font-bold">Products</h2>
        </div>

        <div className="flex justify-around items-center flex-wrap mb-4 px-4">
          <h2>Listings</h2>
          <Link to="buyer-shop" className="m-2 text-black">
            View All <RightOutlined />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:px-60">
          {products.map((product) => (
            <div className="text-center rounded">
              <img
                src={
                  product.imagePaths || "/assets/BuyersImg/Products/Onion.png"
                } // Fallback image if product.image doesn't exist
                alt={product.name}
              />
              <div className="flex justify-between">
                <div className="p-2">
                  <h5>{product.name}</h5>
                  <p className="text-green-500 text-lg">
                    Rs {product.price || "00.00"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mt-1">{product.farmName || "Farm Name"}</p>
                  <p>{product.location || "Location"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Product;
