import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip, X } from "lucide-react";
import { useHelpdesk } from "../context/HelpdeskContext";
import "./TicketDrawer.css";

const agents = [
  "Unassigned",
  "Arun Kumar",
  "Meena Raj",
  "Sanjay Kumar"
];

const categories = [
  "Technical",
  "Billing",
  "Account"
];

const priorities = [
  "Critical",
  "High",
  "Medium",
  "Low"
];

function TicketDrawer({
  isOpen,
  onClose,
  onTicketCreated
}) {
  const navigate = useNavigate();

  const {
    tickets,
    addTicket
  } = useHelpdesk();

  const [subject, setSubject] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [requester, setRequester] =
    useState("");

  const [requesterEmail, setRequesterEmail] =
    useState("");

  const [category, setCategory] =
    useState("Technical");

  const [priority, setPriority] =
    useState("Medium");

  const [assignedTo, setAssignedTo] =
    useState("Unassigned");

  const [attachment, setAttachment] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  const [isSaving, setIsSaving] =
    useState(false);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!subject.trim()) {
      newErrors.subject =
        "Subject is required.";
    } else if (
      subject.trim().length < 5
    ) {
      newErrors.subject =
        "Subject must be at least 5 characters.";
    }

    if (!description.trim()) {
      newErrors.description =
        "Description is required.";
    } else if (
      description.trim().length < 10
    ) {
      newErrors.description =
        "Description must be at least 10 characters.";
    }

    if (!requester.trim()) {
      newErrors.requester =
        "Requester name is required.";
    }

    if (!requesterEmail.trim()) {
      newErrors.requesterEmail =
        "Requester email is required.";
    } else {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          requesterEmail.trim()
        )
      ) {
        newErrors.requesterEmail =
          "Enter a valid email address.";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const generateTicketId = () => {
    if (tickets.length === 0) {
      return "TCK-1001";
    }

    const numbers = tickets
      .map((ticket) => {
        const number = Number(
          ticket.id.replace("TCK-", "")
        );

        return Number.isNaN(number)
          ? 0
          : number;
      })
      .filter(
        (number) => number > 0
      );

    const highestNumber =
      numbers.length > 0
        ? Math.max(...numbers)
        : 1000;

    return `TCK-${
      highestNumber + 1
    }`;
  };

  const getSlaHours = (
    selectedPriority
  ) => {
    const slaHoursMap = {
      Critical: 2,
      High: 4,
      Medium: 8,
      Low: 12
    };

    return (
      slaHoursMap[
        selectedPriority
      ] || 12
    );
  };

  const resetForm = () => {
    setSubject("");
    setDescription("");
    setRequester("");
    setRequesterEmail("");
    setCategory("Technical");
    setPriority("Medium");
    setAssignedTo("Unassigned");
    setAttachment(null);
    setErrors({});
  };

  const handleAttachmentChange = (
    event
  ) => {
    const selectedFile =
      event.target.files[0] || null;

    setAttachment(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    const now =
      new Date().toISOString();

    const newTicket = {
      id: generateTicketId(),
      subject: subject.trim(),
      description:
        description.trim(),
      requester:
        requester.trim(),
      requesterEmail:
        requesterEmail.trim(),
      category,
      priority,
      status: "Open",
      assignedTo,
      createdAt: now,
      slaHours:
        getSlaHours(priority),
      comments: [],
      attachments: attachment
        ? [
            {
              name:
                attachment.name,
              size:
                attachment.size,
              type:
                attachment.type
            }
          ]
        : [],
      activity: [
        {
          type: "created",
          message:
            "Ticket created",
          date: now
        }
      ]
    };

    setTimeout(() => {
      addTicket(newTicket);

      setIsSaving(false);

      if (onTicketCreated) {
        onTicketCreated(
          newTicket
        );
      }

      resetForm();

      onClose();

      navigate("/tickets");
    }, 700);
  };

  const handleFieldChange = (
    field,
    value
  ) => {
    setErrors((current) => ({
      ...current,
      [field]: ""
    }));

    if (field === "subject") {
      setSubject(value);
    }

    if (field === "description") {
      setDescription(value);
    }

    if (field === "requester") {
      setRequester(value);
    }

    if (
      field === "requesterEmail"
    ) {
      setRequesterEmail(value);
    }
  };

  return (
    <div className="ticket-drawer-overlay">
      <div className="ticket-drawer">
        <div className="ticket-drawer-header">
          <div>
            <span className="ticket-drawer-eyebrow">
              SUPPORT OPERATIONS
            </span>

            <h2>Create Ticket</h2>

            <p>
              Create a new customer
              support request.
            </p>
          </div>

          <button
            type="button"
            className="ticket-drawer-close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="ticket-drawer-form"
          onSubmit={handleSubmit}
        >
          <div className="ticket-drawer-section">
            <h3>
              Ticket Information
            </h3>

            <div className="ticket-drawer-field">
              <label htmlFor="ticket-subject">
                Subject
              </label>

              <input
                id="ticket-subject"
                type="text"
                value={subject}
                onChange={(event) =>
                  handleFieldChange(
                    "subject",
                    event.target.value
                  )
                }
                placeholder="Enter ticket subject"
              />

              {errors.subject && (
                <span className="ticket-field-error">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="ticket-drawer-field">
              <label htmlFor="ticket-description">
                Description
              </label>

              <textarea
                id="ticket-description"
                value={
                  description
                }
                onChange={(event) =>
                  handleFieldChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the issue..."
                rows="5"
              />

              {errors.description && (
                <span className="ticket-field-error">
                  {
                    errors.description
                  }
                </span>
              )}
            </div>
          </div>

          <div className="ticket-drawer-section">
            <h3>
              Requester Information
            </h3>

            <div className="ticket-drawer-row">
              <div className="ticket-drawer-field">
                <label htmlFor="ticket-requester">
                  Requester
                </label>

                <input
                  id="ticket-requester"
                  type="text"
                  value={
                    requester
                  }
                  onChange={(
                    event
                  ) =>
                    handleFieldChange(
                      "requester",
                      event.target
                        .value
                    )
                  }
                  placeholder="Customer name"
                />

                {errors.requester && (
                  <span className="ticket-field-error">
                    {
                      errors.requester
                    }
                  </span>
                )}
              </div>

              <div className="ticket-drawer-field">
                <label htmlFor="ticket-email">
                  Email
                </label>

                <input
                  id="ticket-email"
                  type="email"
                  value={
                    requesterEmail
                  }
                  onChange={(
                    event
                  ) =>
                    handleFieldChange(
                      "requesterEmail",
                      event.target
                        .value
                    )
                  }
                  placeholder="customer@example.com"
                />

                {errors.requesterEmail && (
                  <span className="ticket-field-error">
                    {
                      errors.requesterEmail
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="ticket-drawer-section">
            <h3>
              Ticket Classification
            </h3>

            <div className="ticket-drawer-row">
              <div className="ticket-drawer-field">
                <label htmlFor="ticket-category">
                  Category
                </label>

                <select
                  id="ticket-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target
                        .value
                    )
                  }
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="ticket-drawer-field">
                <label htmlFor="ticket-priority">
                  Priority
                </label>

                <select
                  id="ticket-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target
                        .value
                    )
                  }
                >
                  {priorities.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="ticket-drawer-field">
              <label htmlFor="ticket-assignee">
                Assigned To
              </label>

              <select
                id="ticket-assignee"
                value={
                  assignedTo
                }
                onChange={(event) =>
                  setAssignedTo(
                    event.target
                      .value
                  )
                }
              >
                {agents.map(
                  (agent) => (
                    <option
                      key={agent}
                      value={agent}
                    >
                      {agent}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="ticket-drawer-section">
            <h3>
              Attachment
            </h3>

            <label
              htmlFor="ticket-attachment"
              className="ticket-attachment-upload"
            >
              <Paperclip
                size={18}
              />

              <span>
                {attachment
                  ? attachment.name
                  : "Choose a file"}
              </span>
            </label>

            <input
              id="ticket-attachment"
              type="file"
              className="ticket-hidden-file-input"
              onChange={
                handleAttachmentChange
              }
            />
          </div>

          <div className="ticket-drawer-footer">
            <button
              type="button"
              className="ticket-cancel-button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ticket-save-button"
              disabled={isSaving}
            >
              {isSaving
                ? "Creating..."
                : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketDrawer;