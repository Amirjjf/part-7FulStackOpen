import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { setNotificationAsync } from "../reducers/notificationReducer";
import {
  createBlog,
  likeBlog as likeBlogAction,
  deleteBlog as deleteBlogAction,
} from "../reducers/blogReducer";

const Home = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  // Show Notifications
  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
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

  return (
    <div>
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

export default Home;
