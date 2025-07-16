import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
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
      <div className="text-center mt-5">
        <h2>Blog post not found</h2>
        <Link to="/" className="btn btn-primary">
          ← Back to blogs
        </Link>
      </div>
    );
  }

  const showDeleteButton =
    user && blog.user && user.username === blog.user.username;

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/" className="btn btn-outline-primary">
            ← Back to blogs
          </Link>
        </div>
        
        <Card className="shadow mb-4">
          <Card.Header className="bg-primary text-white">
            <h1 className="mb-0">{blog.title}</h1>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <h5 className="text-muted">✍️ by {blog.author}</h5>
            </div>
            
            <div className="mb-3">
              <strong>🌐 URL: </strong>
              <a 
                href={blog.url} 
                className="text-primary"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {blog.url}
              </a>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Badge bg="success" className="fs-6 me-2">
                  👍 {blog.likes} likes
                </Badge>
                <small className="text-muted">
                  Added by {blog.user?.name || "Anonymous"}
                </small>
              </div>
              
              <div>
                <Button 
                  variant="outline-success" 
                  onClick={handleLike}
                  className="me-2"
                >
                  👍 Like
                </Button>
                
                {showDeleteButton && (
                  <Button 
                    variant="outline-danger" 
                    onClick={handleDelete}
                  >
                    🗑️ Delete Blog
                  </Button>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <Comments blog={blog} />
      </div>
    </div>
  );
};

export default BlogView;
