import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import Explore from "@/components/pages/Explore";
import Profile from "@/components/pages/Profile";
import Notifications from "@/components/pages/Notifications";
import Search from "@/components/pages/Search";
import CreatePost from "@/components/pages/CreatePost";
import Messages from "@/components/pages/Messages";
function App() {
  // Mock current user - in a real app, this would come from auth context
  const currentUser = {
    id: 1,
    username: "johndoe",
    displayName: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Software developer passionate about creating amazing user experiences.",
    isVerified: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} />
      
      <main>
<Routes>
          <Route path="/" element={<Home currentUser={currentUser} />} />
          <Route path="/explore" element={<Explore currentUser={currentUser} />} />
          <Route path="/profile/:username" element={<Profile currentUser={currentUser} />} />
          <Route path="/notifications" element={<Notifications currentUser={currentUser} />} />
          <Route path="/search" element={<Search currentUser={currentUser} />} />
          <Route path="/create" element={<CreatePost currentUser={currentUser} />} />
          <Route path="/messages" element={<Messages currentUser={currentUser} />} />
          <Route path="/messages/:userId" element={<Messages currentUser={currentUser} />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;