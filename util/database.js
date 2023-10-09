const mysql = require("mysql2");
// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");

// dotenv.config();

const DB_HOST = "localhost";
const DB_USER = "root";
const DB_PASSWORD = "admin";
const DB_DATABASE = "social_media";
const DB_PORT = 3306;

const pool = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

module.exports = pool.promise();
