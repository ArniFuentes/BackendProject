const Ticket = require("../../models/ticket.model");

class TicketDAOMongo {
  async createTicket(ticketData) {
    try {
      const newTicket = await Ticket.create(ticketData);
      return newTicket;
    } catch (error) {
      // console.error("Error creating ticket:", error);
      throw error;
    }
  }
}

module.exports = TicketDAOMongo;
