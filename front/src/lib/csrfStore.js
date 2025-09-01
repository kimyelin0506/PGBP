export const csrfStore = {
    token: null,
    setToken(t) {this.token = t;},
    getToken() {return this.token}
}