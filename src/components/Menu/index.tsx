import { useContext } from "react";

import { getAuth, signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";
import { toast } from "react-toastify";
import { app } from "firebaseApp";

import { BiUserCircle } from "react-icons/bi";
import { BsSun, BsMoon, BsHouse } from "react-icons/bs";

import { useNavigate } from "react-router-dom";
import ThemeContext from "context/ThemeContext";

export default function MenuList() {
  const context = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div className="fixed lg:left-[8%] lg:top-10 lg:bg-transparent z-10 lg:w-[200px] bg-white dark:bg-slate-800 bottom-0 w-full inset-x-0 mx-auto max-w-[600px] lg:mx-0 border border-slate-100 dark:border-slate-600 lg:border-none">
      <div className="lg:flex-col gap-3 flex justify-between px-20 lg:px-0 py-1.5">
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500  dark:text-gray-100 dark:hover:text-gray-200 dark:focus:text-gray-200hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
          onClick={() => navigate("/")}
        >
          <BsHouse className="font-bold text-xl lg:text-lg" />
          <div className="hidden lg:block">홈</div>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500  dark:text-gray-100 dark:hover:text-gray-200 dark:focus:text-gray-200hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
          onClick={() => navigate("/profile")}
        >
          <BiUserCircle className="font-bold text-xl lg:text-lg" />
          <div className="hidden lg:block">프로필</div>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500  dark:text-gray-100 dark:hover:text-gray-200 dark:focus:text-gray-200hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
          onClick={context.toggleMode}
        >
          {context.theme === "dark" ? <BsMoon className="font-bold text-xl lg:text-lg" /> : <BsSun className="font-bold text-xl lg:text-lg" />}
          <div className="hidden lg:block">{context.theme === "dark" ? "다크모드" : "라이트모드"}</div>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500  dark:text-gray-100 dark:hover:text-gray-200 dark:focus:text-gray-200 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
          onClick={async () => {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success("로그아웃 되었습니다.");
          }}
        >
          <MdLogout className="font-bold text-xl lg:text-lg" />
          <div className="hidden lg:block">로그아웃</div>
        </button>
      </div>
    </div>
  );
}
