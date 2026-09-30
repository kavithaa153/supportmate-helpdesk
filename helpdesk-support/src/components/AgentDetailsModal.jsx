import {
  Mail,
  UserRound,
  X
} from "lucide-react";
import "./AgentDetailsModal.css";

function AgentDetailsModal({
  agent,
  onClose
}) {
  if (!agent) {
    return null;
  }

  const initials = agent.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="agent-modal-overlay"
      onClick={onClose}
    >
      <div
        className="agent-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="agent-modal-header">
          <div>
            <span>
              AGENT DETAILS
            </span>

            <h2>
              {agent.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="agent-modal-profile">
          <div className="agent-modal-avatar">
            {initials}
          </div>

          <div>
            <strong>
              {agent.name}
            </strong>

            <span>
              {agent.role}
            </span>
          </div>
        </div>

        <div className="agent-modal-grid">
          <div>
            <span>
              Email
            </span>

            <strong>
              {agent.email}
            </strong>
          </div>

          <div>
            <span>
              Status
            </span>

            <strong>
              {agent.status}
            </strong>
          </div>

          <div>
            <span>
              Open Tickets
            </span>

            <strong>
              {agent.openTickets}
            </strong>
          </div>

          <div>
            <span>
              Resolved Tickets
            </span>

            <strong>
              {agent.resolved}
            </strong>
          </div>
        </div>

        <div className="agent-modal-contact">
          <UserRound size={17} />
          <span>
            {agent.role}
          </span>

          <Mail size={17} />
          <span>
            {agent.email}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AgentDetailsModal;