export interface FormParameters {
  questions?: QuestionProperties[];
  properties?: FormProperties;
  emails?: FormEmailProperties[];
  [key: string]: unknown;
}

export interface FormProperties {
  title: string;
  [key: string]: string;
}

export interface QuestionProperties {
  type: string;
  text: string;
  order: string;
  name: string;
  [key: string]: string;
}

export interface FormEmailProperties {
  type: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  body: string;
}
