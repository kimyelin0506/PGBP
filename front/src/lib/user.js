// 로그인 성공 시 유저 정보를 전역적으로 사용하기 위해 cursor_data를 저장함
export const userStore = {
    user: null,

    setUser(data) {
        this.user = data;
    },

    getUser() {
        return this.user;
    },

    clear() {
        this.user = null;
    }
}