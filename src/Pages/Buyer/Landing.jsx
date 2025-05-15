import Carousel from "./Component/scroll";
import Footer from "./Component/Footer";
import Header from "./Component/Header";
import OtherContent from "./Component/OtherContent";
import Product from "./Component/Product";

const Landing = () => {
    return(
        <>
          <Header/>
          <Carousel/>
            <div className="my-8 px-4">
              <div className="mx-auto max-w-screen-lg">
                <h3 className="text-2xl ml-4 font-bold text-gray-800">Shop by Categories</h3>
              </div><br/>

              <div className="flex justify-between items-center mx-auto max-w-screen-lg">
                  <div className="flex flex-col items-center p-2 bg-white  w-24 h-28">
                    <img src="/assets/BuyersImg/images/apple.png" alt="Apple" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Apple</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-white w-24 h-28">
                    <img src="/assets/BuyersImg/images/potato.png" alt="Potato" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Potato</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-white w-24 h-28">
                    <img src="/assets/BuyersImg/images/cauli.png" alt="Tomato" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Cauli Flower</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-white w-24 h-28">
                    <img src="/assets/BuyersImg/images/tomato.png" alt="Tomato" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Tomato</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-white w-24 h-28">
                    <img src="/assets/BuyersImg/images/carrot.png" alt="Carrot" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Carrot</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-white w-24 h-28">
                    <img src="/assets/BuyersImg/images/lemon.png" alt="Lemon" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Lemon</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-white w-24 h-28">
                    <img src="/assets/BuyersImg/images/corn.png" alt="Corn" className="w-20 h-20 object-contain" />
                    <span className="text-sm mt-2">Corn</span>
                  </div>
                </div>
            </div>
          <Product/>
          <OtherContent/>
          <Footer/>
        </>
    )
}

export default Landing;