import React from 'react';
import Container from './container/Container';

const Registation = () => {
  return (
    <section className="">
      <Container>
        <div className="flex justify-center items-center h-screen">
          <div className="w-[30%] h-[30%] border border-white flex justify-center items-center">
            <h1 className="text-[28px] font-bold font-inter text-white leading-6
            ">
              Registation Your Account
            </h1>
            <div className="w-[30%] h-[60px] rounded-full border border-white">
              <input
                className="w-full h-full text-[16px] font-semibold font-open_sens outline-none"
                type="text"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Registation;
