

const OtherContent = () => {
    return(
        <>
        {/*cart*/}
        <div className=""> 
        <div className="absolute z-20 -mt-40 flex pr-60 pl-60 justify-between gap-4">
            <div className=" text-center">
                <img src="/assets/BuyersImg/Contentimg/cart1.png" alt="cart" className="object-cover "/>
                <div className="absolute z-40 -mt-20 ml-8">
                <button className=" bg-green-500 text-white font-semibold px-3 py-2 rounded ">
                    Order Now
                </button>
                </div>
            </div>
            <div className="text-center">
                <img src="/assets/BuyersImg/Contentimg/cart2.png" alt="cart" className="object-cover"/>
                <div className="absolute z-40 -mt-20 ml-8">
                    <button className=" bg-green-500 text-white font-semibold px-3 py-2 rounded">
                        Order Now
                    </button>
                </div>
            </div>
        </div>
        
        <div  className="relative overflow-hidden z-10 mt-44 flex items-center justify-center text-center"
            style={{
                height: "300px", width:"100%",backgroundSize: "cover", backgroundPosition: "center",
                backgroundImage:
                    "url('/assets/BuyersImg/images/section-03.png')",
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
                        { name: "Kevin Smith", img: "https://c8.alamy.com/comp/KD0EGE/nepali-farmer-carrying-wheat-kathmandu-valley-nepal-KD0EGE.jpg" },
                        { name: "Jessica Brown", img: "https://english.onlinekhabar.com/wp-content/uploads/2017/01/isard2.jpg" },
                        { name: "David Martin", img: "https://i.pinimg.com/736x/2b/90/b7/2b90b75c737128ef4748d41d627c402f.jpg" }
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
                        <img src="https://media.istockphoto.com/id/1350039123/photo/nepalese-plowing-a-field.jpg?s=612x612&w=0&k=20&c=IgpNRS0gY62_SuOCJykkAQ3aKuZ2DpqUtoWRFFeo5_o=" alt="Onion" className="w-full h-[126px] object-cover"/>
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
                        <img src="https://assets-cdn.kathmandupost.com/uploads/source/news/2023/opinion/leadShutterstock1769145530-1685549421.jpg" alt="Onion" className="w-full h-[126px] object-cover"/>
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