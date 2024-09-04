import appStyles from "../../App.module.css";
import styles from "../../styles/FriendventureParticipants.module.css"
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import Profile from "../profiles/Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";


const FriendVentureParticipants = ({ mobile }) => {
  const { friendventureParticipants } = useProfileData();
  console.log("friendventureParticipants:", friendventureParticipants)

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mt-3"
      }`}
    >
      {friendventureParticipants.results.length ? (
        <>
          <p className={styles.Subheading}>Participants:</p>
          {mobile ? (
            <div>
              {friendventureParticipants.results.map((profile) => (
                <Profile key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            friendventureParticipants.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default FriendVentureParticipants;