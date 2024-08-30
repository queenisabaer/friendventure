import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../api/axiosDefault";
import Friendventure from "./Friendventure";

function FriendventurePage() {
  const {id} = useParams();
  const [friendventure, setFriendventure] = useState({results: []});

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{data:friendventure}] = await Promise.all([
          axiosRequest.get(`/friendventures/${id}`)
        ])
        setFriendventure({results: [friendventure]})
        console.log(friendventure)
      } catch(err) {
        console.log(err)
      }
    }
    handleMount()
  }, [id])


  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Participants for mobile</p>
        <Friendventure {...friendventure.results[0]} setFriendventure={setFriendventure} friendventurePage/>
        <Container className={appStyles.Content}>
          Comments
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Participants
      </Col>
    </Row>
  );
}

export default FriendventurePage;