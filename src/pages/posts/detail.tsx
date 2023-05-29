import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";
import { AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

export default function PostDetailPage() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && post) {
      await deleteDoc(doc(db, "posts", post.id));
      navigate("/");
      toast.success("게시글을 삭제했습니다.");
    }
  };

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="Post__detail">
      {post ? (
        <div className="Post__box">
          <div className="Post__profile-box">
            <div className="Post__profile" />
            <div className="Post__author-name">{post?.email}</div>
            <div className="Post__date">{post?.createdAt}</div>
          </div>
          {user?.uid === post?.uid && (
            <div className="Post__utils-box">
              <div className="Post__edit">
                <Link to={`/posts/edit/${post?.id}`}>수정</Link>
              </div>
              <div onClick={handleDelete} role="presentation" className="Post__delete">
                삭제
              </div>
              <div className="Post__save">
                <AiFillHeart />
              </div>
            </div>
          )}

          <br />
          <div className="Post__text--pre-wrap">{post?.content}</div>
          {post?.imageUrl && <img src={post?.imageUrl} width={100} height={100} alt="post img" />}
        </div>
      ) : (
        "loading"
      )}
      <br />
      <Link to="/">목록으로 돌아가기</Link>
    </div>
  );
}
