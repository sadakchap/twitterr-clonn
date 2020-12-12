const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASSWORD}@twitter-clone-cluster.4fypc.mongodb.net/twitter-db?retryWrites=true&w=majority`;

module.exports = {
    MONGO_URI
}