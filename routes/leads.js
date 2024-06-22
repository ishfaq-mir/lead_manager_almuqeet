var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const authMiddleWare = async function (req, res, next) {
  try {
    const bearer = req.headers["authorization"];
    if (!bearer) {
      throw new Error("Authentication Token Is Missing");
    }
    const token = bearer.split(" ")[1];

    const email = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (email !== user.email) {
      throw new Error(`UnAuthenticated`);
    }
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: error.message });
  }
};

router.get("/", authMiddleWare, async function (req, res, next) {
  try {
    const allLeads = await prisma.leads.findMany();
    res.json({
      status: "success",
      data: allLeads,
    });
  } catch (error) {
    res.status(401).json({ status: "error", message: error.message });
  }
});
router.post("/", authMiddleWare, async function (req, res, next) {
  try {
    const { customerName, companyName, country, phone, asignedToUser } =
      req.body;

    const cutomerIp = req.ip;
    if (!customerName) {
      throw new Error("customer name missing");
    }

    if (!companyName) {
      throw new Error("company name missing");
    }

    if (!country) {
      throw new Error("country missing");
    }

    if (!phone) {
      throw new Error("phone missing");
    }

    if (!asignedToUser) {
      console.log("helel");
      throw new Error("user assingment missing");
    }

    console.log("asingend", asignedToUser);
    const leads = await prisma.leads.create({
      data: {
        customerName,
        companyName,
        country,
        phone: `${phone}`,
        asignedToUser,
        cutomerIp,
      },
    });
    res.json({ status: "success", message: "lead created successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
router.patch("/", function (req, res, next) {
  res.json({ status: "success", message: "get su" });
});
router.delete("/", function (req, res, next) {
  res.json({ status: "success", message: "get su" });
});

module.exports = router;
