import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";

const ActiveProfiles = ({ mobile }) => {
  const {activeProfiles} = useProfileData()

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {activeProfiles.results.length ? (
        <>
          <p>Most active profiles:</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {activeProfiles.results.slice(0, 3).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            activeProfiles.results
              .slice(0, 5)
              .map((profile) => <Profile key={profile.id} profile={profile} />
            )
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default ActiveProfiles;
