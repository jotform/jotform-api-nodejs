import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { asyncForEach } from '@wojtekmaj/async-array-utils';
import { z } from 'zod';
import jotform from './index';

const TEST_FORM_ID = '232143945675058';

const TEST_FORM_SUBMISSION_ID = '5668764982391558613';

const TEST_FORM_QUESTION_ID = '1';

const TEST_ROOT_FOLDER_ID = '64cba4746334320c7cd86aa0';
const TEST_FOLDER_ID = '64cba4746334320c7c37f6b1';
const TEST_SUBFOLDER_ID = '64cba47f366166d6c6b373a8';

// TODO: Find a way to get a test report ID
const TEST_REPORT_ID = '';

describe('index', () => {
  it('has options exported properly', () => {
    expect(jotform.options).toBeDefined();
  });
});

/**
 * General
 */

// API call takes ~12 seconds to complete, we can't wait this long
describe.skip('getHistory()', () => {
  it('returns history data properly', async () => {
    const response = await jotform.getHistory();

    expect(response).toMatchObject(expect.any(Array));
  });
});

describe('getSettings()', () => {
  it('returns settings data properly', async () => {
    const response = await jotform.getSettings();

    expect(response).toMatchObject({
      email: expect.any(String),
    });
  });
});

// Getting "User is not Allowed" error
describe.skip('getSubusers()', () => {
  it('returns subusers data properly', async () => {
    const response = await jotform.getSubusers();

    expect(response).toMatchObject(expect.any(Array));
  });
});

describe('getUsage()', () => {
  it('returns usage data properly', async () => {
    const response = await jotform.getUsage();

    expect(response).toMatchObject({
      api: expect.any(Number),
    });
  });
});

describe('getUser()', () => {
  it('returns user data properly', async () => {
    const response = await jotform.getUser();

    expect(response).toMatchObject({
      email: expect.any(String),
    });
  });
});

/**
 * Forms
 */

describe('getForms()', () => {
  it('returns forms data properly', async () => {
    const response = await jotform.getForms({ filter: { status: 'ENABLED' } });

    expect(response).toMatchObject(expect.any(Array));

    const anyResponse = z.any().parse(response);

    const testForm = anyResponse.find((form: { id: string }) => form.id === TEST_FORM_ID);

    expect(testForm).toBeDefined();
  });
});

describe('getForm()', () => {
  it('returns form data properly', async () => {
    const response = await jotform.getForm(TEST_FORM_ID);

    expect(response).toMatchObject({
      id: TEST_FORM_ID,
    });
  });
});

describe('createForm()', () => {
  const createdFormIds: string[] = [];

  afterAll(async () => {
    await asyncForEach(createdFormIds, async (formId) => {
      await jotform.deleteForm(formId);
    });
  });

  it('creates form properly', async () => {
    const response = await jotform.createForm({ questions: [] });

    expect(response).toMatchObject({
      id: expect.any(String),
    });

    const anyResponse = z.any().parse(response);

    // Store form ID for later use
    createdFormIds.push(anyResponse.id);
  });
});

describe('createForms()', () => {
  const createdFormIds: string[] = [];

  afterAll(async () => {
    await asyncForEach(createdFormIds, async (formId) => {
      await jotform.deleteForm(formId);
    });
  });

  it('creates forms properly', async () => {
    const response = await jotform.createForms([{ title: 'Test form', questions: [] }]);

    // Not a mistake, actual unexpected API response
    expect(response).toMatchObject({
      id: expect.any(String),
    });

    const anyResponse = z.any().parse(response);

    // Store form ID for later use
    createdFormIds.push(anyResponse.id);
  });
});

describe('deleteForm()', () => {
  let createdFormId: string;

  beforeAll(async () => {
    const response = await jotform.createForm({ questions: [] });

    const anyResponse = z.any().parse(response);

    createdFormId = anyResponse.id;
  });

  it('deletes form properly', async () => {
    const response = await jotform.deleteForm(createdFormId);

    expect(response).toMatchObject({
      id: createdFormId,
    });
  });
});

