import { defineStore } from 'pinia'
import { ref } from 'vue'
import Notes from './Notes'
import NotesService from './NotesService'

export const NotesStore = defineStore('notes', () => {
const note = ref({
    NoteId: '',
    accesToken: ''
})


function getNotes(accessToken, noteId, userId) {
   const note = new Notes(noteId, userId, accessToken)
   const service = new NotesService(note)
   return service.addNote()
}

function addNote(note, accessToken) {
    const service = new NotesService()
    return service.addNote(note, accessToken)
}

function deleteNote(noteId, accessToken) {
    const service = new NotesService()
    return service.deleteNote(noteId, accessToken)
}

return { note, getNotes, addNote, deleteNote}
})


