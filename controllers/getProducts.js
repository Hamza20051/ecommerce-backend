// helpers/guest.js
export const getGuestId = () => {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = "guest_" + crypto.randomUUID();
    localStorage.setItem("userId", userId);
  }

  return userId;
};
