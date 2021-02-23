import { Selector, t } from "testcafe";

export class PjSignInPage {
    constructor() {
        this.baseSelector = Selector('div.modal-content').nth(1);
        this.username = this.baseSelector.find('#signInFormUsername');
        this.password = this.baseSelector.find('#signInFormPassword');
        this.loginButton = this.baseSelector.find('input[name="signInSubmitButton"]');
    };

    async signIn(user) {
        await this.fillAccountCredentials(user);
        await this.submitSignIn();
    }

    async fillAccountCredentials({ username, password }) {
        await t
            .typeText(this.username, username)
            .typeText(this.password, password);
    }

    async submitSignIn() {
        await t.click(this.loginButton);
    }
}