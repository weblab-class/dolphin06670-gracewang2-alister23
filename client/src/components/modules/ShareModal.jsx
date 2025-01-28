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

  if (!isOpen) {
    return null;
  }

  const handleShareWithEmail = () => {
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
          onChange={(event) => setEmail(event.target.value)}
        />
        <button onClick={handleShareWithEmail}>Share with a Friend</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
