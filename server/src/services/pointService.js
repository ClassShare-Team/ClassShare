const db = require('../db');

exports.purchasePointPackage = async (userId, packageId) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 패키지 조회
    const {
      rows: [pkg],
    } = await client.query(`SELECT amount, bonus FROM point_packages WHERE id = $1`, [packageId]);

    if (!pkg) throw new Error('유효하지 않은 패키지입니다.');

    const totalPoint = pkg.amount + pkg.bonus;

    // 유저 포인트 업데이트
    await client.query(`UPDATE users SET point_balance = point_balance + $1 WHERE id = $2`, [
      totalPoint,
      userId,
    ]);

    // 포인트 내역 기록
    await client.query(
      `INSERT INTO point_histories (user_id, change_amount, source, detail)
       VALUES ($1, $2, '충전', $3)`,
      [userId, totalPoint, `패키지 ID: ${packageId}`]
    );

    await client.query('COMMIT');
    return { success: true, total_point: totalPoint };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// 현재 포인트 조회
exports.getCurrentPoint = async (userId) => {
  const {
    rows: [user],
  } = await db.query(`SELECT point_balance FROM users WHERE id = $1`, [userId]);

  if (!user) throw new Error('사용자를 찾을 수 없습니다.');
  return user.point_balance;
};

// 포인트 내역 조회
exports.getPointHistories = async (userId) => {
  const { rows } = await db.query(
    `SELECT id, change_amount, source, detail, created_at
       FROM point_histories
      WHERE user_id = $1
      ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

// 패키지 조회
exports.getAllPointPackages = async () => {
  const { rows } = await db.query(`
    SELECT id, name, price, amount, bonus
    FROM point_packages
    ORDER BY price ASC
  `);
  return rows;
};
