import Carousel from "./Component/scroll";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import OtherContent from "./Component/OtherContent";
import Product from "./Component/Product";

const Landing = () => {
  const categories = [
    { name: "Apple", image: "/assets/BuyersImg/images/apple.png" },
    { name: "Potato", image: "/assets/BuyersImg/images/potato.png" },
    { name: "Cauli Flower", image: "/assets/BuyersImg/images/cauli.png" },
    { name: "Tomato", image: "/assets/BuyersImg/images/tomato.png" },
    { name: "Carrot", image: "/assets/BuyersImg/images/carrot.png" },
    { name: "Lemon", image: "/assets/BuyersImg/images/lemon.png" },
    { name: "Corn", image: "/assets/BuyersImg/images/corn.png" },
  ];

  return (
    <>
      <Header />
      <Carousel />
      
      {/* Category Section */}
      <div className="my-8 px-4">
        <div className="mx-auto max-w-screen-lg">
          <h3 className="text-2xl ml-4 font-bold text-gray-800 mb-4">Shop by Categories</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 justify-around">
            {categories.map((cat, index) => (
              <div key={index} className="flex flex-col items-center p-2 bg-white rounded-lg  hover:shadow-md transition w-full h-28">
                <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain" />
                <span className="text-sm mt-2 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Product />
      <OtherContent />
      <Footer />
    </>
  );
};

export default Landing;
