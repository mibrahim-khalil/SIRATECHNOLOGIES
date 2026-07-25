const PricingPlan = require("../models/PricingPlan");
const { success, error } = require("../utils/apiResponse");

exports.createPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.create(req.body);
    return success(res, { plan }, "Pricing plan created", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    return success(res, { plans, count: plans.length }, "Pricing plans fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1, createdAt: -1 });
    return success(res, { plans, count: plans.length }, "Pricing plans fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return error(res, "Plan not found", 404);
    return success(res, { plan }, "Plan fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return error(res, "Plan not found", 404);
    return success(res, { plan }, "Plan updated");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) return error(res, "Plan not found", 404);
    return success(res, {}, "Plan deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.togglePlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return error(res, "Plan not found", 404);

    plan.isActive = !plan.isActive;
    await plan.save();

    return success(
      res,
      { plan },
      `Plan ${plan.isActive ? "activated" : "deactivated"}`
    );
  } catch (err) {
    return error(res, err.message);
  }
};