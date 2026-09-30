import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  Pencil,
  Save,
  User,
  X
} from "lucide-react";
import { useHelpdesk } from "../context/HelpdeskContext";
import ConfirmationModal from "../components/ConfirmationModal";
import "./TicketDetails.css";

const agents = [
  "Unassigned",
  "Arun Kumar",
  "Meena Raj",
  "Sanjay Kumar"
];

const priorities = [
  "Critical",
  "High",
  "Medium",
  "Low"
];

const categories = [
  "Technical",
  "Billing",
  "Account"
];

const allowedTransitions = {
  Open: ["Assigned", "Cancelled"],
  Assigned: ["In Progress"],
  "In Progress": ["Pending", "Resolved"],
  Pending: ["In Progress", "Resolved", "Cancelled"],
  Resolved: ["Closed"],
  Closed: [],
  Cancelled: []
};

const slaHoursMap = {
  Critical: 2,
  High: 4,
  Medium: 8,
  Low: 12
};

function TicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const {
    tickets,
    updateTicket,
    isLoading: contextLoading,
    error: contextError
  } = useHelpdesk();

  const [ticket, setTicket] = useState(null);
  const [formData, setFormData] = useState(null);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    action: null
  });

  useEffect(() => {
    setIsLoading(true);

    const foundTicket = tickets.find(
      (item) => item.id === ticketId
    );

    if (!foundTicket) {
      setTicket(null);
      setFormData(null);
      setError("Ticket not found.");
      setIsLoading(false);
      return;
    }

    const normalizedTicket = {
      ...foundTicket,
      comments: Array.isArray(foundTicket.comments)
        ? foundTicket.comments
        : [],
      attachments: Array.isArray(foundTicket.attachments)
        ? foundTicket.attachments
        : [],
      activity: Array.isArray(foundTicket.activity)
        ? foundTicket.activity
        : []
    };

    setTicket(normalizedTicket);

    setFormData({
      subject: normalizedTicket.subject || "",
      description: normalizedTicket.description || "",
      requester: normalizedTicket.requester || "",
      requesterEmail: normalizedTicket.requesterEmail || "",
      category: normalizedTicket.category || "Technical",
      priority: normalizedTicket.priority || "Medium",
      assignedTo: normalizedTicket.assignedTo || "Unassigned",
      status: normalizedTicket.status || "Open"
    });

    setError("");
    setIsLoading(false);
  }, [tickets, ticketId]);

  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const formatFileSize = (size) => {
    if (!size) {
      return "";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getSlaHours = (priority) => {
    return slaHoursMap[priority] || 12;
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase().replace(/\s+/g, "-");
  };

  const saveTicket = (updatedTicket) => {
    updateTicket(updatedTicket);
    setTicket(updatedTicket);
  };

  const addActivity = (
    currentTicket,
    type,
    message
  ) => {
    return {
      ...currentTicket,
      activity: [
        ...(currentTicket.activity || []),
        {
          type,
          message,
          date: new Date().toISOString()
        }
      ]
    };
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  };

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));

    setError("");
  };

  const handleSaveEdit = () => {
    if (!formData.subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (formData.subject.trim().length < 5) {
      setError("Subject must be at least 5 characters.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    if (!formData.requester.trim()) {
      setError("Requester name is required.");
      return;
    }

    if (!formData.requesterEmail.trim()) {
      setError("Requester email is required.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.requesterEmail.trim())) {
      setError("Enter a valid requester email.");
      return;
    }

    let updatedTicket = {
      ...ticket,
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      requester: formData.requester.trim(),
      requesterEmail: formData.requesterEmail.trim(),
      category: formData.category,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      status: formData.status,
      slaHours: getSlaHours(formData.priority)
    };

    updatedTicket = addActivity(
      updatedTicket,
      "updated",
      "Ticket details updated"
    );

    saveTicket(updatedTicket);

    setIsEditing(false);
    setError("");

    showSuccess("Ticket updated successfully.");
  };

  const handleStatusChange = (newStatus) => {
    if (!ticket || newStatus === ticket.status) {
      return;
    }

    const allowedStatuses =
      allowedTransitions[ticket.status] || [];

    if (!allowedStatuses.includes(newStatus)) {
      setError(
        `Cannot change status from ${ticket.status} to ${newStatus}.`
      );
      return;
    }

    let updatedTicket = {
      ...ticket,
      status: newStatus
    };

    updatedTicket = addActivity(
      updatedTicket,
      "status",
      `Status changed from ${ticket.status} to ${newStatus}`
    );

    saveTicket(updatedTicket);

    setFormData((current) => ({
      ...current,
      status: newStatus
    }));

    setError("");

    showSuccess(
      `Ticket status changed to ${newStatus}.`
    );
  };

  const handlePriorityChange = (newPriority) => {
    if (!ticket || newPriority === ticket.priority) {
      return;
    }

    let updatedTicket = {
      ...ticket,
      priority: newPriority,
      slaHours: getSlaHours(newPriority)
    };

    updatedTicket = addActivity(
      updatedTicket,
      "priority",
      `Priority changed from ${ticket.priority} to ${newPriority}`
    );

    saveTicket(updatedTicket);

    setFormData((current) => ({
      ...current,
      priority: newPriority
    }));

    setError("");

    showSuccess(
      `Priority changed to ${newPriority}.`
    );
  };

  const handleAssigneeChange = (newAssignee) => {
    if (!ticket || newAssignee === ticket.assignedTo) {
      return;
    }

    let updatedTicket = {
      ...ticket,
      assignedTo: newAssignee
    };

    updatedTicket = addActivity(
      updatedTicket,
      "assignment",
      `Ticket assigned to ${newAssignee}`
    );

    saveTicket(updatedTicket);

    setFormData((current) => ({
      ...current,
      assignedTo: newAssignee
    }));

    setError("");

    showSuccess(
      `Ticket assigned to ${newAssignee}.`
    );
  };

  const handleAddComment = () => {
    if (!comment.trim()) {
      return;
    }

    const now = new Date().toISOString();

    let updatedTicket = {
      ...ticket,
      comments: [
        ...(ticket.comments || []),
        {
          id: `${Date.now()}`,
          author: "Support Agent",
          message: comment.trim(),
          date: now
        }
      ]
    };

    updatedTicket = addActivity(
      updatedTicket,
      "comment",
      "New comment added"
    );

    saveTicket(updatedTicket);

    setComment("");
    setError("");

    showSuccess("Comment added successfully.");
  };

  const handleAttachmentChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const attachmentData = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type
    };

    let updatedTicket = {
      ...ticket,
      attachments: [
        ...(ticket.attachments || []),
        attachmentData
      ]
    };

    updatedTicket = addActivity(
      updatedTicket,
      "attachment",
      `Attachment added: ${selectedFile.name}`
    );

    saveTicket(updatedTicket);

    event.target.value = "";

    setError("");

    showSuccess("Attachment added successfully.");
  };

  const handleResolve = () => {
    handleStatusChange("Resolved");
  };

  const handleCloseTicket = () => {
    handleStatusChange("Closed");
  };

  const handleCancelTicket = () => {
    if (
      ticket.status !== "Open" &&
      ticket.status !== "Pending"
    ) {
      setError(
        "Only Open or Pending tickets can be cancelled."
      );
      return;
    }

    handleStatusChange("Cancelled");
  };

  const openConfirmation = (action) => {
    setConfirmation({
      isOpen: true,
      action
    });
  };

  const closeConfirmation = () => {
    setConfirmation({
      isOpen: false,
      action: null
    });
  };

  const confirmTicketAction = () => {
    if (confirmation.action === "cancel") {
      handleCancelTicket();
    }

    if (confirmation.action === "close") {
      handleCloseTicket();
    }

    closeConfirmation();
  };

  const getCurrentStatusOptions = () => {
    if (!ticket) {
      return [];
    }

    return [
      ticket.status,
      ...(allowedTransitions[ticket.status] || [])
    ];
  };

  const resetEditForm = () => {
    setFormData({
      subject: ticket.subject || "",
      description: ticket.description || "",
      requester: ticket.requester || "",
      requesterEmail: ticket.requesterEmail || "",
      category: ticket.category || "Technical",
      priority: ticket.priority || "Medium",
      assignedTo: ticket.assignedTo || "Unassigned",
      status: ticket.status || "Open"
    });

    setIsEditing(false);
    setError("");
  };

  if (isLoading || contextLoading) {
    return (
      <div className="ticket-details-state">
        <div className="ticket-details-loader">
          Loading ticket...
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="ticket-details-state">
        <div className="ticket-details-error">
          <h2>Ticket Not Found</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/tickets")}
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  if (!ticket || !formData) {
    return null;
  }

  const canResolve = (
    allowedTransitions[ticket.status] || []
  ).includes("Resolved");

  const canClose = (
    allowedTransitions[ticket.status] || []
  ).includes("Closed");

  const canCancel = (
    allowedTransitions[ticket.status] || []
  ).includes("Cancelled");

  return (
    <div className="ticket-details-page">
      {successMessage && (
        <div className="ticket-details-toast">
          <Check size={17} />
          {successMessage}
        </div>
      )}

      <div className="ticket-details-topbar">
        <button
          type="button"
          className="back-to-tickets"
          onClick={() => navigate("/tickets")}
        >
          <ArrowLeft size={18} />
          Back to Tickets
        </button>

        <div className="ticket-details-actions">
          {!isEditing ? (
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setIsEditing(true);
                setError("");
              }}
            >
              <Pencil size={16} />
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                className="secondary-action"
                onClick={resetEditForm}
              >
                <X size={16} />
                Cancel Edit
              </button>

              <button
                type="button"
                className="primary-action"
                onClick={handleSaveEdit}
              >
                <Save size={16} />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="ticket-details-form-error">
          {error}
        </div>
      )}

      <div className="ticket-details-header">
        <div>
          <div className="ticket-details-id">
            {ticket.id}
          </div>

          {isEditing ? (
            <input
              className="ticket-edit-title"
              value={formData.subject}
              onChange={(event) =>
                handleFieldChange(
                  "subject",
                  event.target.value
                )
              }
            />
          ) : (
            <h1>{ticket.subject}</h1>
          )}

          <div className="ticket-header-meta">
            <span>
              <Calendar size={15} />
              Created {formatDate(ticket.createdAt)}
            </span>

            <span>
              <User size={15} />
              {ticket.requester}
            </span>
          </div>
        </div>

        <div className="ticket-header-badges">
          <span
            className={`ticket-status-badge ${getStatusClass(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>

          <span
            className={`ticket-priority-badge ${getPriorityClass(
              ticket.priority
            )}`}
          >
            {ticket.priority}
          </span>
        </div>
      </div>

      <div className="ticket-details-grid">
        <main className="ticket-details-main">
          <section className="ticket-details-card">
            <div className="card-heading">
              <FileText size={18} />
              <h2>Ticket Information</h2>
            </div>

            {isEditing ? (
              <div className="ticket-edit-form">
                <div className="ticket-form-group full-width">
                  <label>Description</label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      handleFieldChange(
                        "description",
                        event.target.value
                      )
                    }
                    rows="6"
                  />
                </div>

                <div className="ticket-form-row">
                  <div className="ticket-form-group">
                    <label>Requester</label>

                    <input
                      value={formData.requester}
                      onChange={(event) =>
                        handleFieldChange(
                          "requester",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="ticket-form-group">
                    <label>Email</label>

                    <input
                      type="email"
                      value={formData.requesterEmail}
                      onChange={(event) =>
                        handleFieldChange(
                          "requesterEmail",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="ticket-form-row">
                  <div className="ticket-form-group">
                    <label>Category</label>

                    <select
                      value={formData.category}
                      onChange={(event) =>
                        handleFieldChange(
                          "category",
                          event.target.value
                        )
                      }
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-form-group">
                    <label>Priority</label>

                    <select
                      value={formData.priority}
                      onChange={(event) =>
                        handleFieldChange(
                          "priority",
                          event.target.value
                        )
                      }
                    >
                      {priorities.map((priority) => (
                        <option
                          key={priority}
                          value={priority}
                        >
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="ticket-description">
                {ticket.description}
              </div>
            )}
          </section>

          <section className="ticket-details-card">
            <div className="card-heading">
              <MessageSquare size={18} />
              <h2>Comments</h2>
            </div>

            <div className="comment-list">
              {ticket.comments.length === 0 ? (
                <div className="no-comments">
                  No comments yet.
                </div>
              ) : (
                ticket.comments.map((item) => (
                  <div
                    className="comment-item"
                    key={item.id}
                  >
                    <div className="comment-avatar">
                      {item.author
                        ?.charAt(0)
                        ?.toUpperCase() || "S"}
                    </div>

                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>
                          {item.author}
                        </strong>

                        <span>
                          {formatDate(item.date)}
                        </span>
                      </div>

                      <p>{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="comment-box">
              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="Write a comment..."
                rows="4"
              />

              <button
                type="button"
                className="primary-action"
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                Add Comment
              </button>
            </div>
          </section>

          <section className="ticket-details-card">
            <div className="card-heading">
              <Clock size={18} />
              <h2>Activity Timeline</h2>
            </div>

            <div className="activity-timeline">
              {ticket.activity.length === 0 ? (
                <div className="no-comments">
                  No activity recorded yet.
                </div>
              ) : (
                [...ticket.activity]
                  .reverse()
                  .map((item, index) => (
                    <div
                      className="activity-item"
                      key={`${item.date}-${index}`}
                    >
                      <div className="activity-dot" />

                      <div className="activity-content">
                        <strong>
                          {item.message}
                        </strong>

                        <span>
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </main>

        <aside className="ticket-details-sidebar">
          <section className="ticket-details-card">
            <div className="card-heading">
              <User size={18} />
              <h2>Ticket Assignment</h2>
            </div>

            <div className="detail-field">
              <span>Requester</span>
              <strong>{ticket.requester}</strong>
            </div>

            <div className="detail-field">
              <span>Email</span>
              <strong>{ticket.requesterEmail}</strong>
            </div>

            <div className="detail-field">
              <span>Assigned To</span>

              <select
                value={ticket.assignedTo}
                onChange={(event) =>
                  handleAssigneeChange(
                    event.target.value
                  )
                }
              >
                {agents.map((agent) => (
                  <option
                    key={agent}
                    value={agent}
                  >
                    {agent}
                  </option>
                ))}
              </select>
            </div>

            <div className="detail-field">
              <span>Category</span>
              <strong>{ticket.category}</strong>
            </div>
          </section>

          <section className="ticket-details-card">
            <div className="card-heading">
              <Clock size={18} />
              <h2>Ticket Controls</h2>
            </div>

            <div className="control-field">
              <label>Status</label>

              <select
                value={ticket.status}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value
                  )
                }
              >
                {getCurrentStatusOptions().map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="control-field">
              <label>Priority</label>

              <select
                value={ticket.priority}
                onChange={(event) =>
                  handlePriorityChange(
                    event.target.value
                  )
                }
              >
                {priorities.map((priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div className="sla-box">
              <div className="sla-box-icon">
                <Clock size={18} />
              </div>

              <div>
                <span>SLA Target</span>
                <strong>
                  {ticket.slaHours} hours
                </strong>
              </div>
            </div>
          </section>

          <section className="ticket-details-card">
            <div className="card-heading">
              <Paperclip size={18} />
              <h2>Attachments</h2>
            </div>

            <div className="attachment-upload">
              <label htmlFor="details-attachment">
                <Paperclip size={17} />
                Add Attachment
              </label>

              <input
                id="details-attachment"
                type="file"
                onChange={handleAttachmentChange}
              />
            </div>

            <div className="attachment-list">
              {ticket.attachments.length === 0 ? (
                <div className="no-comments">
                  No attachments.
                </div>
              ) : (
                ticket.attachments.map(
                  (item, index) => (
                    <div
                      className="attachment-item"
                      key={`${item.name}-${index}`}
                    >
                      <Paperclip size={16} />

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {formatFileSize(item.size)}
                        </span>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          <section className="ticket-details-card ticket-actions-card">
            <div className="card-heading">
              <Check size={18} />
              <h2>Lifecycle Actions</h2>
            </div>

            <button
              type="button"
              className="resolve-button"
              onClick={handleResolve}
              disabled={!canResolve}
            >
              <Check size={16} />
              Resolve Ticket
            </button>

            <button
              type="button"
              className="close-ticket-button"
              onClick={() =>
                openConfirmation("close")
              }
              disabled={!canClose}
            >
              Close Ticket
            </button>

            <button
              type="button"
              className="cancel-ticket-button"
              onClick={() =>
                openConfirmation("cancel")
              }
              disabled={!canCancel}
            >
              Cancel Ticket
            </button>
          </section>
        </aside>
      </div>

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={
          confirmation.action === "cancel"
            ? "Cancel Ticket?"
            : "Close Ticket?"
        }
        message={
          confirmation.action === "cancel"
            ? "Are you sure you want to cancel this ticket? This will update the ticket lifecycle."
            : "Are you sure you want to close this ticket? Make sure the issue has been resolved."
        }
        confirmText={
          confirmation.action === "cancel"
            ? "Yes, Cancel Ticket"
            : "Yes, Close Ticket"
        }
        cancelText="Keep Ticket"
        variant="danger"
        onConfirm={confirmTicketAction}
        onCancel={closeConfirmation}
      />
    </div>
  );
}

export default TicketDetails;