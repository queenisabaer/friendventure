import { useEffect, useState } from "react";
import appStyles from "../../App.module.css";
import styles from "../../styles/FriendventureParticipants.module.css"
import { Container } from "react-bootstrap";
import { axiosRequest } from "../../api/axiosDefault";
import Asset from "../../components/Asset";
import Profile from "../profiles/Profile";


const FriendVentureParticipants = ({ friendventureId, mobile }) => {
  const [participantsData, setParticipantsData] = useState({
    friendventureParticipants: { results: [] },
  });

  const { friendventureParticipants } = participantsData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRequest.get(
          `/participants/?friendventure=${friendventureId}&ordering=created_at`
        );
        setParticipantsData((prevState) => ({
          ...prevState,
          friendventureParticipants: data,
        }));
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    handleMount();
  }, [friendventureId]);

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