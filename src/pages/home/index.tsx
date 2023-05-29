import PostList from "components/posts/PostList";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}

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
  comments?: CommentProps[];
}

export default function HomePage() {
  return (
    <>
      <h1 className="py-4 text-xl font-bold px-4">Home</h1>
      <PostList />
    </>
  );
}
