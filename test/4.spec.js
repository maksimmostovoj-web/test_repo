import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Переменные
const user = {
  email: faker.internet.email({ provider: "qa.guru" }),
  name: faker.person.fullName(),
  password: faker.internet.password({ length: 10 }),
  NewVersionName: faker.person.fullName(),
};
/*
let email = faker.internet.email({ provider: "qa.guru" });
let name = faker.person.fullName(); // 'Allen Brown'
let password = faker.internet.password({ length: 10 });
let NewVersionName = faker.person.fullName();
*/

const url = "https://realworld.qa.guru/";

const getRegistration = async (page, email, name, password, url) => {
  await page.goto(url);
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByRole("textbox", { name: "Your Name" }).click();
  await page.getByRole("textbox", { name: "Your Name" }).fill(name);
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();
};

test("Пользователь может зарегистрироваться используя email и пароль", async ({
  page,
}) => {
  getRegistration(page, user.email, user.name, user.password, url);
  await expect(page.getByRole("navigation")).toContainText(user.name);
});

test("Пользователь может изменить свое имя в профиле", async ({ page }) => {
  getRegistration(page, user.email, user.name, user.password, url);
  await expect(page.getByRole("navigation")).toContainText(user.name);
  // изменение имени
  await page.getByText(user.name).click();
  await page.getByRole("link", { name: " Settings" }).click();
  await page.getByRole("textbox", { name: "Your Name" }).click();
  await page
    .getByRole("textbox", { name: "Your Name" })
    .fill(user.NewVersionName);
  await page.getByRole("button", { name: "Update Settings" }).click();
  // проверка изменения имени
  await page.getByText(user.NewVersionName).click();
  await page.getByRole("link", { name: " Profile" }).click();
  await expect(
    page.getByRole("heading", { name: user.NewVersionName }),
  ).toBeVisible();
});
