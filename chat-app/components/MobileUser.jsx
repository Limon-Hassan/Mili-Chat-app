import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import { UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { useGraphQL } from './Hook/useGraphQL';

const MobileUser = () => {
  let { request, loading, error } = useGraphQL();
  let [users, setUsers] = useState([]);
  const dynamic = useDynamicHeight({
    baseHeight: 555,
    basePx: 180,
    maxPx: 430,
  });

  useEffect(() => {
    let userFetch = async () => {
      try {
        const query = `query {
          users {
            id
            name
            email
          }
        }`;
        let data = await request(query);
        setUsers(data.users);
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
    };

    userFetch();
  }, []);

  return (
    <>
      <section
        className={`mobile:w-full tablet:w-full laptop:w-full computer:w-0 bg-transparent border border-white mobile:p-4 tablet:p-5 laptop:p-5 rounded-lg mobile:absolute mobile:top-38.75 mobile:left-0 tablet:absolute tablet:top-46.25 tablet:left-0 laptop:absolute laptop:top-46.25 laptop:left-0 computer:hidden`}
      >
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Add user
        </h1>

        <div className="mobile:mt-2.5 tablet:mt-5 laptop:mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search user..."
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul
          className={`flex flex-col gap-1 mt-5 overflow-auto w-full scrollbar-hide transition-all ease-in-out duration-400 `}
          style={{ maxHeight: `${dynamic}px` }}
        >
          {users.map((u, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={u.avatar || 'defult.jpg'}
                  alt="group"
                />
                <h5 className="text-[14px] h-5.5 font-open_sens font-semibold text-white">
                  {u.name}
                </h5>
              </div>
              <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
                <UserPlus />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default MobileUser;
