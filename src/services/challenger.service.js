import { test } from "@playwright/test";
export class ChallengerService {
  constructor(request) {
    this.request = request;
  }
  async post(testinfo) {
    return test.step("POST /challanger", async () => {
      const response = await this.request.post(`${testinfo.project.use.apiUrl}challenger`);
      // Простой вариант
      // return response;

      //  const body = await response.json();
      const headers = response.headers();
      return { headers };
    });
  }
}
