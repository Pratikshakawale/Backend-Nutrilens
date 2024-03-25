const jwt = require('jsonwebtoken');
const connectToMongo = require('../db');
const JWT_SECRET = process.env.JWT_SECRET
await connectToMongo()


const checkAuth = async (req, res, next) => {
    const token = req.header("authorization");
    if (token) {
        try {
            const decryptToken = jwt.verify(token, JWT_SECRET)
            const userData = await Users.findById(UserId)
            if (decryptToken.hash === userData.password) {
                req["x-email"] = userData.email;
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    next()
}
module.exports = checkAuth;
