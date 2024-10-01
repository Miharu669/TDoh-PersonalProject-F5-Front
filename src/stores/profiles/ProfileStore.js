import { defineStore } from "pinia";
import { ref } from "vue";
import Profile from "./Profile";
import ProfileService from "./ProfileService";


export const ProfileStore = defineStore('profile', () => {

    const profile = ref(
        {
            firstName: '',
            lastName: '',
            country: '',
            userAccesToken: ''
        }
    )

    function setProfile(firstName, lastName, country, userAccesToken) {

        const profile = new Profile(firstName, lastName, country, userAccesToken)
        const service = new ProfileService(profile)
        return service.setProfile()

    }

    function getProfile(accessToken) {
        const service = new ProfileService()
        return service.getProfile(accessToken)
    }

    return { profile, setProfile, getProfile };
});