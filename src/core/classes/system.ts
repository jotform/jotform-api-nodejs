import { IClient } from '../client';

interface ISystem {
  getPlans(plan: string): Promise<object>;
}

export class System implements ISystem {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  /**
   * Get limit and prices of a plan.
   * @param plan  Name of the requested plan. Must be one of the following: | **FREE** | **BRONZE** | **SILVER** | **GOLD** | **PLATINUM** |
   */
  getPlans = (plan: string): Promise<object> => {
    return this.client.Request('GET', `/system/plan/${plan}`);
  };
}
