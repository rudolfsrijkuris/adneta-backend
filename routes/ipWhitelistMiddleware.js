// WHITELISTED IP ADDRESSES
const whitelist = ["195.13.246.78", "212.3.196.222"];

const ipWhitelistMiddleware = (req, res, next) => {
    const clientIP = req.ip;

    if (whitelist.includes(clientIP)) {
        next();
    } else {
        res.status(403).send("Access denied: You are not authorized to access this page.");
    }
};

export default ipWhitelistMiddleware