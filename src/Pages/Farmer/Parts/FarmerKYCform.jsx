import React, { useState } from "react";


const FarmerKYCform = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [gender, setGender] = useState("");
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

    const steps = [
        { step: 1, label: "Personal Information" },
        { step: 2, label: "Address" },
        { step: 3, label: "Identification and Business Info" },
    ];

    const handleImageChange = (e) => {
    const file = e.target.files[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        }
    };

    const handleRemove = () => {
        setImage(null);
    };
    return(
        <>
        <div className="flex justify-center">
            <div className="bg-[#4BAF47] text-white p-4 md:p-8 max-w-4xl w-full">
                <h5>Almost done, please follow the remarks below to  complete KYC</h5>
                <p>Please upload photo and one of  the following documents :</p>
                <ul>
                    <li>Citizenship Certificate</li>
                    <li>Driving Licence</li>
                    <li>Passport</li>
                </ul>
            </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-6">
            {/* Stepper */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-2 lg:space-x-4 mb-8">
            {steps.map((s, index) => (
                <React.Fragment key={s.step}>
                <div className="flex items-center">
                    <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600 mb-1">Step</span>
                    <button
                        onClick={() => setCurrentStep(s.step)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center
                        ${currentStep === s.step ? "bg-[#4BAF47] text-white" : "border border-gray-400 text-black"}`}
                    >
                        {s.step}
                    </button>
                    <span className="text-sm mt-1 text-center w-64 md:w-48 lg:w-64">{s.label}</span>
                    </div>
                </div>
                {/* Arrow → */}
                {index < steps.length - 1 && (
                    <div className="text-xl md:text-2xl lg:text-3xl text-gray-500 rotate-90 md:rotate-0">→</div>
                )}
                </React.Fragment>
            ))}
            </div>

            {/* Form Content */}
            <div className="mt-8">
            {currentStep === 1 && (
                <div>
                    <h2 className="text-lg mb-4">1. Personal Information</h2>
                    <label form="name" className="mb-1 font-semibold">Full Name</label>
                    <input type="text" id="name" className="border rounded-full p-2 w-full mb-2" />
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                    <div className="flex flex-col w-full">
                        <label htmlFor="number" className="mb-1 font-semibold">Mobile Number</label>
                        <input type="text" id="number" className="border rounded-full p-2 w-full" />
                    </div>

                    <div className="flex flex-col w-full">
                        <label htmlFor="email" className="mb-1 font-semibold">Email Address</label>
                        <input type="email" id="email" className="border rounded-full p-2 w-full" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col w-full mt-3">
                        <label htmlFor="date" className="mb-1 font-semibold">Permanent Address</label>
                        <input type="text" id="date" className="border rounded-full p-2 w-full" />
                    </div>

                    <div className="flex flex-col w-full mt-3">
                        <label className="mb-1 font-semibold">Gender</label>
                        <div className="flex border rounded-full">
                            <button type="button" onClick={() => setGender("Male")} className={`px-4 py-2 ${
                                gender === "Male" ? "bg-green-500 rounded-full text-white" : "bg-white "
                            }`}
                            > Male </button>
                            <button type="button" onClick={() => setGender("Female")} className={`px-4 py-2 ${
                                gender === "Female" ? "bg-green-500 rounded-full text-white" : "bg-white"
                            }`}
                            > Female </button>
                            <button type="button" onClick={() => setGender("Other")} className={`px-4 py-2 ${
                                gender === "Other" ? "bg-green-500 rounded-full text-white" : "bg-white"
                            }`}
                            > Other </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full mt-3">
                        <label htmlFor="date" className="mb-1 font-semibold">Birth Date</label>
                        <input type="date" id="date" placeholder="Enter email" className="border rounded-full p-2 w-full" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                    <div className="flex flex-col w-full">
                        <label htmlFor="number" className="mb-1 font-semibold">Citizenship Number</label>
                        <input type="text" id="number" className="border rounded-full p-2 w-full" />
                    </div>

                    <div className="flex flex-col w-full">
                        <label htmlFor="citizendistrict" className="mb-1 font-semibold">Citizenship Issued District</label>
                        <select id="citizendistrict" className="border rounded-full p-2 w-full">
                            <option value=""></option>
                            <option value="Province 1">Province 1</option>
                            <option value="Province 2">Province 2</option>
                            <option value="Bagmati Province">Bagmati Province</option>
                            <option value="Gandaki Province">Gandaki Province</option>
                            <option value="Lumbini Province">Lumbini Province</option>
                            <option value="Karnali Province">Karnali Province</option>
                            <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                        </select>
                    </div>
                </div>
                <h2 className="text-lg py-3">Upload Citizenship Document <span className="">(Front & Back)</span></h2>
                <div className="flex flex-col-2 gap-8 ">
                    <div>
                        <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2">
                            {/* Profile Picture Preview */}
                            <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                            {image ? (
                                <img src={image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Image
                                </div>
                            )}
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-rows-2 gap-4">
                            <label className="cursor-pointer mt-1">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">Upload</span>
                            </label>
                            <button
                                onClick={handleRemove}
                                disabled={!image}
                                className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        <h5 className="text-lg py-3 text-center">Front</h5>
                    </div>
                    <div>
                        <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2">
                            {/* Profile Picture Preview */}
                            <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                            {image ? (
                                <img src={image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Image
                                </div>
                            )}
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-rows-2 gap-4">
                            <label className="cursor-pointer mt-1">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">Upload</span>
                            </label>
                            <button
                                onClick={handleRemove}
                                disabled={!image}
                                className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        <h5 className="text-lg py-3 text-center">Back</h5>
                    </div>
                </div>
                </div>
            )}

            {currentStep === 2 && (
                <div>
                    <div className="flex justify-between">
                        <div>
                            <h2 className="text-lg mb-4">2. Address</h2>
                        </div>
                        <div className="relative w-64 mb-4 max-w-sm mr-6 shadow rounded ">
                            <input
                                type="text"
                                placeholder="Search Google Maps"
                                className="w-64 p-1 border rounded outline-none"
                                aria-label="Search"
                            />
                            <i className="fas fa-search fa-lg absolute right-3 mt-3 text-gray-500 pointer-events-none"></i>
                        </div>
                    </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
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
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-2">
                    <div className="flex flex-col w-full mt-3">
                    <label htmlFor="capacity" className="mb-1 font-semibold">Total Annual Production Capacity</label>
                    <input type="text" id="capacity" placeholder="2000 KG" className="border rounded-full p-2 w-32 placeholder-black font-semibold" />
                    </div>

                    <div className="flex flex-col w-full mt-3">
                    <label htmlFor="crops" className="mb-1 font-semibold">Primary Crops</label>
                    <select id="crops" className="border rounded-full p-2 w-32">
                        <option value="">Tomato</option>
                        <option value="Province 1">Province 1</option>
                        <option value="Province 2">Province 2</option>
                        <option value="Bagmati Province">Bagmati Province</option>
                        <option value="Gandaki Province">Gandaki Province</option>
                        <option value="Lumbini Province">Lumbini Province</option>
                        <option value="Karnali Province">Karnali Province</option>
                        <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                    </select>
                    </div>

                    <div className="flex flex-col w-full mt-3">
                    <label htmlFor="size" className="mb-1 font-semibold">Farm Size<span className="text-gray-600">(in ropani / hectares)</span></label>
                    <div className="flex items-center border rounded-full p-2 w-32">
                        <input
                            type="text"
                            id="size"
                            placeholder="20"
                            className="outline-none w-10 placeholder-black font-semibold"
                        />
                        <select className="outline-none bg-transparent">
                            <option value="">Ropani</option>
                            <option value="apple">Apple</option>
                            <option value="banana">Banana</option>
                            <option value="mango">Mango</option>
                        </select>
                        </div>
                    </div>
                </div>
                </div>
            )}

            {currentStep === 3 && (
                <div>
                <div className="flex justify-between">
                    <h2 className="text-lg mb-4">3. Farming Experience <span className="text-gray-600">(Optional)</span></h2>
                    <h2 className="text-lg mb-4 mr-60 text-left">Farm picture</h2>
                </div>
                <div className="flex flex-col-2 gap-4 justify-content-between ">
                    <div className="flow flow-rows-2 md:flex-row-2 space-y-4 mt-3">
                        <div className="flex flex-col">
                        <label htmlFor="citizenship" className="mb-1">Citizenship Number</label>
                        <input type="text" id="citizenship" className="border rounded p-2 w-96" />
                        </div>

                        <div className="flex flex-col w-full">
                        <label htmlFor="PAN" className="mb-1">PAN Number</label>
                        <input type="text" id="PAN" className="border rounded p-2 w-full" />
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col md:flex-row items-center gap-6 border-1 border-black rounded p-2 mx-20">
                            {/* Profile Picture Preview */}
                            <div className="w-32 h-32 rounded overflow-hidden border border-gray-300">
                            {image ? (
                                <img src={image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Image
                                </div>
                            )}
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-rows-2 gap-4">
                            <label className="cursor-pointer mt-1">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">Upload</span>
                            </label>
                            <button
                                onClick={handleRemove}
                                disabled={!image}
                                className="px-3 py-2 border border-black text-black rounded text-sm hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        <h5 className="text-lg py-3 text-center">Picture Of Certificate</h5>
                    </div>
                </div>
                <h2 className="text-lg mb-4">4. Bank & Payment Details</h2>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                    <div className="flex flex-col w-full">
                        <label htmlFor="number" className="mb-1 font-semibold">Bank Account Name</label>
                        <input type="text" id="number" className="border rounded-full p-2 w-full" />
                    </div>

                    <div className="flex flex-col w-full">
                        <label htmlFor="email" className="mb-1 font-semibold">Bank Account Number</label>
                        <input type="email" id="email" className="border rounded-full p-2 w-full" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                    <div className="flex flex-col w-full">
                        <label htmlFor="number" className="mb-1 font-semibold">PAN Number<span className="text-gray-600">(Optional)</span></label>
                        <input type="text" id="number" className="border rounded-full p-2 w-full" />
                    </div>

                    <div className="flex flex-col w-full">
                        <label htmlFor="email" className="mb-1 font-semibold">eSewa / Khalti ID<span className="text-gray-600">(Optional)</span></label>
                        <input type="email" id="email" className="border rounded-full p-2 w-full" />
                    </div>
                </div>
                </div>
            )}
            </div>

            {/* Navigation Buttons */}
            <div className="text-center p-4 md:p-8">
                <h4 className="text-green-500 p-2">Have doubts? Worry not!</h4>
                <div className="flex gap-3 justify-center">
                <button disabled={currentStep === 1} onClick={() => setCurrentStep(currentStep - 1)} className="bg-[#EFBE44] p-2 w-32 rounded-full text-white text-1xl font-bold">Previous</button>
                <button disabled={currentStep === steps.length} onClick={() => setCurrentStep(currentStep + 1)} className="bg-[#4BAF47] p-2 w-32 rounded-full text-white text-1xl font-bold">Next</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default FarmerKYCform;