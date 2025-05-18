import { Link } from 'react-router-dom';

const Product = () => {
    return(
        <>
        <div>
            <div className="text-center p-4">
                <p className="text-[#EEC044]">Recently Added</p>
                <h2 className="font-bold">Products</h2>
            </div>
            <div className="d-flex justify-content-around align-items-center mb-4">
                <h2>Listings</h2>
                <a to="#" className="m-2">View All</a>
            </div>
            <div class="grid grid-cols-3 pr-60 pl-60 justify-between gap-4">
                <div class="text-center rounded">
                    <img src="/assets/BuyersImg/Products/Onion.png" alt="Onion"/>
                    <div className="p-2">
                        <h5>Onions</h5>
                        <p>&20.00</p>
                    </div>
                </div>
                <div class="text-center rounded">
                    <img src="/assets/BuyersImg/Products/Carrot.jpg" alt="Onion"/>
                    <div className="p-2">
                        <h5>Onions</h5>
                        <p>&20.00</p>
                    </div>
                </div>
                <div class="text-center rounded">
                    <img src="/assets/BuyersImg/Products/Tomato.png" alt="Onion"/>
                    <div className="p-2">
                        <h5>Onions</h5>
                        <p>&20.00</p>
                    </div>
                </div>
                <div class="text-center rounded">
                    <img src="/assets/BuyersImg/Products/Grapes.png" alt="Onion"/>
                    <div className="p-2">
                        <h5>Onions</h5>
                        <p>&20.00</p>
                    </div>
                </div>
                <div class="text-center rounded">
                    <img src="/assets/BuyersImg/Products/Lasun.png" alt="Onion"/>
                    <div className="p-2">
                        <h5>Onions</h5>
                        <p>&20.00</p>
                    </div>
                </div>
                <div class="text-center rounded">
                    <img src="/assets/BuyersImg/Products/Rayo.png" alt="Onion"/>
                    <div className="p-2">
                        <h5>Onions</h5>
                        <p>&20.00</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Product;