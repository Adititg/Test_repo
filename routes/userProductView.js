const { check, validationResult } = require("express-validator/check");
const UserProductView = require("../controllers/UserProductView.ctrl");
const response = require("../Utils/response");

module.exports = (router) => {
  function methodNotAllowedHandler(req, res) {
    res.sendStatus(405);
  }

  /**
   * getUserCount
   */
  router
    .route("/getUserCount")
    .post(
      [
        check("viewType").exists().withMessage("View type is required"),
      ],
      (req, res) => {
        const typeAvailable = ['monthly', 'daily', 'yearly', 'weekly', 'custom date']
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(412).json(response.sendError(errors.array()));
        } else if(req.body.viewType === 'custom date' && !req.body.viewDate) {
          return res.status(412).json(response.sendError("Please enter viewDate"));
        } else if(typeAvailable.includes(req.body.viewType)) {
            UserProductView.getUserCount(req, res);
        } else {
          return res.status(412).json(response.sendError(`Please enter viewType in ${typeAvailable}`));
        }
      }
    )
    .all(methodNotAllowedHandler);
};
