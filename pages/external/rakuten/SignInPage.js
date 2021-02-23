import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';

export class RakutenSignInPage {
    constructor() {
        this.baseSelector = Selector('#fm1');
        this.username = this.baseSelector.find('#username');
        this.password = this.baseSelector.find('#password');
        this.loginButton = this.baseSelector.find('input.button[type="submit"]');
    };

    async signIn(user, maxAttempts = waits.maxLoginAttempts, timeout = waits.table.timeout) {
        await this.fillAccountCredentials(user);
        await this.submitSignIn();
        
        await t.wait(timeout);

        for (let i = 0; i < maxAttempts; i += 1) {
            if (!(await this.username.exists)) {

                return;
            } else if (await this.username.value === "") {
                await this.fillAccountCredentials(user);
                await this.submitSignIn();
            }
        
            await t.wait(timeout);
        }
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