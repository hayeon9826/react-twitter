import { useCallback, useContext, useEffect, useState } from "react";

import { db } from "firebaseApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { PostProps } from "pages/home";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "context/AuthContext";
import { FiImage } from "react-icons/fi";

export default function PostEditForm() {
  const params = useParams();
  const [content, setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [post, setPost] = useState<PostProps | null>(null);
  const navigate = useNavigate();
  const storage = getStorage();
  const { user } = useContext(AuthContext);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    let key = `${user?.uid}/${post?.imageKey}`;
    e.preventDefault();

    try {
      if (post) {
        let imageUrl = post?.imageUrl;
        // 새로운 업로드 있으면 기존 사진 지우고 새로운 사진 업로드
        if (newImageFile) {
          if (post?.imageKey) {
            key = `${user?.uid}/${uuidv4()}`;
            const imageRef = ref(storage, post?.imageUrl);
            await deleteObject(imageRef).catch((error) => {
              console.log(error);
            });
          }
          // 새로운 사진 업로드
          const storageRef = ref(storage, key);
          const data = await uploadString(storageRef, newImageFile, "data_url");
          imageUrl = await getDownloadURL(data?.ref);
        }
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          imageUrl: imageUrl,
          imageKey: key,
          updatedAt: new Date()?.toLocaleDateString(),
        });

        navigate(`/posts/${post.id}`);
        toast.success("게시글을 수정했습니다.");
      }
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
      setImageFile(null);
      setNewImageFile(result);
    };
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setNewImageFile(null);
  };

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <>
      <form onSubmit={onSubmit} className="relative">
        <textarea
          className="min-h-[120px] block w-full resize-none border-0 py-4 px-4 !outline-none dark:bg-slate-800 dark:text-white text-gray-900 placeholder:text-gray-400 focus:ring-0 ring-0 sm:text-sm sm:leading-6 md:text-xl md:placeholder:text-xl border-b-[1px] border-b-slate-100 dark:border-b-slate-600"
          name="content"
          id="content"
          required
          placeholder="What is happening?"
          value={content}
          onChange={onChange}
        />
        {(imageFile || newImageFile) && (
          <div className="py-3 flex justify-start items-end gap-4 px-4">
            <div className="border rounded-md border-slate-100 p-4">
              <img src={imageFile || newImageFile || ""} alt="attachment" width={100} height={100} />
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
        <div className="py-3 flex justify-between border-b-[1px] border-b-slate-100 px-4">
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
    </>
  );
}
