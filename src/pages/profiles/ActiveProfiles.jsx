import React, { useEffect, useState } from "react";
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import { axiosRequest } from "../../api/axiosDefault";
import Asset from "../../components/Asset";
import Profile from "./Profile";

const ActiveProfiles = ({ mobile }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    activeProfiles: { results: [] },
  });

  const { activeProfiles } = profileData;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRequest.get(
          `/profiles/?ordering=-friendventures_count`
        );
        setProfileData((prevState) => ({
          ...prevState,
          activeProfiles: data,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  });

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
              {activeProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            activeProfiles.results
              .slice(0, 6)
              .map((profile) => <Profile key={profile.id} profile={profile} />)
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default ActiveProfiles;
