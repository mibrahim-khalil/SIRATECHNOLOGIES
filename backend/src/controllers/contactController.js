const Lead = require("../models/Lead");
const sendEmail = require("../utils/sendEmail");
const { success, error } = require("../utils/apiResponse");

/**
 * @desc    Submit contact form (Public)
 * @route   POST /api/contact
 * @access  Public
 */
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, subject, message, service } = req.body;

    if (!name || !email || !message) {
      return error(res, "Name, email and message are required", 400);
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      subject,
      message,
      service,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Fire-and-forget email notification (terminal mode for now)
    sendEmail({
      to: "admin@siratechnologies.com",
      subject: `New Lead: ${subject || "Contact Form"}`,
      text: `New inquiry from ${name} (${email})\n\nMessage:\n${message}`,
    }).catch(() => {});

    return success(
      res,
      { lead: { id: lead._id } },
      "Thank you! We'll get back to you soon.",
      201
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get all leads (Admin)
 * @route   GET /api/contact
 * @access  Private (Admin)
 * @query   ?status=new&page=1&limit=20
 */
exports.getAllLeads = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { subject: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(filter),
    ]);

    const unreadCount = await Lead.countDocuments({ status: "new" });

    return success(
      res,
      {
        leads,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
        unreadCount,
      },
      "Leads fetched"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Get single lead
 * @route   GET /api/contact/:id
 * @access  Private (Admin)
 */
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return error(res, "Lead not found", 404);

    // auto mark as read
    if (lead.status === "new") {
      lead.status = "read";
      await lead.save();
    }

    return success(res, { lead }, "Lead fetched");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Update lead status
 * @route   PATCH /api/contact/:id/status
 * @access  Private (Admin)
 * @body    { status: "new"|"read"|"replied"|"archived" }
 */
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["new", "read", "replied", "archived"];
    if (!allowed.includes(status)) {
      return error(res, "Invalid status value", 400);
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!lead) return error(res, "Lead not found", 404);

    return success(res, { lead }, "Status updated");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Delete lead
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return error(res, "Lead not found", 404);

    return success(res, {}, "Lead deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * @desc    Dashboard stats (Admin)
 * @route   GET /api/contact/stats/overview
 * @access  Private (Admin)
 */
exports.getLeadStats = async (req, res) => {
  try {
    const [total, unread, replied, archived] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ status: "replied" }),
      Lead.countDocuments({ status: "archived" }),
    ]);

    return success(
      res,
      { total, unread, replied, archived },
      "Stats fetched"
    );
  } catch (err) {
    return error(res, err.message);
  }
};