import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosRequest } from "../../api/axiosDefault";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

const ProfileEditForm = (props) => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const imageFile = useRef();
  const {showMessage} = props;

  const [profileData, setProfileData] = useState({
    name: "",
    description: "",
    profile_image: "",
    phone_number: "",
    email: "",
  });

  const { name, description, profile_image, phone_number, email } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosRequest.get(`/profiles/${id}/`);
          const { name, description, profile_image, phone_number, email } =
            data;
          setProfileData({
            name,
            description,
            profile_image,
            phone_number,
            email,
          });
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    handleMount();
  }, [currentUser, navigate, id]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      const file = event.target.files[0];
      if (file.size > 1024 * 1024 * 2) {
        setErrors({ image: ["Image can't be larger than 2MB"] });
        return;
      }
      URL.revokeObjectURL(profile_image);
      setProfileData({
        ...profileData,
        profile_image: URL.createObjectURL(file),
      });
      setErrors((prevErrors) => ({ ...prevErrors, image: [] }));
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("phone_number", phone_number || "");
    formData.append("email", email);

    // image validation with 2 MB limit
    if (imageFile?.current?.files[0]) {
      const image = imageFile.current.files[0];
      if (image.size > 1024 * 1024 * 2) { 
        setErrors({ image: ["Image can't be larger than 2MB"] });
        return;
      }
      formData.append("profile_image", image);
    }

    try {
      const { data } = await axiosRequest.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.profile_image,
      }));
      showMessage("success", "Your profile has been updated!")
      navigate(-1);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group className="mb-3">
        <Form.Label>About me:</Form.Label>
        <Form.Control
          as="textarea"
          value={description}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          name="description"
          rows={7}
        />
      </Form.Group>
      {errors.description?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={appStyles.Alert}>
          {message}
        </Alert>
      ))}

      <Form.Group className="mb-3">
        <Form.Label>Phone Number:</Form.Label>
        <Form.Control
          type="tel"
          value={phone_number || ""}
          onChange={handleChange}
          placeholder="Add your telephone number"
          name="phone_number"
        />
      </Form.Group>
      {errors.phone_number?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={appStyles.Alert}>
          {message}
        </Alert>
      ))}
      <Form.Group className="mb-3">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Add your email adress"
          name="email"
        />
      </Form.Group>
      {errors.email?.map((message, idx) => (
        <Alert variant="warning" key={idx} className={appStyles.Alert}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Red}`}
        onClick={() => navigate(-1)}
      >
        Cancel
      </Button>
      <Button className={`${btnStyles.Button}`} type="submit">
        Save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {profile_image && (
                <figure>
                  <Image src={profile_image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx} className={appStyles.Alert}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.Control
                id="image-upload"
                type="file"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      profile_image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
                style={{ display: "none" }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
