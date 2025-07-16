import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Card, Form, Button, Badge } from "react-bootstrap";
import { addCommentToBlog } from "../reducers/blogReducer";
import { setNotificationAsync } from "../reducers/notificationReducer";

const Comments = ({ blog }) => {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();

  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newComment.trim() === "") {
      showNotification("Comment cannot be empty", "error");
      return;
    }

    try {
      await dispatch(addCommentToBlog(blog.id, newComment.trim()));
      setNewComment("");
      showNotification("Comment added successfully", "success");
    } catch (error) {
      showNotification("Failed to add comment", "error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">💬 Comments</h5>
        <Badge bg="light" text="dark">
          {blog.comments ? blog.comments.length : 0}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Add a comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {newComment.length}/500 characters
            </Form.Text>
          </Form.Group>
          <Button type="submit" variant="primary">
            Add Comment
          </Button>
        </Form>

        {blog.comments && blog.comments.length > 0 ? (
          <div>
            {blog.comments.map((comment, index) => (
              <Card key={index} className="mb-3 border-start border-primary border-3">
                <Card.Body className="py-3">
                  <Card.Text className="mb-2">
                    {comment.content}
                  </Card.Text>
                  <small className="text-muted">
                    🕐 {formatDate(comment.date)}
                  </small>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-muted">
              <h6>💭 No comments yet</h6>
              <p>Be the first to share your thoughts!</p>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

Comments.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      content: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

export default Comments;
