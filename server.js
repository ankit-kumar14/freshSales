const express = require("express");
const axios = require("axios");
const mysql = require("mysql");

const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/createContact", async (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;

  try {
    if (data_store === "CRM") {
      const response = await axios.post(
        "https://vcomply-593340897342139549.myfreshworks.com/crm/sales/api/contacts",
        {
          first_name,
          last_name,
          email,
          mobile_number,
        },
        {
          headers: {
            Authorization: "Token token=K8j-_IlNou42qL4diLGIdQ",
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } else if (data_store === "DATABASE") {
      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "ankit7856",
        database: "crud_app",
      });

      connection.connect();

      const query =
        "INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [first_name, last_name, email, mobile_number],
        (error, results) => {
          if (error) {
            console.error("Error creating contact in the database:", error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.json({ success: true, contact_id: results.insertId });
          }
        }
      );

      connection.end();
    } else {
      res.status(400).json({ error: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/getContact", async (req, res) => {
  const { contact_id, data_store } = req.body;

  try {
    if (data_store === "CRM") {
      const response = await axios.get(
        `https://vcomply-593340897342139549.myfreshworks.com/crm/sales/api/contacts/${contact_id}`,
        {
          headers: {
            Authorization: "Token token=K8j-_IlNou42qL4diLGIdQ",
          },
        }
      );

      res.json(response.data);
    } else if (data_store === "DATABASE") {
      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "ankit7856",
        database: "crud_app",
      });

      connection.connect();

      const query = "SELECT * FROM contacts WHERE id = ?";
      connection.query(query, [contact_id], (error, results) => {
        if (error) {
          console.error("Error retrieving contact from the database:", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else if (results.length === 0) {
          res.status(404).json({ error: "Contact not found" });
        } else {
          res.json(results[0]);
        }
      });

      connection.end();
    } else {
      res.status(400).json({ error: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error("Error retrieving contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/updateContact", async (req, res) => {
  const { contact_id, new_mobile_number, data_store } = req.body;

  try {
    if (data_store === "CRM") {
      const response = await axios.put(
        `https://vcomply-593340897342139549.myfreshworks.com/crm/sales/api/contacts/${contact_id}`,
        {
            mobile_number: new_mobile_number,
        },
        {
          headers: {
            Authorization: "Token token=K8j-_IlNou42qL4diLGIdQ",
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } else if (data_store === "DATABASE") {
      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "ankit7856",
        database: "crud_app",
      });

      connection.connect();

      const query =
        "UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?";
      connection.query(
        query,
        [new_email, new_mobile_number, contact_id],
        (error) => {
          if (error) {
            console.error("Error updating contact in the database:", error);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.json({ success: true });
          }
        }
      );

      connection.end();
    } else {
      res.status(400).json({ error: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/deleteContact", async (req, res) => {
  const { contact_id, data_store } = req.body;

  try {
    if (data_store === "CRM") {
      const response = await axios.delete(
        `https://vcomply-593340897342139549.myfreshworks.com/crm/sales/api/contacts/${contact_id}`,
        {
          headers: {
            Authorization: "Token token=K8j-_IlNou42qL4diLGIdQ",
          },
        }
      );

      res.json(response.data);
    } else if (data_store === "DATABASE") {
      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "ankit7856",
        database: "crud_app",
      });

      connection.connect();

      const query = "DELETE FROM contacts WHERE id = ?";
      connection.query(query, [contact_id], (error) => {
        if (error) {
          console.error("Error deleting contact from the database:", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json({ success: true });
        }
      });

      connection.end();
    } else {
      res.status(400).json({ error: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
