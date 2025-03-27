const express = require("express");
const cors = require("cors");
const secureRoutes = require("./routes/secureRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", secureRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
