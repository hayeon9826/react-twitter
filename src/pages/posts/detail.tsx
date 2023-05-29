import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";

import { toast } from "react-toastify";
import Header from "components/Header";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

export default function PostDetailPage() {
  const [post, setPost] = useState<PostProps | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const params = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const storage = getStorage();
  const imageRef = ref(storage, post?.imageUrl);

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && post) {
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, toggle]);

  const toggleLike = async () => {
    if (post) {
      const postRef = doc(db, "posts", post?.id);
      if (user?.uid && post?.likes?.includes(user?.uid)) {
        await updateDoc(postRef, {
          likes: arrayRemove(user?.uid),
          likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
          updatedAt: new Date()?.toLocaleDateString(),
        });
        setToggle(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user?.uid),
          likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
          updatedAt: new Date()?.toLocaleDateString(),
        });
        setToggle(true);
      }
    }
  };

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id, toggle]);

  return (
    <>
      <Header hasBack={true} />
      <div className="border-b-[1px] border-b-slate-100 dark:border-b-slate-600 py-4">
        {post ? (
          <>
            <Link to={`/posts/${post?.id}`}>
              <div className="px-4">
                <div className="flex gap-2 items-center">
                  <img src={post?.profileUrl || "/images/user-icon.png"} alt="profile" className="rounded-full w-10 h-10" />
                  <div className="flex gap-2">
                    <div className="text-sm">{post?.email}</div>
                    <div className="text-sm text-gray-500">{post?.createdAt}</div>
                  </div>
                </div>

                <div className="font-bold py-1">{post?.content}</div>
              </div>
            </Link>
            <div className="px-4 mt-2">
              <div className="text-sm flex gap-2 flex-row-reverse">
                {user?.uid === post?.uid && (
                  <>
                    <button type="button" className="cursor-pointer text-black dark:text-white hover:text-red-600 focus:text-red-600" onClick={handleDelete}>
                      삭제
                    </button>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-black dark:text-gray-200 dark:hover:text-white dark:focus:text-white focus:text-black"
                    >
                      <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="cursor-pointer text-sm flex gap-2 items-center text-gray-500 dark:text-gray-20 hover:text-red-600 focus:text-red-600"
                  onClick={toggleLike}
                >
                  {user?.uid && post?.likes?.includes(user?.uid) ? <AiFillHeart /> : <AiOutlineHeart />}
                  {post?.likeCount || 0}
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-black dark:text-gray-200 dark:hover:text-white dark:focus:text-white focus:text-black"
                >
                  <FaRegComment />
                </button>
              </div>
            </div>
            {post?.imageUrl && (
              <div className="p-4">
                <img src={post?.imageUrl} className="w-full h-auto rounded-xl border border-slate-100" alt="post img" />
              </div>
            )}
          </>
        ) : (
          "loading"
        )}
        <div className="px-4 mt-8">
          <button type="button" className="w-full bg-blue-500 focus:bg-blue-600 hover:bg-blue-600 text-white rounded-md px-4 py-2.5 cursor-pointer">
            <Link to="/">목록으로 돌아가기</Link>
          </button>
        </div>
      </div>
    </>
  );
}
