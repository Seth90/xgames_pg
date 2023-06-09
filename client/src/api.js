import axios from 'axios';
import config from './config.js';

export const HTTP = axios.create({
    baseURL: config.MOCK,
});

export default {
    async getComingSoonGames() {
        try {
            const response = await HTTP.get('/getComingSoonGames');
            //console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    },
    async getGeneralInfo() {
        try {
            const response = await HTTP.get('/getGames');
            //console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    },
    async getDescriptions() {
        try {
            const response = await HTTP.get('/getDescriptions');
            //console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    },
    async getPosters() {
        try {
            const response = await HTTP.get('/getPosters');
            //console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    },
    async getPrices() {
        try {
            const response = await HTTP.get('/getPrices');
            //console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    },
    async getExchanges() {
        try {
            const response = await HTTP.get('/getExchanges');
            //console.log(response.data);
            return response.data;
        }
        catch (e) {
            console.log(e);
        }
    },
    async getProduct(id) {
        try {
            const response = await HTTP.get(`/product/${id}`)
            //console.log(response.data);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
}