describe('cloneForm()', () => {
  const createdFormIds: string[] = [];

  afterAll(async () => {
    await asyncForEach(createdFormIds, async (formId) => {
      await jotform.deleteForm(formId);
    });
  });

  it('clones form properly', async () => {
    const response = await jotform.cloneForm(TEST_FORM_ID);

    expect(response).toMatchObject({
      id: expect.any(String),
    });

    const anyResponse = z.any().parse(response);

    // Store form ID for later use
    createdFormIds.push(anyResponse.id);
  });
});

/**
 * Form files
 */

describe.todo('getFormFiles()');

/**
 * Form properties
 */

describe.todo('getFormProperties()');

describe.todo('getFormProperty()');

describe.todo('addFormProperty()');

describe.todo('addFormProperties()');

/**
 * Form questions
 */

describe('getFormQuestions()', () => {
  it('returns form questions data properly', async () => {
    const response = await jotform.getFormQuestions(TEST_FORM_ID);

    expect(response).toMatchObject(expect.any(Object));
  });
});

describe('getFormQuestion()', () => {
  it('returns form question data properly', async () => {
    const response = await jotform.getFormQuestion(TEST_FORM_ID, TEST_FORM_QUESTION_ID);

    expect(response).toMatchObject(expect.any(Object));
  });
});

describe.todo('addFormQuestion()');

describe.todo('addFormQuestions()');

describe.todo('deleteFormQuestion()');

/**
 * Form submissions
 */

describe('getFormSubmissions()', () => {
  it('returns submissions data properly', async () => {
    const response = await jotform.getFormSubmissions(TEST_FORM_ID, {
      filter: {
        status: 'ACTIVE',
      },
    });

    expect(response).toMatchObject(expect.any(Array));

    const anyResponse = z.any().parse(response);

    const testFormSubmission = anyResponse.find(
      (submission: { id: string }) => submission.id === TEST_FORM_SUBMISSION_ID,
    );

    expect(testFormSubmission).toBeDefined();
  });
});

describe.todo('getFormSubmission()');

describe('createFormSubmission()', () => {
  const createdSubmissionIds: string[] = [];

  afterAll(async () => {
    await asyncForEach(createdSubmissionIds, async (submissionId) => {
      await jotform.deleteSubmission(submissionId);
    });
  });

  it('creates form submission properly', async () => {
    const response = await jotform.createFormSubmission(TEST_FORM_ID, {
      submission: {
        1: 'Test value',
      },
    });

    expect(response).toMatchObject({
      submissionID: expect.any(String),
    });

    const safeResponse = z
      .object({
        submissionID: z.string(),
      })
      .parse(response);

    // Store submission ID for later use
    createdSubmissionIds.push(safeResponse.submissionID);
  });
});

describe('createFormSubmissions()', () => {
  const createdSubmissionIds: string[] = [];

  afterAll(async () => {
    await asyncForEach(createdSubmissionIds, async (submissionId) => {
      await jotform.deleteSubmission(submissionId);
    });
  });

  it('creates form submissions properly', async () => {
    const response = await jotform.createFormSubmissions(TEST_FORM_ID, [
      {
        submission: {
          1: 'Test value',
        },
      },
    ]);

    expect(response).toMatchObject(expect.any(Array));

    const anyResponse = z.any().parse(response);

    const item = anyResponse[0];

    expect(item).toMatchObject({
      submissionID: expect.any(String),
    });

    // Store submission ID for later use
    createdSubmissionIds.push(item.submissionID);
  });
});

/**
 * Form webhooks
 */

describe.todo('getFormWebhooks()');

describe.todo('createFormWebhook()');

describe.todo('deleteFormWebhook()');

/**
 * Folders
 */

