export default ({ guest, user }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return guest;
  }

  return user;
};
