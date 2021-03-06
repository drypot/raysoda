import * as assert2 from "../base/assert2.js";
import * as expb from "../express/express-base.js";
import * as userb from "../user/user-base.js";

expb.core.get('/api/users/:id([0-9]+)', function (req, res, done) {
  let id = parseInt(req.params.id) || 0;
  let user = res.locals.user
  userb.getCached(id, function (err, _tuser) {
    if (err) return done(err);
    let tuser = {
      id: _tuser.id,
      name: _tuser.name,
      home: _tuser.home,
      //email: _tuser.email,
      status: _tuser.status,
      cdate: _tuser.cdate,
      //adate: _tuser.adate,
      pdate: _tuser.pdate,
      profile: _tuser.profile
    };
    if (user && (user.admin || user.id === _tuser.id)) {
      tuser.email = _tuser.email;
      tuser.adate = _tuser.adate;
    }
    res.json({
      user: tuser
    });
  });
});
