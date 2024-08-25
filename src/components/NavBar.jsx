import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from "../assets/FriendVenture_logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink, Link } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser()

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      showMessage("success", "Successfully signed out!");
    } catch (err) {
      console.log(err);
    }
  };

  const loggedInIcons = (
    <>
      <NavDropdown
        title={
          <span id={styles.dropdownMenu}>
            <i className="fa-solid fa-dharmachakra"></i>
            FriendVentures
          </span>
        }
      >
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/add"
        >
          <i className="fa-solid fa-calendar-plus"></i>Add
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/bookmarks"
        >
          <i className="fa-solid fa-heart"></i>Bookmarks
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/upcoming"
        >
          <i className="fa-solid fa-calendar-check"></i>Upcoming
        </NavDropdown.Item>
      </NavDropdown>
      <Nav.Link
        as={NavLink}
        className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
        to="/profile"
      >
        <Avatar src={currentUser?.profile_image} text={currentUser?.username} height={30} />
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
        to="/"
        onClick={handleSignOut}
      >
        <i className="fa-solid fa-right-from-bracket"></i>Log Out
      </Nav.Link>
    </>
  );
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
              className={({ isActive }) =>
                isActive ? `${styles.NewActive}` : ""
              }
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
