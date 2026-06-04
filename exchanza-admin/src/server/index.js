const express = require("express");
const cors = require("cors");

const analyticsPdfRoutes =
    require("./routes/analyticsPdf");

const app = express();

app.use(cors());

app.use(express.json({
    limit: "100mb",
}));

app.use(express.urlencoded({
    limit: "100mb",
    extended: true
}));

app.use("/api/pdf", analyticsPdfRoutes);

app.listen(5000, () => {
    console.log("PDF Server Running on 5000");
});