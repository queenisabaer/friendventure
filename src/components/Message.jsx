import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import styles from "../App.module.css";

const Message = (props) => {
  const { type, text } = props;
  const [show, setShow] = useState(true);

  return (
    <div className="position-fixed top-0 mt-5 z-3 col-10 offset-1 col-sm-6 offset-sm-3 col-xl-4 offset-xl-4">
      <Alert
        className={`${styles.AlertGreen} mt-5 mx-2 px-5 py-3 pb-0 text-center`}
        variant={type}
        show={show}
        onClose={() => setShow(false)}
        dismissible
      >
        <p>{text}</p>
      </Alert>
    </div>
  );
};

export default Message;
