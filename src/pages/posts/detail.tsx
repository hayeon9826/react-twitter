import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";

import { toast } from "react-toastify";
import Header from "components/Header";

export default function PostDetailPage() {
  const [post, setPost] = useState<PostProps | null>(null);
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
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <>
      <Header hasBack={true} />
      <div className="border-b-[1px] border-b-slate-100 py-4">
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
              {user?.uid === post?.uid && (
                <div className="text-sm flex gap-2 flex-row-reverse">
                  <button type="button" className="cursor-pointer text-black hover:text-red-600 focus:text-red-600" onClick={handleDelete}>
                    삭제
                  </button>
                  <button type="button" className="text-gray-600 hover:text-black focus:text-black">
                    <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                  </button>
                </div>
              )}
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
        <div className="px-4">
          <button type="button" className="w-full bg-blue-500 focus:bg-blue-600 hover:bg-blue-600 text-white rounded-md px-4 py-2.5 cursor-pointer">
            <Link to="/">목록으로 돌아가기</Link>
          </button>
        </div>
      </div>
    </>
  );
}
