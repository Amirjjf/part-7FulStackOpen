import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";
import { setNotificationAsync } from "../reducers/notificationReducer";

const Navigation = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    showNotification("Logged out successfully", "success");
  };

  const navStyle = {
    padding: "15px 20px",
    backgroundColor: "#f8f9fa",
    marginBottom: "20px",
    borderRadius: "5px",
    borderBottom: "2px solid #dee2e6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const linksStyle = {
    display: "flex",
    alignItems: "center",
  };

  const linkStyle = {
    margin: "0 15px 0 0",
    textDecoration: "none",
    color: "#495057",
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  };

  const userInfoStyle = {
    fontWeight: "bold",
    color: "#495057",
  };

  const buttonStyle = {
    marginLeft: "15px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  };

  return (
    <div style={navStyle}>
      <div style={linksStyle}>
        <Link to="/" style={linkStyle}>
          blogs
        </Link>
        <Link to="/users" style={linkStyle}>
          users
        </Link>
      </div>
      <div style={userInfoStyle}>
        {user.name} logged in 
        <button 
          style={buttonStyle} 
          onClick={handleLogout}
          onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Navigation;
