import NotesRepository from "./NotesRepository";

export default class NotesService {
    #repo
    #notes

    constructor(notes) {
        this.#repo = new NotesRepository()
        this.#notes = notes 
    }

    async getNotes() {
        const response = await this.#repo.getNotes(accesToken)
        return response
    }

    async addNote() {
        const response = await this.#repo.addNote(title, content, accesToken)
        return response
    }

    async deleteNote() {
        const response = await this.#repo.deleteNote(noteId, accesToken)
        return response
    }
}