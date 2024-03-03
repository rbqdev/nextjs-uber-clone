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
      Notification.permission === "granted" &&
      Notification.length === 0
    ) {
      const notification = new Notification("Goober", {
        body: description,
      });
      if (document.visibilityState === "hidden") {
        notification.addEventListener("click", (event) => {
          window.parent.parent.focus();
        });
        setTimeout(() => {
          notification.close();
        }, 4000);
      }
      if (document.visibilityState === "visible") {
        notification.close();
      }
    }
  };

  return {
    requestDesktopNotificationsPermission,
    sendDesktopNotification,
  };
};
