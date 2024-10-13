class User {
    #id
    #username
    #display_name
    #image

    constructor() {
        this.#setDefaults()
    }

    #setDefaults() {
        this.#id = null
        this.#username = null
        this.#display_name = null
        this.#image = null
    }

    // returns true if user is logged in
    get logged_in() {
        return !!this.#id
    }

    // Stores login information
    login({ id, username, display_name, image }) {
        console.log(`User ${id} with name ${username}/${display_name} logged in.`)
        this.#id = id
        this.#username = username
        this.#display_name = display_name
        this.#image = image
    }

    // Delete login information
    logout() {
        this.#setDefaults()
    }

    get id() {
        return this.#id
    }

    get username() {
        return this.#username
    }

    get display_name() {
        return this.#display_name
    }

    get image() {
        return this.#image
    }
}

const user = new User()
export default user