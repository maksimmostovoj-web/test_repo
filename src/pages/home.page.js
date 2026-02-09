export class HomePage {
  constructor(page) {
    this.page = page;
    this.profileName = page.locator(".dropdown-toggle");
    this.profileLink = page.getByRole("link", { name: " Profile" });
    this.settingsLink = page.getByRole("link", { name: " Settings" });
    this.logoutButton = page.getByRole("button", {
      name: "Or click here to logout.",
    });
    this.articleLink = (title, about) =>
      page.getByRole("link", {
        name: new RegExp(`${title}.*${about}.*Read more`, "i"),
      });
    this.profileHeading = (name) => page.getByRole("heading", { name: name });
  }

  async goToSettings() {
    await this.profileName.click();
    await this.settingsLink.click();
  }

  async goToProfile() {
    await this.profileName.click();
    await this.profileLink.click();
  }

  async logout() {
    await this.profileName.click();
    await this.profileLink.click();
    await this.logoutButton.click();
  }
}
