import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { setNotificationAsync } from "./reducers/notificationReducer";
import {
  initializeBlogs,
  createBlog,
  likeBlog as likeBlogAction,
  deleteBlog as deleteBlogAction,
} from "./reducers/blogReducer";
import { loginUser, logoutUser, initializeUser } from "./reducers/userReducer";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const blogFormRef = useRef();

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

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    showNotification("Logged out successfully", "success");
  };

  // Handle Blog Creation
  const addBlog = async (newBlog) => {
    try {
      await dispatch(createBlog(newBlog));
      showNotification(
        `Added "${newBlog.title}" by ${newBlog.author}`,
        "success"
      );

      blogFormRef.current.toggleVisibility();
    } catch (error) {
      showNotification("Failed to add blog", "error");
    }
  };

  // Handle Blog Like
  const likeBlog = async (blog) => {
    try {
      await dispatch(likeBlogAction(blog));
    } catch (error) {
      showNotification("Failed to update likes", "error");
    }
  };

  // Handle Blog Deletion
  const deleteBlog = async (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await dispatch(deleteBlogAction(blog.id));
        showNotification(`Deleted "${blog.title}"`, "success");
      } catch (error) {
        showNotification("Failed to delete blog", "error");
      }
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

  // Logged-in View
  return (
    <div>
      <h2>blogs</h2>
      {notification && notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <p>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </p>

      <h2>Create New Blog</h2>
      <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
          onCancel={() => blogFormRef.current.toggleVisibility()}
        />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}
    </div>
  );
};

export default App;
