import ProfileRepository from "./ProfileRepository"

export default class ProfileService {

    #repo
    #profile

    constructor(profile) {
        this.#repo = new ProfileRepository()
        this.#profile = profile
    }

    async setProfile() {
        const response = await this.#repo.setProfile(this.#profile)
        return response
    }

    async getProfile(accessToken) {
        const response = await this.#repo.getProfile(accessToken)
        return response
    }

}