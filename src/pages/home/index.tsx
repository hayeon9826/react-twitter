import PostList from "components/posts/PostList";
import MenuList from "components/Menu";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  imageUrl?: string;
  imageKey?: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
}

export default function HomePage() {
  return (
    <>
      <h1 className="py-4 text-xl font-bold px-4">Home</h1>
      <PostList />
      <MenuList />
    </>
  );
}
