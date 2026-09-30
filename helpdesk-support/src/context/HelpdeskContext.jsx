import { createContext, useContext, useEffect, useState } from "react";
import ticketData from "../data/ticketData";

const HelpdeskContext = createContext();

function HelpdeskProvider({ children }) {
  const [tickets, setTickets] = useState(() => {
    try {
      const savedTickets = localStorage.getItem("supportmateTickets");

      if (savedTickets) {
        return JSON.parse(savedTickets);
      }

      localStorage.setItem(
        "supportmateTickets",
        JSON.stringify(ticketData)
      );

      return ticketData;
    } catch {
      return ticketData;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "supportmateTickets",
        JSON.stringify(tickets)
      );
    } catch {
      setError("Unable to save ticket data.");
    }
  }, [tickets]);

  const addTicket = (newTicket) => {
    setTickets((currentTickets) => [
      newTicket,
      ...currentTickets
    ]);

    setError("");
  };

  const updateTicket = (updatedTicket) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id
          ? updatedTicket
          : ticket
      )
    );

    setError("");
  };

  const deleteTicket = (ticketId) => {
    setTickets((currentTickets) =>
      currentTickets.filter(
        (ticket) => ticket.id !== ticketId
      )
    );

    setError("");
  };

  const getTicketById = (ticketId) => {
    return tickets.find(
      (ticket) => ticket.id === ticketId
    );
  };

  const refreshTickets = () => {
    setIsLoading(true);
    setError("");

    try {
      const savedTickets = localStorage.getItem(
        "supportmateTickets"
      );

      const loadedTickets = savedTickets
        ? JSON.parse(savedTickets)
        : ticketData;

      setTickets(loadedTickets);
    } catch {
      setError("Unable to load ticket data.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  const value = {
    tickets,
    setTickets,
    isLoading,
    error,
    addTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    refreshTickets,
    clearError
  };

  return (
    <HelpdeskContext.Provider value={value}>
      {children}
    </HelpdeskContext.Provider>
  );
}

export function useHelpdesk() {
  const context = useContext(HelpdeskContext);

  if (!context) {
    throw new Error(
      "useHelpdesk must be used inside HelpdeskProvider"
    );
  }

  return context;
}

export default HelpdeskProvider;