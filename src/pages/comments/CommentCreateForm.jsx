import { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosResponse } from "../../api/axiosDefault";

function CommentCreateForm(props) {
  const {
    friendventure,
    setFriendventure,
    setComments,
    profileImage,
    profile_id,
  } = props;
  const [content, setContent] = useState("");
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosResponse.post("/comments/", {
        content,
        friendventure,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setFriendventure((prevFriendventure) => ({
        results: [
          {
            ...prevFriendventure.results[0],
            comments_count: prevFriendventure.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="my comment..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group className={`d-flex justify-content-end mt-2 ${styles.CommentAreaWrapper}`}>
      <button
        className={`${styles.Button}`}
        disabled={!content.trim()}
        type="submit"
      >
        add comment
      </button>
      </Form.Group>
    </Form>
  );
}

export default CommentCreateForm;
