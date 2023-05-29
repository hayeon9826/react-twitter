import { useContext } from "react";

import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signOut } from "firebase/auth";
import AuthContext from "context/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <h1>Home</h1>
      <h2>안녕하세요 {user?.email} 님</h2>
      <div
        role="presentation"
        className="Profile__logout"
        onClick={async () => {
          const auth = getAuth(app);
          await signOut(auth);
          toast.success("로그아웃 되었습니다.");
        }}
      >
        로그아웃
      </div>
    </>
  );
}
