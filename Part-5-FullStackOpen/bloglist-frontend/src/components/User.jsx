import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Card, Badge, Row, Col } from "react-bootstrap";

const User = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h2>User not found</h2>
        <Link to="/users" className="btn btn-primary">
          ← Back to users
        </Link>
      </div>
    );
  }

  // Get user's blogs from the blogs state if not included in user object
  const userBlogs = user.blogs || blogs.filter(blog => 
    blog.user && (blog.user.id === user.id || blog.user === user.id)
  );

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/users" className="btn btn-outline-primary">
            ← Back to users
          </Link>
        </div>
        
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">👤 {user.name}</h2>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4>📚 Added blogs</h4>
              <Badge bg="secondary" className="fs-6">
                {userBlogs.length} blog{userBlogs.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {userBlogs && userBlogs.length > 0 ? (
          <Row>
            {userBlogs.map((blog) => (
              <Col key={blog.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
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
                    {blog.url && (
                      <Card.Text>
                        <a 
                          href={blog.url} 
                          className="text-primary" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Visit blog →
                        </a>
                      </Card.Text>
                    )}
                    <div className="mt-3">
                      <Badge bg="info">👍 {blog.likes} likes</Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center shadow-sm">
            <Card.Body className="py-5">
              <div className="text-muted">
                <h5>📝 No blogs added yet</h5>
                <p>This user hasn&apos;t created any blog posts.</p>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default User;
