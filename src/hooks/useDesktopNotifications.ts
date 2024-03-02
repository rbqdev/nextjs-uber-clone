export const useDesktopNotification = () => {
  const requestDesktopNotificationsPermission = () => {
    if (typeof Notification !== "undefined") {
      Notification.requestPermission();
    }
  };

  const sendDesktopNotification = ({
    description,
  }: {
    description: string;
  }) => {
    if (
      typeof Notification !== undefined &&
      Notification.permission === "granted"
    ) {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          const notification = new Notification("Goober", {
            body: description,
          });
          notification.addEventListener("click", (event) => {
            window.parent.parent.focus();
          });
          if (document.visibilityState === "visible") {
            notification.close();
          }
          setTimeout(() => {
            notification.close();
          }, 4000);
        }
      });
    }
  };

  return {
    requestDesktopNotificationsPermission,
    sendDesktopNotification,
  };
};
