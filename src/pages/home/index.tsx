import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { BsSun } from "react-icons/bs";

import PostList from "components/posts/PostList";
import { useNavigate } from "react-router-dom";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  imageUrl?: string;
  imageKey?: string;
  profileUrl?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="py-4 text-xl font-bold px-4">Home</h1>
      <PostList />
      <div className="fixed lg:left-[8%] lg:top-10 lg:bg-transparent z-10 lg:w-[200px] bg-white bottom-0 w-full inset-x-0 mx-auto max-w-[600px] lg:mx-0 border border-slate-100 lg:border-none">
        <div className="lg:flex-col gap-3 flex justify-between px-20 lg:px-0">
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success("로그아웃 되었습니다.");
            }}
          >
            <MdLogout className="font-bold text-2xl lg:text-lg" />
            <div className="hidden lg:block">로그아웃</div>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
            onClick={() => navigate("/profile")}
          >
            <BiUserCircle className="font-bold text-2xl lg:text-lg" />
            <div className="hidden lg:block">프로필</div>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-2 lg:w-full text-lg font-semibold text-gray-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:text-black"
            onClick={() => navigate("/profile")}
          >
            <BsSun className="font-bold text-2xl lg:text-lg" />
            <div className="hidden lg:block">다크모드</div>
          </button>
        </div>
      </div>
    </>
  );
}
