const db = require('../db');

exports.purchasePointPackage = async (userId, packageId) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. 패키지 조회
    const {
      rows: [pkg],
    } = await client.query(`SELECT amount, bonus FROM point_packages WHERE id = $1`, [packageId]);

    if (!pkg) throw new Error('유효하지 않은 패키지입니다.');

    const totalPoint = pkg.amount + pkg.bonus;

    // 2. 유저 포인트 업데이트
    await client.query(`UPDATE users SET point_balance = point_balance + $1 WHERE id = $2`, [
      totalPoint,
      userId,
    ]);

    // 3. 포인트 내역 기록
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
