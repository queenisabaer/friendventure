import { useRef, useState } from "react";

import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Image,
  Alert,
} from "react-bootstrap";

import Upload from "../../assets/Friendventure_upload.webp";

import styles from "../../styles/FriendventureCreatEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../../api/axiosDefault";
import { useRedirect } from "../../hooks/useRedirect";

function FriendventureCreateForm(props) {
  useRedirect("loggedOut");
  const [friendventureData, setFriendventureData] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    time: "",
    place: "",
    category: "",
  });

  const { title, description, image, date, time, place, category } =
    friendventureData;

  const [errors, setErrors] = useState({});

  const imageInput = useRef(null);
  const navigate = useNavigate();

  const { showMessage } = props;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedDate = new Date(date);
    const today = new Date();

    // Date validation
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      setErrors({ date: ["The date must be in the future."] });
      return;
    }

    // Image size validation
    if (imageInput.current.files.length > 0) {
      const imageFile = imageInput.current.files[0];

      if (imageFile.size > 1024 * 1024 * 2) {
        setErrors({ image: ["Image can't be larger than 2MB"] });
        return;
      }
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("place", place);
    formData.append("category", category);
    // Only append the image file if one has been selected
    if (imageInput.current.files.length > 0) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      const response = await axiosRequest.post("/friendventures/", formData);
      const { data } = response;

      navigate(`/friendventures/${data.id}`);
      showMessage(
        "success",
        "Your FriendVenture has been created successfully!"
      );
    } catch (err) {
      console.error("Error submitting form:", err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data || {});
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group className="mb-2" htmlFor="title">
        <Form.Label className="mb-1">
          Title<sup>*</sup>
        </Form.Label>
        <Form.Control
          id="title"
          className={styles.Input}
          type="text"
          name="title"
          placeholder="Give your FriendVenture a title"
          value={title}
          onChange={handleChange}
          required
        />
        {errors.title?.map((message, idx) => (
          <Alert variant="warning" key={idx} className={appStyles.Alert}>
            {message}
          </Alert>
        ))}
      </Form.Group>
      <Form.Group className="mb-2" htmlFor="description">
        <Form.Label className="mb-1">Description</Form.Label>
        <Form.Control
          id="description"
          className={styles.Input}
          as="textarea"
          placeholder="Descripe your FriendVenture"
          name="description"
          rows={4}
          value={description}
          onChange={handleChange}
        />
        {errors.description?.map((message, idx) => (
          <Alert variant="warning" key={idx} className={appStyles.Alert}>
            {message}
          </Alert>
        ))}
      </Form.Group>
      <Form.Group className="mb-2">
        <Row>
          <Col lg={6}>
            <Form.Label className="mb-1" htmlFor="date">
              Date<sup>*</sup>
            </Form.Label>
            <Form.Control
              id="date"
              type="date"
              name="date"
              value={date}
              onChange={handleChange}
              required
            />
            {errors.date?.map((message, idx) => (
              <Alert variant="warning" key={idx} className={appStyles.Alert}>
                {message}
              </Alert>
            ))}
          </Col>

          <Col lg={6}>
            <Form.Label className="mb-1" htmlFor="time">
              Time<sup>*</sup>
            </Form.Label>
            <Form.Control
              id="time"
              type="time"
              name="time"
              value={time}
              onChange={handleChange}
              required
            />
            {errors?.time?.map((message, idx) => (
              <Alert variant="warning" key={idx} className={appStyles.Alert}>
                {message}
              </Alert>
            ))}
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label className="mb-1" htmlFor="location">
          Location<sup>*</sup>
        </Form.Label>
        <Form.Control
          id="location"
          type="text"
          name="place"
          placeholder="Enter the place to be"
          value={place}
          onChange={handleChange}
          required
        />
        {errors.place?.map((message, idx) => (
          <Alert variant="warning" key={idx} className={appStyles.Alert}>
            {message}
          </Alert>
        ))}
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label className="mb-1" htmlFor="category">
          Category<sup>*</sup>
        </Form.Label>
        <Form.Control
          id="category"
          as="select"
          name="category"
          value={category}
          onChange={handleChange}
          required
          className={styles.Input}
        >
          <option value="" disabled>
            Select category for indoor or outdoor event
          </option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </Form.Control>
        {errors.category?.map((message, idx) => (
          <Alert variant="warning" key={idx} className={appStyles.Alert}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Button
        className={`${btnStyles.Button} ${btnStyles.Red}`}
        onClick={() => navigate(-1)}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button}`} type="submit">
        create
      </Button>
      <div className={`${styles.SmallText} mt-2`}>
        <sup>*</sup>required
      </div>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
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
                ref={imageInput}
              />
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx} className={appStyles.Alert}>
                  {message}
                </Alert>
              ))}
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
