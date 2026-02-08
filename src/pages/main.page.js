export class MainPage {
  constructor(page) {
    this.page = page;
    this.signupLink = page
      .getByRole("link", { name: "Sign up" })
      .describe("Кнопка зарегистрироваться");
    this.loginLink = page
      .getByRole("link", { name: " Login" })
      .describe("Кнопка войти");
  }

  async gotoRegister() {
    await this.signupLink.click();
  }

  async gotoLogin() {
    await this.loginLink.click();
  }
  

  async open(url) {
    await this.page.goto(url);
  }
}
