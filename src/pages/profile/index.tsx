import AuthContext from "context/AuthContext";
import { useContext } from "react";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <h1>Profile Page</h1>
      <h2>안녕하세요 {user?.email} 님</h2>
    </>
  );
}
