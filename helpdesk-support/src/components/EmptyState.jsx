import { FileSearch } from "lucide-react";
import "./EmptyState.css";

function EmptyState({
  title = "No data found",
  message = "There are no records to display."
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FileSearch size={26} />
      </div>

      <h3 className="empty-state-title">{title}</h3>

      <p className="empty-state-message">{message}</p>
    </div>
  );
}

export default EmptyState;