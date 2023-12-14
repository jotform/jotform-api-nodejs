import { ClientOptions } from './interfaces/client';
import Form from './form';
import User from './user';
import Client from './client';
import Report from './report';
import Submission from './submission';
import Folder from './folder';
import System from './system';

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
