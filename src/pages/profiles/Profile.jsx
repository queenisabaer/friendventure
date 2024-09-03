import styles from "../../styles/Profiles.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, profile_image, owner } = profile;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  console.log("profile image in profile component = ", profile_image)

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={profile_image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`ms-auto ${mobile && "mt-2"}`}>
        {!mobile &&
          currentUser &&
          !is_owner && (
            following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.RedButton}`}
                onClick={() => {}}
              >
                unfollow
              </Button>
            ) : (
              <Button className={`${btnStyles.Button}`} onClick={() => {}}>
                follow
              </Button>
            )
          )}
      </div>
    </div>
  );
};

export default Profile;
