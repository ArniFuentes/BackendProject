const TicketDAOMongo = require("../DAO/mongo/ticket-dao.mongo");

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

module.exports = TicketRepository;
