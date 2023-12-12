import Jotform from "../lib";

export async function createAndAssertForm(client: Jotform) {
  const response = await client.form.createForm();
  expect(response.responseCode).toBe(200);
  const formId = response.content.id;
  expect(formId).toBeTruthy();

  return response.content;
}

export async function createAndAssertFormWithQuestions(client: Jotform) {
  const form = await createAndAssertForm(client);
  const formId = form.id as string;
  const questions = await client.form.addQuestions(formId, [
    {
      type: 'control_email',
      name: 'emailfield',
      text: 'My email field',
      order: '1'
    }, {
      type: 'control_email',
      name: 'emailfield2',
      text: 'My email field 2',
      order: '2'
    }
  ]);
  const { content } = questions;
  expect(content.length).toBe(2);

  return { form, questions: content };
}
