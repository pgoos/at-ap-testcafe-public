import axios from 'axios';
import { apiUrl } from '../../data/consts/access';
import { adminLogin, adminPassword, executionEnv } from '../../utils/envs';
import { DefaultNewUser } from '../../data/consts/users';
import NewUser from '../../data/models/newUser';

axios.defaults.baseURL = apiUrl;

export default class ApiCommon {
    static async login(username = "superadmin@toptal.com", password = "password") {
    // static async login(username = process.env.ADMIN_LOGIN, password = process.env.ADMIN_PASSWORD) {
        try {
        const response = await axios.post('/login', {
            username: username,
            password: password
        });
        axios.defaults.headers.common['Authorization'] = `Bearer ${ response.data.token }`;
        
        return response.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getUserList() {
        try {
            const response = await axios.get('/users', {})
            
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    static async createUser(user = new NewUser({})) {
        try {
            // console.log(user.email);
            
            const response = await axios.post('/users', {
                firstName: user.firstName,
                lastName: user.lastName,
	            email: user.email,
	            password: user.password,
	            role: user.role,
            });

            // console.log(`Created user: ${user.email}`);
            return response.data;
        } catch(error) {
            console.log(error);
            throw new Error(error);
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await axios.delete(`/users/${userId}`, {});

            return response.data;
        } catch(error) {
            throw new Error(error);
        }
    }

    static async manageUserClients(userId, clientList) {
        try {
            const response = await axios.put(`/users/${userId}/clients`, {
                clientIds: clientList,
            });

            return response.data;
        } catch(error) {
            throw new Error(error);
        }
    }

    static loginSync(username = "superadmin@toptal.com", password = "password") {
        // static async login(username = process.env.ADMIN_LOGIN, password = process.env.ADMIN_PASSWORD) {
        return axios.post('/login', {
            username: username,
            password: password
        })
        .then(response => {
            return response.data;
        });
        
        // axios.defaults.headers.common['Authorization'] = `Bearer ${ responseData.token }`;
    }

    static getPipelines() {
        // try {
            // const response = await axios.get('/clients/pipelines', {})
        return axios.get('/clients/pipelines', {})
            .then(response => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    console.log(response.status);
                    throw new Error(response.status);
                }
            })
            
        //     return response.data;
        // } catch (error) {
        //     console.log(error);
        //     throw new Error(error);
        // }
    }
}