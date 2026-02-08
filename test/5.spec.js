import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HomePage } from "../src/pages/home.page";
import { MainPage } from "../src/pages/main.page";
import { RegisterPage } from "../src/pages/register.page";
import { SettingsPage } from "../src/pages/settings.page";
import { ArticlePage } from "../src/pages/article.page";
import { ArticleEditPage } from "../src/pages/article_edit.page";

const createArticle = () => ({
  title: faker.lorem.words(3),
  about: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  tags: faker.lorem.word(),
  updatedTitle: faker.lorem.words(4),
  updatedAbout: faker.lorem.sentence(),
});

const url = "https://realworld.qa.guru/";

test.beforeEach(async ({ page }) => {
  // Регистрация нового пользователя перед каждым тестом
  const email = faker.internet.email({ provider: "qa.guru" });
  const name = faker.person.fullName();
  const password = faker.internet.password({ length: 10 });

  const mainPage = new MainPage(page);
  const registerPage = new RegisterPage(page);
  const homePage = new HomePage(page);

  // Регистрация
  await mainPage.open(url);
  await mainPage.gotoRegister();
  await registerPage.register(name, email, password);
  await expect(homePage.profileName).toContainText(name);
});

test("Пользователь может зарегистрироваться используя email и пароль Page Object", async ({
  page,
}) => {
  // Регистрация уже выполнена в beforeEach
  const homePage = new HomePage(page);
  await expect(homePage.profileName).toBeVisible();
});

test("Пользователь может изменить свое имя в профиле", async ({ page }) => {
  const NewVersionName = faker.person.fullName();

  const homePage = new HomePage(page);
  const settingsPage = new SettingsPage(page);

  // Переход в настройки и изменение имени
  await homePage.goToSettings();
  await settingsPage.updateName(NewVersionName);

  // Ожидание обновления данных после сохранения
  await page.waitForLoadState("networkidle");

  // Проверка изменения имени в навигации
  await expect(homePage.profileName).toContainText(NewVersionName);

  // Переход на свой профиль через навигацию
  await homePage.goToProfile();

  // Проверка изменения имени на странице профиля
  await expect(homePage.profileHeading(NewVersionName)).toBeVisible();
});

test("Пользователь создает новую статью", async ({ page }) => {
  const article = createArticle();
  const { title, about, content, tags } = article;

  const homePage = new HomePage(page);
  const articlePage = new ArticlePage(page);

  // Заполнение полей формы, для создания статьи:
  await articlePage.createArticle(title, about, content, tags);

  // Проверка создания статьи
  await expect(articlePage.articleHeading(title)).toBeVisible();
  // Проверка статьи в профиле
  await homePage.goToProfile();

  await expect(homePage.articleLink(title, about)).toBeVisible();
});

test("Пользователь оставляет комментарий к статье", async ({ page }) => {
  const article = createArticle();
  const { title, about, content, tags } = article;
  const commentText = faker.lorem.sentence();

  const articlePage = new ArticlePage(page);
  const articleEditPage = new ArticleEditPage(page);

  // Создание статьи
  await articlePage.createArticle(title, about, content, tags);

  // Проверка создания статьи
  await expect(articlePage.articleHeading(title)).toBeVisible();

  // Ожидание загрузки страницы
  await page.waitForLoadState("networkidle");

  // 1. Добавляем комментарий
  await articleEditPage.addComment(commentText);

  // 2. Проверка добавления комментария
  await expect(articleEditPage.commentText(commentText)).toBeVisible();
});

test("Пользователь редактирует статью", async ({ page }) => {
  const article = createArticle();
  const { title, about, content, tags, updatedTitle, updatedAbout } = article;

  const homePage = new HomePage(page);
  const articlePage = new ArticlePage(page);
  const articleEditPage = new ArticleEditPage(page);

  // Создание статьи
  await articlePage.createArticle(title, about, content, tags);

  // Проверка создания
  await expect(articlePage.articleHeading(title)).toBeVisible();

  // Переход на страницу статьи через профиль
  await homePage.goToProfile();
  await homePage.articleLink(title, about).first().click();
  // Редактирование статьи (первой в списке)
  await articleEditPage.editArticle(updatedTitle, updatedAbout, 0);

  // Проверка обновления статьи
  await expect(articlePage.articleHeading(updatedTitle)).toBeVisible();

  // Проверка в профиле
  await homePage.goToProfile();

  await expect(homePage.articleLink(updatedTitle, updatedAbout)).toBeVisible();
});

test("Пользователь удаляет статью", async ({ page }) => {
  const article = createArticle();
  const { title, about, content, tags } = article;

  const homePage = new HomePage(page);
  const articlePage = new ArticlePage(page);
  const articleEditPage = new ArticleEditPage(page);

  // Создание статьи
  await articlePage.createArticle(title, about, content, tags);

  // Проверка создания
  await expect(articlePage.articleHeading(title)).toBeVisible();

  // Сохранение URL статьи для проверки
  const postUrl = page.url();

  // удаление статьи
  await articleEditPage.deleteArticle(0);

  await page.waitForTimeout(2000); // Ожидание

  // Проверкаудаления статьи -  по URL статьи
  await page.goto(postUrl);

  // Проверяем, что кнопки редактирования нет (статья не существует)
  await expect(articleEditPage.editButton).not.toBeVisible();
});
