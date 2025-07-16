import { Alert } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const Notification = ({ message, type }) => {
  if (!message) return null;

  const variant = type === "success" ? "success" : "danger";

  return (
    <Alert variant={variant} className="mb-3">
      {message}
    </Alert>
  );
};

export default Notification;
