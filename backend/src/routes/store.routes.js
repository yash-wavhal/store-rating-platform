import express from "express";
import pool from "../config/db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { search, sort = "name", order = "asc" } = req.query;

  let values = [];
  let whereClause = "";

  if (search) {
    values.push(`%${search}%`);
    whereClause = `
      WHERE s.name ILIKE $1 OR s.address ILIKE $1
    `;
  }

  const query = `
    SELECT s.id, s.name, s.address,
    COALESCE(AVG(r.rating),0) AS rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    ${whereClause}
    GROUP BY s.id
    ORDER BY ${sort === "rating" ? "rating" : "s.name"} ${order === "desc" ? "DESC" : "ASC"}
  `;

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export default router;