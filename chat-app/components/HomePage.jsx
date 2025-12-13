// 'use client';

// import React, { useEffect, useState } from 'react';
// import Sideber from './Sideber';
// import Group from './Group';
// import Friends from './Friends';
// import Friend_Request from './Friend_Request';
// import BlockUser from './BlockUser';
// import AddUser from './AddUser';
// import Message from './Message';
// import MyGroup from './MyGroup';
// import Notifaction from './Notifaction';
// import Setting from './Setting';
// import MobileSideIcons from './MobileSideIcons';

// const HomePage = () => {
//   let [activePage, setActivePage] = useState('home');
//   let [show, setShow] = useState(false);

//   useEffect(() => {
//     let mobile = window.innerHeight < 768;
//     if (!mobile) setShow(true);
//   }, []);

//   return (
//     <>
//       <div className="flex gap-[30px] p-6 overflow-x-scroll">
//         <Sideber setActivePage={setActivePage} />

//         <div className="flex-1 mobile:hidden tablet:hidden laptop:hidden computer:block">
//           {activePage === 'home' && (
//             <>
//               <div className="grid grid-cols-3 gap-5">
//                 <Group />
//                 <Friends />
//                 <Friend_Request />
//                 <MyGroup />
//                 <BlockUser />
//               </div>
//             </>
//           )}
//           {activePage === 'messages' && (
//             <div className="flex items-center">
//               <div className="flex flex-col gap-[30px] ">
//                 <Friends />
//                 <MyGroup />
//               </div>
//               <Message />
//             </div>
//           )}
//           {activePage === 'notification' && <Notifaction />}
//           {activePage === 'settings' && <Setting />}
//         </div>
//         {show && activePage === 'home' && <AddUser />}
//         {activePage === 'home' && <MobileSideIcons />}
//       </div>
//     </>
//   );
// };

// export default HomePage;

'use client';

import React, { useEffect, useState } from 'react';
import Sideber from './Sideber';
import Group from './Group';
import Friends from './Friends';
import Friend_Request from './Friend_Request';
import BlockUser from './BlockUser';
import AddUser from './AddUser';
import Message from './Message';
import MyGroup from './MyGroup';
import Notifaction from './Notifaction';
import Setting from './Setting';
import MobileSideIcons from './MobileSideIcons';
import useIsMobile from './Hook/useIsMobile';

const HomePage = () => {
  let [activePage, setActivePage] = useState('home');
  let [show, setShow] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let mobile = window.innerWidth < 768;
    if (!mobile) {
      setShow(true);
    }
  }, []);

  return (
    <>
      <div className="flex gap-[30px] p-6 mobile:overflow-x-auto tablet:overflow-x-auto laptop:overflow-x-auto computer:overflow-hidden">
        <Sideber setActivePage={setActivePage} />

        <div className="flex-1 mobile:hidden tablet:hidden laptop:hidden computer:block">
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

          {activePage === 'notification' && <Notifaction />}
          {activePage === 'settings' && <Setting />}
        </div>

        {!isMobile && show && activePage === 'home' && <AddUser />}

        {isMobile && <MobileSideIcons />}
      </div>
    </>
  );
};

export default HomePage;
