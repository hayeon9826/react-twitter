import { useContext, useState } from "react";

import { db, app } from "firebaseApp";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import AuthContext from "context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { FiImage } from "react-icons/fi";

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
    <form onSubmit={onSubmit} className="relative">
      <textarea
        className="min-h-[120px] block w-full resize-none border-0 py-2 px-4 !outline-none text-gray-900 placeholder:text-gray-400 focus:ring-0 ring-0 sm:text-sm sm:leading-6 md:text-xl md:placeholder:text-xl border-b-[1px] border-b-slate-100"
        name="content"
        id="content"
        required
        placeholder="What is happening?"
        value={content}
        onChange={onChange}
      />
      {imageFile && (
        <div className="py-3 flex justify-start items-end gap-4">
          <div className="border rounded-md border-slate-100 p-4">
            <img src={imageFile} alt="attachment" width={100} height={100} />
          </div>

          <button
            type="button"
            onClick={handleDeleteImage}
            className="rounded-full bg-red-600 px-4 py-2 max-h-[40px] text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            삭제
          </button>
        </div>
      )}
      <div className="py-3 flex justify-between border-b-[1px] border-b-slate-100">
        <label htmlFor="file-input" className="cursor-pointer px-4 flex flex-col justify-center">
          <FiImage className="text-blue-500 hover:text-blue-600 focus:text-blue-600" />
        </label>
        <input type="file" name="file-input" id="file-input" accept="image/*" onChange={handleFileUpload} className="hidden" />

        <input
          type="submit"
          disabled={!content}
          value="Tweet"
          className="disabled:bg-blue-600/50 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        />
      </div>
    </form>
  );
}
