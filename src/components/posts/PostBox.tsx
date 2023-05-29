import { Link } from "react-router-dom";
import { PostProps } from "pages/home";
import { User } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "firebaseApp";
import { doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

interface PostBoxProps {
  index: number;
  post: PostProps;
  user: User | null;
}

export default function PostBox({ index, post, user }: PostBoxProps) {
  const storage = getStorage();
  const imageRef = ref(storage, post?.imageUrl);

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm) {
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다.");
    }
  };

  return (
    <div key={index} className="border-b-[1px] border-b-slate-100 dark:border-b-slate-600 py-2">
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

      {post?.imageUrl && (
        <div className="p-4">
          <img src={post?.imageUrl} className="w-full h-auto rounded-xl border border-slate-100 dark:border-slate-600" alt="post img" />
        </div>
      )}
      <div className="px-4 mt-2">
        {user?.uid === post?.uid && (
          <div className="text-sm flex gap-2 flex-row-reverse">
            <button type="button" className="cursor-pointer text-black dark:text-white hover:text-red-600 focus:text-red-600" onClick={handleDelete}>
              삭제
            </button>
            <button type="button" className="text-gray-600 hover:text-black dark:text-gray-200 dark:hover:text-white dark:focus:text-white focus:text-black">
              <Link to={`/posts/edit/${post?.id}`}>수정</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
