const express = require('express');

const { client } = require('../database/index');
const { ObjectId } = require('bson');
const db = client.db('minton');

const router = express.Router();

router.get('/', async (req, res) => { // 커뮤니티 리스트 겟요청
  const communityData = await db.collection('community').find({}).toArray();
  res.json({
    flag: true,
    message: '성공적으로 데이터를 가져왔습니다.',
    communityData: communityData
  });
});
router.patch('/', async (req, res) => {
  try {
    const like = req.body.like;
    const id = req.body.id
    console.log(req.body);
    await db.collection('community').updateOne({
      // 여기서 뭘 해야 하나 습..내일하자
      _id: id
    }, {
      $set: { like: like }
    })
    res.send('조하효')
  } catch (err) {
    console.error(err);
  }
})

router.post('/communityInsert', async (req, res) => { // 커뮤니티 글 등록
  const { id, title, content, imagePath, like} = req.body;
  console.log(id, title, content);
  // JS Object 형태
  try {
    await db.collection('community').insertOne({
      id ,
      title ,
      content ,
      imagePath,
      like
    });
    res.send('데이터 저장 완료');
  } catch (err) {
    console.error(err);
  }
});

router.get('/communityComment', async (req, res) => { // 댓글 겟요청
  try {
    const comments = await db.collection('communityComment').find({}).toArray();
    res.json({
      flag: true,
      message: '성공적으로 데이터를 가져왔습니다.',
      comments: comments
    });
  } catch (err) {
    console.error(err);
  };
})

router.post('/communityComment', async( req, res ) => { // 댓글 등록
  console.log(req.body);
  console.log(req.user);
  const { addComment, postId } = req.body;
  try {
    await db.collection('communityComment').insertOne({
      commentPostId: postId,
      addComment,
      userId: req.user.userId
    });
    res.send('댓글입력 완료');
  } catch (err) {
    console.error(err);
  }
})





module.exports = router;