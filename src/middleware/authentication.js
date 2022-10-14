const jwt = require("jsonwebtoken")


let authenticate = async function(req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(404).send({ status: false, msg: "token is not present in header" })
        }

        let decodeToken = jwt.verify(token, "rushi-159")

        if (!decodeToken) {
            return res.status(401).send({ status: false, msg: "invalid token" })

        }
        req.decodeToken = decodeToken
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.messge })
    }
}


module.exports.authenticate = authenticate