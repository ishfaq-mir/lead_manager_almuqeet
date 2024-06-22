var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", function (req, res, next) {
  res.json({ status: "success", message: "api hitted " });
});

router.post("/", async function (req, res, next) {
  const { email, phone, name, role, password, confirmPassword, team } =
    req.body;
  if (!team) {
    throw new Error("Team is missing");
  }
  if (!email) {
    throw new Error("email is missing");
  }
  if (!phone) {
    throw new Error("phone is missing");
  }

  if (!role) {
    throw new Error("role is missing");
  }

  if (!password) {
    throw new Error("password is missing");
  }

  if (password !== confirmPassword) {
    throw new Error("your password mismatched");
  }

  try {
    const user = await prisma.users.create({
      data: {
        email,
        name,
        phone,
        password,
        role,
        team,
      },
    });

    const token = jwt.sign(email, process.env.JWT_PRIVATE_KEY);

    res.json({ status: "success", data: { ...user, token } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.patch("/", function (req, res, next) {
  res.json({ status: "success", message: "api hitted " });
});

router.post("/sign-in", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }

    if (user.password !== password) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(email, process.env.JWT_PRIVATE_KEY);
    res.json({ status: "success", data: { ...user, token } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
router.delete("/", function (req, res, next) {
  res.json({ status: "success", message: "api hitted " });
});

module.exports = router;
