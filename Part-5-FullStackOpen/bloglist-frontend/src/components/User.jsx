import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>User not found</h2>
        <Link to="/users" style={{ color: "#007bff", textDecoration: "none" }}>
          ← Back to users
        </Link>
      </div>
    );
  }

  // Get user's blogs from the blogs state if not included in user object
  const userBlogs = user.blogs || blogs.filter(blog => 
    blog.user && (blog.user.id === user.id || blog.user === user.id)
  );

  const userStyle = {
    marginTop: "20px",
    padding: "20px",
  };

  const titleStyle = {
    color: "#343a40",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
  };

  const backLinkStyle = {
    color: "#007bff",
    textDecoration: "none",
    marginBottom: "20px",
    display: "inline-block",
    fontSize: "16px",
  };

  const blogsListStyle = {
    marginTop: "20px",
  };

  const blogItemStyle = {
    backgroundColor: "white",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  };

  const blogTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#495057",
    textDecoration: "none",
    marginBottom: "5px",
    display: "block",
  };

  const blogAuthorStyle = {
    fontSize: "14px",
    color: "#6c757d",
    fontStyle: "italic",
  };

  const blogUrlStyle = {
    fontSize: "14px",
    color: "#007bff",
    marginTop: "5px",
    textDecoration: "none",
  };

  const noBlogsStyle = {
    fontSize: "16px",
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    marginTop: "20px",
  };

  return (
    <div style={userStyle}>
      <Link to="/users" style={backLinkStyle}>
        ← Back to users
      </Link>
      
      <h2 style={titleStyle}>{user.name}</h2>
      
      <h3>Added blogs</h3>
      
      {userBlogs && userBlogs.length > 0 ? (
        <div style={blogsListStyle}>
          {userBlogs.map((blog) => (
            <div key={blog.id} style={blogItemStyle}>
              <div style={blogTitleStyle}>
                {blog.title}
              </div>
              <div style={blogAuthorStyle}>by {blog.author}</div>
              {blog.url && (
                <a 
                  href={blog.url} 
                  style={blogUrlStyle} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                  onMouseOut={(e) => e.target.style.textDecoration = "none"}
                >
                  Visit blog →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={noBlogsStyle}>
          No blogs added yet
        </div>
      )}
    </div>
  );
};

export default User;
