export class ArticlePage {
  constructor(page) {
    this.page = page;
    // локаторы для создания статьи
    this.newArticleLink = page.getByRole("link", { name: " New Article" });
    this.articleTitleInput = page.getByRole("textbox", {
      name: "Article Title",
    });
    this.articleAboutInput = page.getByRole("textbox", {
      name: "What's this article about?",
    });
    this.articleContentInput = page.getByRole("textbox", {
      name: "Write your article (in",
    });
    this.tagsInput = page.getByRole("textbox", { name: "Enter tags" });
    this.publishButton = page.getByRole("button", { name: "Publish Article" });
    this.articleHeading = (title) => page.getByRole("heading", { name: title });
  }

  async createArticle(title, about, content, tags) {
    await this.newArticleLink.click();
    await this.articleTitleInput.fill(title);
    await this.articleAboutInput.fill(about);
    await this.articleContentInput.fill(content);
    await this.tagsInput.fill(tags);
    await this.publishButton.click();
  }
}
