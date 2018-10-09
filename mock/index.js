const Mockjs = require('mockjs');

function getUser(req, res, u) {
  res.send({
    id: 1,
    username: 'kenny',
    sex: 6
  });
}

function loginAccount(req, res, u) {
  const { password, username } = req.body;
  if (password === '888888' && username === 'admin') {
    return res.json({
      status: 'ok',
      code: 0,
      data: req.body
    });
  } else {
    return res.json({
      status: 'error',
      code: 403
    });
  }
}

function delUser(req, res, u) {
	console.log('delUser req', req.params);
  res.send({ status: 'ok', message: '删除成功！', text:'text' });
}

function getListData(req, res, u) {
  const MockData = Mockjs.mock({
    "code": 0,
    "message": "success",
    "data": {
      "list|0-10": [
        {
          "infoId": "@id()",
          "title": "整租 东沙各庄村委会 1室0厅1卫",
          "picUrl": "//pic4.58cdn.com.cn/mobile/big/n_v1bkuymc6ygbnvthtjc5uq.jpg",
          "desc": "公寓·9㎡·朝南",
          "price|500-5000": 5000
        }
      ]
    }
  });
  return res.json(MockData);
}

const proxy = {
  'GET /api/user': getUser,
  'POST /api/login': loginAccount,
  'GET /api/list': getListData,
  'GET /api/deluser/:id': delUser
}
module.exports = proxy;