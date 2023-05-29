import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import { PostProps } from "pages/home";
import { db } from "firebaseApp";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { BsSun } from "react-icons/bs";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import Header from "components/Header";

const PROFILE_DEFAULT_URL = "/images/user-icon.png";
type TabType = "my" | "like";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("my");

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));
      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);
  return (
    <>
      <Header hasBack={true} />
      <h1 className="py-4 text-xl font-bold px-4">Profile</h1>
      <div className="px-4 mt-10 flex justify-between items-center">
        <img src={user?.photoURL || PROFILE_DEFAULT_URL} className="w-32 h-32 rounded-full" alt="profile" />
        <button
          type="button"
          onClick={() => navigate("/profile/edit")}
          className="px-6 py-2 rounded-full border border-slate-400 hover:bg-black/10 focus:bg-black/10 text-gray-600"
        >
          프로필 수정
        </button>
      </div>
      <div className="px-4 mt-4">
        <div className="text-gray-500 font-bold text-lg">{user?.displayName || "사용자님"}</div>
        <div className="text-gray-500 text-sm">{user?.email}</div>
      </div>

      <div className="w-full grid grid-cols-2 mt-8">
        <div
          role="presentation"
          onClick={() => setActiveTab("my")}
          className={cn("font-medium text-center hover:bg-gray-100 py-4 cursor-pointer text-gray-500", {
            "font-bold text-black border-b-2 border-b-blue-500": activeTab === "my",
          })}
        >
          내가쓴 글
        </div>
        <div
          role="presentation"
          onClick={() => setActiveTab("like")}
          className={cn("font-medium text-center hover:bg-gray-100 py-4 cursor-pointer text-gray-500", {
            "font-bold text-black border-b-2 border-b-blue-500": activeTab === "like",
          })}
        >
          좋아요한 글
        </div>
      </div>
      <div className="mb-10">
        {posts?.length > 0 ? (
          posts.map((post, index) => <PostBox key={post?.id} index={index} post={post} user={user} />)
        ) : (
          <div className="mx-8 mt-6">
            <div className="rounded-lg border p-4 border-slate-100 text-sm text-gray-500">게시글이 없습니다</div>
          </div>
        )}
      </div>
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
