import { Request, Response } from 'express';
import { pool } from '../db';


// GET all doors
export const getDoors = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM doors');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch doors' });
  }
};

// POST unlock a door
export const unlockDoor = async (req: Request, res: Response) => {
  const { door_id } = req.body;
  const userId = req.user?.user_id;

  try {
    // Check subscription status from DB
    const userResult = await pool.query(
      'SELECT subscription_status FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!userResult.rows[0].subscription_status) {
      return res.status(403).json({ success: false, message: 'No active subscription' });
    }

    // Check if the door exists
    const doorResult = await pool.query('SELECT * FROM doors WHERE door_id = $1', [door_id]);
    if (doorResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Door not found' });
    }

    console.log(`Door ${door_id} unlocked by user ${userId}`);
    res.json({ success: true, message: `Door ${door_id} unlocked` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to unlock door' });
  }
};
