import styles from "../styles/EditDeletDropdown.module.css";
import { useState, forwardRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ConfirmationModal from "./ConfirmationModal";

const DropdownIcon = forwardRef(({ onClick }, ref) => (
  <i
    className="fa-solid fa-ellipsis-v"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const EditDeleteDropdown = ({ handleEdit, handleDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleConfirmDelete = () => {
    handleDelete();
    setShowModal(false);
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={DropdownIcon} />
        <Dropdown.Menu className="text-center" popperConfig={{ strategy: "absolute" }}>
          <Dropdown.Item
            className={styles.DropdownItem}
            onClick={handleEdit}
            aria-label="edit"
          >
            {" "}
            <i className="fa-solid fa-edit" />
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            className={styles.DropdownItem}
            onClick={handleShowModal}
            aria-label="delete"
          >
            {" "}
            <i className="fa-solid fa-trash-alt" />
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ConfirmationModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this FriendVenture?"
      />
    </>
  );
};
