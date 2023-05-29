import { useContext, useState } from "react";

import { db, app } from "firebaseApp";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import AuthContext from "context/AuthContext";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const auth = getAuth(app);
  const { user } = useContext(AuthContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString(),
        email: auth?.currentUser?.email,
        uid: user?.uid,
      });
      toast.success("게시글을 생성했습니다.");
      setContent("");
    } catch (e: any) {
      console.log(e);
      toast.error(e);
    }
  };

  const onChange = (e: any) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };
  return (
    <form onSubmit={onSubmit} className="Form">
      <textarea name="content" id="content" required placeholder="tweet" value={content} onChange={onChange} />
      <input type="submit" value="생성" className="Form__btn-submit" />
    </form>
  );
}
