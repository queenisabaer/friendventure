import { useState } from "react";

import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Image
} from "react-bootstrap";

import Upload from "../../assets/Friendventure_upload.webp";

import styles from "../../styles/FriendventureCreatEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";

function FriendventureCreateForm() {
  const [friendventureData, setFriendventureData] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });

  const { title, description, image, date, time, location, category } =
    friendventureData;

  const handleChange = (event) => {
    setFriendventureData({
      ...friendventureData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setFriendventureData({
        ...friendventureData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const [errors, setErrors] = useState({});

  const textFields = (
    <div className="text-center">
      <Form.Group className="mb-2">
        <Form.Label className="mb-1">Title</Form.Label>
        <Form.Control
          className={styles.Input}
          type="text"
          name="title"
          placeholder="Give your FriendVenture a title"
          value={title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label className="mb-1">Description</Form.Label>
        <Form.Control
          className={styles.Input}
          as="textarea"
          placeholder="Descripe your FriendVenture"
          name="description" 
          rows={4}
          value={description}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Row>
          <Col lg={6}>
            <Form.Label className="mb-1">Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={date}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6}>
            <Form.Label className="mb-1">Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={time}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label className="mb-1">Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          placeholder="Enter the place to be"
          value={location}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label className="mb-1">Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={category}
          onChange={handleChange}
        >
          <option>Indoor</option>
          <option>Outdoor</option>
        </Form.Control>
      </Form.Group>

      <Button className={`${btnStyles.Button} ${btnStyles.Red}`} onClick={() => {}}>
        cancel
      </Button>
      <Button className={`${btnStyles.Button}`} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form>
      <Row>
        <Col>
          <h1 className={appStyles.Title}>Create a new FriendVenture</h1>
        </Col>
      </Row>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={6}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset src={Upload} message="Click or tap to upload" />
                </Form.Label>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                id="image-upload"
                className={styles.ImageUpload}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default FriendventureCreateForm;
