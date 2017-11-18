export default class Rest {
    getPosts({type, value}) {
        return {
            posts: [{
                id: "string",
                name: "string",
                body: "string",
                type: "enum, [demand, supply]",
                subject: "string",
                userId: "string",
                username: "string",
                createdAt: Date.now(),
                expiresAt: Date.now(),
            }]
        }
    }

    getPostById(id) {

    }

    createPost() {

    }
}