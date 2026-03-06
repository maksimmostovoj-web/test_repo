import { expect } from "@playwright/test";
import { test } from "../src/helpers/fixtures/fixture";
import * as allure from "allure-js-commons";
import { App } from "../src/pages/app.page";
import { UserBuilder } from "../src/helpers/builders";

const url = "https://realworld.qa.guru/";

test("Фикстура 1", async ({ registredUser, app }) => {
  await allure.tms("TMS-456", "Related TMS issue");
  const { user } = registredUser;
  const { name, email, password } = user;

  await app.mainPage.open(url);
  await app.mainPage.gotoRegister();
  await app.registerPage.register(name, email, password);

  await expect(app.homePage.profileName).toContainText(user.name);
});

test("Фикстура 2", async ({ userProfilePage }) => {
  await allure.tms("TMS-456", "Related TMS issue");
  const { app } = userProfilePage;
  const { user } = userProfilePage;
  // проверки профиля пользователя
  await expect(app.homePage.profileName).toContainText(user.name);
});

test("Фикстура парамтеризированная", async ({ createWithRole }) => {
  await allure.tms("TMS-456", "Related TMS issue");
  const user = createWithRole("admin");
  console.log(user);
  //  проверки профиля пользователя
  await expect(user).toHaveProperty("name");
  await expect(user.name).toBe("Test User");
});
test("Фикстура парамтеризированная с дефолтным значением", async ({ createWithRole }) => {
  await allure.tms("TMS-456", "Related TMS issue");
  const user = createWithRole();
  console.log(user);
  //  проверки профиля пользователя
  await expect(user).toHaveProperty("name");
  await expect(user.name).toBe("Test User");
  await expect(user).toHaveProperty("name", "Test User");
});
