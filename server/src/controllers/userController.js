// ClassShare/server/controllers/userController.js

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');

// 마이페이지 정보 조회
exports.getMyPageInfo = async (req, res) => {
  try {
    const result = await userService.getMyPageInfo(req.user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// ✨ 마이페이지 정보 수정 (이름, 전화번호, 프로필 이미지) 컨트롤러 ✨
exports.updateMyPageInfo = async (req, res) => {
  try {
    const updates = {};
    // ⭐ 여기를 'nickname'에서 'name'으로 변경합니다. ⭐
    const { name, phone } = req.body;

    // 이름 업데이트 처리 (이제 'name' 필드를 받습니다)
    if (typeof name === 'string' && name.trim() !== '') {
      updates.name = name.trim(); // ⭐ 'updates.nickname' 대신 'updates.name'으로 저장합니다. ⭐
    }

    // 전화번호 업데이트 처리
    if (typeof phone === 'string' && phone.trim() !== '') {
      const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/; // 전화번호 형식 검증
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({ message: '전화번호 형식이 올바르지 않습니다.' });
      }
      updates.phone = phone.trim();
    }

    // 프로필 이미지 업로드 처리
    if (req.file) {
      // 기존 이미지 조회
      const user = await userService.getUserById(req.user.id);
      const prevImagePath = user.profile_image;

      // 이전 파일 존재하면 삭제 (기존 이미지 경로가 /uploads로 시작하는 경우에만 삭제)
      if (prevImagePath && prevImagePath.startsWith('/uploads/profile/')) {
        const fullPrevPath = path.join(__dirname, '../../', prevImagePath);
        if (fs.existsSync(fullPrevPath)) {
          fs.unlink(fullPrevPath, (err) => {
            if (err) console.error('이전 프로필 이미지 삭제 실패:', err);
            else console.log('이전 프로필 이미지 삭제됨:', fullPrevPath);
          });
        }
      }

      // 새 이미지 경로 저장
      updates.profile_image = `/uploads/profile/${req.file.filename}`;
    }

    // 수정할 필드가 없는 경우
    if (Object.keys(updates).length === 0) {
      // 디버깅을 위해 추가: req.body와 req.file이 어떻게 넘어오는지 확인
      console.log('No fields to update:');
      console.log('req.body:', req.body);
      console.log('req.file:', req.file);
      return res.status(400).json({ message: '수정할 필드가 없습니다.' });
    }

    // 서비스 계층을 통해 DB 업데이트
    // ⭐ userService.updateMyPageInfo 함수도 'name'을 처리하도록 수정해야 합니다! ⭐
    await userService.updateMyPageInfo(req.user.id, updates);

    // 업데이트된 사용자 정보 다시 조회하여 프론트엔드에 반환
    const updatedUser = await userService.getMyPageInfo(req.user.id);

    res.status(200).json({
      message: '회원 정보가 수정되었습니다.',
      user: updatedUser, // 업데이트된 유저 정보 반환 (name 필드가 포함되어야 함)
      profile_image_url: updates.profile_image, // 새로운 이미지 URL만 별도로 반환 (편의성)
    });
  } catch (e) {
    console.error('[회원수정 오류]', e);
    // 이름 중복 등의 에러 처리
    if (e.status === 409) {
      return res.status(409).json({ message: e.message });
    }
    res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 알림 설정 변경 (임시 구현)
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { marketing, lecture_updates, chat_messages } = req.body;

    if (
      typeof marketing !== 'boolean' ||
      typeof lecture_updates !== 'boolean' ||
      typeof chat_messages !== 'boolean'
    ) {
      return res.status(400).json({ message: '형식 오류: 모든 필드는 boolean 타입이어야 합니다.' });
    }

    console.log(
      `[알림 설정] userId=${req.user.id}, marketing=${marketing}, lecture_updates=${lecture_updates}, chat_messages=${chat_messages}`
    );

    res.status(200).json({ message: '알림 설정이 저장되었습니다.' });
  } catch (e) {
    console.error('[알림 설정 오류]', e);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 비밀번호 변경 컨트롤러 함수
exports.updatePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (
      typeof current_password !== 'string' ||
      typeof new_password !== 'string' ||
      new_password.length < 8
    ) {
      return res
        .status(400)
        .json({ code: 'INVALID_FORMAT', message: '비밀번호 형식이 올바르지 않습니다.' });
    }

    const user = await userService.getUserWithPassword(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ code: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' });
    }
    const currentHash = user.password;

    const isMatch = await bcrypt.compare(current_password, currentHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ code: 'INVALID_CURRENT_PASSWORD', message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    const isSame = await bcrypt.compare(new_password, currentHash);
    if (isSame) {
      return res
        .status(400)
        .json({ code: 'PASSWORD_UNCHANGED', message: '새 비밀번호가 기존 비밀번호와 동일합니다.' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await userService.updateUserPassword(req.user.id, newHash);

    res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
  } catch (e) {
    console.error('[비밀번호 변경 오류] 최종 에러:', e);
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
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;

    const result = await userService.getMySubscriptions(userId, page, size);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// 내가 쓴 리뷰 조회
exports.getMyReviews = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: '인증 정보가 없습니다. 다시 로그인해 주세요.',
    });
  }

  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const size = parseInt(req.query.size, 10) || 20;

  if (page < 1 || size < 1) {
    return res.status(400).json({
      message: 'page·size는 1 이상의 정수여야 합니다.',
    });
  }

  try {
    const result = await userService.getMyReviews(userId, page, size);

    if (result.reviews.length === 0) {
      return res.status(200).json({
        message: '작성한 리뷰가 없습니다.',
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[GET /users/my-reviews] error:', err);

    return res.status(500).json({
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
};

// 내가 쓴 댓글 전체 조회
exports.getMyComments = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: '인증 정보가 없습니다. 다시 로그인해 주세요.',
    });
  }
  const userId = req.user.id;

  const page = parseInt(req.query.page, 10) || 1;
  const size = parseInt(req.query.size, 10) || 20;
  if (page < 1 || size < 1) {
    return res.status(400).json({
      message: 'page·size는 1 이상의 정수여야 합니다.',
    });
  }

  try {
    const result = await userService.getMyComments(userId, page, size);

    if (result.comments.length === 0) {
      return res.status(200).json({
        message: '작성한 댓글이 없습니다.',
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[GET /users/my-comments] error:', err);
    return res.status(500).json({
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
};

// 내가 수강한 강의 조회
exports.getMyLectures = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: '인증 정보가 없습니다. 다시 로그인해 주세요.',
    });
  }
  const userId = req.user.id;

  const page = parseInt(req.query.page, 10) || 1;
  const size = parseInt(req.query.size, 10) || 20;
  if (page < 1 || size < 1) {
    return res.status(400).json({
      message: 'page·size는 1 이상의 정수여야 합니다.',
    });
  }

  try {
    const result = await userService.getMyLectures(userId, page, size);

    if (result.lectures.length === 0) {
      return res.status(200).json({
        message: '구매한 강의가 없습니다.',
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[GET /users/my-lectures] error:', err);
    return res.status(500).json({
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
};

// 회원 탈퇴 컨트롤러 함수
exports.deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증 정보가 유효하지 않습니다.' });
    }

    const userId = req.user.id;

    const deletedUser = await userService.deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.error('회원 탈퇴 중 서버 오류 발생:', error);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: '인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.' });
    }
    res.status(500).json({ message: '서버 오류로 회원 탈퇴에 실패했습니다.' });
  }
};
