import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
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

  const commentsStyle = {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: "15px",
  };

  const formStyle = {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  };

  const textareaStyle = {
    flex: 1,
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    resize: "vertical",
    minHeight: "80px",
    fontSize: "14px",
    fontFamily: "inherit",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    alignSelf: "flex-start",
    transition: "background-color 0.2s",
  };

  const commentItemStyle = {
    backgroundColor: "white",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #e9ecef",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const commentContentStyle = {
    fontSize: "14px",
    color: "#495057",
    lineHeight: "1.5",
    marginBottom: "8px",
  };

  const commentDateStyle = {
    fontSize: "12px",
    color: "#6c757d",
    fontStyle: "italic",
  };

  const noCommentsStyle = {
    fontSize: "14px",
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
    padding: "20px",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={commentsStyle}>
      <h3 style={titleStyle}>Comments</h3>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={textareaStyle}
          maxLength={500}
        />
        <button 
          type="submit" 
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Add Comment
        </button>
      </form>

      {blog.comments && blog.comments.length > 0 ? (
        <div>
          {blog.comments.map((comment, index) => (
            <div key={index} style={commentItemStyle}>
              <div style={commentContentStyle}>{comment.content}</div>
              <div style={commentDateStyle}>
                {formatDate(comment.date)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={noCommentsStyle}>
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
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
