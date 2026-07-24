const { success, error } = require("./apiResponse");

/**
 * Factory that generates a full CRUD controller for a Mongoose model
 * without image handling. Perfect for FAQ, Addon, ProcessStep.
 */
function createSimpleCRUD(Model, modelName = "Item") {
  return {
    getAll: async (req, res) => {
      try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;

        const items = await Model.find(filter).sort({ order: 1, createdAt: -1 });
        return success(res, { items, count: items.length }, `${modelName}s fetched`);
      } catch (err) {
        return error(res, err.message);
      }
    },

    getActive: async (req, res) => {
      try {
        const filter = { isActive: true };
        if (req.query.category) filter.category = req.query.category;

        const items = await Model.find(filter).sort({ order: 1, createdAt: -1 });
        return success(res, { items, count: items.length }, `${modelName}s fetched`);
      } catch (err) {
        return error(res, err.message);
      }
    },

    getOne: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return error(res, `${modelName} not found`, 404);
        return success(res, { item }, `${modelName} fetched`);
      } catch (err) {
        return error(res, err.message);
      }
    },

    create: async (req, res) => {
      try {
        const item = await Model.create(req.body);
        return success(res, { item }, `${modelName} created`, 201);
      } catch (err) {
        return error(res, err.message);
      }
    },

    update: async (req, res) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) return error(res, `${modelName} not found`, 404);
        return success(res, { item }, `${modelName} updated`);
      } catch (err) {
        return error(res, err.message);
      }
    },

    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return error(res, `${modelName} not found`, 404);
        return success(res, {}, `${modelName} deleted`);
      } catch (err) {
        return error(res, err.message);
      }
    },

    toggle: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) return error(res, `${modelName} not found`, 404);
        item.isActive = !item.isActive;
        await item.save();
        return success(
          res,
          { item },
          `${modelName} ${item.isActive ? "activated" : "deactivated"}`
        );
      } catch (err) {
        return error(res, err.message);
      }
    },
  };
}

module.exports = { createSimpleCRUD };