class Database {
    constructor() {
        this.data = {};
    }

    save(key, value) {
        this.data[key] = value;
    }

    load(key) {
        return this.data[key] || null;
    }

    delete(key) {
        delete this.data[key];
    }

    clear() {
        this.data = {};
    }

    getAll() {
        return this.data;
    }
}

export default Database;