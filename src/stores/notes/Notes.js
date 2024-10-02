export default class Notes {
    #title
    #content
    #accesToken

    constructor(title, content, accesToken) {
        this.#title = title
        this.#content = content
        this.#accesToken = accesToken
    }

    gettTitle() {
        return this.#title
    }

    getContent() {
        return this.#content
    }

    getAccessToken() {
        return this.#accesToken
    }

}