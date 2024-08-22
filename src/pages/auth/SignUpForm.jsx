import { Link } from "react-router-dom";

import styles from "../../styles/SignUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Image, Col, Row, Container } from "react-bootstrap";

const SignUpForm = () => {
  return (
    <>
      <Row>
        <Col>
          <h1 className={appStyles.Title}>Start your FriendVenture</h1>
        </Col>
      </Row>
      <Row className={styles.Row}>
        <Col className="my-auto py-2 p-md-2" md={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <h1 className={styles.Header}>Sign up</h1>
            <Form>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password2">
                <Form.Label className="d-none">Confirm password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Confirm password"
                  name="password2"
                />
              </Form.Group>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${appStyles.Upper}`}
                type="submit"
              >
                Sign me up
              </Button>
            </Form>
          </Container>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link className={styles.Link} to="/login">
              Already have an account? <span>Log in</span>
            </Link>
          </Container>
        </Col>
        <Col
          md={6}
          className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
        >
          <Image
            className={`${appStyles.FillerImage}`}
            src={
              "https://res.cloudinary.com/ds5rjhhxu/image/upload/v1724328353/people-821624_1280_ychdpf.webp"
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default SignUpForm;
