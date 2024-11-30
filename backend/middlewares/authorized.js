const CustomError = require("../errors/CustomError");
require("express-async-errors");

const authorized = (req, res, next) => {
    const roleUrl = {
        1: {
            GET: ["/api/transaction", "/api/statistics", "/api/variant", "/api/product"],
            POST: ["/api/transaction"],
            PUT: ["/api/transaction"],
            PATCH: ["/api/transaction"],
            DELETE: ["/api/transaction"],
        },
        0: {},
    };

    const role = req.user.role;
    const requestedPath = req.baseUrl;
    const requestedMethod = req.method;
    console.log("reque " + requestedPath);
    if (role === 0) {
        next();
    } else {
        console.log(requestedPath);
        if (
            roleUrl[role] &&
            roleUrl[role][requestedMethod] &&
            roleUrl[role][requestedMethod].includes(requestedPath)
        ) {
            next();
        } else {
            throw new CustomError("Unauthorized access", 401);
        }
    }
};

module.exports = authorized;
