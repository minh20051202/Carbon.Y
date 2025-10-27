const express = require("express");
const app = express();
const { connectToDB } = require("./database/db");
const envelopeRoute = require("./routes/envelope-route");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Start server after connecting to DB
connectToDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/envelopes", envelopeRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
