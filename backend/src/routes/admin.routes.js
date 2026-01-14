import express from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import { validateSignup } from "../middleware/validation.js";

const router = express.Router();
router.use(auth, role("ADMIN"));

router.get("/dashboard", async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const stores = await pool.query("SELECT COUNT(*) FROM stores");
  const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

  res.json({
    users: users.rows[0].count,
    stores: stores.rows[0].count,
    ratings: ratings.rows[0].count,
  });
});

router.post("/users", validateSignup, async (req, res) => {
  const { name, email, address, password, role: userRole } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,address,password,role)
     VALUES($1,$2,$3,$4,$5) RETURNING id,email,role`,
    [name, email, address, hashed, userRole]
  );

  res.json(result.rows[0]);
});

router.post("/stores", async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  const result = await pool.query(
    `INSERT INTO stores(name,email,address,owner_id)
     VALUES($1,$2,$3,$4) RETURNING *`,
    [name, email, address, owner_id]
  );

  res.json(result.rows[0]);
});

/* Get Users with Filters & Sorting */
// router.get("/users", async (req, res) => {
//   const { name, email, address, role: userRole, sort = "name", order = "asc" } = req.query;

//   let conditions = [];
//   let values = [];

//   if (name) {
//     values.push(`%${name}%`);
//     conditions.push(`name ILIKE $${values.length}`);
//   }

//   if (email) {
//     values.push(`%${email}%`);
//     conditions.push(`email ILIKE $${values.length}`);
//   }

//   if (address) {
//     values.push(`%${address}%`);
//     conditions.push(`address ILIKE $${values.length}`);
//   }

//   if (userRole) {
//     values.push(userRole);
//     conditions.push(`role = $${values.length}`);
//   }

//   const whereClause = conditions.length
//     ? `WHERE ${conditions.join(" AND ")}`
//     : "";

//   const query = `
//     SELECT id, name, email, address, role
//     FROM users
//     ${whereClause}
//     ORDER BY ${sort} ${order === "desc" ? "DESC" : "ASC"}
//   `;

//   const result = await pool.query(query, values);
//   res.json(result.rows);
// });

router.get("/users", async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sort = "name",
      order = "asc",
    } = req.query;

    const allowedSort = ["name", "email", "role"];
    const sortBy = allowedSort.includes(sort) ? sort : "name";
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    let conditions = [];
    let values = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`u.name ILIKE $${values.length}`);
    }

    if (email) {
      values.push(`%${email}%`);
      conditions.push(`u.email ILIKE $${values.length}`);
    }

    if (address) {
      values.push(`%${address}%`);
      conditions.push(`u.address ILIKE $${values.length}`);
    }

    if (role) {
      values.push(role);
      conditions.push(`u.role = $${values.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        COALESCE(AVG(r.rating), 0) AS rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY u.id
      ORDER BY ${sortBy} ${sortOrder}
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


/* Get Stores with Filters & Sorting */
router.get("/stores", async (req, res) => {
  const { name, email, address, sort = "name", order = "asc" } = req.query;

  let conditions = [];
  let values = [];

  if (name) {
    values.push(`%${name}%`);
    conditions.push(`s.name ILIKE $${values.length}`);
  }

  if (email) {
    values.push(`%${email}%`);
    conditions.push(`s.email ILIKE $${values.length}`);
  }

  if (address) {
    values.push(`%${address}%`);
    conditions.push(`s.address ILIKE $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const query = `
    SELECT s.id, s.name, s.email, s.address,
    COALESCE(AVG(r.rating),0) AS rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    ${whereClause}
    GROUP BY s.id
    ORDER BY ${sort} ${order === "desc" ? "DESC" : "ASC"}
  `;

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export default router;