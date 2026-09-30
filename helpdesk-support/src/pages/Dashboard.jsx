import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Ticket,
  Users
} from "lucide-react";
import { useHelpdesk } from "../context/HelpdeskContext";
import "./Dashboard.css";

function Dashboard() {
  const {
    tickets,
    isLoading,
    error
  } = useHelpdesk();

  const statistics = useMemo(() => {
    const total = tickets.length;

    const open = tickets.filter(
      (ticket) =>
        ticket.status === "Open" ||
        ticket.status === "Assigned" ||
        ticket.status === "In Progress"
    ).length;

    const pending = tickets.filter(
      (ticket) => ticket.status === "Pending"
    ).length;

    const resolved = tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" ||
        ticket.status === "Closed"
    ).length;

    const cancelled = tickets.filter(
      (ticket) => ticket.status === "Cancelled"
    ).length;

    const critical = tickets.filter(
      (ticket) => ticket.priority === "Critical"
    ).length;

    const high = tickets.filter(
      (ticket) => ticket.priority === "High"
    ).length;

    const medium = tickets.filter(
      (ticket) => ticket.priority === "Medium"
    ).length;

    const low = tickets.filter(
      (ticket) => ticket.priority === "Low"
    ).length;

    return {
      total,
      open,
      pending,
      resolved,
      cancelled,
      critical,
      high,
      medium,
      low
    };
  }, [tickets]);

  const statusData = useMemo(() => {
    const statuses = [
      "Open",
      "Assigned",
      "In Progress",
      "Pending",
      "Resolved",
      "Closed",
      "Cancelled"
    ];

    return statuses.map((status) => ({
      status,
      count: tickets.filter(
        (ticket) => ticket.status === status
      ).length
    }));
  }, [tickets]);

  const priorityData = useMemo(() => {
    const priorities = [
      "Critical",
      "High",
      "Medium",
      "Low"
    ];

    return priorities.map((priority) => ({
      priority,
      count: tickets.filter(
        (ticket) =>
          ticket.priority === priority
      ).length
    }));
  }, [tickets]);

  const categoryData = useMemo(() => {
    const categories = [
      "Technical",
      "Billing",
      "Account"
    ];

    return categories.map((category) => ({
      category,
      count: tickets.filter(
        (ticket) =>
          ticket.category === category
      ).length
    }));
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort(
        (first, second) =>
          new Date(second.createdAt) -
          new Date(first.createdAt)
      )
      .slice(0, 5);
  }, [tickets]);

  const getStatusClass = (status) => {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getPriorityClass = (priority) => {
    return priority
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getMaxCount = (data) => {
    const counts = data.map(
      (item) => item.count
    );

    return Math.max(...counts, 1);
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            SUPPORT OPERATIONS
          </span>

          <h1>Dashboard</h1>

          <p>
            Monitor ticket activity, workload and
            support performance.
          </p>
        </div>

        <Link
          to="/tickets"
          className="dashboard-view-tickets"
        >
          View All Tickets
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Ticket size={20} />
          </div>

          <div>
            <span>Total Tickets</span>
            <strong>
              {statistics.total}
            </strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Open Tickets</span>
            <strong>
              {statistics.open}
            </strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>Pending Tickets</span>
            <strong>
              {statistics.pending}
            </strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>
              {statistics.resolved}
            </strong>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Ticket Overview</h2>
              <p>
                Current ticket distribution by
                status.
              </p>
            </div>

            <BarChart3 size={19} />
          </div>

          <div className="dashboard-bar-chart">
            {statusData.map((item) => (
              <div
                className="dashboard-bar-row"
                key={item.status}
              >
                <div className="dashboard-bar-label">
                  <span>{item.status}</span>
                  <strong>{item.count}</strong>
                </div>

                <div className="dashboard-bar-track">
                  <div
                    className={`dashboard-bar-fill ${getStatusClass(
                      item.status
                    )}`}
                    style={{
                      width: `${
                        (item.count /
                          getMaxCount(
                            statusData
                          )) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Priority Distribution</h2>
              <p>
                Tickets grouped by priority.
              </p>
            </div>

            <AlertCircle size={19} />
          </div>

          <div className="dashboard-priority-list">
            {priorityData.map((item) => (
              <div
                className="dashboard-priority-row"
                key={item.priority}
              >
                <div className="dashboard-priority-info">
                  <span
                    className={`dashboard-priority-dot ${getPriorityClass(
                      item.priority
                    )}`}
                  />

                  <span>
                    {item.priority}
                  </span>
                </div>

                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-content-grid">
        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Category Analytics</h2>
              <p>
                Support requests by category.
              </p>
            </div>

            <BarChart3 size={19} />
          </div>

          <div className="dashboard-category-list">
            {categoryData.map((item) => (
              <div
                className="dashboard-category-row"
                key={item.category}
              >
                <div>
                  <span>
                    {item.category}
                  </span>

                  <div className="dashboard-category-track">
                    <div
                      className="dashboard-category-fill"
                      style={{
                        width: `${
                          (item.count /
                            getMaxCount(
                              categoryData
                            )) *
                          100
                        }%`
                      }}
                    />
                  </div>
                </div>

                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>SLA Overview</h2>
              <p>
                Priority-based SLA targets.
              </p>
            </div>

            <Clock3 size={19} />
          </div>

          <div className="dashboard-sla-list">
            <div className="dashboard-sla-row">
              <span>Critical</span>
              <strong>2 hours</strong>
            </div>

            <div className="dashboard-sla-row">
              <span>High</span>
              <strong>4 hours</strong>
            </div>

            <div className="dashboard-sla-row">
              <span>Medium</span>
              <strong>8 hours</strong>
            </div>

            <div className="dashboard-sla-row">
              <span>Low</span>
              <strong>12 hours</strong>
            </div>
          </div>

          <div className="dashboard-sla-summary">
            <div>
              <span>Critical Tickets</span>
              <strong>
                {statistics.critical}
              </strong>
            </div>

            <div>
              <span>High Priority</span>
              <strong>
                {statistics.high}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-card dashboard-recent-card">
        <div className="dashboard-card-header">
          <div>
            <h2>Recent Tickets</h2>
            <p>
              Latest support requests.
            </p>
          </div>

          <Link to="/tickets">
            View All
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="dashboard-empty">
            <Users size={22} />
            <p>No tickets available.</p>
          </div>
        ) : (
          <div className="dashboard-recent-table-wrapper">
            <table className="dashboard-recent-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Subject</th>
                  <th>Requester</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                </tr>
              </thead>

              <tbody>
                {recentTickets.map(
                  (ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <Link
                          to={`/tickets/${ticket.id}`}
                        >
                          {ticket.id}
                        </Link>
                      </td>

                      <td>
                        {ticket.subject}
                      </td>

                      <td>
                        {ticket.requester}
                      </td>

                      <td>
                        <span
                          className={`dashboard-priority-badge ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`dashboard-status-badge ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td>
                        {ticket.assignedTo}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="dashboard-secondary-stats">
        <div>
          <span>Cancelled Tickets</span>
          <strong>
            {statistics.cancelled}
          </strong>
        </div>

        <div>
          <span>Medium Priority</span>
          <strong>
            {statistics.medium}
          </strong>
        </div>

        <div>
          <span>Low Priority</span>
          <strong>
            {statistics.low}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;