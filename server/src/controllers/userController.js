const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
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

// 알림 설정 변경 (임시 구현)
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { marketing, lecture_updates, chat_messages } = req.body;

    // 모든 필드가 boolean인지 확인
    if (
      typeof marketing !== 'boolean' ||
      typeof lecture_updates !== 'boolean' ||
      typeof chat_messages !== 'boolean'
    ) {
      return res.status(400).json({ message: '형식 오류: 모든 필드는 boolean 타입이어야 합니다.' });
    }

    // TODO: 실제 DB 저장 로직은 추후 구현 예정
    console.log(
      `[알림 설정] userId=${req.user.id}, marketing=${marketing}, lecture_updates=${lecture_updates}, chat_messages=${chat_messages}`
    );

    res.status(200).json({ message: '알림 설정이 저장되었습니다.' });
  } catch (e) {
    console.error('[알림 설정 오류]', e);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // 형식 검사
    if (
      typeof current_password !== 'string' ||
      typeof new_password !== 'string' ||
      new_password.length < 8
    ) {
      return res
        .status(400)
        .json({ code: 'INVALID_FORMAT', message: '비밀번호 형식이 올바르지 않습니다.' });
    }

    // DB에서 현재 비밀번호 해시 조회
    const user = await userService.getUserWithPassword(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ code: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' });
    }
    const currentHash = user.password;

    // 현재 비밀번호 일치 확인
    const isMatch = await bcrypt.compare(current_password, currentHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ code: 'INVALID_CURRENT_PASSWORD', message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호가 기존과 동일한지 확인
    const isSame = await bcrypt.compare(new_password, currentHash);
    if (isSame) {
      return res
        .status(400)
        .json({ code: 'PASSWORD_UNCHANGED', message: '새 비밀번호가 기존 비밀번호와 동일합니다.' });
    }

    // 새 비밀번호 해시 후 저장
    const newHash = await bcrypt.hash(new_password, 10);
    await userService.updateUserPassword(req.user.id, newHash);

    res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
  } catch (e) {
    console.error('[비밀번호 변경 오류]', e);
    res.status(e.status || 500).json({ code: 'SERVER_ERROR', message: e.message || '서버 오류' });
  }
};

// 1:1 문의 등록
exports.createInquiry = async (req, res) => {
  try {
    const { title, content } = req.body;

    const inquiryId = await userService.createInquiry(req.user.id, title, content);

    res.status(201).json({
      message: '문의가 등록되었습니다.',
      inquiryId,
    });
  } catch (e) {
    console.error('[문의 등록 오류]', e);
    res
      .status(e.status || 500)
      .json({ code: e.code || 'SERVER_ERROR', message: e.message || '서버 오류' });
  }
};

// 내가 구독한 강사 보기
exports.getMySubscriptions = async (req, res, next) => {
  try {
    const userId = req.user.id; // JWT로부터 추출된 사용자 ID
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;

    const result = await userService.getMySubscriptions(userId, page, size);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

