import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import { PostProps } from "pages/home";
import { db } from "firebaseApp";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PROFILE_DEFAULT_URL =
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);

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
      <h1>Profile Page</h1>
      <h2>안녕하세요 {user?.email} 님</h2>
      <h2>프로필명 {user?.displayName}</h2>
      <img src={user?.photoURL || PROFILE_DEFAULT_URL} width={100} height={100} alt="profile" />
      <Link to="/profile/edit">프로필 수정</Link>
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
