import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { setNotificationAsync } from "../reducers/notificationReducer";
import {
  likeBlog as likeBlogAction,
  deleteBlog as deleteBlogAction,
} from "../reducers/blogReducer";
import Comments from "./Comments";

const BlogView = () => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const blog = blogs.find((b) => b.id === id);

  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
  };

  const handleLike = async () => {
    try {
      await dispatch(likeBlogAction(blog));
    } catch (error) {
      showNotification("Failed to update likes", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await dispatch(deleteBlogAction(blog.id));
        showNotification(`Deleted "${blog.title}"`, "success");
        // Could navigate back to home page after deletion
        window.location.href = "/";
      } catch (error) {
        showNotification("Failed to delete blog", "error");
      }
    }
  };

  if (!blog) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Blog post not found</h2>
        <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
          ← Back to blogs
        </Link>
      </div>
    );
  }

  const showDeleteButton =
    user && blog.user && user.username === blog.user.username;

  const containerStyle = {
    marginTop: "20px",
    padding: "20px",
    maxWidth: "800px",
    margin: "20px auto",
  };

  const backLinkStyle = {
    color: "#007bff",
    textDecoration: "none",
    marginBottom: "20px",
    display: "inline-block",
    fontSize: "16px",
  };

  const blogStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
    marginTop: "20px",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: "15px",
    lineHeight: "1.2",
  };

  const authorStyle = {
    fontSize: "18px",
    color: "#6c757d",
    marginBottom: "20px",
    fontStyle: "italic",
  };

  const urlStyle = {
    fontSize: "16px",
    marginBottom: "20px",
  };

  const urlLinkStyle = {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  };

  const likesStyle = {
    fontSize: "18px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const likeButtonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  };

  const deleteButtonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background-color 0.2s",
  };

  const userInfoStyle = {
    fontSize: "16px",
    color: "#6c757d",
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    borderLeft: "4px solid #007bff",
  };

  return (
    <div style={containerStyle}>
      <Link to="/" style={backLinkStyle}>
        ← Back to blogs
      </Link>
      
      <div style={blogStyle}>
        <h1 style={titleStyle}>{blog.title}</h1>
        
        <div style={authorStyle}>by {blog.author}</div>
        
        <div style={urlStyle}>
          <strong>URL: </strong>
          <a 
            href={blog.url} 
            style={urlLinkStyle}
            target="_blank" 
            rel="noopener noreferrer"
            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
            onMouseOut={(e) => e.target.style.textDecoration = "none"}
          >
            {blog.url}
          </a>
        </div>
        
        <div style={likesStyle}>
          <span><strong>Likes: {blog.likes}</strong></span>
          <button 
            style={likeButtonStyle}
            onClick={handleLike}
            onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
          >
            👍 Like
          </button>
        </div>
        
        <div style={userInfoStyle}>
          <strong>Added by:</strong> {blog.user?.name || "Anonymous"}
        </div>
        
        {showDeleteButton && (
          <button 
            style={deleteButtonStyle}
            onClick={handleDelete}
            onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
          >
            🗑️ Delete Blog
          </button>
        )}
      </div>
      
      <Comments blog={blog} />
    </div>
  );
};

export default BlogView;
