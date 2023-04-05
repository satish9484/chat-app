import React from "react";
import { Link } from "react-router-dom";

const TailwindTest = () => {
  return (
    <>
      <section className="h-screen gradient-form bg-gray-200">
        <div className="container h-screen">
          <div className="flex justify-center items-center flex-wrap w-screen h-screen g-6 text-gray-800">
            <div
              className="flex items-center shadow-lg rounded-lg"
              style={{
                background:
                  "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
              }}
            >
              <div className="text-white px-4 md:p-12 md:mx-6">
                <div className=" px-4 md:px-0">
                  <div className="md:px-12 md:mx-6">
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        //src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        src="../public/Message.jpg"
                        alt="logo"
                      />
                      <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">
                        Welcome
                      </h4>
                    </div>
                    <form>
                      <p className="mb-4">Please login to your account</p>
                      <div className="mb-4">
                        <input
                          type="text"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          id="exampleFormControlInput1"
                          placeholder="Username"
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="password"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          id="exampleFormControlInput1"
                          placeholder="Password"
                        />
                      </div>
                      <div className="text-center pt-1 mb-12 pb-1">
                        <button
                          className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg w-full mb-3 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-150"

                        
                         
                         
                         
                          type="button"
                          data-mdb-ripple="true"
                          data-mdb-ripple-color="light"
                          style={{
                            background:
                              "linear-gradient(to right, #ee7724, #d8363a,#dd3675, #b44593)",
                          }}
                        >
                          Log in
                        </button>
                        <Link className="text-gray-500" href="#!">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">Don't have an account?</p>
                        <button
                          type="button"
                          className="inline-block px-6 py-2 bg-slate-500 border-2 text-white font-medium text-xs leading-tight uppercase rounded focus:outline-none focus:ring-0 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300"
                          data-mdb-ripple="true"
                          data-mdb-ripple-color="light"
                        >
                          SIGN UP
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TailwindTest;
