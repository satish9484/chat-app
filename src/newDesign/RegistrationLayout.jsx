import React, { useState } from "react";
import { Link } from "react-router-dom";

const Registration = () => {
  const [selectedImage, setSelectedImage] = useState();

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };
  return (
    <>
      <section className="h-screen gradient-form bg-gray-200">
        <div className="container h-screen">
          <div className="flex justify-center items-center flex-wrap w-screen h-screen g-6 text-gray-800">
            <div className="flex items-center bg-white shadow-lg rounded-lg text-black px-4 md:p-12 md:mx-6 md:px-12 ">
              <div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">
                    Create your Free Account
                  </h4>
                </div>
                <form>
                  <div className=" md:grid grid-cols-2 gap-y-2 m-4">
                    <div className="flex flex-col h-full justify-center items-center gap-2 md:justify-start md:mt-2">
                      <input
                        type="text"
                        className="form-control block w-full  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="displayName"
                        name="displayName"
                        placeholder="Display Name"
                        value="Naruto"
                      />
                      <input
                        type="email"
                        className="form-control block w-full text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="email"
                        name="email"
                        placeholder="Email"
                      />

                      <input
                        type="password"
                        className="form-control block w-full  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="password"
                        placeholder="Password"
                      />
                    </div>

                    <div className="flex m-2 items-center justify-center  uppercase gap-y-2 text-sm">
                      <label className="grow-0 self-start">
                        <input
                          type="file"
                          accept="image/*"
                          name="image"
                          style={{ display: "none" }}
                          onChange={handleSelectImage}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </label>
                      <img
                        width="180"
                        hight="180"
                        className="rounded-full grow"
                        //src="https://theme4press.com/wp-content/uploads/2015/11/featured-small-circular.jpg"
                        src={selectedImage}
                        alt="Select An Avatar"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-1 mb-12 pb-1">
                    <button
                      type="submit"
                      class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-150"
                    >
                      SUBMIT
                    </button>
                    <p class="mt-2 text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account ?
                      <Link
                        to="#"
                        className="underline ml-2 font-medium text-primary-600 hover:underline dark:text-primary-500"
                      >
                        Login here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Registration;

// className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" htmlFor="file">
