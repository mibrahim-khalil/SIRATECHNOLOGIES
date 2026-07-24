const Addon = require("../models/Addon");
const { createSimpleCRUD } = require("../utils/crudFactory");

module.exports = createSimpleCRUD(Addon, "Addon");