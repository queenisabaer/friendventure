// React imports
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// Bootstrap imports
import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
// Style imports
import styles from "../../styles/AuthForms.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

function LogInForm() {
  const setCurrentUser = useSetCurrentUser()

  const [logInData, setLogInData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = logInData;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", logInData);
      setCurrentUser(data.user);
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setLogInData({
      ...logInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Row>
        <Col>
          <h1 className={appStyles.Title}>Your next FriendVenture awaits</h1>
        </Col>
      </Row>
      <Row className={styles.Row}>
        <Col
          md={6}
          className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
        >
          <Image
            className={`${appStyles.FillerImage}`}
            src={
              "https://res.cloudinary.com/ds5rjhhxu/image/upload/v1724394274/key-2310246_1280_opqaun.webp"
            }
          />
        </Col>
        <Col className="my-auto p-0 p-md-2" md={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <h1 className={styles.Header}>Log In</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx} className={appStyles.Alert}>
                  {message}
                </Alert>
              ))}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
                <Alert variant="warning" key={idx} className={appStyles.Alert}>
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${appStyles.Upper}`}
                type="submit"
              >
                Log In
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert
                  variant="warning"
                  key={idx}
                  className={`${appStyles.Alert} mt-3`}
                >
                  {message}
                </Alert>
              ))}
            </Form>
          </Container>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link className={styles.Link} to="/signup">
              Don&apos;t have an account? <span>Sign up!</span>
            </Link>
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default LogInForm;
