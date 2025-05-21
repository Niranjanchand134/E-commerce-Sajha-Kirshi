import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';

const Product = () => {
  return (
    <>
      <div>
        <div className="text-center p-4">
          <p className="text-[#EEC044]">Recently Added</p>
          <h2 className="font-bold">Products</h2>
        </div>

        <div className="flex justify-around items-center flex-wrap mb-4 px-4">
          <h2>Listings</h2>
          <Link to="buyer-shop" className="m-2 text-black">View All <RightOutlined /></Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:px-60">
          <div className="text-center rounded">
            <img src="/assets/BuyersImg/Products/Onion.png" alt="Onion" />
            <div className="p-2">
              <h5>Onions</h5>
              <p>&20.00</p>
            </div>
          </div>

          <div className="text-center rounded">
            <img src="/assets/BuyersImg/Products/Carrot.jpg" alt="Carrot" />
            <div className="p-2">
              <h5>Carrot</h5>
              <p>&20.00</p>
            </div>
          </div>

          <div className="text-center rounded">
            <img src="/assets/BuyersImg/Products/Tomato.png" alt="Tomato" />
            <div className="p-2">
              <h5>Tomato</h5>
              <p>&20.00</p>
            </div>
          </div>

          <div className="text-center rounded">
            <img src="/assets/BuyersImg/Products/Grapes.png" alt="Grapes" />
            <div className="p-2">
              <h5>Grapes</h5>
              <p>&20.00</p>
            </div>
          </div>

          <div className="text-center rounded">
            <img src="/assets/BuyersImg/Products/Lasun.png" alt="Garlic" />
            <div className="p-2">
              <h5>Garlic</h5>
              <p>&20.00</p>
            </div>
          </div>

          <div className="text-center rounded">
            <img src="/assets/BuyersImg/Products/Rayo.png" alt="Mustard Leaves" />
            <div className="p-2">
              <h5>Mustard Leaves</h5>
              <p>&20.00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
