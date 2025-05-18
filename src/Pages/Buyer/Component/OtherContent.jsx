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
        <div className="bg-cyen-500 p-4">
            <div className="text-center p-4">
                <p className="text-[#EEC044]">Customer’s</p>
                <h2 className="font-bold">Meet Our Farmers</h2>
            </div>
            <div class="grid grid-cols-3 pr-60 pl-60 justify-between gap-4">
                <div className="rounded-2xl"
                    style={{
                        height: "275px",
                        width: "100%",
                        backgroundImage: "url('/assets/BuyersImg/Contentimg/person1.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    >
                    <div className="bg-opacity-40 bottom-0 content-end text-end text-white">
                        <i className="fa-solid fa-share-nodes bg-green-500 rounded text-white p-2"></i>
                        <button className="bg-white px-6 py-2 text-black rounded-l-lg shadow">Kevin Smith</button>
                    </div>
                </div>

                <div className="rounded-2xl"
                    style={{
                        height: "275px",
                        width: "100%",
                        backgroundImage: "url('/assets/BuyersImg/Contentimg/person2.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    >
                    <div className="bottom-0 content-end text-end text-white">
                        <i className="fa-solid fa-share-nodes bg-green-500 rounded text-white p-2"></i>
                        <button className="bg-white px-6 py-2 text-black rounded-l-lg shadow">Jessica Brown</button>
                    </div>
                </div>

                <div className="rounded-2xl"
                    style={{
                        height: "275px",
                        width: "100%",
                        backgroundImage: "url('/assets/BuyersImg/Contentimg/person3.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    >
                    <div className="bg-opacity-40 bottom-0 content-end text-end text-white">
                        <i className="fa-solid fa-share-nodes bg-green-500 rounded text-white p-2"></i>
                        <button className="bg-white px-6 py-2 text-black rounded-l-lg shadow">David Martin</button>
                    </div>
                </div>
            </div>
        </div>
        {/*end top farmers */}


        {/*our blog */}
        <div className="text-center  p-4">
            <p className="text-[#EEC044]">Latest News</p>
            <h2 className="font-bold">Check out our blog posts</h2>
        </div>
        <div class="flex pr-40 pl-40 gap-4">
            <div className="rounded-2xl mb-4 flex items-center justify-center text-center"
                style={{
                    height: "300px",
                    width: "700px",
                    backgroundImage: "url('/assets/BuyersImg/Contentimg/1.jpg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                >
                <div>
                    <h5 className="mb-2 text-white text-lg font-bold">
                    Miscovery incommode earnestly commanded if.
                    </h5>
                    <p className="mb-2 text-white">
                    Seeing rather her you not esteem men settle genius excuse. Deal say over
                    you age from. Comparison new ham melancholy son themselves.
                    </p>
                    <a href="#">Continue Reading →</a>
                </div>
                </div>

            <div class="text-center  rounded">
                <div style={{  width: "250px", height: "150px" }}>
                    <img src="/assets/BuyersImg/Contentimg/2p.png" alt="Onion" style={{ height: "126px", width: "250px" }}/>
                    {/* <div
                        style={{
                        position: "absolute",
                        bottom: "24px",
                        left: "0px",
                        width:"87px",
                        backgroundColor: "yellow",
                        color: "black",
                        fontWeight: "bold",
                        padding: "8px 12px"
                        }}
                    >
                        26
                    </div> */}
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
            <div class="text-center  rounded">
                <div style={{ width: "250px", height: "150px" }}>
                    <img src="/assets/BuyersImg/Contentimg/3p.png" alt="Onion" style={{ height: "126px", width: "250px", objectFit: "cover" }}/>
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
        </div><br/><br/>
        {/*end our blog */}

        <div className="flex bg-green-500 mt-10">
            <div>
                <img src="/assets/BuyersImg/Contentimg/farmer.png" alt="picture of farmer" style={{ height: "430px", width: "1200px", objectFit: "cover" }}></img>
            </div>
            <div className="text-white p-4 m-4">
                <h2>Healthy life with fresh products</h2>
                <p>Consume ipsum dolor sit amet consectetur adipisicing elit. Veritatis, illo ullam
                    harum et fuga suscipit quibusdam sapiente. Corrupti ut consequatur magni minus!
                    Iusto eos consectetur similique minus culpa odio temporibus.
                </p>
                <div className="flex">
                    <div>
                        <img src="/assets/BuyersImg/Contentimg/persentage1.png" alt="persentage"></img>
                        <h5>Organic Solutions</h5>
                    </div>
                    <div>
                        <ul>
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