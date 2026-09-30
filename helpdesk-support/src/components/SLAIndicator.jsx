import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import "./SLAIndicator.css";

function SLAIndicator({
  createdAt,
  slaHours = 12,
  status
}) {
  const [currentTime, setCurrentTime] =
    useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const completedStatuses = [
    "Resolved",
    "Closed",
    "Cancelled"
  ];

  if (
    completedStatuses.includes(status)
  ) {
    return (
      <div className="sla-indicator completed">
        <div className="sla-indicator-header">
          <div className="sla-indicator-title">
            <Clock3 size={14} />
            <span>SLA</span>
          </div>

          <strong>Completed</strong>
        </div>

        <div className="sla-indicator-track">
          <div
            className="sla-indicator-progress"
            style={{
              width: "100%"
            }}
          />
        </div>
      </div>
    );
  }

  const createdTime =
    new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return (
      <div className="sla-indicator unknown">
        <div className="sla-indicator-header">
          <div className="sla-indicator-title">
            <Clock3 size={14} />
            <span>SLA</span>
          </div>

          <strong>Unknown</strong>
        </div>

        <div className="sla-indicator-track">
          <div
            className="sla-indicator-progress"
            style={{
              width: "0%"
            }}
          />
        </div>
      </div>
    );
  }

  const slaMilliseconds =
    slaHours *
    60 *
    60 *
    1000;

  const deadline =
    createdTime +
    slaMilliseconds;

  const remaining =
    deadline - currentTime;

  if (remaining <= 0) {
    return (
      <div className="sla-indicator breached">
        <div className="sla-indicator-header">
          <div className="sla-indicator-title">
            <Clock3 size={14} />
            <span>SLA</span>
          </div>

          <strong>
            SLA Breached
          </strong>
        </div>

        <div className="sla-indicator-track">
          <div
            className="sla-indicator-progress"
            style={{
              width: "100%"
            }}
          />
        </div>
      </div>
    );
  }

  const remainingHours =
    remaining /
    (60 * 60 * 1000);

  const remainingPercentage =
    Math.min(
      100,
      Math.max(
        0,
        (remaining /
          slaMilliseconds) *
          100
      )
    );

  const usedPercentage =
    100 -
    remainingPercentage;

  const warningThreshold =
    Math.max(
      slaHours * 0.25,
      1
    );

  if (
    remainingHours <=
    warningThreshold
  ) {
    return (
      <div className="sla-indicator warning">
        <div className="sla-indicator-header">
          <div className="sla-indicator-title">
            <Clock3 size={14} />
            <span>SLA</span>
          </div>

          <strong>
            {remainingHours.toFixed(
              1
            )}
            h left
          </strong>
        </div>

        <div className="sla-indicator-track">
          <div
            className="sla-indicator-progress"
            style={{
              width: `${usedPercentage}%`
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="sla-indicator within">
      <div className="sla-indicator-header">
        <div className="sla-indicator-title">
          <Clock3 size={14} />
          <span>SLA</span>
        </div>

        <strong>
          {remainingHours.toFixed(
            1
          )}
          h left
        </strong>
      </div>

      <div className="sla-indicator-track">
        <div
          className="sla-indicator-progress"
          style={{
            width: `${usedPercentage}%`
          }}
        />
      </div>
    </div>
  );
}

export default SLAIndicator;