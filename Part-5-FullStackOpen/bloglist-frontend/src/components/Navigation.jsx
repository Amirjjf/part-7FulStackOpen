import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { logoutUser } from "../reducers/userReducer";
import { setNotificationAsync } from "../reducers/notificationReducer";

const Navigation = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const showNotification = (message, type = "success", duration = 5) => {
    const notificationData = { message, type };
    dispatch(setNotificationAsync(notificationData, duration));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    showNotification("Logged out successfully", "success");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/" className="fw-bold">
            🏠 Blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users" className="fw-bold">
            👥 Users
          </Nav.Link>
        </Nav>
        
        <Navbar.Text className="me-3">
          <span className="fw-bold">Welcome, {user?.name}!</span>
        </Navbar.Text>
        
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

export default Navigation;
