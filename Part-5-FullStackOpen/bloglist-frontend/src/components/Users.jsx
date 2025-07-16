import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeUsers } from "../reducers/usersReducer";

const Users = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  const usersStyle = {
    marginTop: "20px",
    padding: "20px",
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "15px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const thStyle = {
    border: "none",
    padding: "12px 16px",
    textAlign: "left",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const tdStyle = {
    border: "none",
    borderBottom: "1px solid #e9ecef",
    padding: "12px 16px",
    fontSize: "15px",
  };

  const titleStyle = {
    color: "#343a40",
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "bold",
  };
  

  return (
    <div style={usersStyle}>
      <h2 style={titleStyle}>Users</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.blogs ? user.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
