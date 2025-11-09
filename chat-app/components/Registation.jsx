'use client';

import Container from './container/Container';
import FloatingInput from './FloatingInputs';

const Registation = () => {
  return (
    <section>
      <Container>
        <div className="flex justify-center items-center h-screen">
          <div className="w-[660px] h-auto p-8 rounded-lg border border-white   shadow-2xl shadow-blue-600">
            <h1
              className="text-[36px] font-bold font-inter text-white leading-6
              flex items-center justify-center mb-[50px]"
            >
              Registation Your Account
            </h1>
            <FloatingInput label="Username" type="text" id="name" />
            <FloatingInput label="Email" type="email" id="email" />
            <FloatingInput label="Password" type="password" id="password" />
            <button className="relative overflow-hidden text-[18px] font-inter font-bold text-white px-[120px] py-3.5 border border-white mt-3 flex items-center justify-center mx-auto group cursor-pointer">
              <span className="relative group-hover:text-black transition-all duration-600 ease-in-out z-10">
                Register
              </span>
              <span className="absolute left-0 top-0 w-0 h-full bg-white transition-all duration-600 ease-in-out group-hover:w-full "></span>
            </button>
            <div className="relative w-full my-10 border-t-2 border-dashed border-white after:content-['or'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-[#F3F4F6] after:px-2 after:text-black after:font-semibold"></div>
            <div className="flex items-center gap-3 mt-3">
              <button className="text-[18px] font-inter font-bold text-black px-10 bg-white flex items-center gap-2 py-3.5 cursor-pointer">
                Login with
                <img
                  className="w-[30px] h-[30px] object-cover"
                  src="/google.png"
                  alt="google"
                />
                google
              </button>
              <button className="text-[18px] font-inter font-bold text-black px-10 bg-white flex items-center gap-2 py-3.5 cursor-pointer">
                Login with
                <img
                  className="w-[30px] h-[30px] object-cover"
                  src="/facebook.png"
                  alt="facebook"
                />
                facebook
              </button>
            </div>
            <p className="text-[14px] font-inter text-white mt-3 flex items-center justify-center mx-auto">
              Already have an account ? <a className='hover:underline ml-2' href="#">Login</a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Registation;
