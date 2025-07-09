import NotificationsList from "@/components/organisms/NotificationsList";

const Notifications = ({ currentUser }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <NotificationsList currentUser={currentUser} />
    </div>
  );
};

export default Notifications;