import Jotform from '../dist/index';
import { sleep } from './utils';

const client = new Jotform(process.env.JF_API_KEY ?? '');

describe('Folder test suite', () => {

  beforeEach(async () => {
    await sleep(1000);
  });

  it('should create a folder with properties', async () => {
    const { content: folder } = await client.folder.create({
      name: 'my test folder'
    });

    expect(folder.name).toBe('my test folder');

    await client.folder.delete(folder.id as string);
  });

  it('should get a folder', async () => {
    const { content: folder } = await client.folder.create({
      name: 'my test folder'
    });

    expect(folder.name).toBe('my test folder');

    const { content: folderGet } = await client.folder.get(folder.id as string);

    expect(folder.name).toBe(folderGet.name);

    await client.folder.delete(folder.id as string);
  });

  it('should update a folder', async () => {
    const { content: folder } = await client.folder.create({
      name: 'my test folder'
    });

    expect(folder.name).toBe('my test folder');

    await client.folder.update(folder.id as string, {
      name: 'updated folder'
    });

    const { content: folderGet } = await client.folder.get(folder.id as string);

    expect(folderGet.name).toBe('updated folder');

    await client.folder.delete(folder.id as string);
  });

});
