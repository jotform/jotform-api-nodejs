interface FormParameters {
  questions?: QuestionProperties[];
  properties?: FormProperties;
  emails?: FormEmailProperties[];
}

interface FormProperties {
  title: string;
  [key: string]: string;
}

interface QuestionProperties {
  type: string;
  text: string;
  order: string;
  name: string;
  [key: string]: string;
}

interface FormEmailProperties {
  type: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  body: string;
}
