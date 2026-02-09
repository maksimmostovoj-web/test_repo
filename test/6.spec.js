import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { App } from "../src/pages/app.page";
import { UserBuilder } from "../src/helpers/builders";

const url = "https://realworld.qa.guru/";

test.beforeEach(async ({ page }) => {
  // Регистрация нового пользователя перед каждым тестом
  const user = new UserBuilder().withEmail().withName().withPassword().build();
  const app = new App(page);

  // Регистрация
  await app.mainPage.open(url);
  await app.mainPage.gotoRegister();
  await app.registerPage.register(user.name, user.email, user.password);
  await expect(app.homePage.profileName).toContainText(user.name);
});

test("Пользователь может зарегистрироваться используя email и пароль Page Object", async ({
  page,
}) => {
  // Регистрация уже выполнена в beforeEach
  const app = new App(page);
  await expect(app.homePage.profileName).toBeVisible();
});

test("Пользователь может изменить свое имя в профиле", async ({ page }) => {
  const NewVersionName = faker.person.fullName();
  const app = new App(page);

  // Переход в настройки и изменение имени
  await app.homePage.goToSettings();
  await app.settingsPage.updateName(NewVersionName);

  // Ожидание обновления данных после сохранения
  await page.waitForLoadState("networkidle");

  // Проверка изменения имени в навигации
  await expect(app.homePage.profileName).toContainText(NewVersionName);

  // Переход на свой профиль через навигацию
  await app.homePage.goToProfile();

  // Проверка изменения имени на странице профиля
  await expect(app.homePage.profileHeading(NewVersionName)).toBeVisible();
});

test("Пользователь создает новую статью", async ({ page }) => {
  const app = new App(page);
  const article = app.createArticle();
  const { title, about, content, tags } = article;

  // Заполнение полей формы, для создания статьи:
  await app.articlePage.createArticle(title, about, content, tags);

  // Проверка создания статьи
  await expect(app.articlePage.articleHeading(title)).toBeVisible();
  // Проверка статьи в профиле
  await app.homePage.goToProfile();

  await expect(app.homePage.articleLink(title, about)).toBeVisible();
});

test("Пользователь оставляет комментарий к статье", async ({ page }) => {
  const app = new App(page);
  const article = app.createArticle();
  const { title, about, content, tags } = article;
  const commentText = faker.lorem.sentence();

  // Создание статьи
  await app.articlePage.createArticle(title, about, content, tags);

  // Проверка создания статьи
  await expect(app.articlePage.articleHeading(title)).toBeVisible();

  // Ожидание загрузки страницы
  await page.waitForLoadState("networkidle");

  // 1. Добавляем комментарий
  await app.articleEditPage.addComment(commentText);

  // 2. Проверка добавления комментария
  await expect(app.articleEditPage.commentText(commentText)).toBeVisible();
});

test("Пользователь редактирует статью", async ({ page }) => {
  const app = new App(page);
  const article = app.createArticle();
  const { title, about, content, tags, updatedTitle, updatedAbout } = article;

  // Создание статьи
  await app.articlePage.createArticle(title, about, content, tags);

  // Проверка создания
  await expect(app.articlePage.articleHeading(title)).toBeVisible();

  // Переход на страницу статьи через профиль
  await app.homePage.goToProfile();
  await app.homePage.articleLink(title, about).first().click();
  // Редактирование статьи (первой в списке)
  await app.articleEditPage.editArticle(updatedTitle, updatedAbout, 0);

  // Проверка обновления статьи
  await expect(app.articlePage.articleHeading(updatedTitle)).toBeVisible();

  // Проверка в профиле
  await app.homePage.goToProfile();

  await expect(
    app.homePage.articleLink(updatedTitle, updatedAbout),
  ).toBeVisible();
});

test("Пользователь удаляет статью", async ({ page }) => {
  const app = new App(page);
  const article = app.createArticle();
  const { title, about, content, tags } = article;

  // Создание статьи
  await app.articlePage.createArticle(title, about, content, tags);

  // Проверка создания
  await expect(app.articlePage.articleHeading(title)).toBeVisible();

  // Сохранение URL статьи для проверки
  const postUrl = page.url();

  // удаление статьи
  await app.articleEditPage.deleteArticle(0);

  await page.waitForTimeout(2000); // Ожидание

  // Проверкаудаления статьи -  по URL статьи
  await page.goto(postUrl);

  // Проверяем, что кнопки редактирования нет (статья не существует)
  await expect(app.articleEditPage.editButton).not.toBeVisible();
});
