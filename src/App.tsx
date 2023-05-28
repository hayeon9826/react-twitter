import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h2>Home Page</h2>} />
      <Route path="/posts" element={<h2>Post List Page</h2>} />
      <Route path="/posts/:id" element={<h2>Post Detail Page</h2>} />
      <Route path="/posts/new" element={<h2>Post New Page</h2>} />
      <Route path="/posts/edit/:id" element={<h2>Post Edit Page</h2>} />
      <Route path="/profile" element={<h2>Profile Page</h2>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
