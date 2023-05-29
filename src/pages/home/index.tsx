import { useContext, useEffect, useState } from "react";

import { db } from "firebaseApp";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signOut } from "firebase/auth";
import AuthContext from "context/AuthContext";
import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";
import { Link } from "react-router-dom";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  imageUrl?: string;
}

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);

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
      <h1>Home</h1>
      <h2>안녕하세요 {user?.email} 님</h2>
      <button
        type="button"
        className="Profile__logout"
        onClick={async () => {
          const auth = getAuth(app);
          await signOut(auth);
          toast.success("로그아웃 되었습니다.");
        }}
      >
        로그아웃
      </button>
      <br />
      <Link to="/profile">프로필</Link>
      <br />
      <br />
      <PostForm />
      <br />
      <br />
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
