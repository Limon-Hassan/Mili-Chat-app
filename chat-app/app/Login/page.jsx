'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Container from '../../components/container/Container';
import FloatingInput from '../../components/FloatingInputs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGraphQL } from '@/components/Hook/useGraphQL';
import Loader from '@/components/Loader';
import { useGoogleLogin } from '@react-oauth/google';

const page = () => {
  const { request, loading, error } = useGraphQL();
  console.log(error);
  const [active, setActive] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  let [passShow, setPassShow] = useState(false);
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

  let handleLogin = e => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  let handleSubmit = async () => {
    if (!formData.email || !formData.password) return;
    setActive(true);

    const LOGIN_MUTATION = `
    mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        token
        refreshToken
        user {
          id
          name
          email
        }
      }
    }
  `;

    try {
      const data = await request(LOGIN_MUTATION, formData);
      localStorage.setItem('userId', data.loginUser.user.id);
      setActive(false);
      setFormData({ email: '', password: '' });
      if (data.loginUser.user.id) window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const GOOGLE_LOGIN = `
      mutation GoogleLogin($accessToken: String!) {
        googleLogin(accessToken: $accessToken) {
          token
          refreshToken
          user {
            id
            name
            email
          }
        }
      }
    `;

      await request(GOOGLE_LOGIN, {
        accessToken: tokenResponse.access_token,
      });

      localStorage.setItem('userId', tokenResponse.user_id);
      if (tokenResponse) {
        window.location.href = '/';
      }
    },
    onError: () => console.log('Google login failed'),
  });

  return (
    <section className="relative z-10">
      <Container>
        <div className="flex justify-center items-center h-screen">
          <div className="mobile:w-full target:w-full laptop:w-165 computer:w-165 h-auto p-8 rounded-lg border border-white shadow-2xl shadow-blue-600">
            <h1
              style={{
                fontSize: 'clamp(25px, 2vw + 1rem, 36px)',
              }}
              className=" font-bold font-inter text-white leading-6
              flex items-center justify-center mb-12.5"
            >
              Login Your Account
            </h1>
            <FloatingInput
              onChange={handleLogin}
              value={formData.email}
              label="Email"
              type="email"
              id="email"
            />
            <div className="relative">
              <FloatingInput
                onChange={handleLogin}
                value={formData.password}
                label="Password"
                type={passShow ? 'text' : 'password'}
                id="password"
              />
              <span
                onClick={() => setPassShow(!passShow)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-100 text-[20px]"
              >
                {passShow ? <FaEye /> : <FaEyeSlash />}
              </span>
              {error && <p className="text-red-500 absolute -bottom-6">{error}</p>}
            </div>
            <button
              onClick={handleSubmit}
              ref={menuRef}
              disabled={!formData.email || !formData.password}
              className="relative overflow-hidden text-[18px] font-inter font-bold text-white mobile:w-full target:w-full laptop:w-75 computer:w-75 h-12.5 border border-white mt-3 flex items-center justify-center mx-auto group cursor-pointer"
            >
              <span
                className={`relative group-hover:text-black ${
                  active ? 'text-black' : ''
                } transition-all duration-600 ease-in-out z-10 flex items-center gap-3 `}
              >
                Login {loading && <Loader />}
              </span>
              <span
                className={`absolute left-0 top-0 ${
                  active ? 'w-full' : ''
                } w-0 h-full bg-white transition-all duration-600 ease-in-out group-hover:w-full `}
              ></span>
            </button>
            <div className="relative w-full my-10 border-t-2 border-dashed border-white after:content-['or'] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-[#F3F4F6] after:px-2 after:text-black after:font-semibold"></div>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => googleLogin()}
                className="text-[18px] font-inter font-bold text-black  bg-white mobile:hidden tablet:hidden computer:flex laptop:flex items-center gap-2 laptop:w-75 mx-auto justify-center computer:w-75 h-12.5 cursor-pointer"
              >
                Login with
                <img
                  className="w-7.5 h-7.5 object-cover"
                  src="/google.png"
                  alt="google"
                />
                google
              </button>
              <button
                onClick={() => googleLogin()}
                className="text-[10px] font-inter font-bold text-black  bg-white items-center computer:hidden laptop:hidden mobile:flex flex-col tablet:flex w-full mx-auto h-12.5 cursor-pointer"
              >
                <img
                  className="w-7.5 h-7.5 object-cover"
                  src="/google.png"
                  alt="google"
                />
                Login with google
              </button>
              <button className="text-[18px] font-inter font-bold text-black  bg-white mobile:hidden tablet:hidden computer:flex laptop:flex items-center gap-2 laptop:w-75 mx-auto justify-center computer:w-75 h-12.5 cursor-pointer">
                Login with
                <img
                  className="w-7.5 h-7.5 object-cover"
                  src="/facebook.png"
                  alt="facebook"
                />
                facebook
              </button>
              <button className="text-[10px] font-inter font-bold text-black  bg-white items-center computer:hidden laptop:hidden mobile:flex tablet:flex flex-col w-full mx-auto h-12.5 cursor-pointer">
                <img
                  className="w-7.5 h-7.5 object-cover"
                  src="/facebook.png"
                  alt="facebook"
                />
                Login with facebook
              </button>
            </div>
            <p className="text-[14px] font-inter text-white mt-3 flex items-center justify-center mx-auto">
              Don't have an account ?
              <a className="hover:underline ml-2" href="/Registration">
                Register
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default page;
