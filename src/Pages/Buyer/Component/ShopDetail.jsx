import Footer from "./Footer";
import Header from "./Header";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

const ShopDetail = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    // Step 1: Create state for selected image
    const [selectedImage, setSelectedImage] = useState("/assets/BuyersImg/Products/Onion.png");

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -200 : 200,
                behavior: 'smooth',
            });
        }
    };

    const images = [
        "https://t4.ftcdn.net/jpg/02/52/93/81/360_F_252938192_JQQL8VoqyQVwVB98oRnZl83epseTVaHe.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr9R2LFMW25ZTV1rNW3UOXM8sWMdGjeTq81A&s",
        "https://yt3.googleusercontent.com/s5hlNKKDDQWjFGzYNnh8UeOW2j2w6id-cZGx7GdAA3d5Fu7zEi7ZMXEyslysuQUKigXNxtAB=s900-c-k-c0x00ffffff-no-rj",
        "https://bf1af2.a-cdn.akinoncloud.com/products/2024/10/01/146178/36fc22ee-1e52-430b-ba5b-d8229470fea3_size3840_cropCenter.jpg",
    ];

    const handleBuynowClick = () => {
        navigate('/buynow');
    };

    const handleAddCartClick = () => {
        // Get existing count or default to 0
        const count = parseInt(localStorage.getItem("cartCount") || "0");
        // Increment and update
        localStorage.setItem("cartCount", count + 1);

        alert("Product added to cart!");
        navigate('/addcart');
    };

    return (
        <>
            <Header />
            {/*Detail part */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 px-4 md:px-0">
                <div className="w-96 h-105 md:w-80 h-auto md:h-140 object-contain">
                    <img src={selectedImage} alt="Selected Product" className=" object-contain" />
                </div>
                <div className="w-full md:w-auto">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <h4>Tomato</h4>
                        <p className="mt-1 text-sm sm:text-base">(Minimum 20 kg of Order)</p>
                    </div>
                    <div className="flex text-green-500 gap-2">
                        <h5 className="">Rs. 50.00</h5>
                        <p className="text-sm mt-1">Per Kg</p>
                    </div>

                    <hr className="mt-1" />
                    <p className="w-full md:w-96 text-sm md:text-base">
                        Aliquam hendrerit a augue insuscipit. Etiam aliquam massa quis des mauris
                        commodo venenatis ligula commodo leez sed blandit convallis dignissim
                        onec vel pellentesque neque.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <h4 className="text-base font-semibold">Choose Quantity</h4>
                        <input
                            type="number"
                            placeholder=" /Kg"
                            className="w-full sm:w-20 border-2 border-solid border-black px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button onClick={handleAddCartClick} className="bg-green-600 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto">
                            Add to cart
                        </button>
                        <button onClick={handleBuynowClick} className="bg-[#EEC044] text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 w-full sm:w-auto">
                            Add to wishlist
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
                        <h5>Chat With the Farmer</h5>
                        <button className="bg-green-500 rounded text-white p-1">Message</button>
                    </div>
                    <div className="relative flex items-center w-full max-w-md mx-auto mt-4">
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 z-10 bg-transparent text-gray-600 text-xl p-2"
                        >
                            &#x276E;
                        </button>

                        <div
                            ref={scrollRef}
                            className="flex space-x-4 overflow-x-auto scroll-smooth px-8 no-scrollbar"
                        >
                            {images.map((src, index) => (
                            <div
                                key={index}
                                className="w-[80px] h-[80px] bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(src)}
                            >
                                <img
                                src={src}
                                alt={`Image ${index + 1}`}
                                className="w-[80px] h-[100px] object-contain"
                                />
                            </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 z-10 bg-transparent text-gray-600 text-xl p-2"
                        >
                            &#x276F;
                        </button>
                    </div>
                </div>
            </div>

            {/*About us part */}
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 text-white my-8">
                <div className="bg-green-600 rounded w-64 p-4">
                    <h4>About</h4>
                    <p>Lorem ipsum is simply free text
                        used by copytypinh refreshing.
                        Neque porro est qui
                    </p>
                </div>
                <div className="bg-[#C5CE38] rounded w-64 p-4">
                    <h4>Content</h4>
                    <p>+1- (246) 333-0079
                        support@agrios.com
                        Mon - Fri: 7:00 am - 6:00 pm
                    </p>
                </div>
                <div className="bg-[#EEC044] rounded w-64 p-4">
                    <h4>Address</h4>
                    <p>66 Broklun Road Golden Street,
                        New Your United States of
                        Ameriaca
                    </p>
                </div> 
            </div>


            {/*Google Map */}
            <div className="flex justify-content-center">
                <iframe
                    title="Kumaripati Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.522068845213!2d85.31823907471563!3d27.670254826203855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ce1dace9ed%3A0xfb9c8b305818fb7d!2sKumaripati%2C%20Lalitpur!5e0!3m2!1sen!2snp!4v1747846965367!5m2!1sen!2snp"
                    width="820"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/*Farm Detail */}
            <div className="flex flex-col items-center justify-center my-8">
                <div className="w-full max-w-4xl">
                    <h3 className="text-xl font-semibold mb-4 text-left ml-6">Farmer Details</h3>

                    <div className="flex items-start gap-6 bg-white p-6 rounded-lg">
                    <img
                        src="https://t4.ftcdn.net/jpg/02/23/50/73/360_F_223507349_F5RFU3kL6eMt5LijOaMbWLeHUTv165CB.jpg"
                        alt="farmer photo"
                        className="w-48 h-48 rounded object-cover"
                    />

                    <div className="max-w-xl">
                        <h5 className="text-lg font-semibold">Kevin Martin</h5>
                        <p className="text-green-500 mb-2">July 10, 2022</p>
                        <p className="text-gray-700">
                        It has survived not only five centuries, but also the leap into electronic typesetting unchanged.
                        It was popularised in the sheets containing Lorem Ipsum. Sint occaecat cupidatat non proident
                        sunt in culpa qui officia deserunt mollit anim id est laborum. Vivamus sed molestie sapien.
                        </p>
                    </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ShopDetail;
