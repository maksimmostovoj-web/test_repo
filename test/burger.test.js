import { test, expect } from "@playwright/test";

test("Пользователь может заказать бургер", async ({ page }) => {
  const name = "lzlz";
  await page.goto("file:///Users/maksimmostovoj/Downloads/burger-order.html");
  //Поиск по Роли
  // await page.getByRole("textbox" , {name: "Имя"}).click();
  // Поиск по Плейсхолдеру
  await page.getByPlaceholder("Введите ваше имя").fill(name);
  // Поиск по тегу или связка ключ значению
  // await page.locator('[placeholder=""Введите ваше имя]').fill(name);
  // Поиск по id начинается с решетки # и через selectOption
  await page.locator("#burgerType").selectOption("spicy");
  // Поиск по Классу (Начинается с точки!!!!) выбираем порцию через hasText
  await page.locator(".radio-group", { hasText: "Большой" }).click();
  // Поиск по Тексту
  await page.getByText("Горчица").click();
  // поиск по Лейблу
  //await page.getByLabel('Горчица').click();
  //Клик по классу  выбор свича
  await page.locator(".switch-label").click();
  // Увеличение количесва бургеров
  await page.getByText("+").click();
  // Выбор способа оплаты Text
  await page.getByText("Картой онлайн").click();
  //Кнопка заказать бургер по Тексту
  await page.getByText("Заказать бургер").click();
  // кнопка заказать бургер по Классу
  //await page.locator(".btn-primary", { hasText: "Заказать бургер" }).click();
  // проверка отображения принятия заказа
  //await expect(page.getByText("✅ Заказ принят!")).toBeVisible();
  // проверка через id
  await expect(page.locator("#popupMessage")).toContainText(
    `Спасибо за заказ, ${name}!`
  );
});
