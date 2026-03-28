import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { auth } from "../middleware/auth";

const router = Router();

const createToken = (userId: number) => {
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || "",
    surname: parts.slice(1).join(" ") || "-",
  };
};

const validateEmail = (email: string): boolean => email.includes("@");

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Salasanan tulee olla vähintään 8 merkkiä";
  if (!/[A-Z]/.test(password)) return "Salasanassa tulee olla vähintään yksi iso kirjain";
  if (!/[0-9]/.test(password)) return "Salasanassa tulee olla vähintään yksi numero";
  return null;
};

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Täytä kaikki kentät" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({ message: "Sähköpostissa tulee olla @-merkki" });
    }

    const passwordError = validatePassword(String(password));
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Salasanat eivät täsmää" });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Sähköposti on jo käytössä" });
    }

    const { first_name, surname } = splitName(String(name));
    const passwordHash = await bcrypt.hash(String(password), 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, surname, email, subscription_status, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, surname, email, subscription_status`,
      [first_name, surname, cleanEmail, false, passwordHash]
    );

    const user = result.rows[0];
    const token = createToken(user.id);

    return res.status(201).json({ message: "Käyttäjä luotu", token, user });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Rekisteröinti epäonnistui" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Täytä sähköposti ja salasana" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (!cleanEmail.includes("@")) {
      return res.status(400).json({ message: "Sähköpostissa tulee olla @-merkki" });
    }

    const result = await pool.query(
      "SELECT id, first_name, surname, email, password_hash, subscription_status FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Virheellinen kirjautuminen" });
    }

    const userRow = result.rows[0];
    const storedPassword = userRow.password_hash as string;

    let passwordIsValid = false;

    const isBcryptHash =
      storedPassword.startsWith("$2a$") ||
      storedPassword.startsWith("$2b$") ||
      storedPassword.startsWith("$2y$");

    if (isBcryptHash) {
      passwordIsValid = await bcrypt.compare(String(password), storedPassword);
    } else {
      passwordIsValid = String(password) === storedPassword;

      if (passwordIsValid) {
        const newHash = await bcrypt.hash(String(password), 10);
        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
          newHash,
          userRow.id,
        ]);
      }
    }

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Virheellinen kirjautuminen" });
    }

    const token = createToken(userRow.id);

    return res.json({
      message: "Kirjautuminen onnistui",
      token,
      user: {
        id: userRow.id,
        first_name: userRow.first_name,
        surname: userRow.surname,
        email: userRow.email,
        subscription_status: userRow.subscription_status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Kirjautuminen epäonnistui" });
  }
});

router.get("/me", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;

    const result = await pool.query(
      `SELECT id, first_name, surname, email, subscription_status
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Käyttäjää ei löytynyt" });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Käyttäjän haku epäonnistui" });
  }
});

export default router;