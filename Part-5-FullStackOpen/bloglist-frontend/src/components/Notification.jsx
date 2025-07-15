// eslint-disable-next-line react/prop-types
const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyle = {
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    color: type === "success" ? "green" : "red",
    backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
    borderColor: type === "success" ? "#c3e6cb" : "#f5c6cb",
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
