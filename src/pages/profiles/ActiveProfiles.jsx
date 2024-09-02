import React, { useEffect, useState } from "react";
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import { axiosRequest } from "../../api/axiosDefault";
import Asset from "../../components/Asset";

const ActiveProfiles = () => {
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
    <Container className={appStyles.Content}>
      {activeProfiles.results.length ? (
        <>
          <p>Most active profiles:</p>

          {activeProfiles.results.map((profile) => (
            <p key={profile.id}>{profile.owner}</p>
          ))}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default ActiveProfiles;
