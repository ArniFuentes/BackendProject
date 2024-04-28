import Ticket from "../../models/ticket.model.js";

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

export default TicketDAOMongo;
