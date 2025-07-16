import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Card } from "react-bootstrap";
import { initializeUsers } from "../reducers/usersReducer";

const Users = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="text-primary mb-4">👥 Users</h2>
        
        <Card className="shadow">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">User Statistics</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th className="text-center">Blogs Created</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice()
                  .sort((a, b) => (b.blogs ? b.blogs.length : 0) - (a.blogs ? a.blogs.length : 0))
                  .map((user) => (
                    <tr key={user.id}>
                      <td>
                        <Link 
                          to={`/users/${user.id}`} 
                          className="text-decoration-none fw-bold"
                        >
                          {user.name}
                        </Link>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-primary">
                          {user.blogs ? user.blogs.length : 0}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Users;
