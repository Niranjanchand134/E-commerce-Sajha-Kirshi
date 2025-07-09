

const OtherContent = () => {
    return(
        <>
        {/*cart*/}
        <div className="flex pr-60 pl-60 justify-between gap-4">
            <div className="text-center">
                <img src="/assets/BuyersImg/Contentimg/cart1.png" alt="cart" className="object-cover "/>
                <button className="mt-4 bg-green-500 hover:bg-green-500 text-white font-semibold px-3 py-2 rounded ">
                    Order Now
                </button>
            </div>
            <div className="text-center">
                <img src="/assets/BuyersImg/Contentimg/cart2.png" alt="cart" className="object-cover"/>
                    <button className="mt-4 bg-green-500 hover:bg-blue-500 text-white font-semibold px-3 py-2 rounded">
                        Order Now
                    </button>
            </div>
        </div><br/>
        <div  className="flex items-center justify-center text-center"
            style={{
                height: "300px", width:"100%",backgroundSize: "cover", backgroundPosition: "center",
                backgroundImage:
                    "url('https://img.freepik.com/premium-photo/variety-vegetables-fruits-sale-market-nicosia-cyprus-closeup-view-with-details_771335-22607.jpg')",
            }}
        >
            <div className="text-white items-center p-4 w-full">
                <h1 className="text-4xl font-bold ">
                    Be Healthy & Eat Only Fresh <br /> Organic Vegetables
                </h1>
                <button className="bg-green-500 px-6 py-2 text-white rounded shadow">
                    Shop Now
                </button>
            </div>
        </div>
        {/*end cart */}

        {/*top farmers */}
        <div className="bg-[#E9F1EE] p-4">
            <div className="text-center p-4">
                <p className="text-[#EEC044]">Customer's</p>
                <h2 className="font-bold">Meet Our Farmers</h2>
            </div>
            <div className="px-6 sm:px-6 md:px-10 lg:px-20 xl:px-60">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { name: "Kevin Smith", img: "/assets/BuyersImg/Contentimg/person1.png" },
                        { name: "Jessica Brown", img: "/assets/BuyersImg/Contentimg/person2.png" },
                        { name: "David Martin", img: "/assets/BuyersImg/Contentimg/person3.png" }
                    ].map((person, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                height: "275px",
                                backgroundImage: `url('${person.img}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {/* Bottom bar with button */}
                            <div className="absolute bottom-0 right-0 left-0 p-2 flex justify-end items-end bg-gradient-to-t from-black/60 to-transparent">
                                <div className="relative inline-block">
                                    {/* Icon overlapping the left of button */}
                                    <i className="fa-solid fa-share-nodes bg-green-500 text-white p-2 rounded absolute -left-5 top-1/2 transform -translate-y-1/2 z-10"></i>

                                    {/* Button */}
                                    <button className="bg-white px-6 py-2 text-black rounded-l-lg shadow pl-8">
                                        {person.name}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/*end top farmers */}


        {/*our blog */}
        <div className="text-center p-4">
            <p className="text-[#EEC044]">Latest News</p>
            <h2 className="font-bold">Check out our blog posts</h2>
        </div>
        <div class="flex flex-col md:flex-row px-4 justify-center md:px-10 lg:px-40 gap-4">
            <div className="rounded-2xl mb-4 flex items-center  text-center w-full md:w-[400px] h-[300px]"
                style={{
                    backgroundImage: "url('/assets/BuyersImg/Contentimg/1.jpg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                >
                <div className="p-4">
                    <h5 className="mb-2 text-white text-lg font-bold">
                    Miscovery incommode earnestly commanded if.
                    </h5>
                    <p className="mb-2 text-white">
                    Seeing rather her you not esteem men settle genius excuse. Deal say over
                    you age from. Comparison new ham melancholy son themselves.
                    </p>
                    <a href="#" className="text-white">Continue Reading →</a>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="text-center rounded w-full md:w-[250px]">
                    <div style={{ width: "100%", height: "150px" }}>
                        <img src="/assets/BuyersImg/Contentimg/2p.png" alt="Onion" className="w-full h-[126px] object-cover"/>
                        <div
                            style={{
                            backgroundColor: "#49A760",
                            color: "black",
                            padding: "2px 8px",
                            width: "88px"
                            }}
                        >
                            Aug, 2023
                        </div>
                    </div>
                    <div className="p-2 text-left">
                        <p className="text-[#666666]">Md Sohag . 25 April, 2023</p>
                        <h5>Expression acceptance imprudence particular</h5>
                        <a href="#">Continue Reading → </a>
                    </div>
                </div>
                <div class="text-center rounded w-full md:w-[250px]">
                    <div style={{ width: "100%", height: "150px" }}>
                        <img src="/assets/BuyersImg/Contentimg/3p.png" alt="Onion" className="w-full h-[126px] object-cover"/>
                        <div
                            style={{
                            backgroundColor: "#49A760",
                            color: "black",
                            padding: "2px 8px",
                            width: "88px"
                            }}
                        >
                            Aug, 2023
                        </div>
                    </div>
                    <div className="p-2 text-left">
                        <p className="text-[#666666]">Md Sohag . 25 April, 2023</p>
                        <h5>Expression acceptance imprudence particular</h5>
                        <a href="#">Continue Reading → </a>
                    </div>
                </div>
            </div>
        </div>
        {/*end our blog */}

        <div className="flex flex-col lg:flex-row bg-green-500 mt-10">
            <div className="w-full lg:w-1/2">
                <img 
                    src="/assets/BuyersImg/Contentimg/farmer.png" 
                    alt="picture of farmer" 
                    className="w-full h-auto lg:h-[430px] object-cover"
                ></img>
            </div>
            <div className="text-white p-4 m-4 w-full lg:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold">Healthy life with fresh products</h2>
                <p className="my-4 text-sm md:text-base">
                    Consume ipsum dolor sit amet consectetur adipisicing elit. Veritatis, illo ullam
                    harum et fuga suscipit quibusdam sapiente. Corrupti ut consequatur magni minus!
                    Iusto eos consectetur similique minus culpa odio temporibus.
                </p>
                <div className="flex flex-col md:flex-row">
                    <div className="mb-4 md:mb-0 md:mr-8">
                        <img 
                            src="/assets/BuyersImg/Contentimg/persentage1.png" 
                            alt="persentage"
                            className="w-full max-w-[200px]"
                        ></img>
                        <h5 className="font-semibold mt-2">Organic Solutions</h5>
                    </div>
                    <div>
                        <ul className="list-disc pl-5">
                            <li>Biodynamic food</li>
                            <li>Biodynamic food</li>
                            <li>Biodynamic food</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default OtherContent;