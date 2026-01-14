import express from "express";
import pool from "../config/db.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

/*
  STORE OWNER DASHBOARD
  - Average rating of store
  - Users who rated the store
*/
router.get("/dashboard", auth, role("STORE_OWNER"), async (req, res) => {
  try {
    // Get store owned by logged-in owner
    const storeResult = await pool.query(
      "SELECT id, name FROM stores WHERE owner_id = $1",
      [req.user.id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found for this owner" });
    }

    const storeId = storeResult.rows[0].id;

    // Average rating
    const avgResult = await pool.query(
      "SELECT COALESCE(AVG(rating),0) AS average_rating FROM ratings WHERE store_id = $1",
      [storeId]
    );

    // Users who submitted ratings
    const usersResult = await pool.query(
      `
      SELECT u.id, u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      `,
      [storeId]
    );

    res.json({
      store: storeResult.rows[0],
      averageRating: avgResult.rows[0].average_rating,
      ratedUsers: usersResult.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;