import { useContext, useState, useEffect } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FiImage } from "react-icons/fi";
import Header from "components/Header";

export const PROFILE_DEFAULT_URL = "/images/user-icon.png";

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
      <Header hasBack={true} />
      <form onSubmit={onSubmit} className="relative pt-4 px-4">
        <label htmlFor="email" className="block font-semibold text-lg">
          이름
        </label>
        <input
          type="text"
          name="displayName"
          value={displayName}
          onChange={onChange}
          className="w-full px-4 py-2 !outline-none border border-slate-100 dark:border-slate-600 dark:bg-slate-600 focus:border-blue-600 rounded-md mt-2"
        />
        {(defaultUrl || newImageUrl) && (
          <div>
            <div className="py-3 flex justify-start items-end gap-4">
              <div className="border rounded-md border-slate-100 p-4">
                <img src={defaultUrl || newImageUrl || ""} alt="attachment" width={100} height={100} />
              </div>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="rounded-full bg-red-600 px-4 py-2 max-h-[40px] text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        )}
        <div className="py-3 flex justify-between border-b-[1px] border-b-slate-100 px-4">
          <div className="flex justify-start gap-2 items-center">
            <label htmlFor="email" className="block font-semibold text-lg">
              이미지 변경
            </label>
            <label htmlFor="file-input" className="cursor-pointer px-4 flex flex-col justify-center">
              <FiImage className="text-blue-500 hover:text-blue-600 focus:text-blue-600 text-xl" />
            </label>
          </div>

          <input type="file" name="file-input" id="file-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <input
            type="submit"
            value="프로필 수정"
            className="disabled:bg-blue-600/50 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          />
        </div>
      </form>
    </>
  );
}
