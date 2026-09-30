import "./PriorityBadge.css";

function PriorityBadge({ priority }) {
  const priorityClass = priority
    ? priority.toLowerCase()
    : "unknown";

  return (
    <span
      className={`priority-badge ${priorityClass}`}
    >
      <span className="priority-dot" />
      {priority || "Unknown"}
    </span>
  );
}

export default PriorityBadge;