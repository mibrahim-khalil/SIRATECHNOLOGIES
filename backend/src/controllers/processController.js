const ProcessStep = require("../models/ProcessStep");
const { createSimpleCRUD } = require("../utils/crudFactory");

module.exports = createSimpleCRUD(ProcessStep, "Process step");