import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./login";
import SigninPage from "./signin";
import HomePage from "./home";

interface RouterProps {
  isAuthenticated: boolean;
}

export default function Router({ isAuthenticated }: RouterProps) {
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<h2>Post List Page</h2>} />
          <Route path="/posts/:id" element={<h2>Post Detail Page</h2>} />
          <Route path="/posts/new" element={<h2>Post New Page</h2>} />
          <Route path="/posts/edit/:id" element={<h2>Post Edit Page</h2>} />
          <Route path="/profile" element={<h2>Profile Page</h2>} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SigninPage />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </>
      )}
    </Routes>
  );
}
