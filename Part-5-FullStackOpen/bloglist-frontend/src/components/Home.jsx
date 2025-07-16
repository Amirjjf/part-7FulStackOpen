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
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">📚 Blog Posts</h2>
          <span className="badge bg-secondary">{blogs.length} blogs</span>
        </div>
        
        <div className="card shadow mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">✍️ Create New Blog</h5>
          </div>
          <div className="card-body">
            <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
              <BlogForm
                createBlog={addBlog}
                onCancel={() => blogFormRef.current.toggleVisibility()}
              />
            </Togglable>
          </div>
        </div>

        <div className="row">
          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <div key={blog.id} className="col-12 mb-3">
                <Blog
                  blog={blog}
                  likeBlog={likeBlog}
                  deleteBlog={deleteBlog}
                  user={user}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
