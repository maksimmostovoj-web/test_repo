import { faker } from "@faker-js/faker";
import {
  HomePage,
  MainPage,
  RegisterPage,
  SettingsPage,
  ArticlePage,
  ArticleEditPage,
} from "./index";
export class App {
  constructor(page) {
    this.page = page;
    this.mainPage = new MainPage(page);
    this.registerPage = new RegisterPage(page);
    this.homePage = new HomePage(page);
    this.settingsPage = new SettingsPage(page);
    this.articlePage = new ArticlePage(page);
    this.articleEditPage = new ArticleEditPage(page);
  }

  // Метод для создания статьи
  createArticle() {
    return {
      title: faker.lorem.words(3),
      about: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      tags: faker.lorem.word(),
      updatedTitle: faker.lorem.words(4),
      updatedAbout: faker.lorem.sentence(),
    };
  }
}
