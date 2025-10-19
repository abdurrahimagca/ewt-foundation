export class MockProvider {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getResponse(response: any): Promise<any> {
    return response;
  }
  
}
