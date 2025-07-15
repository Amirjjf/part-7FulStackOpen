import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { setNotificationAsync } from "./reducers/notificationReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Fetch Blogs
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Show Notifications
  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
  };

  // Handle Login
  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      showNotification(`Welcome, ${user.name}!`, "success");
    } catch (error) {
      showNotification("Wrong username or password", "error");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    showNotification("Logged out successfully", "success");
  };

  // Handle Blog Creation
  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      showNotification(
        `Added "${returnedBlog.title}" by ${returnedBlog.author}`,
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
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user,
      };
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map((b) => (b.id === blog.id ? returnedBlog : b)));
    } catch (error) {
      showNotification("Failed to update likes", "error");
    }
  };

  // Handle Blog Deletion
  const deleteBlog = async (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
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