describe('getFolders()', () => {
  it('returns folders data properly', async () => {
    const response = await jotform.getFolders();

    expect(response).toMatchObject({
      id: TEST_ROOT_FOLDER_ID,
      // Not a mistake, actual discrepancy in API response
      forms: expect.any(Object),
      subfolders: expect.any(Array),
    });

    const anyResponse = z.any().parse(response);

    const testFolder = anyResponse.subfolders.find(
      (folder: { id: string }) => folder.id === TEST_FOLDER_ID,
    );

    expect(testFolder).toBeDefined();

    expect(testFolder).toEqual(
      expect.objectContaining({
        id: TEST_FOLDER_ID,
        forms: expect.any(Array),
        subfolders: expect.any(Array),
      }),
    );

    const testSubfolder = testFolder.subfolders.find(
      (subfolder: { id: string }) => subfolder.id === TEST_SUBFOLDER_ID,
    );

    expect(testSubfolder).toBeDefined();

    expect(testSubfolder).toEqual(
      expect.objectContaining({
        id: TEST_SUBFOLDER_ID,
        forms: expect.any(Array),
        subfolders: expect.any(Array),
      }),
    );
  });
});

describe('getFolder()', () => {
  it('returns folder data properly', async () => {
    const response = await jotform.getFolder(TEST_FOLDER_ID);

    expect(response).toMatchObject({
      id: TEST_FOLDER_ID,
      forms: expect.any(Object),
    });
  });
});

describe('createFolder()', () => {
  const createdFolderIds: string[] = [];

  afterAll(async () => {
    await asyncForEach(createdFolderIds, async (folderId) => {
      // This should be awaited, but this Promise never resolves
      jotform.deleteFolder(folderId);
    });
  });

  it('creates folder properly', async () => {
    const response = await jotform.createFolder({ name: 'Test folder' });

    expect(response).toMatchObject({
      id: expect.any(String),
    });

    const anyResponse = z.any().parse(response);

    // Store folder ID for later use
    createdFolderIds.push(anyResponse.id);
  });
});

describe('updateFolder()', () => {
  let createdFolderId: string;

  beforeAll(async () => {
    const response = await jotform.createFolder({ name: 'Test folder' });

    const anyResponse = z.any().parse(response);

    createdFolderId = anyResponse.id;
  });

  afterAll(async () => {
    // This should be awaited, but this Promise never resolves
    jotform.deleteFolder(createdFolderId);
  });

  it('updates folder properly', async () => {
    const response = await jotform.updateFolder(createdFolderId, { name: 'Test folder 2' });

    expect(response).toMatchObject({
      name: 'Test folder 2',
    });
  });
});

describe.todo('addFormToFolder()');

describe.todo('addFormsToFolder()');

// This method returns a Promise that never resolves
describe.skip('deleteFolder()', () => {
  let createdFolderId: string;

  beforeAll(async () => {
    const response = await jotform.createFolder({ name: 'Test folder' });

    const anyResponse = z.any().parse(response);

    createdFolderId = anyResponse.id;
  });

  it('deletes folder properly', async () => {
    const response = await jotform.deleteFolder(createdFolderId);

    expect(response).toMatchObject({
      id: createdFolderId,
    });
  });
});

/**
 * Reports
 */

describe('getReports()', () => {
  it('returns reports data properly', async () => {
    const response = await jotform.getReports();

    expect(response).toMatchObject(expect.any(Array));
  });
});

describe.skip('getReport()', () => {
  it('returns report data properly', async () => {
    const response = await jotform.getReport(TEST_REPORT_ID);

    expect(response).toMatchObject({
      id: TEST_REPORT_ID,
    });
  });
});

/**
 * Submissions
 */

describe('getSubmissions()', () => {
  it('returns submissions data properly', async () => {
    const response = await jotform.getSubmissions({
      filter: {
        status: 'ACTIVE',
      },
    });

    expect(response).toMatchObject(expect.any(Array));

    const anyResponse = z.any().parse(response);

    const testFormSubmission = anyResponse.find(
      (submission: { id: string }) => submission.id === TEST_FORM_SUBMISSION_ID,
    );

    expect(testFormSubmission).toBeDefined();
  });
});

describe.todo('getSubmission()');

describe.todo('editSubmission()');

describe.todo('deleteSubmission()');
