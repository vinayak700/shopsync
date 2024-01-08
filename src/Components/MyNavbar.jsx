import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  NavDropdown,
  Nav,
  Offcanvas,
  Navbar,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelector } from "../Redux/reducers/authReducer";

const MyNavbar = () => {
  const { currentUser, isAdmin } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary mb-2"
        data-bs-theme="dark"
        sticky="top"
      >
        <Container fluid>
          <Navbar.Brand href="#" className="mr-5">
            <Link to="/" className="text-decoration-none text-white">
              ShopSync
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                ShopSync
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/admin-dashboard">
                    Admin Dashboard
                  </Nav.Link>
                )}
                {currentUser && (
                  <>
                    <Nav.Link as={NavLink} to="/orders">
                      My Orders
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/cart">
                      My Cart
                    </Nav.Link>
                    <p className="text-white">{currentUser.name}</p>
                    <Nav.Link
                      as={NavLink}
                      onClick={() => {
                        dispatch(authActions.logout());
                        navigate("/");
                      }}
                    >
                      Logout
                    </Nav.Link>
                  </>
                )}
                {!currentUser && (
                  <NavDropdown
                    title="User"
                    id="offcanvasNavbarDropdown-expand-lg"
                    className="dropleft"
                  >
                    <NavDropdown.Item as={Link} to="/signup">
                      Sign Up
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/signin">
                      Log In
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default MyNavbar;
