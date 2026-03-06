import { test, expect } from "@playwright/test";

let token;
const url = "https://apichallenges.herokuapp.com/";

test.describe("Challenge", () => {
  test.beforeEach(async ({ request }) => {
    let r = await request.post(`${url}challenger`);
    token = r.headers();
    console.log(`${url}gui/challenges/${token["x-challenger"]}`);
  });

  test("проверить количество challenges", async ({ request }) => {
    let r = await request.get(`${url}challenges`, {
      headers: {
        "X-CHALLENGER": token["x-challenger"],
      },
    });
    const body = await r.json();
    expect(body.challenges.length).toBe(59);
  });
});
