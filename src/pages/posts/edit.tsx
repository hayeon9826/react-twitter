import Header from "components/Header";
import PostEditForm from "components/posts/PostEditForm";

export default function PostEditPage() {
  return (
    <>
      <Header hasBack={true} />
      <PostEditForm />
    </>
  );
}
