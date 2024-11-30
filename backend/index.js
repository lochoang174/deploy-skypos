const express = require("express");
const connectMongoDB = require("./configs/database.config");
const cors = require("cors");
const app = express();
var dotenv = require("dotenv");
var env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
const port = process.env.PORT;
// routes
const authRoute = require("./routes/Auth.route");
const accountRoute = require("./routes/Account.route");
const productRoute = require("./routes/Product.route");
const variantRoute = require("./routes/Variant.route");
const transactionRoute = require("./routes/Transaction.route");
const customerRoute = require("./routes/Customer.route");
const statisticsRoute = require("./routes/Statistics.route");
// middlewares
const handleError = require("./errors/handleError");
const verifyToken = require("./middlewares/verifyToken");
const authorized = require("./middlewares/authorized");
const verifyFirstLogin = require("./middlewares/verifyFirstLogin");
const formatResponse = require("./middlewares/formatResponse");
const cookieParser = require("cookie-parser");
const path = require("path");
const {fileURLToPath} = require("url");
const corsOptions = {
    origin: "http://localhost:5173",
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Cho phép tất cả các phương thức
    credentials: true, // Allow credentials

};
// const __dirname = path.resolve();
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoute, formatResponse);
app.use("/api/account", verifyToken, authorized, accountRoute, formatResponse);
app.use("/api/product", verifyToken, authorized, productRoute, formatResponse);
app.use("/api/variant", verifyToken, authorized, variantRoute, formatResponse);

app.use("/api/transaction", verifyToken, authorized, transactionRoute, formatResponse);
app.use("/api/customer", verifyToken, authorized, customerRoute, formatResponse);
app.use("/api/statistics", verifyToken, authorized, statisticsRoute, formatResponse);

app.use(express.static(path.join(__dirname, "..", "front-end", "dist")));

app.get("*", (req, res) => { 
    res.sendFile(path.join(__dirname, "..", "front-end", "dist", "index.html"));
});
app.use(handleError);

const start = async () => {
    try {
        await connectMongoDB(process.env.URL);
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
