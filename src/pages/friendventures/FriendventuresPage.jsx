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
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import ActiveProfiles from "../profiles/ActiveProfiles";

function FriendventuresPage({ message, filter = "" }) {
  const [friendventures, setFriendventures] = useState({ results: [] });
  const [hasLoaded, setHasloaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchFriendventures = async () => {
      try {
        const { data } = await axiosRequest.get(
          `/friendventures/?${filter}search=${query}`
        );
        setFriendventures(data);
        setHasloaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasloaded(false);
    const timer = setTimeout(() => {
      fetchFriendventures();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        < ActiveProfiles mobile />
        <i className={`fa-solid fa-magnifying-glass ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-ms-2"
            placeholder="Search FriendVentures"
          />
        </Form>

        {hasLoaded ? (
          <>
            {friendventures.results.length ? (
              <InfiniteScroll
                children={friendventures.results.map((friendventure) => (
                  <Friendventure
                    key={friendventure.id}
                    {...friendventure}
                    setFriendventure={setFriendventures}
                    friendventurePage
                  />
                ))}
                dataLength={friendventures.results.length}
                loader={<Asset spinner />}
                hasMore={!!friendventures.next}
                next={() => fetchMoreData(friendventures, setFriendventures)}
              />
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
        <ActiveProfiles />
      </Col>
    </Row>
  );
}

export default FriendventuresPage;
