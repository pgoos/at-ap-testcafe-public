import { Selector, t } from "testcafe";

export class SasSignInPage {
    constructor() {
        this.baseSelector = Selector('#sas-outer');
        this.username = this.baseSelector.find('#username').with({ visibilityCheck: true });
        this.password = this.baseSelector.find('#password').with({ visibilityCheck: true });
        this.loginButton = this.baseSelector.find('#form2 button[type="submit"]').withText('LOGIN');
    };

    async signIn(user) {
        await this.fillAccountCredentials(user);
        await this.submitSignIn();
    }
    // async signIn(username, password) {
    //     const user = { username, password };
    //     await this.fillAccountCredentials(user);
    //     await this.submitSignIn();
    // }

    async fillAccountCredentials({ username, password }) {
        await t
            .typeText(this.username, username)
            .typeText(this.password, password);
    }

    async submitSignIn() {
        await t.click(this.loginButton);
    }
}