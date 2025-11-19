'use client';

import React, { useState } from 'react';
import Sideber from './Sideber';
import Group from './Group';
import Friends from './Friends';
import Friend_Request from './Friend_Request';
import BlockUser from './BlockUser';
import AddUser from './AddUser';
import Message from './Message';
import MyGroup from './MyGroup';

const HomePage = () => {
  let [activePage, setActivePage] = useState('home');
  return (
    <>
      <div className="flex gap-[30px] p-6">
        <Sideber setActivePage={setActivePage} />

        <div className="flex-1">
          {activePage === 'home' && (
            <>
              <div className="grid grid-cols-3 gap-5">
                <Group />
                <Friends />
                <Friend_Request />
                <MyGroup />
                <BlockUser />
              </div>
            </>
          )}
          {activePage === 'messages' && (
            <div className="flex items-center">
              <div className="flex flex-col gap-[30px] ">
                <Friends />
                <MyGroup />
              </div>
              <Message />
            </div>
          )}
        </div>
        {activePage === 'home' && <AddUser />}
      </div>
      {/* <div className="flex gap-[60px] p-6">
        <Sideber />
        <div className="grid grid-cols-2 gap-[30px]">
          <Group />
          <Friends />
          <Friend_Request />
          <BlockUser />
        </div>
        <AddUser />
      </div> */}
    </>
  );
};

export default HomePage;
