/* eslint-disable no-multi-assign */
const async = require("async");
const UserProductViewSchema = require("../models/UserProductViewSchema");
const Utils = require("../Utils/response");
const Message = require("../Utils/dataMessage");

const UserProductView = (module.exports = {

  // get Total and distinct user count
  getUserCount: (req, res) => {
    query = {}
    matchQuery = {
        productId: { $exists: true, $ne: true },
        userId: { $exists: true, $ne: true }
    }
    type = "month"
    if(req.body.viewType === "daily") {
      query = {$dateToString: { format: "%Y-%m-%d", date: "$viewDate" }}
      type = "date"
    } else if(req.body.viewType === "monthly") {
      query = {$month: "$viewDate" }
      type="month"
    } else if (req.body.viewType === "yearly") {
      query = {$year: "$viewDate" }
      type="Year"
    } else if (req.body.viewType === "weekly") {
      query = {$week: "$viewDate" }
      type="Week"
    } else if (req.body.viewType === "custom date") {
      query = {$dateFromString: { dateString: req.body.viewDate }}
      matchQuery.viewDate = new Date(req.body.viewDate)
      type = "selectedDate"
    }

    UserProductViewSchema.aggregate([
      {
        $match: matchQuery
      },
      {
        $project: {
          [req.body.viewType]: query,
          userId: "$userId",
          productId: "$productId",
        },
      },
      {
        $group: {
          _id: {
            month: `$${req.body.viewType}`,
            productId: "$productId",
            userId: "$userId",
          },
          totaluserCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { [type]: "$_id.month", productId: "$_id.productId" },
          totalCount: { $sum: "$totaluserCount" },
          uniqueCount: { $sum: 1 },
        },
      },
    ]).exec((error, response) => {
      if (error) {
        res.status(400).json(Utils.error(error));
      } else {
        res.status(400).json(Utils.success(response, Message.DATA_FOUND));
      }
    });
  },
});

module.exports = UserProductView;
