import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
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

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileFriendventures, setProfileFriendventures] = useState({
    results: [],
  });
  const currentUser = useCurrentUser();
  const { id } = useParams();
  console.log("ProfilePage - useParams id:", id);
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    console.log("useEffect triggered with id:", id);
    const fetchData = async () => {
      console.log("Fetching data for profile id:", id);
      try {
        const [{ data: pageProfile }, { data: profileFriendventures }] =
          await Promise.all([
            axiosRequest.get(`/profiles/${id}/`),
            axiosRequest.get(`/friendventures/?owner__profile=${id}`),
          ]);
        console.log("API Response - pageProfile:", pageProfile);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileFriendventures(profileFriendventures);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, setProfileData]);
  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.profile_image}
          />
        </Col>
        <Col lg={7}>
          <h3 className="m-2">{profile?.owner}</h3>
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
        </Col>
        <Col lg={2} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.RedButton}`}
                onClick={() => {}}
              >
                unfollow
              </Button>
            ) : (
              <Button className={`${btnStyles.Button}`} onClick={() => {}}>
                follow
              </Button>
            ))}
        </Col>
        <Col className="p-3">
          {profile?.content && <Col className="p-3">{profile.content}</Col>}
        </Col>
      </Row>
      <hr />
    </>
  );
  const mainProfileFriendventures = (
    <>
      <hr />
      <p className={`text-center ${appStyles.Subheading}`}>Profile owner's FriendVentures</p>
      <hr />
      {profileFriendventures.results.length ? (
        <InfiniteScroll
          children={profileFriendventures.results.map((friendventure) => (
            <Friendventure
              key={friendventure.id}
              {...friendventure}
              setFriendventure={setProfileFriendventures}
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
