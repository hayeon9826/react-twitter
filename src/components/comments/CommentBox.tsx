import AuthContext from "context/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { CommentProps, PostProps } from "pages/home";
import { useContext } from "react";

interface CommentBoxProps {
  data: CommentProps;
  post: PostProps;
}

export default function CommentBox({ data, post }: CommentBoxProps) {
  const { user } = useContext(AuthContext);

  const handleDeleteComment = async () => {
    if (post) {
      const postRef = doc(db, "posts", post?.id);

      await updateDoc(postRef, {
        comments: arrayRemove(data),
      });
    }
  };

  return (
    <div key={data?.comment} className="px-4 border-t-slate-100 dark:border-t-slate-600">
      <div className="border-b border-b-slate-100 dark:border-b-slate-600 py-4">
        <div className="px-4">
          <div className="flex gap-2 items-center">
            <img src={"/images/user-icon.png"} alt="profile" className="rounded-full w-10 h-10" />
            <div className="flex gap-2">
              <div className="text-sm">{data?.email}</div>
              <div className="text-sm text-gray-500">{data?.createdAt}</div>
            </div>
          </div>
          <div className="py-1">{data?.comment}</div>
        </div>
        <div className="px-4 mt-2">
          <div className="text-sm flex gap-2 flex-row-reverse">
            {data?.uid === user?.uid && (
              <button type="button" className="cursor-pointer text-black dark:text-white hover:text-red-600 focus:text-red-600" onClick={handleDeleteComment}>
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
