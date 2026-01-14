import express from "express";
import pool from "../config/db.js";
import auth, { authorize } from "../middleware/auth.js";
import { validateRating } from "../middleware/validation.js";

const router = express.Router();

router.get("/users", auth, authorize("ADMIN"), async (req, res) => {
  try {
    const result = await pool.query(`
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
        GROUP BY u.id
        ORDER BY u.id
      `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}
);

router.post("/", auth, validateRating, async (req, res) => {
  const { store_id, rating } = req.body;

  await pool.query(
    `INSERT INTO ratings(user_id, store_id, rating)
     VALUES($1,$2,$3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating=$3`,
    [req.user.id, store_id, rating]
  );

  res.json({ message: "Rating submitted" });
});

export default router;