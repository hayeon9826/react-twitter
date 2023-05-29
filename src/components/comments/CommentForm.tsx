import { useContext, useState } from "react";

import { db } from "firebaseApp";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";
import AuthContext from "context/AuthContext";

import { PostProps } from "pages/home";
import { useNavigate } from "react-router-dom";

interface CommentProps {
  post: PostProps | null;
}

export default function CommentForm({ post }: CommentProps) {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (post && post?.id) {
      try {
        const postRef = doc(db, "posts", post?.id);

        if (user?.uid) {
          const commentObj = {
            comment: comment,
            uid: user.uid,
            email: user.email,
            createdAt: new Date()?.toLocaleDateString(),
          };
          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updatedAt: new Date()?.toLocaleDateString(),
          });
        }
        toast.success("댓글을 생성했습니다.");
        navigate(`/posts/${post.id}`);
        setComment("");
      } catch (e: any) {
        console.log(e);
        toast.error(e);
      }
    }
  };

  const onChange = (e: any) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative px-3">
      <textarea
        className="min-h-[120px] block w-full resize-none border-0 py-4 px-4 !outline-none dark:bg-slate-800 dark:text-white text-gray-900 placeholder:text-gray-400 focus:ring-0 ring-0 sm:text-sm sm:leading-6 md:text-xl md:placeholder:text-xl border-b-[1px] border-b-slate-100 dark:border-b-slate-600"
        name="comment"
        id="comment"
        required
        placeholder="What is happening?"
        value={comment}
        onChange={onChange}
      />
      <div className="flex flex-row-reverse">
        <input
          type="submit"
          disabled={!comment}
          value="Comment"
          className="mt-2 cursor-pointer disabled:bg-blue-600/50 rounded-full bg-blue-600 dark:bg-blue-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        />
      </div>
    </form>
  );
}
