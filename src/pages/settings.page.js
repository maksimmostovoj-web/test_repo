export class SettingsPage {
  constructor(page) {
    this.page = page;
    this.nameField = page.getByRole("textbox", { name: "Your Name" });
    this.updateSettingsButton = page.getByRole("button", {
      name: "Update Settings",
    });
  }

  async updateName(newName) {
    await this.nameField.click();
    await this.nameField.clear();
    await this.nameField.fill(newName);
    await this.updateSettingsButton.click();
  }
}
