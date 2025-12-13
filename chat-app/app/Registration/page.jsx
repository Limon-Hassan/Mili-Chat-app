'use client';

import { useEffect, useRef, useState } from 'react';
import Container from '../../components/container/Container';
import FloatingInput from '../../components/FloatingInputs';

const page = () => {
  const [active, setActive] = useState(false);
  let menuRef = useRef(null);

  useEffect(() => {
    let handler = event => {
      if (!menuRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  return (
    <section className="relative z-10">
      <Container>
        <div className="flex justify-center items-center h-screen">
          <div className="mobile:w-full target:w-full laptop:w-[660px] computer:w-[660px] h-auto p-8 rounded-lg border border-white   shadow-2xl shadow-blue-600">
            <h1
              style={{
                fontSize: 'clamp(25px, 2vw + 1rem, 36px)',
              }}
              className=" font-bold font-inter text-white leading-6
              flex items-center justify-center mb-[50px]"
            >
              Register Your Account
            </h1>
            <FloatingInput label="Username" type="text" id="name" />
            <FloatingInput label="Email" type="email" id="email" />
            <FloatingInput label="Password" type="password" id="password" />
            <button
              onClick={() => setActive(true)}
              ref={menuRef}
              className="relative overflow-hidden text-[18px] font-inter font-bold text-white mobile:w-full target:w-full laptop:w-[300px] computer:w-[300px] h-[50px] border border-white mt-3 flex items-center justify-center mx-auto group cursor-pointer"
            >
              <span
                className={`relative group-hover:text-black ${
                  active ? 'text-black' : ''
                } transition-all duration-600 ease-in-out z-10 `}
              >
                Register
              </span>
              <span
                className={`absolute left-0 top-0 ${
                  active ? 'w-full' : ''
                } w-0 h-full bg-white transition-all duration-600 ease-in-out group-hover:w-full `}
              ></span>
            </button>
            <div className="relative w-full my-10 border-t-2 border-dashed border-white after:content-['or'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-[#F3F4F6] after:px-2 after:text-black after:font-semibold"></div>
            <div className="flex items-center gap-3 mt-3">
              <button className="text-[18px] font-inter font-bold text-black  bg-white mobile:hidden tablet:hidden computer:flex laptop:flex items-center gap-2 laptop:w-[300px] mx-auto justify-center computer:w-[300px] h-[50px] cursor-pointer">
                Login with
                <img
                  className="w-[30px] h-[30px] object-cover"
                  src="/google.png"
                  alt="google"
                />
                google
              </button>
              <button className="text-[10px] font-inter font-bold text-black  bg-white items-center computer:hidden laptop:hidden mobile:flex flex-col tablet:flex w-full  mx-auto  h-[50px] cursor-pointer">
                <img
                  className="w-[30px] h-[30px] object-cover"
                  src="/google.png"
                  alt="google"
                />
                Login with google
              </button>
              <button className="text-[18px] font-inter font-bold text-black  bg-white mobile:hidden tablet:hidden computer:flex laptop:flex items-center gap-2 laptop:w-[300px] mx-auto justify-center computer:w-[300px] h-[50px] cursor-pointer">
                Login with
                <img
                  className="w-[30px] h-[30px] object-cover"
                  src="/facebook.png"
                  alt="facebook"
                />
                facebook
              </button>
              <button className="text-[10px] font-inter font-bold text-black  bg-white items-center computer:hidden laptop:hidden mobile:flex tablet:flex flex-col w-full mx-auto  h-[50px] cursor-pointer">
                <img
                  className="w-[30px] h-[30px] object-cover"
                  src="/facebook.png"
                  alt="facebook"
                />
                Login with facebook
              </button>
            </div>
            <p className="text-[14px] font-inter text-white mt-3 flex items-center justify-center mx-auto">
              Already have an account ?
              <a className="hover:underline ml-2" href="/Login">
                Login
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default page;
