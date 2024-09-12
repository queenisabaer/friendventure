import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../api/axiosDefault";
import Friendventure from "./Friendventure";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import FriendVentureParticipants from "../participants/FriendventureParticipants";
import { useSetFriendventureId } from "../../contexts/ProfileDataContext";

function FriendventurePage() {
  const { id } = useParams();
  const setFriendventureId = useSetFriendventureId();
  const [friendventure, setFriendventure] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    setFriendventureId(id);
  }, [id, setFriendventureId]);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: friendventure }, { data: comments }] = await Promise.all(
          [
            axiosRequest.get(`/friendventures/${id}`),
            axiosRequest.get(`/comments/?friendventure=${id}`),
          ]
        );
        setFriendventure({ results: [friendventure] });
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Friendventure
          {...friendventure.results[0]}
          setFriendventure={setFriendventure}
          friendventurePage
        />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              friendventure={id}
              setFriendventure={setFriendventure}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setFriendventure={setFriendventure}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comment yet, be the first to do</span>
          ) : (
            <span>No comments yet.</span>
          )}
        </Container>
        <FriendVentureParticipants mobile />
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <FriendVentureParticipants />
      </Col>
    </Row>
  );
}

export default FriendventurePage;
