import React from 'react';
import SideBar from './SideBarLayout';
import Chat from './ChatLayout';

const HomePage = () => {
  return (
    <>
      <section className="h-fit smh-screen">
        <div className="flex p-4 sm:w-screen  h-fit sm:h-screen bg-gray-200 justify-center ">
          <div className="bg-white h-auto sm:h-auto shadow-lg rounded-lg w-full p-4">
            <div className="flex flex-col gap-6 sm:gap-0  sm:justify-center sm:items-center overflow-y-auto sm:flex-row sm:w-full sm:h-full ">
              <div className="sm:flex-grow-0 justify-self-start h-full gap-6 ">
                <SideBar />
              </div>
              <div className="sm:grow h-full sm:justify-self-center sm:self-start">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
