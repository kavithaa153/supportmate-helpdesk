import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Ticket
} from "lucide-react";
import { useHelpdesk } from "../context/HelpdeskContext";
import "./Reports.css";

const STATUSES = [
  "Open",
  "Assigned",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
  "Cancelled"
];

const CATEGORIES = ["Technical", "Billing", "Account"];

const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const COMPLETED_STATUSES = ["Resolved", "Closed"];

function getPeriodRange(period) {
  const now = new Date();

  const thisMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  if (period === "Last Month") {
    return {
      start: new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      ),
      end: thisMonthStart
    };
  }

  if (period === "Last 3 Months") {
    return {
      start: new Date(
        now.getFullYear(),
        now.getMonth() - 2,
        1
      ),
      end: nextMonthStart
    };
  }

  return {
    start: thisMonthStart,
    end: nextMonthStart
  };
}

function getCompletionDate(ticket) {
  const activities = Array.isArray(ticket.activity)
    ? ticket.activity
    : [];

  const completionActivity = activities
    .filter(
      (activity) =>
        activity.type === "status" &&
        /to (Resolved|Closed)\b/i.test(
          activity.message || ""
        )
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )
    .at(-1);

  return completionActivity?.date
    ? new Date(completionActivity.date)
    : null;
}

function calculateSlaPerformance(ticketList) {
  const completedTickets = ticketList.filter((ticket) =>
    COMPLETED_STATUSES.includes(ticket.status)
  );

  if (completedTickets.length === 0) {
    return 0;
  }

  const slaMetCount = completedTickets.filter((ticket) => {
    const createdDate = new Date(ticket.createdAt);

    const completionDate =
      getCompletionDate(ticket);

    const slaHours = Number(ticket.slaHours);

    if (
      Number.isNaN(createdDate.getTime()) ||
      !completionDate ||
      Number.isNaN(completionDate.getTime()) ||
      !Number.isFinite(slaHours) ||
      slaHours <= 0
    ) {
      return false;
    }

    const elapsedHours =
      (completionDate.getTime() -
        createdDate.getTime()) /
      3600000;

    return (
      elapsedHours >= 0 &&
      elapsedHours <= slaHours
    );
  }).length;

  return Math.round(
    (slaMetCount / completedTickets.length) * 100
  );
}

function Reports() {
  const {
    tickets,
    isLoading,
    error
  } = useHelpdesk();

  const [period, setPeriod] =
    useState("This Month");

  const filteredTickets = useMemo(() => {
    const { start, end } =
      getPeriodRange(period);

    return tickets.filter((ticket) => {
      const createdDate =
        new Date(ticket.createdAt);

      if (
        Number.isNaN(
          createdDate.getTime()
        )
      ) {
        return false;
      }

      return (
        createdDate >= start &&
        createdDate < end
      );
    });
  }, [tickets, period]);

  const statistics = useMemo(() => {
    const total =
      filteredTickets.length;

    const resolved =
      filteredTickets.filter((ticket) =>
        COMPLETED_STATUSES.includes(
          ticket.status
        )
      ).length;

    const open =
      filteredTickets.filter((ticket) =>
        [
          "Open",
          "Assigned",
          "In Progress"
        ].includes(ticket.status)
      ).length;

    const slaPerformance =
      calculateSlaPerformance(
        filteredTickets
      );

    return {
      total,
      resolved,
      open,
      slaPerformance
    };
  }, [filteredTickets]);

  const categoryData = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        count: filteredTickets.filter(
          (ticket) =>
            ticket.category === category
        ).length
      })),
    [filteredTickets]
  );

  const priorityData = useMemo(
    () =>
      PRIORITIES.map((priority) => ({
        priority,
        count: filteredTickets.filter(
          (ticket) =>
            ticket.priority === priority
        ).length
      })),
    [filteredTickets]
  );

  const statusData = useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        count: filteredTickets.filter(
          (ticket) =>
            ticket.status === status
        ).length
      })),
    [filteredTickets]
  );

  const maxCategory = Math.max(
    ...categoryData.map(
      (item) => item.count
    ),
    1
  );

  const maxPriority = Math.max(
    ...priorityData.map(
      (item) => item.count
    ),
    1
  );

  if (isLoading) {
    return (
      <div className="reports-page">
        <div className="reports-loading">
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <span className="reports-eyebrow">
            SUPPORT ANALYTICS
          </span>

          <h1>
            Reports &amp; Analytics
          </h1>

          <p>
            Analyze ticket volume,
            priorities, categories and
            support performance.
          </p>
        </div>

        <select
          value={period}
          onChange={(event) =>
            setPeriod(event.target.value)
          }
          className="reports-period-select"
          aria-label="Report period"
        >
          <option value="This Month">
            This Month
          </option>

          <option value="Last Month">
            Last Month
          </option>

          <option value="Last 3 Months">
            Last 3 Months
          </option>
        </select>
      </div>

      {error && (
        <div className="reports-error">
          {error}
        </div>
      )}

      <div className="reports-stat-grid">
        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <Ticket size={20} />
          </div>

          <div>
            <span>Total Tickets</span>
            <strong>
              {statistics.total}
            </strong>
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Resolved Tickets</span>
            <strong>
              {statistics.resolved}
            </strong>
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Open Tickets</span>
            <strong>
              {statistics.open}
            </strong>
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>SLA Performance</span>
            <strong>
              {statistics.slaPerformance}%
            </strong>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <section className="reports-card">
          <div className="reports-card-header">
            <div>
              <h2>
                Tickets by Category
              </h2>

              <p>
                Support requests grouped by
                category.
              </p>
            </div>

            <BarChart3 size={19} />
          </div>

          <div className="reports-chart-list">
            {categoryData.map((item) => (
              <div
                className="reports-chart-row"
                key={item.category}
              >
                <div className="reports-chart-label">
                  <span>
                    {item.category}
                  </span>

                  <strong>
                    {item.count}
                  </strong>
                </div>

                <div className="reports-chart-track">
                  <div
                    className="reports-chart-fill"
                    style={{
                      width: `${
                        (item.count /
                          maxCategory) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reports-card">
          <div className="reports-card-header">
            <div>
              <h2>
                Tickets by Priority
              </h2>

              <p>
                Ticket distribution by
                priority.
              </p>
            </div>

            <AlertTriangle size={19} />
          </div>

          <div className="reports-chart-list">
            {priorityData.map((item) => (
              <div
                className="reports-chart-row"
                key={item.priority}
              >
                <div className="reports-chart-label">
                  <span>
                    {item.priority}
                  </span>

                  <strong>
                    {item.count}
                  </strong>
                </div>

                <div className="reports-chart-track">
                  <div
                    className="reports-chart-fill"
                    style={{
                      width: `${
                        (item.count /
                          maxPriority) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="reports-card">
        <div className="reports-card-header">
          <div>
            <h2>
              Ticket Volume
            </h2>

            <p>
              {period} ticket status
              distribution.
            </p>
          </div>
        </div>

        <div className="reports-volume">
          {statusData.map((item) => (
            <div
              className="reports-volume-item"
              key={item.status}
            >
              <strong>
                {item.count}
              </strong>

              <span>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Reports;