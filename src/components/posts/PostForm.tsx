import { useContext, useState } from "react";

import { db, app } from "firebaseApp";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import AuthContext from "context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState(null);
  const auth = getAuth(app);
  const { user } = useContext(AuthContext);
  const storage = getStorage();

  const onSubmit = async (e: any) => {
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    e.preventDefault();
    try {
      let imageUrl = "";
      let imageKey = "";
      // image 먼저 업로드
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        console.log(data?.metadata?.name);
        imageUrl = await getDownloadURL(data?.ref);
        imageKey = data?.metadata?.name;
      }

      // image url 받아서 addDoc
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString(),
        email: auth?.currentUser?.email,
        imageUrl: imageUrl,
        imageKey: imageKey,
        uid: user?.uid,
      });

      toast.success("게시글을 생성했습니다.");
      setContent("");
      setImageFile(null);
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

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  return (
    <form onSubmit={onSubmit} className="Form">
      <textarea name="content" id="content" required placeholder="tweet" value={content} onChange={onChange} />
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {imageFile && (
        <div>
          <img src={imageFile} alt="attachment" width={100} height={100} />
          <button type="button" onClick={handleDeleteImage}>
            Clear
          </button>
        </div>
      )}
      <input type="submit" value="생성" className="Form__btn-submit" />
    </form>
  );
}
