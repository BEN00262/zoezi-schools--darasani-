module.exports = {
    convertToJson: require("./excelToJSON"),
    multerUploader: require("./multer_uploader"),
    rateLimiter: require("./ratelimiter"),
    paymentFunction: require("./payment"),
    ...require("./curriculum")
}