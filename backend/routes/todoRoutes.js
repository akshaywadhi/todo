const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth.middlware");

const {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo,
} = require("../controller/todoController");

const router = express.Router();

/*
  🔐 Protect ALL todo routes
  Every request must have a valid JWT
*/
router.use(protect);

router
  .get("/", getTodo)
  .post("/", upload.single("image"), createTodo)
  .put("/:id", upload.single("image"), updateTodo)
  .delete("/:id", deleteTodo);

module.exports = router;
