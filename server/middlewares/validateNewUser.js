const validateNewUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Name, Email and Password are required");
    return res.status(400).json({
      error: "Name, Email and Password are reqired!",
    });
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 character long." });
  }

  next();
};

module.exports = validateNewUser;
