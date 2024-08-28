import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefault";
import SignUpForm from "./pages/auth/SignUpForm";
import LogInForm from "./pages/auth/LogInForm";
import FriendventureCreateForm from "./pages/friendventures/FriendventureCreateForm";
import FriendventurePage from "./pages/friendventures/FriendventurePage";
import FriendventuresPage from "./pages/friendventures/FriendventuresPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  return (
    <>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Routes>
            <Route exact path="/" element={
              <FriendventuresPage
                  message="Sorry, no FriendVentures found. Adjust the search keyword."
                />} />
            <Route
              exact
              path="/friendventures"
              element={
                <FriendventuresPage
                  message="Sorry, no FriendVentures found. Adjust the search keyword or follow a user."
                  filter={`owner__followed_by__owner__profile=${profile_id}&`}
                />
              }
            />
            <Route
              exact
              path="/bookmarks"
              element={
                <FriendventuresPage
                  message="Sorry, no FriendVentures found. Adjust the search keyword or bookmark a FriendVenture."
                  filter={`bookmarks__owner__profile=${profile_id}&ordering=-bookmarks__created_at&`}
                />
              }
            />
            <Route
              exact
              path="/upcoming"
              element={
                <FriendventuresPage
                  message="Sorry, no FriendVentures found. Adjust the search keyword or participate in a FriendVenture."
                  filter={`participants__owner__profile=${profile_id}&ordering=-participants__created_at&`}
                />
              }
            />
            <Route exact path="/signup" element={<SignUpForm />} />
            <Route exact path="/login" element={<LogInForm />} />
            <Route exact path="/add" element={<FriendventureCreateForm />} />
            <Route
              exact
              path="/friendventures/:id"
              element={<FriendventurePage />}
            />
            <Route path="*" element={<p>Sorry, Page not found</p>} />
          </Routes>
        </Container>
      </div>
    </>
  );
}

export default App;
