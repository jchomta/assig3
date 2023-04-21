
const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mta_dashboard"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

const PORT = process.env.PORT || 3001;

const app = express();
// const sql = require('mssql')
// const sqlConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   server: 'localhost',
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000
//   },
//   options: {
//     encrypt: true, // for azure
//     trustServerCertificate: false // change to true for local dev / self-signed certs
//   }
// }

// async () => {
//     try {
//         // make sure that any items are correctly URL encoded in the connection string
//         await sql.connect('Server=TSPOCMSLIVTAP.transit.nyct.com,1433;Database=OpticomManagement;User Id=appOpticomUser;Password=App0ptic0mU$3r;Encrypt=true')
//         const result = await sql.query`select * from Priority`
//         console.dir(result)
//     } catch (err) {
//         // ... error checks
//         console.log(err)
//     }
// }

app.get("/countTSP", (req, res) => {
    // make sure that any items are correctly URL encoded in the connection string

    const q = `SELECT SUM(CASE WHEN enabled = 1 THEN 1 ELSE 0 END) AS enabled, 
              SUM(CASE WHEN enabled = 0 THEN 1 ELSE 0 END) AS disabled 
              FROM VEHICLES
              `;
    console.log(q);
    db.query(q, (err,data)=>{
      if (err) return res.json(err)
      console.log("data", data)
      return res.json(data)
    })
});

app.get("/countTSPByPOPI", (req, res) => {
    const q = `SELECT route, SUM(CASE WHEN enabled = 1 THEN 1 ELSE 0 END) AS enabled, 
              SUM(CASE WHEN enabled = 0 THEN 1 ELSE 0 END) AS disabled 
              FROM VEHICLES
              WHERE convert(varchar(10), date, 102) 
              = convert(varchar(10), getdate(), 102) 
              GROUP BY route
              `;
    console.log(q);
    db.query(q, (err,data)=>{
      if (err) return res.json(err)
      console.log("data", data)
      return res.json(data)
    })
});
app.get("/allDepot", (req, res) => {
    const q = `SELECT DISTINCT depot from Depot`;
    console.log(q);
    db.query(q, (err,data)=>{
      if (err) return res.json(err)
      console.log("data", data)
      return res.json(data)
    })
});


// app.get("/api", (req, res) => {
//     // make sure that any items are correctly URL encoded in the connection string
//     sql.connect('Server=TSPOCMSLIVTAP.transit.nyct.com,1433;Database=OpticomManagement;User Id=appOpticomUser;Password=App0ptic0mU$3r;Encrypt=true')
//     const result = sql.query`select * from Priority`
//     console.log("HELLO")
//   res.json({ message: "Hello from servers!" });
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

