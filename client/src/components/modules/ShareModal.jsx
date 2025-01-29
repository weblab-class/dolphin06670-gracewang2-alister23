import React, { useState, useEffect, createContext } from "react";
import "./ShareModal.css";
import { get, post, del, put } from "../../utilities";

/**
 * Modal component that will be displayed in the middle
 * of the screen when the "Share" button is clicked.
 *
 * props: isOpen (Boolean), onClose (function), onShare (function), chartName (selected chart's name)
 * props: isOpen (Boolean), onClose (function), onShare (function), chartName (selected chart's name)
 */
const ShareModal = (props) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [error, setError] = useState("");

  if (!props.isOpen) {
  if (!props.isOpen) {
    return null;
  }

  const handleShareWithEmail = () => {
    // Validate the email
    get(`/api/user_exists/${email}`).then((response) => {
      if (response.exists) {
        props.onShare(email, permission);
        props.onClose();
      } else {
        setError("Oops! It seems like we don't have a user with this email address.");
      }
    });
  };

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <h2>Share {props.chartName} with:</h2>
        <input
          type="text"
          placeholder="Enter email here"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(""); // Error should be cleared when user types
          }}
        />
        {error && <p className="no-such-user-error-message">{error}</p>}

        {/* Permission dropdown */}
        <select value={permission} onChange={(event) => setPermission(event.target.value)}>
          <option value="view">View Only</option>
          <option value="edit">Can Edit</option>
        </select>

        {/* Share and Cancel buttons */}
        <button onClick={handleShareWithEmail}>Share with a Friend</button>
        <button onClick={props.onClose}>Cancel</button>
        <button onClick={props.onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ShareModal;

export default ShareModal;
