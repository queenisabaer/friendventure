import { Col, Row } from "react-bootstrap";
import styles from "../../styles/Comment.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

const Comment = (props) => {
  const { profile_id, profile_pic, owner, updated_at, content } = props;
  return (
    <div>
      <Row>
        <Col xs="auto">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_pic} />
          </Link>
        </Col>
        <Col>
        <Link to={`/profiles/${profile_id}`} className={styles.Owner}>
          <span >{owner}</span>
          </Link>
          <span className={styles.Date}>{updated_at}</span>
          <p>{content}</p>
        </Col>
      </Row>
    </div>
  );
};

export default Comment;
