import { AlertTriangle, X } from "lucide-react";
import "./ConfirmationModal.css";

function ConfirmationModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger"
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <button
          type="button"
          className="confirmation-modal-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div
          className={`confirmation-modal-icon ${variant}`}
        >
          <AlertTriangle size={22} />
        </div>

        <div className="confirmation-modal-content">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="confirmation-modal-actions">
          <button
            type="button"
            className="confirmation-cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`confirmation-confirm-button ${variant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;