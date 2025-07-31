import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const OtherContent = () => {
     const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Sajha Krishi?",
      answer: "Sajha Krishi is an online platform that connects farmers and buyers directly to trade fresh agricultural produce like fruits, vegetables, and grains with transparency and trust."
    },
    {
      question: "How do I register as a farmer or buyer?",
      answer: "Click on the Sign Up button and choose your role as either a Farmer or a Buyer. Fill out the required details and complete the KYC process to start using the platform."
    },
    {
      question: "What documents are required for KYC verification?",
      answer: "For farmers: Citizenship number, scanned citizenship image, farm details, and bank info. For buyers: Citizenship number and optional business PAN (for shops/businesses)."
    },
    {
      question: "How do I add a product for sale?",
      answer: "Log in to your Farmer Dashboard and click on “Add New Product.” Enter the details like product name, price per unit, quantity, and upload a clear photo."
    },
    {
      question: "Can I chat with buyers/farmers before making a deal?",
      answer: "Yes, Sajha Krishi offers an in-platform chat feature where farmers and buyers can communicate directly regarding product availability, pricing, and delivery."
    }
  ];
    return(
        <>
        {/*cart*/}
        <div className=""> 
        <div className="absolute z-20 -mt-40 flex pr-60 pl-60 justify-between gap-4">
            <div className=" text-center">
                <img src="/assets/BuyersImg/Contentimg/cart1.png" alt="cart" className="object-cover "/>
            </div>
            <div className="text-center">
                <img src="/assets/BuyersImg/Contentimg/cart2.png" alt="cart" className="object-cover"/>
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
                <button className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300">
                    Shop Now
                </button>
            </div>
        </div>
        </div>
        {/*end cart */}

        {/* FAQ Question set */}
        <div className=" mx-auto px-4 py-8 ">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 bg-[#E9F1EE]"
                >
                    <button
                    className={`w-full px-6 py-4 text-left flex justify-between items-center ${activeIndex === index ? 'bg-gray-50' : 'hover:bg-[#E9F1EE]'}`}
                    onClick={() => toggleQuestion(index)}
                    >
                    <span className="text-lg font-medium text-gray-700">{faq.question}</span>
                    <span className="text-gray-500 transform transition-transform duration-300">
                        {activeIndex === index ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        )}
                    </span>
                    </button>
                    
                    <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 pb-4' : 'max-h-0'}`}
                    >
                    <p className="text-gray-600">{faq.answer}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/*top farmers */}
        {/* <div className="bg-[#E9F1EE] p-4">
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
                            Bottom bar with button
                            <div className="absolute bottom-0 right-0 left-0 p-2 flex justify-end items-end bg-gradient-to-t from-black/60 to-transparent">
                                <div className="relative inline-block">
                                    Icon overlapping the left of button
                                    <i className="fa-solid fa-share-nodes bg-green-500 text-white p-2 rounded absolute -left-5 top-1/2 transform -translate-y-1/2 z-10"></i>

                                    Button
                                    <button className="bg-white px-6 py-2 text-black rounded-l-lg shadow pl-8">
                                        {person.name}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div> */}
        {/*end top farmers */}


        {/*our blog */}
        {/* <div className="text-center p-4">
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
        </div> */}
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