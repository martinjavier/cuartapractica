import { TicketManager } from "../dao/factory.js";

export const createTicket = (ticket) => {
  try {
    let ticketAdded = TicketManager.addOneTicket(ticket);
    return ticketAdded;
  } catch (error) {
    return error.message;
  }
};

export const getTickets = () => {
  try {
    const tickets = TicketManager.getTickets();
    return tickets;
  } catch (error) {
    return error.message;
  }
};

export const getTicketById = (ticketId) => {
  try {
    const ticket = TicketManager.getTicketById(ticketId);
    return ticket;
  } catch (error) {
    return error.message;
  }
};

export const updateTicket = (ticketId, ticket) => {
  try {
    const updatedTicket = TicketManager.updateTicket(ticketId, ticket);
    return updatedTicket;
  } catch (error) {
    return error.message;
  }
};

export const deleteTicket = (ticketId) => {
  try {
    const deletedTicket = TicketManager.deleteTicket(ticketId);
    return deletedTicket;
  } catch (error) {
    return error.message;
  }
};
