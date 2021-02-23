import { Role } from 'testcafe';
import { getClientPortals } from '../../utils/test-data-reader';
import { SasSignInPage } from '../../pages/external/sas/SignInPage';
import SignInPage from '../../pages/platform/SignInPage';
import urls from './urls';
import { CjSignInPage } from '../../pages/external/cj/SignInPage';
import { PjSignInPage } from '../../pages/external/pepper-jam/SignInPage';
import { RakutenSignInPage } from '../../pages/external/rakuten/SignInPage';

const cjSignInPage = new CjSignInPage();
const pjSignInPage = new PjSignInPage();
const sasLoginPage = new SasSignInPage();
const rakutenLoginPage = new RakutenSignInPage()
const signInPage = new SignInPage();

const roles = {
  cj: (username, password) => Role(
    getClientPortals().CJ,
    async () => cjSignInPage.signIn({username, password}),
    { preserveUrl: true }
  ),
  pepperJam: (username, password) => Role(
    getClientPortals().PepperJam,
    async () => pjSignInPage.signIn({username, password}),
    { preserveUrl: true }
  ),
  sas: (username, password) => Role(
    getClientPortals().SAS,
    async () => sasLoginPage.signIn({username, password}),
    { preserveUrl: true }
  ),
  rakuten: (username, password) => Role(
    getClientPortals().Rakuten,
    async () => rakutenLoginPage.signIn({username, password}),
    { preserveUrl: true }
  ),
  basic: (username, password) => Role(
    urls.platform.signIn,
    async () => signInPage.signIn({username, password}),
    { preserveUrl: true }
  ),
};

export default roles;
