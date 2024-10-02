import axios from 'axios';

export default class NotesRepository {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_ENDPOINT + '/notes';
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    async getNotes(accesToken) {
        try {
            const headersList = {
                Accept: '*/*',
                Authorization: `Bearer ${accesToken}`,
            };

            const response = await this.axiosInstance.get('', { headers: headersList });
            return response.data; 
        } catch (error) {
            console.error('Error fetching notes:', error); 
            return error.response ? error.response.data : error.message; 
        }
    }

    async addNote(title, content, accesToken) {
        try {
            const headersList = {
                Accept: '*/*',
                Authorization: `Bearer ${accesToken}`,
                'Content-Type': 'application/json',
            };

            const bodyContent = {
                title: title,
                content: content
            };

            const response = await this.axiosInstance.post('', bodyContent, { headers: headersList });
            return response.data; 
        } catch (error) {
            console.error('Error adding note:', error); 
            return error.response ? error.response.data : error.message; 
        }
    }

    async deleteNote(noteId, accesToken) {
        try {
            const headersList = {
                Accept: '*/*',
                Authorization: `Bearer ${accesToken}`,
            };

            const response = await this.axiosInstance.delete(`/${noteId}`, { headers: headersList });
            return response.data; 
        } catch (error) {
            console.error('Error deleting note:', error); 
            return error.response ? error.response.data : error.message; 
        }
    }
}
