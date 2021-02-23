import { Selector, t } from "testcafe";

export default class SignInPage {
    constructor() {
        this.baseSelector = Selector('mat-card');
        this.usernameInput = this.baseSelector.find('input[placeholder="Email"]');
        this.passwordInput = this.baseSelector.find('input[placeholder="Password"]');
        this.signInButton = this.baseSelector.find('button[type="submit"]');
    }

    async signIn(user) {
        await this.fillAccountCredentials(user);
        await this.submitSignIn();
    }

    async fillAccountCredentials({ username, password }) {
        await t
            .typeText(this.usernameInput, username)
            .typeText(this.passwordInput, password);
    }

    async submitSignIn() {
        await t.click(this.signInButton);
    }
}