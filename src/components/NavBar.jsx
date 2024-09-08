import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from "../assets/FriendVenture_logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink, Link } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = (props) => {
  const { showMessage } = props;
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, showDropdown, setShowDropdown, ref } =
    useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      setExpanded(false);
      setShowDropdown(false);
      showMessage("success", "Successfully logged out!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDropdownClick = (event) => {
    event.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false);
    setExpanded(false);
  };

  const loggedInIcons = (
    <>
      <NavDropdown
        title={
          <span id={styles.dropdownMenu} onClick={handleDropdownClick}>
            <i className="fa-solid fa-dharmachakra"></i>
            FriendVentures
          </span>
        }
        show={showDropdown}
      >
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/add"
          onClick={handleDropdownItemClick}
        >
          <i className="fa-solid fa-calendar-plus"></i>Add
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/bookmarks"
          onClick={handleDropdownItemClick}
        >
          <i className="fa-solid fa-heart"></i>Bookmarks
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/upcoming"
          onClick={handleDropdownItemClick}
        >
          <i className="fa-solid fa-calendar-check"></i>Upcoming
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
          to="/friendventures"
          onClick={handleDropdownItemClick}
        >
          <i className="fa-solid fa-compass"></i>Explore
        </NavDropdown.Item>
      </NavDropdown>
      <Nav.Link
        as={NavLink}
        className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
        to={`/profiles/${currentUser?.profile_id}/`}
        onClick={handleDropdownItemClick}
      >
        <Avatar
          src={currentUser?.profile_image}
          text={currentUser?.username}
          height={30}
        />
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
        onClick={handleDropdownItemClick}
      >
        <i className="fa-solid fa-user-pen"></i>Sign Up
      </Nav.Link>
      <Nav.Link
        as={NavLink}
        className={({ isActive }) => (isActive ? `${styles.NewActive}` : "")}
        to="/login"
        onClick={handleDropdownItemClick}
      >
        <i className="fa-solid fa-right-to-bracket"></i>Log in
      </Nav.Link>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/" onClick={handleDropdownItemClick}>
          <Navbar.Brand>
            <img
              className={styles.Logo}
              src={logo}
              alt="friendventure logo"
              height="60px"
            />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse ref={ref} id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto text-center">
            <Nav.Link
              end
              as={NavLink}
              className={({ isActive }) =>
                isActive ? `${styles.NewActive}` : ""
              }
              to="/"
              onClick={handleDropdownItemClick}
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
