const resTojson = require("../../lib/res.json.js");

function jsonBodyParser(req, res, next) {
  const hasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  const isJson =
    req.headers["content-type"] &&
    req.headers["content-type"].includes("application/json");

  if (hasBody && isJson) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        req.body = JSON.parse(body);
        next();
      } catch (error) {
        console.error("JSON body parsing error", error);
        res
          .status(500)
          .json({ error: "Sever error during request processing" });
      }
    });
  } else {
    req.body = {};
    next();
  }
}

module.exports = jsonBodyParser;
