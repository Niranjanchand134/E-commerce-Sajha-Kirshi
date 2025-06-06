import Footer from "./Footer";
import Header from "./Header";
import React, { useState } from "react";

const KYCform = () => {
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
        <Header/>
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
                <label form="name" className="mb-1">Full Name</label>
                <input type="text" id="name" className="border rounded p-2 w-full mb-2" />
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="number" className="mb-1">Mobile Number</label>
                    <input type="text" id="number" className="border rounded p-2 w-full" />
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-1">Email Address</label>
                    <input type="email" id="email" className="border rounded p-2 w-full" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full mt-3">
                    <label className="mb-1">Gender</label>
                    <div className="flex border rounded">
                      <button type="button" onClick={() => setGender("Male")} className={`px-4 py-2 ${
                          gender === "Male" ? "bg-green-500 rounded text-white" : "bg-white "
                        }`}
                      > Male </button>
                      <button type="button" onClick={() => setGender("Female")} className={`px-4 py-2 ${
                          gender === "Female" ? "bg-green-500 rounded text-white" : "bg-white"
                        }`}
                      > Female </button>
                      <button type="button" onClick={() => setGender("Other")} className={`px-4 py-2 ${
                          gender === "Other" ? "bg-green-500 rounded text-white" : "bg-white"
                        }`}
                      > Other </button>
                    </div>
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="date" className="mb-1">Birth Date</label>
                    <input type="date" id="date" placeholder="Enter email" className="border rounded p-2 w-full" />
                  </div>
                
                
                <div className="flex flex-col w-full mt-3">
                  <h2 className="text-lg">Profile Photo Upload</h2>
                <div className="flex flex-col md:flex-row items-center gap-6 ">
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
                </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-lg mb-4">2. Address</h2>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="province" className="mb-1">Province</label>
                    <select id="province" className="border rounded p-2 w-full">
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

                  <div className="flex flex-col w-full">
                    <label htmlFor="district" className="mb-1">District</label>
                    <select id="district" className="border rounded p-2 w-full">
                      <option value=""></option>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Chitwan">Chitwan</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="mb-1">Municipality / Rular Municipality</label>
                    <input type="text" id="name" className="border rounded p-2 w-full" />
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor="address" className="mb-1">Address</label>
                    <input type="text" id="address" className="border rounded p-2 w-full" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="ward" className="mb-1">Ward Number</label>
                    <input type="number" id="ward" className="border rounded p-2 w-full" />
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="tole" className="mb-1">Tole / Street</label>
                    <input type="text" id="tole" className="border rounded p-2 w-full" />
                  </div>

                  <div className="flex flex-col w-full mt-3">
                    <label htmlFor="landmark" className="mb-1">Landmark<span className="text-gray-600">(optional)</span></label>
                    <input type="text" id="landmark" className="border rounded p-2 w-full" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-lg mb-4">4. Identification and Business Info</h2>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="flex flex-col w-full">
                    <label htmlFor="citizenship" className="mb-1">Citizenship Number</label>
                    <input type="text" id="citizenship" className="border rounded p-2 w-full" />
                  </div>

                  <div className="flex flex-col w-full">
                    <label htmlFor="PAN" className="mb-1">PAN Number</label>
                    <input type="text" id="PAN" className="border rounded p-2 w-full" />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex flex-col gap-4 ">
                        <h2 className="text-lg">Citizen Card Image <span className="text-gray-100">(Font)</span></h2>

                        <div className="flex flex-col md:flex-row items-center gap-6">
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
                            <label className="cursor-pointer">
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
                      </div>
                      
                      <div className="">
                      <h2 className="text-lg mb-4">Pan Card Image</h2>
                      <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
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
                      </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg mb-4 mt-4">Citizen Card Image <span className="text-gray-100">(Back)</span></h2>
                  <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
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
        <Footer/>
        </>
    )
}

export default KYCform;