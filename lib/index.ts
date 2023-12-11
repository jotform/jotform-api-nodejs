import createClient from './client.ts';
import { ClientOptions } from './interfaces/client.ts';
import User from './user.ts';

export default class Jotform {
  
  user: User;

  constructor(apiKey: string, options: ClientOptions) {
    const instance = createClient(apiKey, options);
    this.user = new User(instance);
  }

}
