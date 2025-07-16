import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const showDeleteButton =
    user && blog.user && user.username === blog.user.username;

  const handleLike = () => {
    likeBlog(blog);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title>
          <Link 
            to={`/blogs/${blog.id}`} 
            className="text-decoration-none"
          >
            {blog.title}
          </Link>
        </Card.Title>
        
        <Card.Subtitle className="mb-2 text-muted">
          by {blog.author}
        </Card.Subtitle>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <Badge bg="primary" className="me-2">
              👍 {blog.likes} likes
            </Badge>
            {blog.user && (
              <small className="text-muted">
                Added by {blog.user.name}
              </small>
            )}
          </div>
          
          <div>
            <Button 
              variant="outline-success" 
              size="sm" 
              onClick={handleLike}
              className="me-2"
            >
              👍 Like
            </Button>
            
            {showDeleteButton && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleDelete}
              >
                🗑️ Delete
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
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
