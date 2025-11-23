import React from 'react';

const Edite = () => {
  return (
    <>
      <section>
        <div className="bg-white flex flex-col gap-4 p-5 w-[600px]">
          <div className="border-dashed border-gray-500 rounded-lg">
            <label>Upload Your Photo</label>
            <input className="w-full" type="file" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Edite;
