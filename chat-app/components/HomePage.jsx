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
import Notifaction from './Notifaction';
import Setting from './Setting';
import MobileSideIcons from './MobileSideIcons';
import useIsMobile from './Hook/useIsMobile';
import MobileFriends from './Mobile/MobileFriends';
import MobileSetting from './Mobile/MobileSetting';
import { useGraphQL } from './Hook/useGraphQL';
import Big_Loading from './Big_Loading';
import Mobile_Notification from './Mobile/Mobile_Notification';
import MsgFriends from './MsgFriends';

const HomePage = () => {
  let [activePage, setActivePage] = useState('home');
  let { request, loading, error } = useGraphQL();
  let [show, setShow] = useState(false);
  const [authorized, setAuthorized] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    let mobile = window.innerWidth < 768;
    if (!mobile) {
      setShow(true);
    }

    let checkAUTH = async () => {
      try {
        const query = `
            query {
              me {
                id
                name
                email
              }
            }
          `;

        let data = await request(query);
        setAuthorized(true);
      } catch (error) {
        console.log(error.message);
        console.error(error);
        setAuthorized(false);
        window.location.href = '/Login';
      }
    };
    checkAUTH();
  }, [request]);

  if (authorized === null) return <Big_Loading />;

  return (
    <>
      {loading && <Big_Loading />}
      <div className="flex gap-15 p-6 mobile:overflow-x-auto tablet:overflow-x-auto laptop:overflow-x-auto computer:overflow-hidden">
        <Sideber setActivePage={setActivePage} />

        <div className="flex-1 mobile:hidden tablet:hidden laptop:hidden computer:block">
          {activePage === 'home' && (
            <>
              <div className="grid grid-cols-2 gap-7.5">
                <Group />
                <Friends />
                <Friend_Request />
                <BlockUser />
              </div>
            </>
          )}

          {activePage === 'messages' && (
            <div className="flex items-center">
              <div className="flex flex-col gap-7.5 ">
                <MsgFriends />
              </div>
              <Message />
            </div>
          )}

          {activePage === 'notification' && <Notifaction />}
          {activePage === 'settings' && <Setting />}
        </div>

        {!isMobile && show && activePage === 'home' && <AddUser />}

        {isMobile && activePage === 'home' && <MobileSideIcons />}
        {isMobile && activePage === 'messages' && <MobileFriends />}
        {isMobile && activePage === 'notification' && <Mobile_Notification />}
        {isMobile && activePage === 'settings' && <MobileSetting />}
      </div>
    </>
  );
};

export default HomePage;
