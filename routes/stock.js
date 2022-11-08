const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const stockController = require("../controllers/stock");

router.get("/:ticker", stockController.getStock);
router.post("/:ticker/addComment", ensureAuth, stockController.addComment);
router.put(
  "/:ticker/likeComment/:commentID",
  ensureAuth,
  stockController.likeComment
);
router.delete(
  "/:ticker/deleteComment/:commentID",
  ensureAuth,
  stockController.deleteComment
);
module.exports = router;
