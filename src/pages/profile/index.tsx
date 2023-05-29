import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import { PostProps } from "pages/home";
import { db } from "firebaseApp";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import Header from "components/Header";
import MenuList from "components/Menu";

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
      let postsQuery;
      if (activeTab === "my") {
        postsQuery = query(postsRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));
      } else {
        postsQuery = query(postsRef, where("likes", "array-contains", user.uid), orderBy("createdAt", "desc"));
      }
      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [activeTab, user]);
  return (
    <>
      <Header hasBack={true} />
      <h1 className="py-4 text-xl font-bold px-4">Profile</h1>
      <div className="px-4 mt-10 flex justify-between items-center">
        <img src={user?.photoURL || PROFILE_DEFAULT_URL} className="w-32 h-32 rounded-full" alt="profile" />
        <button
          type="button"
          onClick={() => navigate("/profile/edit")}
          className="px-6 py-2 rounded-full border border-slate-400 dark:border-slate-200 dark:text-gray-300 hover:bg-black/10 focus:bg-black/10 text-gray-600"
        >
          프로필 수정
        </button>
      </div>
      <div className="px-4 mt-4">
        <div className="text-gray-500 dark:text-gray-300 font-bold text-lg">{user?.displayName || "사용자님"}</div>
        <div className="text-gray-500 dark:text-gray-300 text-sm">{user?.email}</div>
      </div>
      <div className="w-full grid grid-cols-2 mt-8">
        <div
          role="presentation"
          onClick={() => setActiveTab("my")}
          className={cn(
            "font-medium text-center dark:hover:bg-slate-700 hover:bg-gray-100 py-4 cursor-pointer text-gray-500 dark:text-white dark:hover:text-gray-100 dark:focus:text-gray-100",
            {
              "font-bold text-black border-b-2 border-b-blue-500": activeTab === "my",
            }
          )}
        >
          내가쓴 글
        </div>
        <div
          role="presentation"
          onClick={() => setActiveTab("like")}
          className={cn(
            "font-medium text-center dark:hover:bg-slate-700 hover:bg-gray-100 py-4 cursor-pointer text-gray-500 dark:text-white dark:hover:text-gray-100 dark:focus:text-gray-100",
            {
              "font-bold text-black border-b-2 border-b-blue-500": activeTab === "like",
            }
          )}
        >
          좋아요한 글
        </div>
      </div>
      <div className="pb-10">
        {posts?.length > 0 ? (
          posts.map((post, index) => <PostBox key={post?.id} index={index} post={post} user={user} />)
        ) : (
          <div className="mx-8 mt-6">
            <div className="rounded-lg border p-4 border-slate-100 text-sm text-gray-500">게시글이 없습니다</div>
          </div>
        )}
      </div>
      <MenuList />
    </>
  );
}
