import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Users from "./components/Users";
import { setNotificationAsync } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { loginUser, initializeUser } from "./reducers/userReducer";

const App = () => {
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  // Fetch Blogs
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  // Show Notifications
  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
  };

  // Handle Login
  const handleLogin = async (credentials) => {
    try {
      const user = await dispatch(loginUser(credentials));
      showNotification(`Welcome, ${user.name}!`, "success");
    } catch (error) {
      showNotification("Wrong username or password", "error");
    }
  };

  // Conditional Rendering
  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification && notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  // Logged-in View with routing
  return (
    <div>
      <h2>blog app</h2>
      {notification && notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Navigation />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;
