module.exports = (req, res, next) => {

    // this is the teacher
    req.teacher = {}
    return next();
}