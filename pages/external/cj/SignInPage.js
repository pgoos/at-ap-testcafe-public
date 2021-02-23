import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';

export class CjSignInPage {
    constructor() {
        this.baseSelector = Selector('div.form-box');
        this.username = this.baseSelector.find('#form-username');
        this.password = this.baseSelector.find('#form-password');
        this.loginButton = this.baseSelector.find('input[type="submit"][value="Login"]');
        this.gdprModal = Selector('#gdpr-modal-body');
        this.gdprModalContinueButton = this.gdprModal.find('.gdpr-modal-footer-nav button.gdpr-modal-button-continue');
    };

    async acceptGdprIfPresent(maxAttempts = waits.modal.maxAttempts, timeout = waits.modal.timeout) {
        for (let i = 0; i < maxAttempts; i += 1) {
            if (await this.gdprModal.exists) {
                await t.click(this.gdprModalContinueButton);
                
                return;
            }
        
            await t.wait(timeout);
        }
    }

    async signIn(user) {
        await this.acceptGdprIfPresent();

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