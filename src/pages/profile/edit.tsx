import { useContext, useState, useEffect } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const PROFILE_DEFAULT_URL =
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80";

export default function ProfileEditPage() {
  const { user } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [defaultUrl, setDefaultUrl] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const storage = getStorage();

  const onChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setDisplayName(value);
  };

  const onSubmit = async (event: any) => {
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let imageUrl = "";

    event.preventDefault();

    if (newImageUrl) {
      // 기존 이미지 삭제
      if (user?.photoURL) {
        const imageRef = ref(storage, user?.photoURL);
        console.log(imageRef, "@@@imageRef");
        const data = await deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
        console.log(data, "###RES");
      }
      // image 먼저 업로드
      const data = await uploadString(storageRef, newImageUrl, "data_url");
      imageUrl = await getDownloadURL(data?.ref);
    }

    if ((user?.displayName !== displayName || user?.photoURL !== newImageUrl) && user) {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: imageUrl,
      })
        .then(() => {
          toast.success("프로필이 업데이트 되었습니다.");
          navigate("/profile");
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setDefaultUrl(null);
      setNewImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setDefaultUrl(null);
    setNewImageUrl(null);
  };

  useEffect(() => {
    if (user?.photoURL) {
      setDefaultUrl(user?.photoURL || PROFILE_DEFAULT_URL);
    }
  }, [user]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" name="displayName" value={displayName} onChange={onChange} />
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        {(defaultUrl || newImageUrl) && (
          <div>
            <img src={defaultUrl || newImageUrl || ""} alt="attachment" width={100} height={100} />
            <button type="button" onClick={handleDeleteImage}>
              Clear
            </button>
          </div>
        )}
        <input type="submit" value="프로필 수정" />
      </form>
      <button
        type="button"
        className="Profile__logout"
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
