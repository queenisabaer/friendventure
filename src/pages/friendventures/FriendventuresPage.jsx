import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/FriendventuresPage.module.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefault";
import Friendventure from "./Friendventure";

import NoResults from "../../assets/no_results.webp";
import Asset from "../../components/Asset";

function FriendventuresPage({message, filter = ""}) {
  const [friendventures, setFriendventures] = useState({ results: [] });
  const [hasLoaded, setHasloaded] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchFriendventures = async () => {
      try {
        const { data } = await axiosRequest.get(`/friendventures/?${filter}`);
        setFriendventures(data);
        setHasloaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasloaded(false);
    fetchFriendventures();
  }, [filter, pathname]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Your upcoming FriendVentures mobile</p>
        {hasLoaded ? (
          <>
            {friendventures.results.length ? (
              friendventures.results.map((friendventure) => (
                <Friendventure
                  key={friendventure.id}
                  {...friendventure}
                  setFriendventure={setFriendventures}
                />
              ))
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <p>Your upcoming FriendVentures for desktop</p>
      </Col>
    </Row>
  );
}

export default FriendventuresPage;
