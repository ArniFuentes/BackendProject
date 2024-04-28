import TicketDAOMongo from "../DAO/mongo/ticket-dao.mongo.js";

class TicketRepository {
  constructor() {
    this.ticketDAO = new TicketDAOMongo();
  }

  async createTicket(ticketData) {
    try {
      return await this.ticketDAO.createTicket(ticketData);
    } catch (error) {
      throw error;
    }
  }
}

export default TicketRepository;
