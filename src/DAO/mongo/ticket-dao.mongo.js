import Ticket from "../../models/ticket.model.js";

class TicketDAOMongo {
  async createTicket(ticketData) {
    try {
      const newTicket = await Ticket.create(ticketData);
      return newTicket;
    } catch (error) {
      throw error;
    }
  }
}

export default TicketDAOMongo;
