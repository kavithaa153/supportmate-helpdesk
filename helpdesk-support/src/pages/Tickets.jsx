import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  X
} from "lucide-react";

import { useHelpdesk } from "../context/HelpdeskContext";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import SLAIndicator from "../components/SLAIndicator";
import EmptyState from "../components/EmptyState";

import "./Tickets.css";

function Tickets() {
  const navigate = useNavigate();

  const {
    tickets,
    isLoading,
    error
  } = useHelpdesk();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [sortField, setSortField] =
    useState("createdAt");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const ticketsPerPage = 8;

  const statuses = [
    "All",
    "Open",
    "Assigned",
    "In Progress",
    "Pending",
    "Resolved",
    "Closed",
    "Cancelled"
  ];

  const priorities = [
    "All",
    "Critical",
    "High",
    "Medium",
    "Low"
  ];

  const categories = [
    "All",
    "Technical",
    "Billing",
    "Account"
  ];

  const filteredTickets = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const result = tickets.filter((ticket) => {
      const matchesSearch =
        !normalizedSearch ||
        ticket.id
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        ticket.subject
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        ticket.requester
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        ticket.requesterEmail
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        ticket.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });

    result.sort((a, b) => {
      let firstValue;
      let secondValue;

      if (sortField === "createdAt") {
        firstValue =
          new Date(a.createdAt).getTime();

        secondValue =
          new Date(b.createdAt).getTime();
      } else {
        firstValue =
          String(a[sortField] || "")
            .toLowerCase();

        secondValue =
          String(b[sortField] || "")
            .toLowerCase();
      }

      if (
        sortField === "createdAt"
      ) {
        return sortDirection === "asc"
          ? firstValue - secondValue
          : secondValue - firstValue;
      }

      if (firstValue < secondValue) {
        return sortDirection === "asc"
          ? -1
          : 1;
      }

      if (firstValue > secondValue) {
        return sortDirection === "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return result;
  }, [
    tickets,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortField,
    sortDirection
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTickets.length /
        ticketsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    ticketsPerPage;

  const paginatedTickets =
    filteredTickets.slice(
      startIndex,
      startIndex + ticketsPerPage
    );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    categoryFilter !== "All";

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePriorityChange = (event) => {
    setPriorityFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  const getResultStart = () => {
    if (filteredTickets.length === 0) {
      return 0;
    }

    return startIndex + 1;
  };

  const getResultEnd = () => {
    return Math.min(
      startIndex + ticketsPerPage,
      filteredTickets.length
    );
  };

  if (isLoading) {
    return (
      <div className="tickets-page">
        <div className="tickets-loading">
          <div className="tickets-loading-spinner" />
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-page">
        <div className="tickets-error">
          <h2>Unable to load tickets</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="tickets-page-header">
        <div>
          <div className="tickets-breadcrumb">
            SupportMate
            <span>/</span>
            Tickets
          </div>

          <h1>Tickets</h1>

          <p>
            Manage, track and resolve
            customer support requests.
          </p>
        </div>

        <button
          type="button"
          className="tickets-create-button"
          onClick={() =>
            navigate("/create-ticket")
          }
        >
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      <div className="tickets-summary">
        <div className="tickets-summary-card">
          <span>Total Tickets</span>
          <strong>
            {tickets.length}
          </strong>
        </div>

        <div className="tickets-summary-card">
          <span>Open</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === "Open"
              ).length
            }
          </strong>
        </div>

        <div className="tickets-summary-card">
          <span>In Progress</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status ===
                  "In Progress"
              ).length
            }
          </strong>
        </div>

        <div className="tickets-summary-card">
          <span>Pending</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status ===
                  "Pending"
              ).length
            }
          </strong>
        </div>

        <div className="tickets-summary-card">
          <span>Resolved</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status ===
                    "Resolved" ||
                  ticket.status === "Closed"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="tickets-filter-panel">
        <div className="tickets-filter-header">
          <div className="tickets-filter-title">
            <Filter size={17} />
            <span>Filters</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="tickets-clear-button"
              onClick={clearFilters}
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        <div className="tickets-filter-grid">
          <div className="tickets-search-wrapper">
            <Search size={17} />

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search ticket ID, subject, requester..."
            />

            {searchTerm && (
              <button
                type="button"
                className="tickets-search-clear"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="tickets-filter-field">
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={handleStatusChange}
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="tickets-filter-field">
            <label>Priority</label>

            <select
              value={priorityFilter}
              onChange={handlePriorityChange}
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

          <div className="tickets-filter-field">
            <label>Category</label>

            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
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
        </div>
      </div>

      <div className="tickets-table-card">
        <div className="tickets-table-header">
          <div>
            <h2>All Tickets</h2>

            <p>
              {filteredTickets.length} ticket
              {filteredTickets.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="tickets-result-count">
            Showing{" "}
            <strong>
              {getResultStart()}-
              {getResultEnd()}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredTickets.length}
            </strong>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="tickets-empty-wrapper">
            <EmptyState
              title="No tickets found"
              message={
                hasActiveFilters
                  ? "Try changing your search or filter criteria."
                  : "There are no tickets available."
              }
            />

            {hasActiveFilters && (
              <button
                type="button"
                className="tickets-empty-clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="tickets-table-wrapper">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>
                      <button
                        type="button"
                        className="tickets-sort-button"
                        onClick={() =>
                          handleSort("id")
                        }
                      >
                        Ticket ID
                        <ArrowUpDown
                          size={13}
                        />
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        className="tickets-sort-button"
                        onClick={() =>
                          handleSort("subject")
                        }
                      >
                        Subject
                        <ArrowUpDown
                          size={13}
                        />
                      </button>
                    </th>

                    <th>Requester</th>

                    <th>Category</th>

                    <th>
                      <button
                        type="button"
                        className="tickets-sort-button"
                        onClick={() =>
                          handleSort("priority")
                        }
                      >
                        Priority
                        <ArrowUpDown
                          size={13}
                        />
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        className="tickets-sort-button"
                        onClick={() =>
                          handleSort("status")
                        }
                      >
                        Status
                        <ArrowUpDown
                          size={13}
                        />
                      </button>
                    </th>

                    <th>SLA</th>

                    <th>Assigned To</th>

                    <th>
                      <button
                        type="button"
                        className="tickets-sort-button"
                        onClick={() =>
                          handleSort("createdAt")
                        }
                      >
                        Created
                        <ArrowUpDown
                          size={13}
                        />
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTickets.map(
                    (ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="ticket-id-link"
                          >
                            {ticket.id}
                          </Link>
                        </td>

                        <td>
                          <div className="ticket-subject-cell">
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="ticket-subject-link"
                            >
                              {ticket.subject}
                            </Link>

                            {ticket.description && (
                              <span>
                                {ticket.description.length >
                                55
                                  ? `${ticket.description.slice(
                                      0,
                                      55
                                    )}...`
                                  : ticket.description}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="ticket-requester-cell">
                            <strong>
                              {ticket.requester ||
                                "-"}
                            </strong>

                            <span>
                              {ticket.requesterEmail ||
                                "-"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="ticket-category">
                            {ticket.category ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          <PriorityBadge
                            priority={
                              ticket.priority
                            }
                          />
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              ticket.status
                            }
                          />
                        </td>

                        <td className="sla-table-cell">
                          <SLAIndicator
                            createdAt={
                              ticket.createdAt
                            }
                            slaHours={
                              ticket.slaHours
                            }
                            status={
                              ticket.status
                            }
                          />
                        </td>

                        <td>
                          <div className="ticket-assignee">
                            <span className="ticket-avatar">
                              {ticket.assignedTo
                                ? ticket.assignedTo
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                            </span>

                            <span>
                              {ticket.assignedTo ||
                                "Unassigned"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="ticket-created-cell">
                            <span>
                              {formatDate(
                                ticket.createdAt
                              )}
                            </span>

                            <small>
                              {formatTime(
                                ticket.createdAt
                              )}
                            </small>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="tickets-pagination">
              <div className="tickets-pagination-info">
                Page{" "}
                <strong>
                  {safeCurrentPage}
                </strong>{" "}
                of{" "}
                <strong>
                  {totalPages}
                </strong>
              </div>

              <div className="tickets-pagination-controls">
                <button
                  type="button"
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="tickets-page-number">
                  {Array.from(
                    {
                      length: totalPages
                    },
                    (_, index) =>
                      index + 1
                  )
                    .filter((page) => {
                      if (
                        totalPages <= 5
                      ) {
                        return true;
                      }

                      if (
                        page === 1 ||
                        page === totalPages
                      ) {
                        return true;
                      }

                      return (
                        page >=
                          safeCurrentPage -
                            1 &&
                        page <=
                          safeCurrentPage +
                            1
                      );
                    })
                    .map((page) => (
                      <button
                        type="button"
                        key={page}
                        className={
                          page ===
                          safeCurrentPage
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  type="button"
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Tickets;