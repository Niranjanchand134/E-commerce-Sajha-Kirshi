import { Carousel } from "antd";

const scroll = () => {
    return(
        <>
        <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000} arrows infinite={false} className="">
              <div>
                <img src="/assets/BuyersImg/images/cover.png" alt="cover image" className=" h-full" />
              </div>
              <div>
                <img src="/assets/BuyersImg/images/cover.png" alt="cover image" className=" h-full" />
              </div>
              <div>
                <img src="/assets/BuyersImg/images/cover.png" alt="cover image" className=" h-full" />
              </div>
              <div>
                <img src="/assets/BuyersImg/images/cover.png" alt="cover image" className=" h-full" />
              </div>
            </Carousel>

            <div className="absolute top-1/2 ml-[150px] text-left -translate-y-1/2 z-10">
              <h1 className="w-64 text-white font-bold text-4xl sm:text-5xl md:text-[60px] font-mono">
                <span className="text-[#EEC044]">Agriculture</span> &Organic Market
              </h1>
              <button className="mt-4 bg-green-500 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300">
                Shop Now
              </button>
            </div>

          <div className="flex justify-between items-center relative  bg-white shadow-lg rounded-lg p-4 gap-4 mx-auto -mt-[30px] max-w-screen-md">
              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <img src="/assets/BuyersImg/images/item1.png" alt="Organic Products" className="w-12 h-12" />
                <div>
                  <h5 className="font-bold text-sm">Organic Products</h5>
                  <p className="text-xs text-gray-600">Money Back Guarantee</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <img src="/assets/BuyersImg/images/item2.png" alt="Easy Shopping" className="w-12 h-12" />
                <div>
                  <h5 className="font-bold text-sm">Easy Shopping</h5>
                  <p className="text-xs text-gray-600">On All Orders Over $45.00</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <img src="/assets/BuyersImg/images/item3.png" alt="Direct From The Farm" className="w-12 h-12" />
                <div>
                  <h5 className="font-bold text-sm">Direct From The Farm</h5>
                  <p className="text-xs text-gray-600">Find Your Nearest Store</p>
                </div>
              </div>
            </div>
        </>
    )
}

export default scroll;