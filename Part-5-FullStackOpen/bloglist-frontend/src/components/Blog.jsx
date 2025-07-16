import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const blogStyle = {
    padding: "15px",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    marginBottom: "15px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#007bff",
    textDecoration: "none",
    marginBottom: "8px",
    display: "block",
  };

  const authorStyle = {
    fontSize: "14px",
    color: "#6c757d",
    marginBottom: "10px",
  };

  const actionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  };

  const likeButtonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
  };

  const deleteButtonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
  };

  const likesStyle = {
    fontSize: "14px",
    color: "#6c757d",
  };

  const showDeleteButton =
    user && blog.user && user.username === blog.user.username;

  return (
    <div className="blog" style={blogStyle}>
      <Link 
        to={`/blogs/${blog.id}`} 
        style={titleStyle}
        onMouseOver={(e) => e.target.style.textDecoration = "underline"}
        onMouseOut={(e) => e.target.style.textDecoration = "none"}
      >
        {blog.title}
      </Link>
      
      <div style={authorStyle}>by {blog.author}</div>
      
      <div style={actionsStyle}>
        <span style={likesStyle}>Likes: {blog.likes}</span>
        <button 
          style={likeButtonStyle}
          onClick={() => likeBlog(blog)}
          onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
        >
          👍 Like
        </button>
        {showDeleteButton && (
          <button 
            style={deleteButtonStyle}
            onClick={() => deleteBlog(blog)}
            onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

// Define PropTypes
Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
