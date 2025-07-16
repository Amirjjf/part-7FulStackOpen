import { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col } from "react-bootstrap";

const BlogForm = ({ createBlog, onCancel }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control
              id="title"
              type="text"
              value={title}
              name="Title"
              placeholder="Enter blog title"
              onChange={({ target }) => setTitle(target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="author">Author</Form.Label>
            <Form.Control
              id="author"
              type="text"
              value={author}
              name="Author"
              placeholder="Enter author name"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor="url">URL</Form.Label>
        <Form.Control
          id="url"
          type="text"
          value={url}
          name="URL"
          placeholder="Enter blog URL (e.g., https://example.com)"
          onChange={({ target }) => setUrl(target.value)}
          required
        />
      </Form.Group>
      
      <div className="d-flex gap-2">
        <Button type="submit" variant="primary">
          Create Blog
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default BlogForm;
