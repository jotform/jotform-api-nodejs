import { Client } from './core/client';
import { User } from './core/classes/user';
import { Form } from './core/classes/form';
import { Submission } from './core/classes/submission';
import { Report } from './core/classes/report';
import { Folder } from './core/classes/folder';
import { System } from './core/classes/system';

export class JotForm {
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
   */
  setApiKey = (apiKey: string): void => {
    this.client.setApiKey(apiKey);
  };
}
