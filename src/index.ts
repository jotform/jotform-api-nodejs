import { Client } from './core/client';
import { User } from './core/classes/user';
import { Form } from './core/classes/form';
import { Submission } from './core/classes/submission';
import { Report } from './core/classes/report';
import { Folder } from './core/classes/folder';
import { System } from './core/classes/system';

export class Jotform {
  private client: Client;
  public user: User;
  public form: Form;
  public submission: Submission;
  public report: Report;
  public folder: Folder;
  public system: System;

  constructor() {
    this.client = new Client();
    this.user = new User(this.client);
    this.form = new Form(this.client);
    this.submission = new Submission(this.client);
    this.report = new Report(this.client);
    this.folder = new Folder(this.client);
    this.system = new System(this.client);
  }

  /**
   * @param apiKey Your personal API key.
   * @param instance Which Jotform API instance are you going to use, if it's not specified defaults to **US**. Must be one of the following: | **US** | **EU** | **HIPAA** |
   */
  initializeSDK = (apiKey: string, instanceType = 'US'): void => {
    if (!(instanceType in this.client.instanceTypes)) {
      throw new Error(
        'instanceType must be one of the following: US, EU, HIPAA.'
      );
    }

    this.client.initializeSDK(apiKey, instanceType);
  };
}
