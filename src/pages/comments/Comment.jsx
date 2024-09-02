import { Col, Row } from "react-bootstrap";
import styles from "../../styles/Comment.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { EditDeleteDropdown } from "../../components/EditDeleteDropdown";
import { axiosResponse } from "../../api/axiosDefault";
import { useState } from "react";
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
  const {
    profile_id,
    profile_pic,
    owner,
    updated_at,
    content,
    id,
    setFriendventure,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosResponse.delete(`/comments/${id}`);
      setFriendventure((prevFriendventure) => ({
        results: [
          {
            ...prevFriendventure.results[0],
            comments_count: prevFriendventure.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Row className="d-flex align-items-center">
        <Col xs="auto">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_pic} height={40}/>
          </Link>
        </Col>
        <Col xs className="flex-grow-1">
          <Link to={`/profiles/${profile_id}`} className={styles.Owner}>
            <span>{owner}</span>
          </Link>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_pic}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Col>
        <Col xs="auto">
          {is_owner && !showEditForm && (
            <EditDeleteDropdown
              handleEdit={() => setShowEditForm(true)}
              handleDelete={handleDelete}
              confirmationMessage={
                "Are you sure, you want to delete your comment?"
              }
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Comment;
