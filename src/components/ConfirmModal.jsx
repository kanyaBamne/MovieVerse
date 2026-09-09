function ConfirmModal({
    title = "Delete?",
    itemName,
    message = "This action cannot be undone.",
    onCancel,
    onConfirm,
}) {
    return (
        <div className="modal-overlay">

            <div className="confirm-modal">

                <div className="modal-icon">
                    🗑️
                </div>

                <h2>{title}</h2>

                <p>
                    Are you sure you want to delete
                    <strong> "{itemName}"</strong>?
                </p>

                <span className="modal-warning">
                    {message}
                </span>

                <div className="modal-actions">

                    <button
                        className="modal-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="modal-delete"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmModal;