import Client from "./client";
import { Plan } from "./enums/plan";
import { JotformResponse } from "./types/response";

export default class System {
    
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  getPlan(plan: Plan): JotformResponse {
    return this.client.get(`/system/plan/${plan}`);
  }

}