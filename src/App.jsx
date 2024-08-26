import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefault";
import SignUpForm from "./pages/auth/SignUpForm";
import LogInForm from "./pages/auth/LogInForm";
import FriendventureCreateForm from "./pages/friendventures/FriendventureCreateForm";

function App() {
  return (
    <>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Routes>
            <Route exact path="/" element={<h1>Home Page</h1>} />
            <Route exact path="/signup" element={<SignUpForm />} />
            <Route exact path="/login" element={<LogInForm />} />
            <Route exact path="/add" element={<FriendventureCreateForm />} />
            <Route path="*" element={<p>Sorry, Page not found</p>} />
          </Routes>
        </Container>
      </div>
    </>
  );
}

export default App;
