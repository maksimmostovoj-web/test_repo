import { test, expect } from "@playwright/test";
import { Api } from "../src/services/api.facede";

let token;
const url = "https://apichallenges.eviltester.com/";
test.describe("Challenge with service", () => {
  test.beforeAll(async ({ request }, testinfo) => {
    // facade
    let api = new Api(request);
    let response = await api.challenger.post(testinfo);

    token = response.headers["x-challenger"];

    // для дебага
    console.log(`${url}gui/challenges/${token}`);
  });

  test.only("Получить список челленджей", async ({ request }, testinfo) => {
    let api = new Api(request);
    let response = await api.challenges.get(testinfo, token);
    expect(response.body.challenges.length).toBe(59);
  });

  test("Получить список туду", async ({ request }, testinfo) => {
    let api = new Api(request);
    let response = await api.todos.get(testinfo, token);
    response.body.todos.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({ id: expect.any(Number) }));
    });
  });
});
