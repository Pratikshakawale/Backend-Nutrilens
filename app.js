require('dotenv/config')
const express = require("express")
const bodyParser = require("body-parser")
const checkAuth = require("./middleware/checkAuth");
const cors = require("cors");
const connectToMongo = require('./db');

const app = express();
const port = 5000;

connectToMongo()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkAuth);


app.use("/api/auth/", require("./routes/auth"));
app.use("/api/admin/", require("./routes/admin"));
app.use("/api/user/request/", require("./routes/user"))

// db.end();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});