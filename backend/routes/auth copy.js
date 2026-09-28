const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../config/database");


/* 
   CUSTOMER REGISTRATION
    */

router.post("/register", async (req, res) => {

  try {

    const {
      first_name,
      last_name,
      email,
      password,
      phone
    } = req.body;


    /* Basic validation */

    if (!first_name || !email || !password) {

      return res.status(400).json({
        message: "First name, email and password are required."
      });

    }


    if (password.length < 6) {

      return res.status(400).json({
        message: "Password must be at least 6 characters."
      });

    }


    /* Check whether email already exists */

    const checkSql = `
      SELECT user_id
      FROM users
      WHERE email = ?
      LIMIT 1
    `;


    db.query(
      checkSql,
      [email],
      async (checkError, existingUsers) => {

        if (checkError) {

          console.error(checkError);

          return res.status(500).json({
            message: "Database error."
          });

        }


        if (existingUsers.length > 0) {

          return res.status(409).json({
            message: "An account with this email already exists."
          });

        }


        /* Hash password */

        const passwordHash =
          await bcrypt.hash(password, 10);


        /* Insert customer */

        const insertSql = `
          INSERT INTO users
          (
            first_name,
            last_name,
            email,
            password_hash,
            phone,
            role
          )
          VALUES (?, ?, ?, ?, ?, 'customer')
        `;


        db.query(
          insertSql,
          [
            first_name,
            last_name || null,
            email,
            passwordHash,
            phone || null
          ],
          (insertError, result) => {

            if (insertError) {

              console.error(insertError);

              return res.status(500).json({
                message: "Unable to create account."
              });

            }


            return res.status(201).json({

              message: "Account created successfully.",

              user: {
                user_id: result.insertId,
                first_name,
                last_name: last_name || null,
                email,
                phone: phone || null,
                role: "customer"
              }

            });

          }
        );

      }
    );

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message: "Server error."
    });

  }

});

/* =========================================================
   CUSTOMER LOGIN
   ========================================================= */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    /* Validate input */

    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password are required."
      });

    }


    /* Find customer */

    const sql = `
      SELECT
        user_id,
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        role
      FROM users
      WHERE email = ?
      LIMIT 1
    `;


    db.query(
      sql,
      [email],
      async (error, results) => {

        if (error) {

          console.error(
            "Login database error:",
            error
          );

          return res.status(500).json({
            message: "Database error."
          });

        }


        /* Email doesn't exist */

        if (results.length === 0) {

          return res.status(401).json({
            message: "Invalid email or password."
          });

        }


        const user = results[0];


        /* Compare entered password with hash */

        const passwordMatches =
          await bcrypt.compare(
            password,
            user.password_hash
          );


        if (!passwordMatches) {

          return res.status(401).json({
            message: "Invalid email or password."
          });

        }


        /*
          Create JWT token.

          For a university/demo project this gives
          us a proper authentication foundation that
          we can use later for orders and customer data.
        */

        const token = jwt.sign(
          {
            user_id: user.user_id,
            email: user.email,
            role: user.role
          },

          process.env.JWT_SECRET || "chiccharm-development-secret",

          {
            expiresIn: "2h"
          }
        );


        /* Send safe user information */

        return res.json({

          message: "Login successful.",

          token: token,

          user: {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            role: user.role
          }

        });

      }
    );

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message: "Server error."
    });

  }

});

module.exports = router;