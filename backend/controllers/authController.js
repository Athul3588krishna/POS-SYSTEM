const { signToken } = require("../utils/auth");

const USERS = {
  admin: {
    id: "admin",
    name: "Admin",
    email: "admin@pos.com",
    password: "admin123",
    role: "admin"
  },
  staff: {
    id: "staff",
    name: "Billing Staff",
    email: "staff@pos.com",
    password: "staff123",
    role: "staff"
  }
};

exports.register = async (req, res) => {
  res.status(403).json({
    message: "Registration is disabled. Use the assigned login credentials."
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = Object.values(USERS).find(
      (entry) => entry.email === email.toLowerCase()
    );

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is registered as ${user.role}` });
    }

    const token = signToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
