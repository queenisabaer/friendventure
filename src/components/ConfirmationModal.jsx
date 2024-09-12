import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import buttonStyles from "../styles/Button.module.css";
import styles from "../App.module.css";

function ConfirmationModal({
  show,
  handleClose,
  handleConfirm,
  title,
  message,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className={styles.Title}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button className={buttonStyles.Button} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className={`${buttonStyles.Button} ${buttonStyles.Red}`}
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
