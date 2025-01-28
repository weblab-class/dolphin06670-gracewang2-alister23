import React, { useState, useEffect, createContext } from "react";
import "./ShareModal.css";
import { get, post } from "../../utilities";

/**
 * Modal component that will be displayed in the middle
 * of the screen when the "Share" button is clicked.
 *
 * props: isOpen (Boolean), onClose (function), onShare (function)
 */
const ShareModal = (props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  // Do error-handling later.
  const handleShareWithEmail = () => {
    // Validate the email
    get(`/api/user_exists/${email}`).then((response) => {
      if (response.exists) {
        onShare(email);
        onClose();
      } else {
        setError("Oops! It seems like we don't have a user with this email address.");
      }
    });
    onShare(email);
    onClose();
  };

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <h2>Share with:</h2>
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
        <button onClick={handleShareWithEmail}>Share with a Friend</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
