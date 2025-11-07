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
            
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Registation;
