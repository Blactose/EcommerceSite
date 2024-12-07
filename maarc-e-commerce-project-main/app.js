const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const pageRoutes = require("./routes/pages");
const reviewRoutes = require("./routes/review");

const app = express();

// Database connection
const DB_connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "maarc_db",
});

DB_connection.connect((error) => {
  if (error) {
    console.log("Database connection error:", error);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); // Parse JSON bodies

app.use(
  session({
    secret: "thisisalongandsecureSessionKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

// Configure Handlebars
const hbs = require("hbs");
hbs.registerHelper("eq", (a, b) => a === b); 
hbs.registerPartials(path.join(__dirname, "views/partials")); 
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Define routes
app.use("/auth", authRoutes); 
app.use("/", pageRoutes); 
app.use("/reviews", reviewRoutes); 

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
