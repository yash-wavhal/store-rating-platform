import express from "express";
import pool from "../config/db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { search, sort = "name", order = "asc" } = req.query;

  const values = [req.user.id];
  let searchClause = "";

  if (search) {
    values.push(`%${search}%`);
    searchClause = `
      AND (s.name ILIKE $2 OR s.address ILIKE $2)
    `;
  }

  const query = `
    SELECT
      s.id,
      s.name,
      s.address,
      COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
      ur.rating AS user_rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    LEFT JOIN ratings ur
      ON s.id = ur.store_id AND ur.user_id = $1
    WHERE 1 = 1
    ${searchClause}
    GROUP BY s.id, ur.rating
    ORDER BY
      ${sort === "rating" ? "average_rating" : "s.name"}
      ${order === "desc" ? "DESC" : "ASC"}
  `;

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export default router;