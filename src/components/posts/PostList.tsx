import { useContext, useEffect, useState } from "react";

import { db } from "firebaseApp";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import AuthContext from "context/AuthContext";
import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";

import cn from "classnames";
import { PostProps } from "pages/home";

type TabType = "all" | "my";

export default function PostList() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
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
      <div className="w-full grid grid-cols-2">
        <div
          role="presentation"
          onClick={() => setActiveTab("all")}
          className={cn("font-medium text-center hover:bg-gray-100 py-4 cursor-pointer text-gray-500", {
            "font-bold text-black border-b-2 border-b-blue-500": activeTab === "all",
          })}
        >
          전체 글
        </div>
        <div
          role="presentation"
          onClick={() => setActiveTab("my")}
          className={cn("font-medium text-center hover:bg-gray-100 py-4 cursor-pointer text-gray-500", {
            "font-bold text-black border-b-2 border-b-blue-500": activeTab === "my",
          })}
        >
          내가쓴 글
        </div>
      </div>
      <PostForm />
      <div className="Post__list">
        {posts?.length > 0 ? (
          posts.map((post, index) => <PostBox key={post?.id} index={index} post={post} user={user} />)
        ) : (
          <div className="Post__box--no-posts">
            <div className="Post__text">게시글이 없습니다</div>
          </div>
        )}
      </div>
    </>
  );
}
