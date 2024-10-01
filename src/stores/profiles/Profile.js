export default class Profile {
  #firstName;
  #lastName;
  #country;
  #accessToken;

  constructor(
    firstName,
    lastName,
    country,
    accessToken
  ) {
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#country = country;
    this.#accessToken = accessToken;
  }

  getFirstName() {
    return this.#firstName;
  }

  getLastName() {
    return this.#lastName;
  }

  getCountry() {
    return this.#country;
  }

  getAccessToken() {
    return this.#accessToken;
  }
}
