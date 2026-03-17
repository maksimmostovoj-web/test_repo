import { expect, test } from "@playwright/test";
const url = "https://realworld.qa.guru/";

test("Визуальная регреcсия главной страницы", async ({ page }) => {
  await page.goto(url);

  await expect(page).toHaveScreenshot("homePage.png", {
    fullPage: true,
    mask: [
      page.locator(".tag-pill"), // маскируем теги
      page.locator(".date"), // маскируем даты
      page.locator(".counter"), // маскируем каунтеры лайков
    ],
  });
});

test("Визуальная регреcсия снапшоты главной страницы", async ({ page }) => {
  await page.goto(url);
  const $body = page.locator("#root");
  await expect($body).toMatchAriaSnapshot();
});

test("Визуальная регреcсия главной страницы с моком данных", async ({ page }) => {
  await page.route("**/tags", async (route) => {
    // todo переделать в json
    const json = { tags: ["Понедельник", "Monday"] };
    route.fulfill({ json });
  });

  await page.goto(url);

  await expect(page).toHaveScreenshot("homePageWithMock.png", {
    fullPage: true,
    mask: [
      // page.locator('.tag-pill'), // маскируем теги
      page.locator(".date"), // маскируем даты
      page.locator(".counter"), // маскируем каунтеры лайков
    ],
  });
});

test("Визуальная регреcсия главной страницы с добавлением данных", async ({ page }) => {
  const mockName = "Константинопольский Константин Константинович";
  await page.route("**/tags", async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.tags.unshift(mockName);
    route.fulfill({ json });
  });

  await page.goto(url);

  await expect(page).toHaveScreenshot("homePageWithAdd.png", {
    fullPage: true,
    mask: [
      // page.locator('.tag-pill'), // маскируем теги
      page.locator(".date"), // маскируем даты
      page.locator(".counter"), // маскируем каунтеры лайков
    ],
  });
});

test.only("Визуальная регреcсия авторизация", async ({ page }) => {
  const json = {
    user: {
      email: "!sni221225@ya.ru",
      username: "!sni221225",
      bio: "!!!",
      image: null,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNuaTIyMTIyNSIsImVtYWlsIjoic25pMjIxMjI1QHlhLnJ1IiwiaWF0IjoxNzY2NDI3NTE0fQ.H2DT6p6wo7OuOaKEbXbHgkevQeyJminCzz-ZxJBTVck",
    },
  };

  await page.route("**/users/login", async (route) => {
    route.fulfill({ json });
  });

  await page.goto(url);
  await page.getByRole("link", { name: " Login" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("sni@yandex.ru");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("passwdweffqewg");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("navigation")).toContainText("sniper10112025");

  /* await expect(page).toHaveScreenshot(
    'homePageWithAdd.png',
    {
            fullPage: true,
            mask: [
               // page.locator('.tag-pill'), // маскируем теги
                page.locator('.date'), // маскируем даты
                page.locator('.counter'), // маскируем каунтеры лайков
            ]
    }
    ); */
});
