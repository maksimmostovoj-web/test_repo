export class ArticleEditPage {
  constructor(page) {
    this.page = page;

    this.editArticleLinks = page.getByRole("link", { name: " Edit Article" });
    this.deleteArticleButtons = page.getByRole("button", {
      name: " Delete Article",
    });

    // Локаторы для комментариев
    this.commentInput = page.getByRole("textbox", {
      name: "Write a comment...",
    });
    this.postCommentButton = page.getByRole("button", { name: "Post Comment" });

    // Локаторы для формы редактирования
    this.articleTitleInput = page.getByRole("textbox", {
      name: "Article Title",
    });
    this.articleAboutInput = page.getByRole("textbox", {
      name: "What's this article about?",
    });
    this.articleContentInput = page.getByRole("textbox", {
      name: "Write your article (in",
    });
    this.updateButton = page.getByRole("button", { name: "Update Article" });

    // Локаторы для проверок
    this.editButton = page.locator("a").filter({ hasText: "Edit Article" });
    this.commentText = (text) => page.getByText(text);
  }

  async editArticle(title, about, articleIndex = 0) {
    await this.editArticleLinks.nth(articleIndex).click();

    if (title) {
      await this.articleTitleInput.fill(title);
    }
    if (about) {
      await this.articleAboutInput.fill(about);
    }

    await this.updateButton.click();
  }

  async deleteArticle(articleIndex = 0) {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        await dialog.accept();
        resolve(dialog.message());
      });
      this.deleteArticleButtons.nth(articleIndex).click();
    });
  }
  

  async addComment(commentText) {
    await this.commentInput.fill(commentText);
    await this.postCommentButton.click();
  }

}
