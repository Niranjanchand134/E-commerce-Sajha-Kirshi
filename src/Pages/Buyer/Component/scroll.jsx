import { Carousel } from "antd";

const Scroll = () => {
  return (
    <>
      {/* Carousel Section */}
      <div className="relative">
        <Carousel autoplay autoplaySpeed={5000} arrows={false} infinite>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <img
                src="/assets/BuyersImg/images/cover.png"
                alt="cover"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
            </div>
          ))}
        </Carousel>

        {/* Overlayed Text and Button */}
        <div className="absolute top-1/2 left-4 sm:left-10 md:left-20 -translate-y-1/2 z-10 text-left">
          <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full max-w-md font-mono leading-tight">
            <span className="text-[#EEC044]">Agriculture</span> & Organic Market
          </h1>
          <button className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300">
            Shop Now
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="relative -mt-6 md:-mt-10 z-20">
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-4 flex flex-col sm:flex-row sm:justify-around items-center gap-2 max-w-screen-lg mx-auto">
          {/* Feature 1 */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <img src="/assets/BuyersImg/images/item1.png" alt="Organic Products" className="w-12 h-12" />
            <div>
              <h5 className="font-bold text-sm">Organic Products</h5>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <img src="/assets/BuyersImg/images/item2.png" alt="Easy Shopping" className="w-12 h-12" />
            <div>
              <h5 className="font-bold text-sm">Easy Shopping</h5>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <img src="/assets/BuyersImg/images/item3.png" alt="Direct From The Farm" className="w-12 h-12" />
            <div>
              <h5 className="font-bold text-sm">Easy Payment</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scroll;
