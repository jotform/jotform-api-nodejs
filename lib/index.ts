import { ClientOptions } from './interfaces/client.ts';
import Form from './form.ts';
import User from './user.ts';
import Client from './client.ts';
import Report from './report.ts';
import Submission from './submission.ts';
import Folder from './folder.ts';
import System from './system.ts';

export default class Jotform {
  
  user: User;
  form: Form;
  report: Report;
  submission: Submission;
  folder: Folder;
  system: System;

  constructor(apiKey: string, options?: ClientOptions) {
    const instance = new Client(apiKey, options);
    this.user = new User(instance);
    this.form = new Form(instance);
    this.report = new Report(instance);
    this.submission = new Submission(instance);
    this.folder = new Folder(instance);
    this.system = new System(instance);
  }

}
