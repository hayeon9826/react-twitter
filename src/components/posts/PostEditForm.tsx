import { useCallback, useContext, useEffect, useState } from "react";

import { db } from "firebaseApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { PostProps } from "pages/home";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "context/AuthContext";

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
    <form onSubmit={onSubmit} className="Form">
      <textarea name="content" id="content" required placeholder="tweet" value={content} onChange={onChange} />
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {(imageFile || newImageFile) && (
        <div>
          <img src={imageFile || newImageFile || ""} alt="attachment" width={100} height={100} />
          <button type="button" onClick={handleDeleteImage}>
            Clear
          </button>
        </div>
      )}
      <input type="submit" value="수정" className="Form__btn-submit" />
    </form>
  );
}
