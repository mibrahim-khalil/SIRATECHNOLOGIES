const FAQ = require("../models/FAQ");
const { createSimpleCRUD } = require("../utils/crudFactory");

module.exports = createSimpleCRUD(FAQ, "FAQ");