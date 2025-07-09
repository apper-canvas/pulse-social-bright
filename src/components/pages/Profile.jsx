import UserProfile from "@/components/organisms/UserProfile";

const Profile = ({ currentUser }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <UserProfile currentUser={currentUser} />
    </div>
  );
};

export default Profile;