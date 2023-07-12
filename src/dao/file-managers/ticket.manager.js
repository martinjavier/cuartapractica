class TicketManager {
  constructor(model) {
    this.model = model;
  }

  async addTicket(ticket) {
    try {
      const data = await this.model.create(ticket);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error creating a new ticket : ${error.message}`);
    }
  }

  async getTickets() {
    try {
      const tickets = await this.model.find();
      const response = JSON.parse(JSON.stringify(tickets));
      return response;
    } catch (error) {
      throw new Error(`Error getting tickets: ${error.message}`);
    }
  }

  async getTicketById(ticketId) {
    try {
      const data = await this.model.findOne(ticketId);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error getting a ticket by Id: ${error.message}`);
    }
  }

  async deleteTicket(ticketId) {
    try {
      const data = await this.model.deleteTicket(ticketId);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error deleting a ticket: ${error.message}`);
    }
  }

  async updateTicket(ticketId, ticket) {
    try {
      const data = await this.model.updateTicket(ticketId, ticket);
      const response = JSON.parse(JSON.stringify(data));
      return response;
    } catch (error) {
      throw new Error(`Error updating ticket: ${error.message}`);
    }
  }
}

export default TicketManager;
