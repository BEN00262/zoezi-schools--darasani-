const { RateLimiterMongo } = require('rate-limiter-flexible')

module.exports = (mongo_connection) => {
    const rateLimiterMongo = new RateLimiterMongo({
        storeClient: mongo_connection,
        points: 10, // change to 5 points
        duration: 60 * 60
    })

    return (req, res, next) => {
        rateLimiterMongo.consume(req.ip)
            .then(() => next())
            .catch(() => res.status(429).render('error', {
                code: 429,
                message: "Exceeded usage limits"
            }))
    }
}