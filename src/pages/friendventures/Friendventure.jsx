import styles from "../../styles/Friendventure.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosResponse } from "../../api/axiosDefault";
import { EditDeleteDropdown } from "../../components/EditDeleteDropdown";

// format date and time
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const formatTime = (timeString) => {
  if (!timeString || typeof timeString !== "string") {
    console.error("Time string is empty, undefined, or not a string");
    return "N/A";
  }
  const cleanTime = timeString.split(":");
  if (cleanTime.length < 2) {
    console.error(`Invalid time format: ${timeString}`);
    return "N/A";
  }
  const [hours, minutes] = cleanTime.slice(0, 2);
  return `${hours}:${minutes}`;
};

const Friendventure = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_pic,
    bookmarks_count,
    bookmark_id,
    category,
    comments_count,
    participants_count,
    participants_id,
    place,
    date,
    time,
    title,
    image,
    description,
    updated_at,
    friendventurePage,
    setFriendventure,
    datetime,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const formatedDate = formatDate(date);
  const formatedTime = time ? formatTime(time) : "N/A";
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/friendventures/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosResponse.delete(`/friendventures/${id}/`);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleParticipants = async () => {
    try {
      const { data } = await axiosResponse.post("/participants/", {
        friendventure: id,
      });
      setFriendventure((prevFriendventures) => ({
        ...prevFriendventures,
        results: prevFriendventures.results.map((friendventure) => {
          return friendventure.id === id
            ? {
                ...friendventure,
                participants_count: friendventure.participants_count + 1,
                participants_id: data.id,
              }
            : friendventure;
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleNonparticipant = async () => {
    try {
      await axiosResponse.delete(`/participants/${participants_id}`);
      setFriendventure((prevFriendventures) => ({
        ...prevFriendventures,
        results: prevFriendventures.results.map((friendventure) => {
          return friendventure.id === id
            ? {
                ...friendventure,
                participants_count: friendventure.participants_count - 1,
                participants_id: 0,
              }
            : friendventure;
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmarks = async () => {
    try {
      const { data } = await axiosResponse.post("/bookmarks/", {
        friendventure: id,
      });
      setFriendventure((prevFriendventures) => ({
        ...prevFriendventures,
        results: prevFriendventures.results.map((friendventure) => {
          return friendventure.id === id
            ? {
                ...friendventure,
                bookmarks_count: friendventure.bookmarks_count + 1,
                bookmark_id: data.id,
              }
            : friendventure;
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnbookmark = async () => {
    try {
      await axiosResponse.delete(`/bookmarks/${bookmark_id}`);
      setFriendventure((prevFriendventures) => ({
        ...prevFriendventures,
        results: prevFriendventures.results.map((friendventure) => {
          return friendventure.id === id
            ? {
                ...friendventure,
                bookmarks_count: friendventure.bookmarks_count - 1,
                bookmark_id: 0,
              }
            : friendventure;
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className={styles.Friendventure}>
      <Card.Body>
        <Row className="d-flex flex-column flex-md-row align-items-center">
          <Col
            md={8}
            className="d-flex flex-column justify-content-center order-2 order-md-1"
          >
            {title && <Card.Title className={styles.Title}>{title}</Card.Title>}
          </Col>
          <Col
            md={4}
            className={`d-flex justify-content-end align-items-center order-1 order-md-2 ${styles.SmallText}`}
          >
            <p className="mt-3 text-center">by</p>
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_pic} height={30} />
              <span className="ml-2">{owner}</span>
            </Link>
            {is_owner && friendventurePage && (
              <EditDeleteDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Link to={`/friendventures/${id}`}>
              <Card.Img src={image} className={styles.Image} />
            </Link>
          </Col>
          <Col md={6}>
            {" "}
            <p className="mb-1">Description:</p>
            {description && <Card.Text>{description}</Card.Text>}
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <div className="d-flex align-items-center">
              <i className={`fa-regular fa-calendar ${styles.IconGreen}`} />{" "}
              {formatedDate}
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center">
              <i className={`fa-regular fa-clock ${styles.IconGreen}`} />{" "}
              {formatedTime}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="d-flex align-items-center">
              <i className={`fa-solid fa-map-marker-alt ${styles.IconGreen}`} />{" "}
              {place}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <span
                className={`d-flex justify-content-end ${styles.SmallText}`}
              >
                last updated: {updated_at}
              </span>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row className="d-flex align-items-center justify-content-between">
          <Col
            xs={4}
            className="d-flex justify-content-center align-items-center"
          >
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    As the owner of this FriendVenture, you are already a
                    participant.
                  </Tooltip>
                }
              >
                <i className={`fa-solid fa-user-check ${styles.Icon}`} />
              </OverlayTrigger>
            ) : participants_id ? (
              <span onClick={handleNonparticipant}>
                <i className={`fa-solid fa-user-check ${styles.Icon}`} />
              </span>
            ) : currentUser ? (
              <Link to={`/friendventures/${id}`}>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>Participate in this FriendVenture!</Tooltip>
                  }
                >
                  <span onClick={handleParticipants}>
                    <i className={`fa-solid fa-user-check ${styles.Icon}`} />
                  </span>
                </OverlayTrigger>
              </Link>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    Log in to participate in this FriendVenture!
                  </Tooltip>
                }
              >
                <span>
                  <i className={`fa-solid fa-user-check ${styles.Icon}`} />
                </span>
              </OverlayTrigger>
            )}
            {participants_count}
          </Col>

          <Col
            xs={4}
            className="d-flex justify-content-center align-items-center"
          >
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>You can't bookmark your own FriendVenture!</Tooltip>
                }
              >
                <i className={`fa-regular fa-heart ${styles.Icon}`} />
              </OverlayTrigger>
            ) : bookmark_id ? (
              <span onClick={handleUnbookmark}>
                <i className={`fa-regular fa-heart ${styles.Icon}`} />
              </span>
            ) : currentUser ? (
              <span onClick={handleBookmarks}>
                <i className={`fa-regular fa-heart ${styles.IconOutline}`} />
              </span>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to bookmark a FriendVenture!</Tooltip>}
              >
                <i className={`fa-regular fa-heart ${styles.Icon}`} />
              </OverlayTrigger>
            )}
            {bookmarks_count}
          </Col>

          <Col
            xs={4}
            className="d-flex justify-content-center align-items-center"
          >
            <Link to={`/friendventures/${id}`}>
              <i className={`far fa-comments ${styles.Icon}`} />
            </Link>
            {comments_count}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default Friendventure;
