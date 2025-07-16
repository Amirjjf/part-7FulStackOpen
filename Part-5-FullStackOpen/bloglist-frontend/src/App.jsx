import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Users from "./components/Users";
import User from "./components/User";
import BlogView from "./components/BlogView";
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Log in to application</h2>
                {notification && notification.message && (
                  <Notification
                    message={notification.message}
                    type={notification.type}
                  />
                )}
                <LoginForm handleLogin={handleLogin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in View with routing
  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="bg-primary text-white py-3 mb-4">
              <div className="container">
                <h1 className="h3 mb-0">📚 Blog Application</h1>
              </div>
            </div>
            
            {notification && notification.message && (
              <div className="container">
                <Notification message={notification.message} type={notification.type} />
              </div>
            )}
            
            <Navigation />
            
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
                <Route path="/blogs/:id" element={<BlogView />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
