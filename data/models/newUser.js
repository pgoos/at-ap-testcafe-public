import { DefaultNewUser } from "../consts/users";

export default class NewUser {
    constructor({
        firstName = DefaultNewUser.FIRST_NAME,
        lastName = DefaultNewUser.LAST_NAME,
        email = DefaultNewUser.EMAIL,
        password = DefaultNewUser.PASSWORD,
        role = DefaultNewUser.ROLE
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}