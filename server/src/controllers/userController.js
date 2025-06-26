const fs = require('fs');
const path = require('path');
const userService = require('../services/userService');

// 마이페이지 정보 조회
exports.getMyPageInfo = async (req, res) => {
  try {
    const result = await userService.getMyPageInfo(req.user.id); // authMiddleware 가 req.user 주입
    res.status(200).json(result);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 마이페이지 정보 수정 (multipart/form-data만 허용)
exports.updateMyPageInfo = async (req, res) => {
  try {
    const updates = {};
    const { nickname, phone } = req.body;

    if (typeof nickname === 'string' && nickname.trim() !== '') {
      updates.nickname = nickname.trim();
    }

    if (typeof phone === 'string' && phone.trim() !== '') {
      const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({ message: '전화번호 형식이 올바르지 않습니다.' });
      }
      updates.phone = phone.trim();
    }

    // 프로필 이미지 업로드 처리
    if (req.file) {
      // 기존 이미지 조회
      const user = await userService.getUserById(req.user.id);
      const prevPath = user.profile_image && path.join(__dirname, '../../', user.profile_image);

      // 이전 파일 존재하면 삭제
      if (prevPath && fs.existsSync(prevPath)) {
        fs.unlink(prevPath, (err) => {
          if (err) console.error('이전 프로필 삭제 실패:', err);
          else console.log('이전 프로필 삭제됨:', prevPath);
        });
      }

      // 새 이미지 경로 저장
      updates.profile_image = `/uploads/profile/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: '수정할 필드가 없습니다.' });
    }

    await userService.updateMyPageInfo(req.user.id, updates);

    res.status(200).json({ message: '회원 정보가 수정되었습니다.' });
  } catch (e) {
    console.error('[회원수정 오류]', e);
    res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};
