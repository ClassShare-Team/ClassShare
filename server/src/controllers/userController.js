const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bcrypt = require('bcrypt');
const userService = require('../services/userService');

// 마이페이지 정보 조회
exports.getMyPageInfo = async (req, res) => {
  try {
    const result = await userService.getMyPageInfo(req.user.id);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
  }
};

// 마이페이지 정보 수정 (multipart/form-data만 허용)
exports.updateMyPageInfo = async (req, res) => {
  try {
    const updates = {};
    const { nickname, phone } = req.body;

    // 닉네임
    if (typeof nickname === 'string' && nickname.trim() !== '') {
      updates.nickname = nickname.trim();
    }

    // 전화번호
    if (typeof phone === 'string' && phone.trim() !== '') {
      const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({ message: '전화번호 형식이 올바르지 않습니다.' });
      }
      updates.phone = phone.trim();
    }

    // 프로필 이미지 S3
    if (req.file) {
      // 이전 이미지 S3 객체 삭제

      const user = await userService.getUserById(req.user.id);
      if (user.profile_image?.includes(process.env.AWS_S3_BUCKET)) {
        const Key = user.profile_image.split(`/${process.env.AWS_S3_BUCKET}/`)[1];
        if (Key) {
          s3.deleteObject(
            { Bucket: process.env.AWS_S3_BUCKET, Key },
            (err) => err && console.error('이전 S3 객체 삭제 실패:', err)
          );
        }
      }

      // 새 이미지 URL 저장 (multer-s3가 주입하는 location)
      updates.profile_image = req.file.location;
    }

    // 변경사항 없는 경우
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: '수정할 필드가 없습니다.' });
    }

    await userService.updateMyPageInfo(req.user.id, updates);
    return res.status(200).json({ message: '회원 정보가 수정되었습니다.' });
  } catch (e) {
    console.error('[회원수정 오류]', e);
    return res.status(e.status || 500).json({ message: e.message || '서버 오류' });
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

// 비밀번호 변경
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

// 강사 설명 수정
exports.updateInstructorIntroduction = async (req, res) => {
  const userId = req.user.id;
  const { introduction } = req.body;

  // null, 빈 값 모두 허용 → 그대로 저장
  const updated = await userService.updateInstructorIntroduction(userId, introduction);

  if (!updated) {
    return res.status(404).json({ message: '강사 프로필 없음' });
  }

  res.json({ introduction: updated });
};

exports.deleteMyAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await userService.deleteUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[회원 탈퇴 실패]', error);
    return res.status(500).json({
      message: '회원 탈퇴 실패',
      error: error.message || String(error),
    });
  }
};
