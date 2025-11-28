import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/vue/dist/#/");
});

test("Добавление новой задачи", async ({ page }) => {
  // Пердусловия
  await expect(
    page.getByRole("textbox", { name: "What needs to be done?" })
  ).toBeVisible();
  // Шаги
  await page.getByRole("textbox", { name: "What needs to be done?" }).click();
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("новая задача");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");
  // Проверка
  await expect(page.getByText("новая задача")).toBeVisible();
});

test("Добавление новой задачи и перевод ее в состояние выполнено", async ({
  page,
}) => {
  await page.getByRole("textbox", { name: "What needs to be done?" }).click();
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("Новая задача");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");
  await expect(page.getByText("Новая задача")).toBeVisible();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Новая задачаEdit Todo Input" })
    .getByRole("checkbox")
    .check();
  await page.getByRole("link", { name: "Completed" }).click();
  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "Новая задачаEdit Todo Input" })
      .getByRole("checkbox")
  ).toBeVisible();
});

test("Удаление выполненной задачи", async ({ page }) => {
  await page.getByRole("textbox", { name: "What needs to be done?" }).click();
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("задача 1");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("задача 2");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");
  await page
    .getByRole("listitem")
    .filter({ hasText: "задача 2Edit Todo Input" })
    .getByRole("checkbox")
    .check();
  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "задача 2Edit Todo Input" })
      .getByRole("checkbox")
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear Completed" }).click();
  await expect(page.getByText("задача 2")).not.toBeVisible();
});
