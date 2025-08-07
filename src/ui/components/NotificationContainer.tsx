import React from "react";
import { useNotificationStore } from "../store/notification/useNotificationStore";
import Alert from "./Alert";

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <>
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          message={notification.message}
          type={notification.type}
          position={notification.position}
          duration={notification.duration}
          restartAlert={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
};

export default NotificationContainer;
