const { Router } = require("express");
const productsService = require("../services/products.service");

const router = Router();

router.get("/", async (req, res) => {
  const { page = 1 } = req.query;
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productsService.getAll(page, 10, null, null, undefined);

  const products = docs;
  res.render("productsView.handlebars", {
    products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  });
});

module.exports = router;
