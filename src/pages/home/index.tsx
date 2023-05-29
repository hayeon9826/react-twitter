import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signOut } from "firebase/auth";

import PostList from "components/posts/PostList";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  imageUrl?: string;
  imageKey?: string;
}

export default function HomePage() {
  return (
    <>
      <h1 className="py-4 text-xl font-bold">Home</h1>
      <PostList />
      <button
        type="button"
        className="fixed left-10 bottom-10 rounded-full bg-blue-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={async () => {
          const auth = getAuth(app);
          await signOut(auth);
          toast.success("로그아웃 되었습니다.");
        }}
      >
        로그아웃
      </button>
    </>
  );
}
