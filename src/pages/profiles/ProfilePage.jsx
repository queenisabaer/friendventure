import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import moment from "moment-timezone";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import ActiveProfiles from "./ActiveProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefault";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Friendventure from "../friendventures/Friendventure";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no_results.webp";
import { ProfileEditDropdown } from "../../components/EditDeleteDropdown";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileFriendventures, setProfileFriendventures] = useState({
    results: [],
  });
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  const combineDateTime = (dateString) => {
    const parsedDate = moment(dateString, "DD MMM YYYY HH:mm");
    return parsedDate.isValid() ? parsedDate.utc().valueOf() : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileFriendventures }] =
          await Promise.all([
            axiosRequest.get(`/profiles/${id}/`),
            axiosRequest.get(`/friendventures/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));

        // Filter friendventures based on datetime
        const now = moment().utc().valueOf();
        const filteredFriendventures = profileFriendventures.results.filter(
          (friendventure) => {
            const friendventureTimestamp = combineDateTime(
              friendventure.datetime
            );
            return (
              friendventureTimestamp !== null && friendventureTimestamp >= now
            );
          }
        );
        setProfileFriendventures({ results: filteredFriendventures });
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <span className={styles.EditProfile}>
        {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      </span>
      <Row className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.profile_image}
          />
        </Col>
        <Col lg={7}>
          <Row className="align-items-center">
            <h3 className={`m-2 d-inline ${styles.Username}`}>
              {profile?.owner}
            </h3>
          </Row>
          <Row className="justify-content-center no-gutters">
            <Col xs={12} md={4} className="my-2">
              <div>{profile?.friendventures_count}</div>
              <div>FriendVentures</div>
            </Col>
            <Col xs={12} md={4} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>Followers</div>
            </Col>
            <Col xs={12} md={4} className="my-2">
              <div>{profile?.following_count}</div>
              <div>Following</div>
            </Col>
          </Row>
          <Row className="p-3">
            <Col xs={12}>
              <p className={`mt-2 mb-1 ${appStyles.Subheading}`}>That's me:</p>
              {profile?.description ? (
                <p>{profile.description}</p>
              ) : (
                <p>Sorry, no description added yet.</p>
              )}
            </Col>
            <Col xs={12}>
              <p className={`mt-2 mb-1 ${appStyles.Subheading}`}>Reach out:</p>
            </Col>
            <Col xs={12} md={6}>
              <p className="mb-1">Phone:</p>
              <p>
                {profile?.phone_number
                  ? profile.phone_number
                  : "Not yet provided"}
              </p>
            </Col>
            <Col xs={12} md={6}>
              <p className="mb-1">Email:</p>
              <p>{profile?.email ? profile.email : "Not yet provided"}</p>
            </Col>
          </Row>
        </Col>
        <Col lg={2} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.RedLight}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Col>
      </Row>
      <hr />
    </>
  );

  const mainProfileFriendventures = (
    <>
      <hr />
      <p className={`text-center ${appStyles.Subheading}`}>
        Profile owner's FriendVentures
      </p>
      <hr />
      {profileFriendventures.results.length ? (
        <InfiniteScroll
          children={profileFriendventures.results.map((friendventure) => (
            <Friendventure
              key={friendventure.id}
              {...friendventure}
              setFriendventure={setProfileFriendventures}
              friendventurePage
            />
          ))}
          dataLength={profileFriendventures.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileFriendventures.next}
          next={() =>
            fetchMoreData(profileFriendventures, setProfileFriendventures)
          }
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't created a FriendVenture yet.`}
        />
      )}
    </>
  );
  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <ActiveProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileFriendventures}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <ActiveProfiles />
      </Col>
    </Row>
  );
}
export default ProfilePage;
