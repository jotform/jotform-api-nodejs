import { IClient } from '../client';

interface IFolder {
  getFolder(folderId: string): Promise<object>;
}

export class Folder implements IFolder {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  /**
   * Get a list of forms in a folder, and other details about the form such as folder color.
   * @param folderId Folder ID.
   */
  getFolder = (folderId: string): Promise<object> => {
    return this.client.Request('GET', `/folder/${folderId}`);
  };
}
