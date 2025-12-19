import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm} className="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
