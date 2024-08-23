import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/FriendVenture_logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const loggedInIcons = <>{currentUser?.username}</>;
  const loggedOutIcons = (
    <>
      <Nav.Link
        as={NavLink}
        className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
        to="/signup"
      >
        <i className="fa-solid fa-user-pen"></i>Sign Up
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
        to="/login"
      >
        <i className="fa-solid fa-right-to-bracket"></i>Log in
      </Nav.Link>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img
              className={styles.Logo}
              src={logo}
              alt="friendventure logo"
              height="60px"
            />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto text-center">
            <Nav.Link
              end
              as={NavLink}
              className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </Nav.Link>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
