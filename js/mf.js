var __extends = this && this.__extends || function() {
  var n = Object.setPrototypeOf || {
    __proto__: []
  }
  instanceof Array && function(t, e) {
    t.__proto__ = e
  } || function(t, e) {
    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
  };
  return function(t, e) {
    function i() {
      this.constructor = t
    }
    n(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i)
  }
}();
! function(h) {
  var t = function() {
    function t() {
      this.listeners = {}
    }
    return t.prototype.dispatchEvent = function(t) {
      var e, i;
      if (t instanceof a ? (i = t.type, e = t) : e = new a(i = t), null != this.listeners[i]) {
        e.currentTarget = this;
        for (var n = 0; n < this.listeners[i].length; n++) {
          var s = this.listeners[i][n];
          try {
            s.handler(e)
          } catch (t) {
            window.console && console.error(t.stack)
          }
        }
      }
    }, t.prototype.addEventListener = function(t, e, i) {
      void 0 === i && (i = 0), null == this.listeners[t] && (this.listeners[t] = []), this.listeners[t].push(new n(t, e, i)), this.listeners[t].sort(function(t, e) {
        return e.priolity - t.priolity
      })
    }, t.prototype.removeEventListener = function(t, e) {
      if (this.hasEventListener(t, e))
        for (var i = 0; i < this.listeners[t].length; i++) {
          var n = this.listeners[t][i];
          if (n.equalCurrentListener(t, e)) return n.handler = null, void this.listeners[t].splice(i, 1)
        }
    }, t.prototype.clearEventListener = function() {
      this.listeners = {}
    }, t.prototype.containEventListener = function(t) {
      return null != this.listeners[t] && 0 < this.listeners[t].length
    }, t.prototype.hasEventListener = function(t, e) {
      if (null == this.listeners[t]) return !1;
      for (var i = 0; i < this.listeners[t].length; i++) {
        if (this.listeners[t][i].equalCurrentListener(t, e)) return !0
      }
      return !1
    }, t
  }();
  h.EventDispatcher = t;
  var n = function() {
      function t(t, e, i) {
        void 0 === t && (t = null), void 0 === e && (e = null), void 0 === i && (i = 0), this.type = t, this.handler = e, this.priolity = i
      }
      return t.prototype.equalCurrentListener = function(t, e) {
        return this.type == t && this.handler == e
      }, t
    }(),
    a = function(t, e) {
      void 0 === t && (t = null), void 0 === e && (e = null), this.type = t, this.data = e
    };
  h.Event = a;
  var e = function(n) {
    function t(t, e) {
      var i = n.call(this) || this;
      return i._loadData = t, i._id = e, i
    }
    return __extends(t, n), t.prototype.execute = function() {}, t.prototype.cancel = function() {}, t.prototype._setData = function(t) {
      this._loadData && (this._loadData[this._id] = t)
    }, t.prototype._dispatchComplete = function() {
      this.dispatchEvent(new s(s.COMPLETE))
    }, t.prototype._dispatchFailed = function() {
      this.dispatchEvent(new s(s.FAILED))
    }, t.prototype._dispatchProgress = function(t) {
      var e = new s(s.PROGRESS);
      e.progress = t, this.dispatchEvent(e)
    }, t
  }(t);
  h.CommandBase = e;
  var s = function(e) {
    function t(t) {
      return e.call(this, t) || this
    }
    return __extends(t, e), t.COMPLETE = "update", t.FAILED = "failed", t.PROGRESS = "progress", t
  }(a);
  h.CommandEvent = s;
  var i = function(i) {
    function t(t) {
      var e = i.call(this, t) || this;
      return e._rates = [], e._sum = 0, e._commands = [], e._now = 0, e._total = 0, e._loaded = !1, e
    }
    return __extends(t, i), t.prototype.execute = function() {
      this._loaded = !1, this._now = this._compRate = 0, this._execute()
    }, t.prototype.cancel = function() {
      if (!(this._total <= this._now)) {
        var t = this._commands[this._now];
        this._removeEvents(t), t.cancel()
      }
    }, t.prototype.add = function(t, e) {
      void 0 === e && (e = 1), this._commands[this._total] = t, this._rates[this._total] = e, this._sum += e, this._total++
    }, t.prototype._execute = function() {
      if (this._now < this._total) {
        this._nowRate = this._rates[this._now] / this._sum;
        var e = this;
        this.__tmp_complete = function(t) {
          e._complete(t)
        }, this.__tmp_progress = function(t) {
          e._progress(t)
        }, this.__tmp_failed = function(t) {
          e._failed(t)
        };
        var t = this._commands[this._now];
        t.addEventListener(s.COMPLETE, this.__tmp_complete), t.addEventListener(s.PROGRESS, this.__tmp_progress), t.addEventListener(s.FAILED, this.__tmp_failed), t.execute()
      } else this._loaded = !0, this._dispatchComplete()
    }, t.prototype._removeEvents = function(t) {
      this.__tmp_complete && (t.removeEventListener(s.COMPLETE, this.__tmp_complete), t.removeEventListener(s.PROGRESS, this.__tmp_progress), t.removeEventListener(s.FAILED, this.__tmp_failed))
    }, t.prototype._completeCommand = function(t, e) {}, t.prototype._complete = function(t) {
      var e = this._commands[this._now];
      this._removeEvents(e), this._compRate += this._nowRate, this._dispatchProgress(this._compRate), this._completeCommand(e, this._now), this._now++, this._execute()
    }, t.prototype._progress = function(t) {
      this._dispatchProgress(this._compRate + t.progress * this._nowRate)
    }, t.prototype._failed = function(t) {
      var e = this._commands[this._now];
      this._removeEvents(e), this._dispatchFailed()
    }, Object.defineProperty(t.prototype, "loaded", {
      get: function() {
        return this._loaded
      },
      enumerable: !0,
      configurable: !0
    }), t
  }(e);
  h.SequentialCommand = i;
  var o = function() {
    function t(t) {
      this._core = t, this._loadData = t.loadData, this._nowId = -1
    }
    return t.prototype.play = function(t) {
      if (void 0 === t && (t = -1), !h.Context._rec && this._core.config.sound && this._nowId != t) {
        var e, i = this._loadData,
          n = .5,
          s = 1.5;
        switch (this._nowId) {
          case h.DataId.BGM_MAP:
            s = .1;
            break;
          case h.DataId.BGM_BATTLE:
        }
        switch (t) {
          case h.DataId.BGM_MAP:
            break;
          case h.DataId.BGM_BATTLE:
            n = .42
        }
        i[this._nowId] && (e = i[this._nowId], TweenLite.killTweensOf(e), TweenLite.to(e, s, {
          volume: 0,
          ease: Power2.easeOut
        }), TweenLite.delayedCall(s, e.stop)), i[t] && ((e = i[t]).play(0, !0, null, 0, 0), TweenLite.to(e, 1.5, {
          volume: n,
          ease: Power2.easeIn
        })), this._nowId = t
      }
    }, t
  }();
  h.BGMManager = o;
  var r = function() {
    function t(t) {
      this._core = t, this._loadData = t.loadData, this._nowId = -1
    }
    return t.prototype.play = function(t, e, i) {
      if (void 0 === t && (t = -1), void 0 === e && (e = 0), void 0 === i && (i = 1), this._core.config.sound) {
        var n = this._loadData,
          s = .8;
        switch (t) {
          case h.SoundId.DRAIN:
            s *= 2;
            break;
          case h.SoundId.HEAL:
          case h.SoundId.VANISHING:
            s *= 1.6;
            break;
          case h.SoundId.QTE0:
          case h.SoundId.QTE1:
            s *= 1.3;
            break;
          case h.SoundId.MAGICK:
          case h.SoundId.HEALUP:
          case h.SoundId.DRAINUP:
          case h.SoundId.METEOR_IN:
          case h.SoundId.ICE:
          case h.SoundId.SHOOT:
            s *= 1.2;
            break;
          case h.SoundId.TURN:
          case h.SoundId.THUNDER:
            s *= 1.1;
            break;
          case h.SoundId.VOLTEX_EXP:
          case h.SoundId.CRYSIS_IN:
            s *= .9;
            break;
          case h.SoundId.BOMB_EXP:
          case h.SoundId.TAIL_HIT:
          case h.SoundId.ULTIMA_IN:
          case h.SoundId.ULTIMA_EXP:
          case h.SoundId.ULTRANOVA:
          case h.SoundId.BOSS_FLASH:
          case h.SoundId.BOSS_DEATH:
          case h.SoundId.BATTLE:
          case h.SoundId.MUGIWARA:
            s *= .8;
            break;
          case h.SoundId.VOLTEX_IN:
          case h.SoundId.BOSS_SHOW:
          case h.SoundId.FLAME:
            s *= .7
        }
        if (s *= i, n[t]) {
          var a = n[t],
            o = function() {
              a.play(0, !1, null, 0, s)
            };
          0 < e ? TweenLite.delayedCall(e, o) : o()
        }
        this._nowId = t
      }
    }, t.prototype.stop = function() {
      if (this._core.config.sound) {
        var t = this._loadData;
        if (t[this._nowId]) t[this._nowId].stop();
        this._nowId = -1
      }
    }, t
  }();
  h.SEManager = r;
  var c = function() {
    function e() {}
    return e.toRad = function(t) {
      return t * e._toRadCer
    }, e.toDeg = function(t) {
      return t * e._toDegCer
    }, e.abs = function(t) {
      return t < 0 ? -t : t
    }, e.rand = function(t, e) {
      return Math.random() * (e - t) + t
    }, e.randInt = function(t, e) {
      return Math.floor(Math.random() * (e + 1 - t) + t)
    }, e._toRadCer = Math.PI / 180, e._toDegCer = 180 / Math.PI, e
  }();
  h.MathUtil = c;
  var _ = function() {
    function l() {}
    return l.intersect = function(t, e, i, n, s, a, o, h) {
      return ((t - i) * (a - e) + (e - n) * (t - s)) * ((t - i) * (h - e) + (e - n) * (t - o))
    }, l.triContainsPos = function(t, e, i, n, s, a, o, h) {
      return (t - s) * (e - n) != (t - i) * (e - a) && (!(l.intersect(t, e, i, n, o, h, s, a) < 0) && (!(l.intersect(t, e, s, a, o, h, i, n) < 0) && !(l.intersect(i, n, s, a, o, h, t, e) < 0)))
    }, l.boxContainsPos = function(t, e, i, n, s, a, o, h, r, c, _) {
      if (void 0 === _ && (_ = -1), _ < 0 && (_ = l.checkBump(t, e, i, n, s, a, o, h)), 1 == _ || 3 == _) {
        if (l.triContainsPos(t, e, s, a, i, n, r, c)) return !0;
        if (l.triContainsPos(t, e, s, a, o, h, r, c)) return !0
      } else if (2 == _ || 4 == _) {
        if (l.triContainsPos(i, n, o, h, t, e, r, c)) return !0;
        if (l.triContainsPos(i, n, o, h, s, a, r, c)) return !0
      } else {
        if (l.triContainsPos(t, e, i, n, s, a, r, c)) return !0;
        if (l.triContainsPos(t, e, s, a, o, h, r, c)) return !0
      }
      return !1
    }, l.circleContainsPos = function(t, e, i, n, s) {
      var a = n - t,
        o = s - e;
      return !(i * i < a * a + o * o)
    }, l.calcTriArea = function(t, e, i, n, s, a) {
      return .5 * c.abs((i - t) * (a - e) - (n - e) * (s - t))
    }, l.calcBoxArea = function(t, e, i, n, s, a, o, h, r) {
      void 0 === r && (r = -1);
      var c = 0;
      return r < 0 && (r = l.checkBump(t, e, i, n, s, a, o, h)), 1 == r || 3 == r ? (c += l.calcTriArea(t, e, s, a, i, n), c += l.calcTriArea(t, e, s, a, o, h)) : 2 == r || 4 == r ? (c += l.calcTriArea(i, n, o, h, t, e), c += l.calcTriArea(i, n, o, h, s, a)) : (c += l.calcTriArea(t, e, i, n, s, a), c += l.calcTriArea(t, e, s, a, o, h)), c
    }, l.checkBump = function(t, e, i, n, s, a, o, h) {
      return l.triContainsPos(i, n, s, a, o, h, t, e) ? 1 : l.triContainsPos(s, a, o, h, t, e, i, n) ? 2 : l.triContainsPos(o, h, t, e, i, n, s, a) ? 3 : l.triContainsPos(t, e, i, n, s, a, o, h) ? 4 : 0
    }, l.intersectLineSegment = function(t, e, i, n, s, a, o, h) {
      return l.intersect(t, e, i, n, s, a, o, h) < 0 && l.intersect(s, a, o, h, t, e, i, n) < 0
    }, l.getCrossPoint = function(t, e, i, n, s, a) {
      var o = n - e,
        h = t - i,
        r = (o * s + h * a + ((e - n) * t + (i - t) * e)) / (o * o + h * h);
      return new d(s - r * o, a - r * h)
    }, l.getClossPoint2 = function(t, e, i, n) {
      var s = .5 * ((n.x - i.x) * (t.y - i.y) - (n.y - i.y) * (t.x - i.x)),
        a = .5 * ((n.x - i.x) * (i.y - e.y) - (n.y - i.y) * (i.x - e.x)),
        o = new d;
      return o.x = t.x + (e.x - t.x) * (s / (s + a)), o.y = t.y + (e.y - t.y) * (s / (s + a)), o
    }, l.getVecter3DFromBox = function(t, e, i, n, s, a, o, h, r, c) {
      void 0 === r && (r = 0), void 0 === c && (c = -1), c < 0 && (c = l.checkBump(t, e, i, n, s, a, o, h));
      var _ = [];
      return 1 == c || 3 == c ? (_[0] = new p(i, n, r), _[1] = new p(s, a, r), _[2] = new p(o, h, r), _[3] = new p(t, e, r)) : (_[0] = new p(t, e, r), _[1] = new p(i, n, r), _[2] = new p(s, a, r), _[3] = new p(o, h, r)), _
    }, l
  }();
  h.MathExtUtil = _;
  var l = function() {
    function t() {}
    return t.getColor = function(t) {
      for (var e = t.toString(16), i = e.length, n = 0; n < 6 - i; n++) e = "0" + e;
      return "#" + e
    }, t.keta = function(t, e, i) {
      void 0 === i && (i = " ");
      for (var n = t + "", s = n.length; s < e; s++) n = i + n;
      return n
    }, t
  }();
  h.StringUtil = l;
  var p = function() {
    function t(t, e, i) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), this.x = t, this.y = e, this.z = i
    }
    return t.prototype.set = function(t, e, i) {
      return void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), this.x = t, this.y = e, this.z = i, this
    }, t.prototype.clone = function() {
      return new t(this.x, this.y, this.z)
    }, t
  }();
  h.Vector3D = p;
  var d = function() {
    function t(t, e) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), this.x = t, this.y = e
    }
    return t.prototype.set = function(t, e) {
      return void 0 === t && (t = 0), void 0 === e && (e = 0), this.x = t, this.y = e, this
    }, t.prototype.clone = function() {
      return new t(this.x, this.y)
    }, t
  }();
  h.Point = d
}(nnf || (nnf = {}));
var nnf, WebFontConfig = {
  custom: {
    families: ["Noto Sans SC"]
  },
  active: function() {
    nnf.active()
  },
  inactive: function() {}
};
! function(t) {
  var e = t.createElement("script"),
    i = t.scripts[0];
  e.src = "https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.26/webfontloader.js", i.parentNode.insertBefore(e, i)
}(document),
function(a) {
  a.active = function() {
    var t = new a.MainController;
    TweenLite.delayedCall(.3, function() {
      t.init()
    })
  };
  var o = function() {
    function t() {}
    return t.ok = aidn.util.webgl, t.isMobile = aidn.util.checkMobile(), t.isIOS = aidn.util.checkiOS(), t.isHomeScreen = !1, t.query = aidn.util.getQuery(), t.pcTouchEnabled = "ontouchstart" in window && !aidn.util.checkMobile(), t.delta = 0, t.time = 0, t._obj = {}, t._a = null, t._skip = 0, t._url = "http://aidn.jp/mf/", t._hashtag = "MikuMikuFantasy", t.useDummy = aidn.util.useDummyDiv(), t
  }();
  a.Context = o;
  var i = function(t) {
    this.main = t, this.loadData = new a.LoadData, this.game = new _, this.config = new c
  };
  a.CoreManager = i;
  var n = function() {
    function t() {}
    return t.init = function() {
      o.isMobile && (t.START = "touchstart", t.MOVE = "touchmove", t.END = "touchend")
    }, t.START = "mousedown", t.MOVE = "mousemove", t.END = "mouseup", t.TOUCH_START = "touchstart", t.TOUCH_MOVE = "touchmove", t.TOUCH_END = "touchend", t
  }();
  a.EventName = n;
  var h, t, e, s = function() {
    function e() {}
    return e.getString = function(t) {
      return e._names[t]
    }, e.LOW = 0, e.MEDIUM = 1, e.HIGH = 2, e.len = 3, e._names = ["Low", "Medium", "High"], e
  }();
  a.Quality = s, (t = h = a.SceneId || (a.SceneId = {}))[t.TOP = 0] = "TOP", t[t.LOADING = 1] = "LOADING", t[t.INPUT_NAME = 2] = "INPUT_NAME", t[t.START = 3] = "START", t[t.START_CRYSTAL = 4] = "START_CRYSTAL", t[t.BATTLE_START = 5] = "BATTLE_START", t[t.BATTLE_UPDATE = 6] = "BATTLE_UPDATE", t[t.BATTLE_MY_TURN = 7] = "BATTLE_MY_TURN", t[t.BATTLE_ENEMY_TURN = 8] = "BATTLE_ENEMY_TURN", t[t.BATTLE_END = 9] = "BATTLE_END", t[t.END = 10] = "END", (e = a.CustomId || (a.CustomId = {}))[e.CRYSTAL_MOVE_COMP = 0] = "CRYSTAL_MOVE_COMP", e[e.CRYSTAL_SHOW_BOSS = 1] = "CRYSTAL_SHOW_BOSS", e[e.CRYSTAL_BOSS_SERIF = 2] = "CRYSTAL_BOSS_SERIF";
  var r = function(n) {
    function t(t, e) {
      var i = n.call(this, t) || this;
      return i.id = e, i
    }
    return __extends(t, n), t.CUSTOM = "custom", t
  }(a.Event);
  a.CustomEvent = r;
  var c = function() {
      function t() {
        this._age = 31536e3, this._ageS = 86400;
        var t = aidn.util.getCookie("name");
        this.name = null != t ? t : "", this.quality = s.HIGH, null != (t = aidn.util.getCookie("sound")) ? this.sound = 1 == Number(t) : aidn.util.webaudio ? this.sound = !0 : this.sound = !1;
        t = aidn.util.getCookie("japanese");
        this.japanese = null != t ? 1 == Number(t) : aidn.util.checkJapanese();
        t = aidn.util.getCookie("home");
        this.home = null == t || 1 == Number(t)
      }
      return t.prototype.setName = function(t) {
        aidn.util.setCookie("name", t, this._age), this.name = t
      }, t.prototype.setSound = function(t) {
        aidn.util.setCookie("sound", t ? 1 : 0, this._age), this.sound = t
      }, t.prototype.setJapanese = function(t) {
        aidn.util.setCookie("japanese", t ? 1 : 0, this._age), this.japanese = t
      }, t.prototype.setHome = function(t) {
        aidn.util.setCookie("home", t ? 1 : 0, this._ageS), this.home = t
      }, t.prototype.updateViewMaxRank = function() {
        var t = aidn.util.getCookie("rank");
        if (null != t) {
          t = parseInt(t);
          var e = this.getRankText(t, !1);
          null != e && ($("#rank").css("display", "inline"), $("#rank .jp").text("MAX " + e), $("#rank .en").text("MAX " + this.getRankText(t, !0)), aidn.util.setCookie("rank", t, this._age))
        }
      }, t.prototype.getRankText = function(t, e) {
        void 0 === e && (e = !1);
        var i = ["RANK S (神ミクさん)", "RANK A (伝説のミクさん)", "RANK B (一人前ミクさん)", "RANK C (半人前ミクさん)", "RANK D (見習いミクさん)", "RANK E (ただのミクさん)", "RANK X (耐え忍ぶミクさん)"];
        return t < 0 || i.length < t ? null : e ? ["RANK S (初 音 之 神)", "RANK A (初 音 传 奇)", "RANK B (初 音 完 全 体)", "RANK C (半 伤 亡 的 初 音)", "RANK D (学 徒 初 音)", "RANK E (普 通 初 音)", "RANK X (坚 持 的 初 音)"][t] : i[t]
      }, t.prototype.setMaxRank = function(t) {
        var e = aidn.util.getCookie("rank");
        null != e ? t < (e = parseInt(e)) && aidn.util.setCookie("rank", t, this._age) : aidn.util.setCookie("rank", t, this._age)
      }, t.prototype.updateViewWin = function() {}, t.prototype.addWin = function() {}, t
    }(),
    _ = function() {
      var t, e;
      for (this.skillList = [], this.skillSpecialList = [], this.skillEnemyList = [], this.paradigm = !1, this.status = new l, this.statusBoss = (new l).initBoss(), e = I.length, t = 0; t < e; t++) {
        var i = new f(I[t]);
        this.skillList[i.id] = i
      }
      for (e = P.length, t = 0; t < e; t++) {
        var n = new y(P[t]);
        this.skillSpecialList[n.id] = n
      }
      for (e = C.length, t = 0; t < e; t++) {
        var s = new v(C[t]);
        this.skillEnemyList[s.id] = s
      }
    },
    l = function() {
      function t() {
        this.SKILS = [], this.SPECIALS = [], this.isGurad = !1, this.states = [], this._nowGage = 0
      }
      return t.prototype.initName = function(t) {
        for (var e = "ミク" == (this.NAME = t) || "MIKU" == t, i = 0, n = t.length, s = 0; s < n; s++) i += t.charCodeAt(s) * (Math.pow(s, 3) + 1.12) * 123.789;
        var a = new MersenneTwister(i),
          o = [],
          h = 0;
        for (s = 0; s < 9; s++) switch (o[s] = a.next(), s) {
          case 0:
            h += .8 * o[s];
            break;
          case 1:
          case 2:
            h += .6 * o[s];
            break;
          case 3:
            h += 1.2 * o[s];
            break;
          case 5:
            h += 1.5 * o[s];
            break;
          case 4:
            h += 1.3 * o[s];
            break;
          case 6:
            h += 1.4 * o[s];
            break;
          default:
            h += .7 * o[s]
        }
        return h /= 9, this.MAX_HP = 4900 + Math.floor(4e3 * o[0]), this.MAX_MP = 330 + Math.floor(440 * o[1]), this.MAX_SP = 13 + Math.floor(17 * o[2]), this.ATK = 400 + Math.floor(230 * o[3]), this.DEF = 300 + Math.floor(240 * o[4]), this.MAT = 400 + Math.floor(230 * o[5]), this.MDF = 300 + Math.floor(240 * o[6]), this.SPD = 320 + Math.floor(270 * o[7]), this.LUK = 320 + Math.floor(270 * o[8]), this.LV = 27 + Math.floor(69 * h), 99 < this.LV && (this.LV = 99), this._initSkill(a), this._initSpecial(a), e && (this.LV = 67, this.MAX_HP = 7539, this.MAX_MP = 679, this.MAX_SP = 22, this.ATK = 512, this.DEF = 483, this.MAT = 505, this.MDF = 411, this.SPD = 537, this.LUK = 477, this.SKILS = [m.HEAL, m.POWER, m.BOMB, m.TAIL], this.SPECIALS = [T.METEOR, T.FULLPOWER, T.NYALTIME]), this.init(), this
      }, t.prototype._initSkill = function(t) {
        this.SKILS = [];
        var e = [m.HEAL, m.DRAIN_HP],
          i = Math.floor(e.length * t.next());
        this.SKILS.push(e.splice(i, 1)[0]);
        var n = [m.POWER, m.DRAIN_MP, m.MOFU_HEAT, m.BOMB, m.VOLTEX, m.APPLE];
        t.next() < .4 && n.push(m.TAIL), t.next() < .05 && n.push(e[0]);
        for (var s = 0; s < 3; s++) {
          i = Math.floor(n.length * t.next());
          this.SKILS.push(n.splice(i, 1)[0])
        }
        this.SKILS.sort(function(t, e) {
          return t - e
        })
      }, t.prototype._initSpecial = function(t) {
        this.SPECIALS = [];
        var e = [T.METEOR, T.CRYSIS, T.MUGIWARA];
        t.next() < .4 ? this.SPECIALS.push(T.FULLPOWER) : e.push(T.FULLPOWER);
        for (var i = 2 - this.SPECIALS.length, n = 0; n < i; n++) {
          var s = Math.floor(e.length * t.next());
          this.SPECIALS.push(e.splice(s, 1)[0])
        }
        this.SPECIALS.sort(function(t, e) {
          return t - e
        }), this.SPECIALS.push(T.NYALTIME)
      }, t.prototype.initBoss = function() {
        return this.NAME = "BOSS", this.LV = 299, this.MAX_HP = 449750, this.MAX_MP = 97820, this.MAX_SP = 0, this.HP = this.MAX_HP, this.MP = this.MAX_MP, this.SP = 0, this.ATK = 479, this.DEF = 333, this.MAT = 512, this.MDF = 333, this.SPD = 333, this.LUK = 123, this
      }, t.prototype.init = function() {
        this.HP = this._HP = this.MAX_HP, this.MP = this._MP = this.MAX_MP, this.SP = 0, this.turn = 0, this.states = [], this.resetGage()
      }, t.prototype.addTurn = function() {
        this.turn++;
        for (var t = this.states.length, e = 0; e < t; e++) {
          var i = this.states[e];
          i.turn--, i.turn <= 0 && (this.states.splice(e, 1), e--, t--)
        }
      }, t.prototype.getATK = function() {
        return this._calcState(this.ATK, "atk")
      }, t.prototype.getDEF = function() {
        return this._calcState(this.DEF, "def")
      }, t.prototype.getMAT = function() {
        return this._calcState(this.MAT, "mat")
      }, t.prototype.getMDF = function() {
        return this._calcState(this.MDF, "mdf")
      }, t.prototype.getSPD = function() {
        return this._calcState(this.SPD, "spd")
      }, t.prototype.getLUK = function() {
        return this._calcState(this.LUK, "luk")
      }, t.prototype._calcState = function(t, e) {
        void 0 === e && (e = "atk");
        for (var i = 0, n = this.states.length, s = 0; s < n; s++) i += t * this.states[s][e];
        return t + i
      }, t.prototype.getHPRate = function() {
        return this.HP / this.MAX_HP
      }, t.prototype.resetGage = function(t) {
        void 0 === t && (t = 0), t < 0 ? t = 0 : 1 < t && (t = 1), this._nowGage = t
      }, t.prototype.updateGage = function() {
        return this._nowGage += (this.getSPD() + 1e3) / 1600 * o.delta, 1 < this._nowGage && (this._nowGage = 1), this._nowGage
      }, t
    }(),
    p = function() {
      function t(t, e) {
        this.type = t, this.id = e
      }
      return t.prototype.init = function(t, e, i, n, s, a, o) {
        return void 0 === e && (e = 0), void 0 === i && (i = 0), void 0 === n && (n = 0), void 0 === s && (s = 0), void 0 === a && (a = 0), void 0 === o && (o = 0), this.turn = t, this.atk = e, this.def = i, this.mat = n, this.mdf = s, this.spd = a, this.luk = o, this
      }, t
    }();
  a.StatusStateData = p;
  var d = function(e) {
    function t() {
      var t = e.call(this) || this;
      return t._clock = new THREE.Clock, t._updates = {}, t.__keyCount = 0, n.init(), t._core = new i(t), o._skip = parseInt(o.query.skip), o._rec = 1 == parseInt(o.query.rec), o._server = aidn.init.basepath, o.isHomeScreen = !1, window.navigator.standalone || aidn.util.checkiOS(!1) && aidn.util.checkSafari() && t._core.config.home && (t._core.config.setHome(!1), o.isHomeScreen = !0), o.stw = aidn.window.width(), o.sth = aidn.window.height(), o.se = new a.SEManager(t._core), o.bgm = new a.BGMManager(t._core), t._initAudioCmd = new a.InitAudioLoadCommand(t._core.loadData), t._initCmd = new a.InitLoadCommand(t._core.loadData), a.PrimUtil.init(t._core), PIXI.utils._saidHello = !0, TweenLite.delayedCall(.8, function() {
        var t = "Welcome to MikuMiku Fantasy (=ﾟｰﾟ)";
        0 <= navigator.userAgent.toLowerCase().indexOf("chrome") ? console.log("%c" + t, "font-size:1.0em;color:#fff;background:#000;padding:20px;line-height:120px") : console.log(t)
      }), t
    }
    return __extends(t, e), t.prototype.init = function() {
      this._initView(), this._initManager(), this._initConfig(), this.playScene(h.TOP, .3)
    }, t.prototype.playScene = function(t, e) {
      void 0 === e && (e = 0);
      var i = 1e3 * e;
      switch (t) {
        case h.TOP:
          this._core.config.updateViewWin(), this._core.config.updateViewMaxRank(), this._core.game.paradigm = !1, $("#scene_top,#bt_back").stop().delay(i).fadeIn(200, "linear"), $("#scene_main,#cover_main").stop().fadeOut(0, "linear"), o.bgm.play(-1), aidn.adv.show();
          break;
        case h.LOADING:
          $("#scene_top").stop().fadeOut(200, "linear"), $("#scene_loading").stop().delay(i).fadeIn(200, "linear"), aidn.adv.hide();
          break;
        case h.INPUT_NAME:
          if ($("#scene_loading").stop().fadeOut(200, "linear"), $("#cover_main").stop().fadeIn(0, "linear"), $("#scene_main").stop().delay(i).fadeIn(200, "linear"), o._skip) {
            o.query.name && $("#input_name").val(decodeURI(o.query.name));
            var n = this;
            TweenLite.delayedCall(.3, function() {
              n._clickOk(null)
            })
          }
          break;
        case h.START:
          break;
        case h.START_CRYSTAL:
          $("#bt_back").stop().fadeOut(200, "linear")
      }
      n = this;
      var s = function() {
        n._core.sceneId = t, n._three.playScene(t), n._pixi.playScene(t), n._resize()
      };
      0 < e ? TweenLite.delayedCall(e, s) : s()
    }, t.prototype.dispatchCustomEvent = function(t) {
      var e = new r(r.CUSTOM, t);
      this.dispatchEvent(e)
    }, t.prototype.addUpdate = function(t) {
      t.__key || (t.__key = "key_" + this.__keyCount, this.__keyCount++), this._updates[t.__key] = t
    }, t.prototype.removeUpdate = function(t) {
      t.__key && delete this._updates[t.__key]
    }, t.prototype._initView = function() {
      aidn.util.needExpandArea(!0);
      var i = o._url;
      $("#bt_tw").click(function(t) {
        var e = document.title;
        aidn.social.shareTw(i, !0, e, "daniwell_aidn", o._hashtag)
      }), $("#bt_fb").click(function(t) {
        aidn.social.shareFb(i, !0)
      }), $("#bt_gp").click(function(t) {
        aidn.social.shareGp(i, !0)
      });
      var e = this;
      $("#bt_play a").click(function(t) {
        e._clickPlay(t)
      }), $("#bt_config a").click(function(t) {
        e._clickConfig(t)
      }), $("#bt_about a").click(function(t) {
        e._clickAbout(t)
      }), $("#bt_close,#cover").click(function(t) {
        e._clickClose(t)
      }), $("#bt_back").click(function(t) {
        e._clickBack(t)
      }), $("#about_in .title,#about_in .desc,#config_in .title,#alert").click(function(t) {
        e._clickClose(t)
      }), $("#bt_ok").click(function(t) {
        e._clickOk(t)
      }), $("#loading").fadeOut(300), this._setInputName();
      var t = navigator.userAgent;
      (0 <= t.indexOf("iPhone") || 0 <= t.indexOf("iPod")) && aidn.util.checkSafari() && aidn.util.useDummyDiv() && ($("#input_name").focusin(function(t) {
        $("#scene_main").css("top", "25%")
      }), $("#input_name").focusout(function(t) {
        $("#scene_main").css("top", "50%")
      })), aidn.util.enabledFullscreen() ? aidn.util.checkAndroid() && ($("#input_name").focusin(function(t) {
        aidn.util.checkFullscreen() && $("#scene_main").css("top", "25%")
      }), $("#input_name").focusout(function(t) {
        $("#scene_main").css("top", "50%")
      })) : $(".full").css("display", "none"), o.ok ? $(".ok").css("display", "block") : $("#ng").css("display", "block")
    }, t.prototype._initManager = function() {
      var t = this;
      o.ok && (this._core.three = this._three = new a.ThreeManager(this._core), this._three.init(), this._core.pixi = this._pixi = new a.PixiManager(this._core), this._pixi.init(), aidn.window.resize(function() {
        return t._resize()
      }), this._update())
    }, t.prototype._initConfig = function() {
      var e = this;
      $("#bt_display").click(function(t) {
        e._clickDisplay(t)
      }), $("#bt_sound").click(function(t) {
        e._clickSound(t)
      }), $("#bt_language").click(function(t) {
        e._clickLanguage(t)
      }), this._clickSound(null), this._clickLanguage(null)
    }, t.prototype._play = function() {
      $("#scene_loading .bar").css("width", 0), this.playScene(h.LOADING);
      var t = this;
      this._core.config.sound && !this._initAudioCmd.loaded ? (this._initAudioCmd.addEventListener(a.CommandEvent.COMPLETE, function() {
        t._audioLoadComplete()
      }), this._initAudioCmd.execute()) : this._audioLoadComplete()
    }, t.prototype._setInputName = function() {
      $("#input_name").val(this._core.config.name), "" == this._core.config.name && (this._core.config.japanese ? $("#input_name").val("ミク") : $("#input_name").val("MIKU"))
    }, t.prototype._clickPlay = function(t) {
      t.preventDefault(), this._play()
    }, t.prototype._clickConfig = function(t) {
      t.preventDefault(), $("#config").stop().fadeIn(200, "linear"), $("#cover").stop().fadeIn(200, "linear")
    }, t.prototype._clickAbout = function(t) {
      t.preventDefault(), $("#about").stop().fadeIn(200, "linear"), $("#cover").stop().fadeIn(200, "linear")
    }, t.prototype._openAlert = function(t, e) {
      $("#alert").stop().fadeIn(200, "linear"), $("#cover").stop().fadeIn(200, "linear"), $("#alert_in .jp").text(t), $("#alert_in .en").text(e)
    }, t.prototype._clickDisplay = function(t) {
      t.preventDefault(), aidn.util.checkFullscreen() ? $("#bt_display a").text("正常") : $("#bt_display a").text("全屏"), aidn.util.fullscreen(), this._clickClose(null);
      var e = this;
      TweenLite.delayedCall(.5, function() {
        e._resize()
      })
    }, t.prototype._clickSound = function(t) {
      t && (t.preventDefault(), this._core.config.setSound(!this._core.config.sound));
      var e = "关";
      this._core.config.sound && (e = "开"), $("#bt_sound a").text(e)
    }, t.prototype._clickLanguage = function(t) {
      t && (t.preventDefault(), this._core.config.setJapanese(!this._core.config.japanese));
      var e = "English (partly)";
      this._core.config.japanese && (e = "Japanese"), $("#bt_language a").text(e), this._core.config.japanese ? ($(".jp").css("display", "block"), $(".en").css("display", "none")) : ($(".jp").css("display", "none"), $(".en").css("display", "block")), this._setInputName(), this._core.pixi && this._core.pixi.changeLanguage()
    }, t.prototype._clickClose = function(t) {
      $("#about").stop().fadeOut(200, "linear"), $("#config").stop().fadeOut(200, "linear"), $("#alert").stop().fadeOut(200, "linear"), $("#cover").stop().fadeOut(200, "linear")
    }, t.prototype._clickBack = function(t) {
      switch (this._core.sceneId) {
        case h.TOP:
        case h.LOADING:
          location.href = "../contents/";
          break;
        default:
          this._core.main.playScene(h.TOP, 0)
      }
    }, t.prototype._clickOk = function(t) {
      t && t.preventDefault();
      var e = $("#input_name").val(),
        i = e.split(/[a-zA-Z0-9\u3041-\u3096\u30a1-\u30f6_ー～\-\. ]/).join("");
      if (e.length <= 0) this._openAlert("１文字以上入力してください。", "Enter at least 1 character.");
      else if (0 < i.length) this._openAlert("'" + i + "' は使用できない文字です。", "'" + i + "' may not be used.");
      else if (e = e.substr(0, 15), $("#scene_main,#cover_main").stop().fadeOut(200, "linear"), this._core.config.setName(e), this._core.game.status.initName(e), this.playScene(h.START, .3), o.bgm.play(a.DataId.BGM_MAP), !aidn.util.webaudio) {
        var n = new aidn.AutoAudio(null);
        n.load(["../../shared/sound/blank.mp3"]), o._a = n
      }
    }, t.prototype._loadProgress = function(t) {
      $("#scene_loading .bar").css("width", Math.round(100 * t) + "%")
    }, t.prototype._loadComplete = function() {
      this.playScene(h.INPUT_NAME, .3)
    }, t.prototype._audioLoadComplete = function() {
      var e = this;
      this._initCmd.loaded ? this._loadComplete() : (this._initCmd.addEventListener(a.CommandEvent.COMPLETE, function() {
        e._loadComplete()
      }), this._initCmd.addEventListener(a.CommandEvent.PROGRESS, function(t) {
        e._loadProgress(t.progress)
      }), this._initCmd.execute())
    }, t.prototype._resize = function(t) {
      void 0 === t && (t = 0), o.stw = aidn.window.width() + t, o.sth = aidn.window.height() + t, this._three && (this._three.resize(), 0 == t && this._pixi.resize()), aidn.util.checkFullscreen() ? $("#bt_display a").text("全屏") : $("#bt_display a").text("正常")
    }, t.prototype._update = function() {
      var t = this;
      for (var e in o.delta = this._clock.getDelta(), o.time = this._clock.elapsedTime, this._three.update(), this._pixi.update(), this._updates) this._updates[e].update();
      window.requestAnimationFrame(function() {
        return t._update()
      })
    }, t
  }(a.EventDispatcher);
  a.MainController = d;
  var u = function() {
      function t(t) {
        this.id = t.id, this.name = t.name, this.nameEn = t.nameEn
      }
      return t.prototype._initDispName = function(t, e, i) {
        var n, s;
        void 0 === e && (e = !0), void 0 === i && (i = 15), n = e ? "MP." + a.StringUtil.keta(t, 2) : "SP." + t, s = i - this.name.length, this.dispName = this.name + a.StringUtil.keta(n, s), s = i + 5 - this.nameEn.length, this.dispNameEn = this.nameEn + a.StringUtil.keta(n, s)
      }, t
    }(),
    f = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e.desc = t.desc, e.descEn = t.descEn, e.mp = t.mp, e._initDispName(e.mp, !0), e
      }
      return __extends(t, i), t
    }(a.SkillBase = u);
  a.SkillData = f;
  var y = function(i) {
    function t(t) {
      var e = i.call(this, t) || this;
      return e.desc = t.desc, e.descEn = t.descEn, e.sp = t.sp, e._initDispName(e.sp, !1), e
    }
    return __extends(t, i), t
  }(u);
  a.SkillSpecialData = y;
  var v = function(s) {
    function t(t) {
      var e, i, n = s.call(this, t) || this;
      if (n.hps = [], n.turns = [], n.count = 0, n.countLimit = 0, n.rate = t.rate, n.mp = t.mp, 0 < t.countLimit && (n.countLimit = t.countLimit), t.hps)
        for (i = t.hps.length, e = 0; e < i; e++) n.hps[e] = new M(t.hps[e]);
      if (t.turns)
        for (i = t.turns.length, e = 0; e < i; e++) n.turns[e] = new E(t.turns[e]);
      return n
    }
    return __extends(t, s), t.prototype.getRate = function(t, e) {
      if (void 0 === t && (t = 1), void 0 === e && (e = 0), 0 < this.countLimit && this.countLimit <= this.count) return 0;
      var i, n, s = this.rate;
      for (n = this.hps.length, i = 0; i < n; i++) {
        var a = this.hps[i];
        t <= a.hp && (s = a.rate)
      }
      return s
    }, t
  }(u);
  a.SkillEnemyData = v;
  var m, g, T, S, w, x, M = function(t) {
      this.hp = t.hp, this.rate = t.rate
    },
    E = function(t) {
      this.turn = t.turn, this.rate = t.rate
    };
  (g = m = a.XSkillId || (a.XSkillId = {}))[g.HEAL = 0] = "HEAL", g[g.POWER = 1] = "POWER", g[g.DRAIN_MP = 2] = "DRAIN_MP", g[g.DRAIN_HP = 3] = "DRAIN_HP", g[g.MOFU_HEAT = 4] = "MOFU_HEAT", g[g.BOMB = 5] = "BOMB", g[g.VOLTEX = 6] = "VOLTEX", g[g.APPLE = 7] = "APPLE", g[g.TAIL = 8] = "TAIL", (S = T = a.XSpecialId || (a.XSpecialId = {}))[S.METEOR = 0] = "METEOR", S[S.CRYSIS = 1] = "CRYSIS", S[S.FULLPOWER = 2] = "FULLPOWER", S[S.NYALTIME = 3] = "NYALTIME", S[S.MUGIWARA = 4] = "MUGIWARA", (x = w = a.XBossSkillId || (a.XBossSkillId = {}))[x.SHOOT = 0] = "SHOOT", x[x.HEAL = 1] = "HEAL", x[x.FLAME = 2] = "FLAME", x[x.ICE = 3] = "ICE", x[x.THUNDER = 4] = "THUNDER", x[x.FLARE_STAR = 5] = "FLARE_STAR", x[x.HELLBOUND = 6] = "HELLBOUND", x[x.ULTIMA = 7] = "ULTIMA", x[x.VANISHING = 8] = "VANISHING", x[x.ULTRANOVA = 9] = "ULTRANOVA", x[x.PARADIGM = 10] = "PARADIGM", x[x.PHANTOM = 11] = "PHANTOM", x[x.SSTAR = 12] = "SSTAR", x[x.PMETEOR = 13] = "PMETEOR", x[x.MEGA_FLARE = 14] = "MEGA_FLARE";
  var I = [{
      id: m.HEAL,
      name: "グリーンヒール",
      desc: "自身のHPを回復します",
      nameEn: "绿 之 回 复",
      descEn: "恢 复 自 己 的 血 量",
      mp: 11
    }, {
      id: m.POWER,
      name: "アリシンパワー",
      desc: "自身の全ステータスを一時的に強化します",
      nameEn: "大 蒜 能 量",
      descEn: "暂 时 将 所 有 状 态 提 升",
      mp: 25
    }, {
      id: m.DRAIN_MP,
      name: "ミクミクドレイン",
      desc: "敵のMPを吸収します",
      nameEn: "初 音 初 音 魔 力 吸 收",
      descEn: "从 一 位 敌 人 上 获 取 一 些 魔 力",
      mp: 5
    }, {
      id: m.DRAIN_HP,
      name: "エナジードレイン",
      desc: "敵のHPを吸収します",
      nameEn: "HP 大 抓 取",
      descEn: "从 一 位 敌 人 上 获 取 一 些 血 量",
      mp: 15
    }, {
      id: m.MOFU_HEAT,
      name: "ヒートアップ",
      desc: "防御力がダウンする代わり、攻撃力が大幅アップします",
      nameEn: "热 力 攻 击",
      descEn: "攻 击 大 幅 提 升 并 防 御 下 降",
      mp: 17
    }, {
      id: m.BOMB,
      name: "ミックスボム",
      desc: "敵に大ダメージを与えます",
      nameEn: "初 音 炸 弹",
      descEn: "对 一 个 敌 人 造 成 大 量 伤 害",
      mp: 15
    }, {
      id: m.VOLTEX,
      name: "ネギボルテックス",
      desc: "敵に特大ダメージを与えます",
      nameEn: "大 葱 漩 涡",
      descEn: "对 一 个 敌 人 造 成 巨 大 伤 害",
      mp: 20
    }, {
      id: m.APPLE,
      name: "ハードボイス",
      desc: "残りHPが少ないほど大ダメージを与えます",
      nameEn: "音 量 风 暴",
      descEn: "只 要 血 越 低 ， 伤 害 就 越 高",
      mp: 21
    }, {
      id: m.TAIL,
      name: "ブルーシューター",
      desc: "敵に連続ダメージを与えます",
      nameEn: "蓝 色 射 手",
      descEn: "持 续 对 一 个 敌 人 造 成 伤 害",
      mp: 24
    }],
    P = [{
      id: T.METEOR,
      name: "ネギメテオ",
      desc: "敵に連続大ダメージを与えます",
      nameEn: "大 葱 流 星",
      descEn: "持 续 对 一 个 敌 人 造 成 大 量 伤 害",
      sp: 3
    }, {
      id: T.CRYSIS,
      name: "ミクドクライシス",
      desc: "敵に超大ダメージを与えます",
      nameEn: "初 音 危 机",
      descEn: "对 一 个 敌 人 造 成 巨 大 伤 害",
      sp: 2
    }, {
      id: T.FULLPOWER,
      name: "葱超活性",
      desc: "自身の全ステータスを一時的に超強化します",
      nameEn: "超 能 大 葱",
      descEn: "将 所 有 状 态 显 著 提 升",
      sp: 2
    }, {
      id: T.NYALTIME,
      name: "葱・アルテマ",
      desc: "敵全体に究極ダメージを与えます",
      nameEn: "满 级 大 葱",
      descEn: "对 所 有 敌 人 造 成 终 极 伤 害",
      sp: 7
    }, {
      id: T.MUGIWARA,
      name: "アブソーブオール",
      desc: "敵のHPとMPを吸収します",
      nameEn: "暴 力 吸 收",
      descEn: "对 一 个 敌 人 造 成 大 量 伤 害 并 消 耗 血 量 和 魔 力",
      sp: 3
    }],
    C = [{
      id: w.SHOOT,
      name: "シュート",
      nameEn: "射 击",
      rate: .65,
      mp: 0,
      hps: [{
        hp: .7,
        rate: .32
      }, {
        hp: .5,
        rate: .11
      }, {
        hp: .4,
        rate: .05
      }, {
        hp: .3,
        rate: 0
      }]
    }, {
      id: w.HEAL,
      name: "カオスヒール",
      nameEn: "混 沌 之 力",
      rate: 0,
      mp: 22,
      hps: [{
        hp: .6,
        rate: .1
      }, {
        hp: .3,
        rate: .2
      }, {
        hp: .1,
        rate: .4
      }, {
        hp: .05,
        rate: .6
      }]
    }, {
      id: w.FLAME,
      name: "フレイム",
      nameEn: "火 焰",
      rate: .5,
      mp: 27,
      hps: [{
        hp: .7,
        rate: .35
      }, {
        hp: .5,
        rate: .15
      }, {
        hp: .2,
        rate: .07
      }, {
        hp: .1,
        rate: .02
      }]
    }, {
      id: w.ICE,
      name: "アイスロック",
      nameEn: "冰 球",
      rate: .5,
      mp: 26,
      hps: [{
        hp: .7,
        rate: .35
      }, {
        hp: .5,
        rate: .15
      }, {
        hp: .2,
        rate: .07
      }, {
        hp: .1,
        rate: .02
      }]
    }, {
      id: w.THUNDER,
      name: "サンダーボルト",
      nameEn: "雷击",
      rate: .5,
      mp: 28,
      hps: [{
        hp: .7,
        rate: .35
      }, {
        hp: .5,
        rate: .2
      }, {
        hp: .2,
        rate: .1
      }, {
        hp: .1,
        rate: .02
      }]
    }, {
      id: w.FLARE_STAR,
      name: "フレアスター",
      nameEn: "耀 斑 之 星",
      rate: .15,
      mp: 39,
      hps: [{
        hp: .8,
        rate: .3
      }, {
        hp: .5,
        rate: .35
      }, {
        hp: .25,
        rate: .45
      }, {
        hp: .1,
        rate: 0
      }]
    }, {
      id: w.HELLBOUND,
      name: "ヘルバウンド",
      nameEn: "地 狱 归 来",
      rate: .1,
      mp: 66,
      hps: [{
        hp: .6,
        rate: .3
      }, {
        hp: .2,
        rate: .2
      }]
    }, {
      id: w.ULTIMA,
      name: "アルテマ",
      nameEn: "终 极 之 力",
      rate: 0,
      mp: 96,
      hps: [{
        hp: .5,
        rate: .1
      }, {
        hp: .35,
        rate: .3
      }, {
        hp: .25,
        rate: .5
      }, {
        hp: .15,
        rate: .6
      }, {
        hp: .1,
        rate: .65
      }, {
        hp: .05,
        rate: .75
      }]
    }, {
      id: w.VANISHING,
      name: "バニッシングライト",
      nameEn: "消 逝 之 光",
      rate: .1,
      mp: 49,
      hps: [{
        hp: .7,
        rate: .25
      }, {
        hp: .4,
        rate: .1
      }]
    }, {
      id: w.ULTRANOVA,
      name: "ウルトラノヴァ",
      nameEn: "超 新 星",
      rate: 0,
      mp: 299,
      hps: [{
        hp: .4,
        rate: .1
      }, {
        hp: .3,
        rate: .75
      }, {
        hp: .2,
        rate: .25
      }]
    }, {
      id: w.PARADIGM,
      name: "パラダイムシフト",
      nameEn: "范 式 转 变",
      rate: 0,
      mp: 0,
      countLimit: 1,
      hps: [{
        hp: .5,
        rate: .5
      }, {
        hp: .4,
        rate: 4
      }, {
        hp: .3,
        rate: 6
      }, {
        hp: .2,
        rate: 10
      }]
    }, {
      id: w.PHANTOM,
      name: "ファントムペイン",
      nameEn: "幻 痛",
      rate: 0,
      mp: 62,
      hps: [{
        hp: .8,
        rate: .11
      }, {
        hp: .5,
        rate: .22
      }]
    }, {
      id: w.SSTAR,
      name: "シューティングスター",
      nameEn: "流 星",
      rate: .05,
      mp: 78,
      hps: [{
        hp: .7,
        rate: .25
      }, {
        hp: .2,
        rate: .35
      }]
    }, {
      id: w.PMETEOR,
      name: "プチメテオ",
      nameEn: "小 陨 石",
      rate: .15,
      mp: 41,
      hps: [{
        hp: .7,
        rate: .3
      }, {
        hp: .2,
        rate: .05
      }]
    }, {
      id: w.MEGA_FLARE,
      name: "メガフレア",
      nameEn: "巨 耀 闪 焰",
      rate: 0,
      mp: 80,
      hps: [{
        hp: .7,
        rate: .1
      }, {
        hp: .5,
        rate: .25
      }, {
        hp: .25,
        rate: .35
      }, {
        hp: .1,
        rate: .45
      }]
    }]
}(nnf || (nnf = {})),
function(S) {
  var s, t, e = function() {
    function t(t) {
      this._core = t
    }
    return t.prototype.init = function() {
      this._renderer = new THREE.WebGLRenderer({
        alpha: !0
      }), this._renderer.setClearColor(0);
      var t = 1;
      1 < window.devicePixelRatio && (t = 2), this._renderer.setPixelRatio(t), $("#view_3d").append(this._renderer.domElement), this._scene = new THREE.Scene, this._camera = new THREE.PerspectiveCamera(70, S.Context.stw / S.Context.sth), this._cameraMng = new C(this._core, this._camera);
      var e = new THREE.AmbientLight(2236962);
      this._scene.add(e);
      var i = new THREE.DirectionalLight(14540253);
      i.position.set(1, 1, 1).normalize(), this._scene.add(i), this._cameraTarget = new h(this._core), this._cameraTarget.init(new THREE.Object3D), this._targetCenter = new THREE.Object3D, this._scene.add(this._targetCenter), this._effectMng = new a(this._renderer, this._scene, this._camera), this._topMng = new o(this._core), this._nyanco = new c(this._core, this._renderer);
      var n = this;
      this._core.main.addEventListener(S.CustomEvent.CUSTOM, function(t) {
        n._customEvent(t)
      })
    }, t.prototype.changeQuality = function(t) {
      var e = 1;
      t == S.Quality.LOW && (e = .5), t == S.Quality.MEDIUM && (e = 1), t == S.Quality.HIGH && (e = 2), e = Math.min(e, window.devicePixelRatio), this._renderer.setPixelRatio(e)
    }, t.prototype.resize = function() {
      this._cameraMng.resize();
      var t = this._renderer.getSize();
      t.width == S.Context.stw && t.height == S.Context.sth || this._renderer.setSize(S.Context.stw, S.Context.sth), this._effectMng.resize(), this._battle && this._battle.resize()
    }, t.prototype.playScene = function(t) {
      switch (t) {
        case S.SceneId.TOP:
          this._topMng.show(), this._floor && this._floor.hide();
          break;
        case S.SceneId.LOADING:
          this._topMng.hide();
          break;
        case S.SceneId.INPUT_NAME:
          if (!this._floor) {
            this._floor = new l(100, 100, this._scene, this._core), this._nyanco.init(this._scene), this._effectMng.setHelper(this._nyanco.helper);
            var e = this;
            this._core.pixi.ui.addEventListener(S.PadEvent.UPDATE, function(t) {
              e._padMove(t)
            })
          }
          this._floor.show();
          break;
        case S.SceneId.START:
          break;
        case S.SceneId.START_CRYSTAL:
          this._boss || (this._boss = new _(this._core), this._boss.init(this._scene));
          break;
        case S.SceneId.BATTLE_START:
          this._battle || (this._battle = new S.ThreeBattleManager(this._core)), this._floor.hide()
      }
      this._boss && this._boss.playScene(t), this._battle && this._battle.playScene(t), this._nyanco.playScene(t), this._cameraMng.playScene(t)
    }, t.prototype.update = function() {
      switch (this._nyanco.update(), this._cameraMng.update(), this._core.sceneId) {
        case S.SceneId.TOP:
          break;
        case S.SceneId.START:
          this._floor.update(), this._floor.hitTest(this._nyanco);
          break;
        case S.SceneId.START_CRYSTAL:
          this._floor.update();
          break;
        case S.SceneId.BATTLE_START:
      }
      this._boss && this._boss.update(), this._battle && this._battle.update(), this._effectMng.render()
    }, t.prototype._padMove = function(t) {
      switch (t.mode) {
        case S.PadEventMode.MOVE:
          this._nyanco.padMove(t);
          break;
        case S.PadEventMode.ROTATE:
          this._cameraMng.padMove(t)
      }
    }, t.prototype._customEvent = function(t) {
      switch (t.id) {
        case S.CustomId.CRYSTAL_MOVE_COMP:
          break;
        case S.CustomId.CRYSTAL_SHOW_BOSS:
          this._floor.showBoss()
      }
      this._nyanco.customEvent(t), this._cameraMng.customEvent(t), this._boss && this._boss.customEvent(t)
    }, Object.defineProperty(t.prototype, "cameraMng", {
      get: function() {
        return this._cameraMng
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "effectMng", {
      get: function() {
        return this._effectMng
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "nyanco", {
      get: function() {
        return this._nyanco
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "boss", {
      get: function() {
        return this._boss
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "battle", {
      get: function() {
        return this._battle
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "cameraTarget", {
      get: function() {
        return this._cameraTarget
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "targetCenter", {
      get: function() {
        return this._targetCenter
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "scene", {
      get: function() {
        return this._scene
      },
      enumerable: !0,
      configurable: !0
    }), t
  }();
  S.ThreeManager = e, (t = s = S.EffectId || (S.EffectId = {}))[t.TOP = 0] = "TOP", t[t.SHOW_BOSS = 1] = "SHOW_BOSS", t[t.SHOW_BATTLE_COVER = 2] = "SHOW_BATTLE_COVER", t[t.PARADIGM = 3] = "PARADIGM";
  var a = function() {
      function t(t, e, i) {
        this._useEffectFlag = !1, this._init(t, e, i)
      }
      return t.prototype.resize = function() {
        this._composer.setSize(S.Context.stw, S.Context.sth), this.render()
      }, t.prototype.render = function() {
        this._useEffectFlag ? (this._composer.reset(), this._composer.render()) : this._helper ? (this._helper.animate(S.Context.delta), this._helper.render(this._scene, this._camera)) : this._renderer.render(this._scene, this._camera)
      }, t.prototype.setHelper = function(t) {
        this._helper = t
      }, t.prototype.start = function(t, e, i) {
        void 0 === e && (e = -1);
        var n = this;
        switch (this._useEffectFlag = !0, e) {
          case s.TOP:
          case s.SHOW_BOSS:
          case s.SHOW_BATTLE_COVER:
        }
        TweenLite.delayedCall(t, function() {
          n._useEffectFlag = !1, i && i()
        })
      }, t.prototype._init = function(t, e, i) {
        this._renderer = t, this._scene = e, this._camera = i, this._composer = new THREE.EffectComposer(t), this._composer.addPass(new THREE.RenderPass(e, i)), this._glitchPass = new THREE.GlitchPass, this._glitchPass.renderToScreen = !0, this._glitchPass.goWild = !0, this._composer.addPass(this._glitchPass)
      }, t
    }(),
    o = function() {
      function t(t) {
        this._core = t, this._parent = this._core.three.scene, this._cube = new E(this._core, this._parent, P.getMaterial(-1, 16777215, 1, !1), 7, 7, 7), this._cube.visible = !1, this._cube.y = 5.2, this._cube.z = 35, this._cube.material.map = (new THREE.TextureLoader).load("img/miku.png")
      }
      return t.prototype.show = function() {
        this._time = S.MathUtil.rand(.8, 2.4), this._cube.chainAlpha(0).chainVisible(!0).chainAlpha(.1, .8), this._core.main.addUpdate(this), this._core.pixi.cover.setup(0, .55, !0).show(0)
      }, t.prototype.hide = function() {
        this._cube.visible = !1, this._core.main.removeUpdate(this), this._core.pixi.cover.hide(.3)
      }, t.prototype.update = function() {
        this._time -= S.Context.delta, this._cube.rotationY += .33 * S.Context.delta
      }, t
    }(),
    i = function() {
      function t(t) {
        this.__isplaying = !1, this.__list = [], t && (this._core = t)
      }
      return t.prototype.init = function(t, e) {
        this._target = t, e ? (this._parent = e, this._parent.add(this._target)) : this._parent = t.parent
      }, t.prototype.setPosVec = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this
      }, t.prototype.setPos = function(t, e, i) {
        return this.x = t, this.y = e, this.z = i, this
      }, t.prototype.setRot = function(t, e, i) {
        return this.rotationX = t, this.rotationY = e, this.rotationZ = i, this
      }, t.prototype.getPos = function() {
        return this._target.position.clone()
      }, t.prototype.getRot = function() {
        return this._target.rotation
      }, t.prototype.get2D = function(t) {
        if (!this._core) return null;
        var e = this._core.three.cameraMng.camera,
          i = .5 * S.Context.stw,
          n = .5 * S.Context.sth,
          s = this._target.position.clone();
        return t && s.add(t), s.project(e), s.x = Math.round((s.x + 1) * i), s.y = Math.round((1 - s.y) * n), new THREE.Vector2(s.x, s.y)
      }, t.prototype.chainTween = function(t, e, i) {
        var n = this;
        return this._chainFooter(function() {
          TweenLite.to(n, t, e), TweenLite.delayedCall(t, function() {
            n._chainNext(i)
          })
        }), this
      }, t.prototype.chainTweens = function(n, s, a) {
        var o = this;
        return this._chainFooter(function() {
          var t, e = s.length,
            i = 0;
          for (t = 0; t < e; t++) n[t] || (n[t] = n[t % n.length]), i < n[t] && (i = n[t]);
          for (t = 0; t < e; t++) TweenLite.to(o, n[t], s[t]);
          TweenLite.delayedCall(i, function() {
            o._chainNext(a)
          })
        }), this
      }, t.prototype.chainFunc = function(t) {
        var e = this;
        return this._chainFooter(function() {
          e._chainNext(t)
        }), e
      }, t.prototype.chainDelay = function(t, e) {
        var i = this;
        return this._chainFooter(function() {
          TweenLite.delayedCall(t, function() {
            i._chainNext(e)
          })
        }), this
      }, t.prototype.chainVisible = function(t, e) {
        void 0 === t && (t = !0);
        var i = this;
        return this._chainFooter(function() {
          i.visible = t, i._chainNext(e)
        }), this
      }, t.prototype.chainMovePos = function(t, e, i, n) {
        void 0 === e && (e = 0), void 0 === i && (i = {});
        var s = this;
        return this._chainFooter(function() {
          null == i && (i = {}), i.x = t.x, i.y = t.y, i.z = t.z, i.ease || (i.ease = Power0.easeNone), i.onComplete = function() {
            s._chainNext(n)
          }, TweenLite.to(s, e, i)
        }), this
      }, t.prototype.chainMove = function(s, a, o, h, r) {
        void 0 === a && (a = 1), void 0 === o && (o = !0), void 0 === h && (h = {});
        var c = this;
        return this._chainFooter(function() {
          var t = s.x - c.x,
            e = s.z - c.z,
            i = -Math.atan2(e, t) + Math.PI / 2,
            n = Math.sqrt(t * t + e * e) / 22 / a;
          null == h && (h = {}), h.x = s.x, h.y = s.y, h.z = s.z, h.ease || (h.ease = Power0.easeNone), h.onComplete = function() {
            c._chainNext(r)
          }, o && (c.rotationY = i), TweenLite.to(c, n, h)
        }), this
      }, t.prototype.chainLookAt = function(n, s, a) {
        void 0 === s && (s = !1);
        var o = this;
        return this._chainFooter(function() {
          if (s) {
            var t = n.x - o.x,
              e = n.z - o.z,
              i = -Math.atan2(e, t) + Math.PI / 2;
            o.rotationY = i
          } else o._target.lookAt(n);
          o._chainNext(a)
        }), this
      }, t.prototype.chainRot = function(t, e, i, n) {
        void 0 === e && (e = 0), void 0 === i && (i = {});
        var s = this;
        return this._chainFooter(function() {
          null == i && (i = {}), i.rotationX = t.x, i.rotationY = t.y, i.rotationZ = t.z, i.ease || (i.ease = Power0.easeNone), i.onComplete = function() {
            s._chainNext(n)
          }, TweenLite.to(s, e, i)
        }), this
      }, t.prototype.chainScale = function(t, e, i, n) {
        void 0 === e && (e = 0), void 0 === i && (i = {});
        var s = this;
        return this._chainFooter(function() {
          null == i && (i = {}), isNaN(t) ? (i.scaleX = t.x, i.scaleY = t.y, i.scaleZ = t.z) : i.scale = t, i.ease || (i.ease = Power0.easeNone), i.onComplete = function() {
            s._chainNext(n)
          }, TweenLite.to(s, e, i)
        }), this
      }, t.prototype.stop = function() {
        TweenLite.killTweensOf(this)
      }, t.prototype.chainAnimation = function(t, e, i, n) {
        return void 0 === e && (e = 1), this
      }, t.prototype.chainAlpha = function(t, e, i, n) {
        return void 0 === e && (e = 0), void 0 === i && (i = {}), this
      }, t.prototype.chainTexOffset = function(t, e, i, n, s) {
        return void 0 === i && (i = 0), void 0 === n && (n = {}), this
      }, t.prototype.changeColor = function(t, e) {
        return void 0 === t && (t = -1), this
      }, t.prototype.changeMaterial = function(t, e, i, n, s) {
        return void 0 === t && (t = -1), void 0 === e && (e = -1), void 0 === i && (i = 1), void 0 === n && (n = !1), this
      }, t.prototype.tweenVertices = function(t, e, i, n) {
        return void 0 === e && (e = 0), void 0 === i && (i = Power2.easeOut), this
      }, t.prototype.setLookTarget = function(t, e) {
        return this
      }, t.prototype.setHeight = function(t) {
        return this
      }, t.prototype.setDistance = function(t) {
        return this
      }, t.prototype.setRotation = function(t) {
        return this
      }, t.prototype.setShake = function(t, e, i, n) {
        return void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), void 0 === n && (n = -1), this
      }, t.prototype.fixPos = function(t, e, i) {
        return void 0 === t && (t = !0), void 0 === e && (e = !0), void 0 === i && (i = !0), this
      }, t.prototype.changeEase = function(t, e, i) {
        return void 0 === i && (i = -1), this
      }, t.prototype._chainFooter = function(t) {
        this.__isplaying ? this.__list.push(t) : (this.__isplaying = !0, t())
      }, t.prototype._chainNext = function(t) {
        null != t && t(this), 0 < this.__list.length ? this.__list.shift()() : this.__isplaying = !1
      }, t.prototype.resetChain = function() {
        this.__list = []
      }, Object.defineProperty(t.prototype, "parent", {
        get: function() {
          return this._parent
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "target", {
        get: function() {
          return this._target
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "x", {
        get: function() {
          return this._target.position.x
        },
        set: function(t) {
          this._target.position.x = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "y", {
        get: function() {
          return this._target.position.y
        },
        set: function(t) {
          this._target.position.y = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "z", {
        get: function() {
          return this._target.position.z
        },
        set: function(t) {
          this._target.position.z = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "rotationX", {
        get: function() {
          return this._target.rotation.x
        },
        set: function(t) {
          this._target.rotation.x = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "rotationY", {
        get: function() {
          return this._target.rotation.y
        },
        set: function(t) {
          this._target.rotation.y = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "rotationZ", {
        get: function() {
          return this._target.rotation.z
        },
        set: function(t) {
          this._target.rotation.z = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "scale", {
        get: function() {
          return this._target.scale.x
        },
        set: function(t) {
          t = this.__checkSc(t), this._target.scale.set(t, t, t)
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "scaleX", {
        get: function() {
          return this._target.scale.x
        },
        set: function(t) {
          t = this.__checkSc(t), this._target.scale.x = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "scaleY", {
        get: function() {
          return this._target.scale.y
        },
        set: function(t) {
          t = this.__checkSc(t), this._target.scale.y = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "scaleZ", {
        get: function() {
          return this._target.scale.z
        },
        set: function(t) {
          t = this.__checkSc(t), this._target.scale.z = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "visible", {
        get: function() {
          return this._target.visible
        },
        set: function(t) {
          this._target.visible = t
        },
        enumerable: !0,
        configurable: !0
      }), t.prototype.__checkSc = function(t) {
        return 0 == t && (t = .001), t
      }, Object.defineProperty(t.prototype, "renderOrder", {
        get: function() {
          return this._target.renderOrder
        },
        set: function(t) {
          this._target.renderOrder = t
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(),
    h = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._prePos = new THREE.Vector3, e
      }
      return __extends(t, i), t.prototype.moveFront = function(t) {
        this._prePos.set(this.x, this.y, this.z);
        var e = -this.rotationY;
        this.x -= t * Math.sin(e), this.z += t * Math.cos(e)
      }, t.prototype.moveBack = function(t) {
        this._prePos.set(this.x, this.y, this.z);
        var e = -this.rotationY;
        this.x += t * Math.sin(e), this.z -= t * Math.cos(e)
      }, t.prototype.moveLeft = function(t) {
        this._prePos.set(this.x, this.y, this.z);
        var e = this.rotationY;
        this.x += t * Math.cos(e), this.z -= t * Math.sin(e)
      }, t.prototype.moveRight = function(t) {
        this._prePos.set(this.x, this.y, this.z);
        var e = this.rotationY;
        this.x -= t * Math.cos(e), this.z += t * Math.sin(e)
      }, Object.defineProperty(t.prototype, "prePos", {
        get: function() {
          return this._prePos
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(S.ObjectManager = i),
    n = function(i) {
      function t(t) {
        return i.call(this, t) || this
      }
      return __extends(t, i), t.prototype.init = function(t, e) {
        i.prototype.init.call(this, t, e), this._mesh = t, this._material = this._mesh.material
      }, t
    }(S.ModelManager = h),
    r = function(e) {
      function t(t) {
        return e.call(this, t) || this
      }
      return __extends(t, e), t.prototype.init = function(t) {
        e.prototype.init.call(this, this._core.loadData[S.DataId.PMD_CRYSTAL], t)
      }, t
    }(n),
    c = function(n) {
      function t(t, e) {
        var i = n.call(this, t) || this;
        return i._rotY = 0, i._dist = 0, i._animId = 1, i._renderer = e, i
      }
      return __extends(t, n), t.prototype.init = function(t) {
        n.prototype.init.call(this, this._core.loadData[S.DataId.PMD_NYNACO], t), this._helper = new THREE.MMDHelper(this._renderer), this._helper.add(this._mesh), this._helper.doOutlineDrawing = !1;
        var e = this._helper.meshes[0];
        this._helper.setAnimation(e), this._anims = [], this._animMorphs = [];
        var i = S.VmdId.getIds1();
        this._initVmds(i)
      }, t.prototype.initBattle = function() {
        var t = S.VmdId.getIds2();
        this._initVmds(t)
      }, t.prototype._initVmds = function(t) {
        for (var e = this._helper.meshes[0], i = t.length, n = 0; n < i; n++) {
          var s = t[n],
            a = e.mixer.clipAction(S.VmdId.getName(s));
          if (a) {
            a.weight = 0, a.stop(), this._anims[s] = a;
            var o = S.VmdId.getName(s) + "Morph";
            (a = e.mixer.clipAction(o)).weight = 0, a.stop(), this._animMorphs[s] = a
          }
        }
      }, t.prototype.changeAnimation = function(t, e, i, n) {
        if (void 0 === e && (e = 1), void 0 === i && (i = .3), void 0 === n && (n = Power0.easeNone), t != this._animId) {
          var s, a, o = i;
          this._anims[this._animId] && (s = this._anims[this._animId], TweenLite.to(s, o, {
            weight: 0,
            ease: n,
            onComplete: function(t) {
              t.stop()
            },
            onCompleteParams: [s]
          }), a = this._animMorphs[this._animId], TweenLite.to(a, o, {
            weight: 0,
            ease: n,
            onComplete: function(t) {
              t.stop()
            },
            onCompleteParams: [a]
          })), this._anims[t] && ((s = this._anims[t]).play(), s.timeScale = e, TweenLite.to(s, o, {
            weight: 1,
            ease: n
          }), (a = this._animMorphs[t]).play(), a.timeScale = e, TweenLite.to(a, o, {
            weight: 1,
            ease: n
          })), this._animId = t
        } else this._anims[t] && (this._anims[t].timeScale = e)
      }, t.prototype.playScene = function(t) {
        this._playScene(t)
      }, t.prototype.update = function() {
        this._update()
      }, t.prototype.customEvent = function(t) {}, t.prototype.padMove = function(t) {
        if (this._core.sceneId == S.SceneId.START) {
          var e = -t.radian - this._core.three.cameraMng.radianY + Math.PI;
          this._rotY = e, this._dist = 23 * t.distance * S.Context.delta;
          var i = S.MathUtil.abs(t.distance);
          i < .01 ? this.changeAnimation(S.DataId.VMD_IDLE) : i < .5 ? this.changeAnimation(S.DataId.VMD_WALK, 1 + i) : this.changeAnimation(S.DataId.VMD_RUN, i - .5 + 1)
        }
      }, t.prototype.chainAnimation = function(t, e, i, n) {
        void 0 === e && (e = 1), void 0 === i && (i = .3);
        var s = this;
        return this._chainFooter(function() {
          s.changeAnimation(t, e, i), s._chainNext(n)
        }), this
      }, t.prototype.actionDamage = function() {
        for (var t = S.ThreeVal.POS_NYAN_DEF, e = 0; e < 6; e++) {
          var i = t.clone(),
            n = Math.floor(e / 2) + 1;
          e % 2 == 0 ? i.z += S.MathUtil.rand(1, 1.2) / n : i.z -= S.MathUtil.rand(1, 1.2) / n, this.chainMovePos(i).chainDelay(.03)
        }
        this.chainMovePos(t)
      }, t.prototype._playScene = function(t) {
        switch (t) {
          case S.SceneId.TOP:
            this._target && (this.visible = !1);
            break;
          case S.SceneId.INPUT_NAME:
            this.visible = !0, this._prePos.set(0, 0, 35), this.setPos(0, 0, 35), this.changeAnimation(S.DataId.VMD_IDLE, 1, 0);
            break;
          case S.SceneId.START:
            this.setPos(0, 0, 35), S.Context._skip && this.setPos(0, 0, -30), this._dist = 0, this._rotY = 0, TweenLite.to(this, .4, {
              rotationY: 0,
              ease: Power2.easeOut
            });
            break;
          case S.SceneId.START_CRYSTAL:
            var e = this;
            this.chainAnimation(S.DataId.VMD_RUN, 1).chainMove(new THREE.Vector3(0, this.y, -25)).chainAnimation(S.DataId.VMD_IDLE, 1).chainLookAt(new THREE.Vector3(0, this.y, -30), !0, function() {
              e._crystalMoveComp()
            });
            break;
          case S.SceneId.BATTLE_START:
            this.setPosVec(S.ThreeVal.POS_NYAN_DEF);
            break;
          case S.SceneId.END:
            this._target && (this.visible = !1)
        }
      }, t.prototype._update = function() {
        switch (this._core.sceneId) {
          case S.SceneId.INPUT_NAME:
            this.rotationY += -.016, this.rotationY <= 2 * -Math.PI && (this.rotationY += 2 * Math.PI);
            break;
          case S.SceneId.START:
            0 < this._dist && (this.rotationY = this._rotY, this.moveFront(this._dist));
            break;
          case S.SceneId.START_CRYSTAL:
          case S.SceneId.BATTLE_START:
        }
      }, t.prototype._crystalMoveComp = function() {
        this._core.main.dispatchCustomEvent(S.CustomId.CRYSTAL_MOVE_COMP)
      }, Object.defineProperty(t.prototype, "helper", {
        get: function() {
          return this._helper
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(n),
    _ = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e.__cols = [16777215, 14540253, 16764108, 13434828, 16777011, 13421823, 16738047, 10079487], e.__len = e.__cols.length, e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = new THREE.Object3D;
        i.prototype.init.call(this, e, t);
        this._pBot = new x(this._core, e, P.getLambMaterial(S.TextureId.BOSSES[0], 16777215, 1), 4, 9, 9, 0), this._pTop = new x(this._core, e, P.getLambMaterial(S.TextureId.BOSSES[0], 16777215, 1), 4, 9, 9, 0), this._pBot.rotationZ = S.MathUtil.toRad(180), this._pTop.y = .5, this._pBot.y = -.5, e.updateMatrix(), e.updateMatrixWorld(!0)
      }, t.prototype.playScene = function(t) {
        switch (t) {
          case S.SceneId.START_CRYSTAL:
            this.visible = !1, this.setPos(0, 10, -38);
            break;
          case S.SceneId.BATTLE_START:
            this.setPosVec(S.ThreeVal.POS_BOSS_DEF);
            break;
          case S.SceneId.BATTLE_END:
            break;
          case S.SceneId.TOP:
          case S.SceneId.END:
            this.visible = !1
        }
      }, t.prototype.update = function() {
        switch (this._core.sceneId) {
          case S.SceneId.START_CRYSTAL:
            this._rotate();
            break;
          case S.SceneId.BATTLE_START:
          case S.SceneId.BATTLE_UPDATE:
          case S.SceneId.BATTLE_MY_TURN:
          case S.SceneId.BATTLE_ENEMY_TURN:
          case S.SceneId.BATTLE_END:
            this._rotate()
        }
      }, t.prototype.customEvent = function(t) {
        switch (t.id) {
          case S.CustomId.CRYSTAL_SHOW_BOSS:
            this.__count = 2, this._stopAnimation(), this._startAnimation()
        }
      }, t.prototype.modeChange = function() {}, t.prototype.actionDamage = function() {
        for (var t = S.ThreeVal.POS_BOSS_DEF, e = 0; e < 6; e++) {
          var i = t.clone(),
            n = Math.floor(e / 2) + 1;
          e % 2 == 0 ? i.z += S.MathUtil.rand(1.4, 1.6) / n : i.z -= S.MathUtil.rand(1.4, 1.6) / n, this.chainMovePos(i).chainDelay(.03)
        }
        this.chainMovePos(t)
      }, t.prototype._startAnimation = function() {
        if (this.__count++, !(this.__count < 2)) {
          this.__count = 0;
          for (var t = this, e = (this._pTop, this._pBot, 0); e < 6; e++) {
            var i = S.MathUtil.rand(.04, .12);
            this.__setMotion(this._pTop, i), this.__setMotion(this._pBot, i)
          }
          this._pTop.chainFunc(function() {
            t._startAnimation()
          }), this._pBot.chainFunc(function() {
            t._startAnimation()
          })
        }
      }, t.prototype._stopAnimation = function() {
        this._pTop.resetChain(), this._pBot.resetChain()
      }, t.prototype.__setMotion = function(t, e) {
        var i = e * Math.random() * .4,
          n = e - i;
        switch (t.chainDelay(n), S.MathUtil.randInt(0, 2)) {
          case 0:
            t.changeColor(this.__getColor()).chainDelay(i);
            break;
          case 1:
            var s = S.TextureId.BOSSES[S.MathUtil.randInt(0, S.TextureId.BOSSES.length - 1)];
            t.changeMaterial(s, -1, 1, !0).chainDelay(i);
            break;
          default:
            t.chainTexOffset(Math.random(), Math.random(), i)
        }
      }, t.prototype.__getColor = function() {
        return this.__cols[S.MathUtil.randInt(0, this.__len - 1)]
      }, t.prototype._rotate = function() {
        this._pTop.rotationY += S.Context.delta, this._pBot.rotationY -= S.Context.delta
      }, t
    }(h),
    l = function() {
      function t(t, e, i, n) {
        this._lines = [], this._pyramids = [], this._prims = [], this._core = n;
        var s = .5 * t,
          a = .5 * e;
        this._parent = new THREE.Object3D, this._parent.position.set(0, 0, 0), i.add(this._parent), this._initWall(t, e, s, a, this._parent), this._initPyramid(t, e, s, a, this._parent), this._initCrystal(t, e, s, a, this._parent), this._prims = this._prims.concat(this._lines), this._prims = this._prims.concat(this._pyramids), this._len = this._prims.length, this._skybox = new p(n, this._parent), this._skybox.scale = 250, this._particles = new y(n, this._parent)
      }
      return t.prototype.show = function() {
        this._particles.init(d.DEFFAULT), this._parent.visible = this._crystal.visible = !0, this._particles.show();
        for (var t = 0; t < this._pyramids.length; t++) this._pyramids[t].visible = !0
      }, t.prototype.hide = function() {
        this._parent.visible = this._crystal.visible = !1, this._particles.hide()
      }, t.prototype.update = function() {
        if (this._crystal.rotationY -= S.Context.delta, this._crystal.y = 10 + 1.7 * Math.sin(S.Context.time), this._core.config.quality != S.Quality.LOW && this._pyramids[0]) {
          var t = this._pyramids[0].material.map,
            e = t.offset;
          e.y -= .1 * S.Context.delta, e.y < 0 && (e.y += .5), t.offset = e
        }
      }, t.prototype.hitTest = function(t) {
        for (var e = !1, i = 0, n = 0; n < this._len; n++) {
          var s = this._prims[n].hiteTest(t.x, t.z, t.prePos.x, t.prePos.z);
          if (s) {
            if (1 < i) {
              t.x = t.prePos.x, t.z = t.prePos.z;
              break
            }
            e = !0, t.x = s.x, t.z = s.y, n = -1, i++
          }
        }
        return S.MathExtUtil.circleContainsPos(this._crystal.x, this._crystal.z, 20, t.x, t.z) && this._core.main.playScene(S.SceneId.START_CRYSTAL), e
      }, t.prototype.showBoss = function() {
        var t = this,
          e = .2;
        0 < S.Context._skip && (e = 0), TweenLite.delayedCall(e, function() {
          t._showBoss()
        })
      }, t.prototype._initWall = function(t, e, i, n, s) {
        var a = [{
          x: -i,
          z: -n
        }, {
          x: -i,
          z: -n + e
        }, {
          x: -i + t,
          z: -n + e
        }, {
          x: -i + t,
          z: -n
        }];
        a.push(a[0]);
        for (var o = 0; o < 4; o++) {
          var h = new THREE.Vector3(a[o].x, 0, a[o].z),
            r = new THREE.Vector3(a[o + 1].x, 0, a[o + 1].z),
            c = new g(this._core, h, r, s);
          this._lines[o] = c
        }
        var _ = new THREE.PlaneGeometry(t, t, 1, 1),
          l = P.getMaterial(S.TextureId.MAP_FLOOR, 16777215, .1),
          p = new THREE.Mesh(_, l);
        p.rotation.x = -90 * Math.PI / 180, s.add(p)
      }, t.prototype._initPyramid = function(t, e, i, n, s) {
        for (var a = [16777215, 13430510, 8965324, 9099756, 961181, 1089457, 34969, 13934238, 16110792, 15488645, 16531063, 5853015, 3222317], o = a.length, h = 0; h < 24; h++) {
          var r, c = S.MathUtil.rand(-n, n);
          r = S.MathUtil.abs(c) < .4 * n ? S.MathUtil.rand(9, i) : S.MathUtil.rand(15, i), Math.random() < .5 && (r = -r);
          var _ = S.MathUtil.randInt(3, 5),
            l = S.MathUtil.randInt(4, 8),
            p = S.MathUtil.randInt(12, 30),
            d = S.MathUtil.randInt(0, 45),
            u = P.getLambMaterial(S.TextureId.MAP_PYRAMID, a[S.MathUtil.randInt(0, o - 1)], .7),
            f = new x(this._core, s, u, _, l, p, d);
          if (f.x = r, f.z = c, this._pyramids.push(f), 0 == h) {
            var y = f.material.map;
            y.repeat.set(.5, .5), y.offset.set(0, 0)
          }
        }
      }, t.prototype._initCrystal = function(t, e, i, n, s) {
        var a = new r(this._core);
        a.init(s), a.scale = .7, a.y = 10, a.z = .7 * -n, this._crystal = a
      }, t.prototype._showBoss = function() {
        var e = this,
          i = this._core.three,
          t = 1.2;
        0 < S.Context._skip && (t = .2), S.Context.bgm.play(-1), S.Context.se.play(S.SoundId.BOSS_SHOW), i.effectMng.start(t, s.SHOW_BOSS, function() {
          e._core.main.dispatchCustomEvent(S.CustomId.CRYSTAL_BOSS_SERIF)
        }), TweenLite.delayedCall(.5 * t, function() {
          e._crystal.visible = !1;
          for (var t = 0; t < e._pyramids.length; t++) e._pyramids[t].visible = !1;
          i.boss.visible = !0
        })
      }, t
    }(),
    p = function(n) {
      function t(t, e) {
        var i = n.call(this, t) || this;
        return i._container = new THREE.Object3D, n.prototype.init.call(i, i._container, e), i._init(), i
      }
      return __extends(t, n), t.prototype._init = function() {
        for (var t = [
            [0, 0, 0],
            [0, Math.PI, 0],
            [0, Math.PI / 2, 0],
            [0, -Math.PI / 2, 0],
            [Math.PI / 2, 0, 0],
            [-Math.PI / 2, 0, 0]
          ], e = [
            [0, 0, .5],
            [0, 0, -.5],
            [.5, 0, 0],
            [-.5, 0, 0],
            [0, .5, 0],
            [0, -.5, 0]
          ], i = [S.TextureId.SKY, S.TextureId.SKY, S.TextureId.SKY, S.TextureId.SKY, -1, S.TextureId.SKY_BOTTOM], n = [16777215, 16777215, 16777215, 16777215, 0, 16777215], s = 0; s < 6; s++) {
          var a = new T(this._core, this._container, P.getMaterial(i[s], n[s], 1, !0));
          a.setRot(t[s][0], t[s][1], t[s][2]), a.setPos(e[s][0], e[s][1], e[s][2])
        }
      }, t
    }(i);
  S.MapSkybox = p;
  var d, u, f = function() {
      function t(t, e) {
        this._core = t, this._parent = e
      }
      return t.prototype.init = function(t) {
        if (!this._sp) {
          var e = P.getSpMaterial(-1, 16777215);
          this._sp = new m(this._core, this._parent, e)
        }
        switch (t) {
          case d.DEFFAULT:
            this._initDefault();
            break;
          case d.BATTLE:
            this._initBattle();
            break;
          case d.BATTLE_PARADIGM:
            this._initBattleParadigm()
        }
      }, t.prototype._initDefault = function() {
        this._sp.changeMaterial(S.TextureId.PT_BALL, 16777215), this._sp.alpha = .5, this._sp.scale = S.MathUtil.rand(.5, 1), this._size = 70, this._sizeY = 25, this._my = S.MathUtil.rand(2, 4)
      }, t.prototype._initBattle = function() {
        this._sp.changeMaterial(S.TextureId.PT_BALL, 16777215), this._sp.alpha = .4, this._sp.scale = S.MathUtil.rand(.2, .3), this._size = 20, this._sizeY = 25, this._my = S.MathUtil.rand(2, 4)
      }, t.prototype._initBattleParadigm = function() {
        var t = [16764057, 10079487, 16776960, 16777215][S.MathUtil.randInt(0, 4)];
        this._sp.changeMaterial(S.TextureId.PT_BALL, t), this._sp.alpha = .5, this._sp.scale = S.MathUtil.rand(.3, .5), this._size = 20, this._sizeY = 25, this._my = S.MathUtil.rand(2, 5)
      }, t.prototype.show = function() {
        this._sp.visible = !0, this._sp.y = S.MathUtil.rand(-1, 1) * this._sizeY, this._sp.x = S.MathUtil.rand(-1, 1) * this._size, this._sp.z = S.MathUtil.rand(-1, 1) * this._size
      }, t.prototype.hide = function() {
        this._sp.visible = !1
      }, t.prototype.update = function() {
        this._sp.y += this._my * S.Context.delta, this._sp.visible = .5 < Math.random(), this._sizeY <= this._sp.y && (this._sp.y -= 2 * this._sizeY, this._sp.x = S.MathUtil.rand(-1, 1) * this._size, this._sp.z = S.MathUtil.rand(-1, 1) * this._size)
      }, t
    }(),
    y = function() {
      function t(t, e) {
        this._pts = [], this._core = t, this._parent = e
      }
      return t.prototype.init = function(t) {
        t == d.DEFFAULT ? this._len = 45 : this._len = 18, this._core.config.quality == S.Quality.MEDIUM && (this._len = Math.floor(.5 * this._len)), this._core.config.quality == S.Quality.LOW && (this._len = 0);
        for (var e = 0; e < this._len; e++) {
          this._pts[e] || (this._pts[e] = new f(this._core, this._parent)), this._pts[e].init(t)
        }
        for (var i = this._pts.length; e < i; e++) this._pts[e].hide()
      }, t.prototype.show = function() {
        this._core.main.addUpdate(this);
        for (var t = 0; t < this._len; t++) this._pts[t].show()
      }, t.prototype.hide = function() {
        this._core.main.removeUpdate(this);
        for (var t = 0; t < this._len; t++) this._pts[t].hide()
      }, t.prototype.update = function() {
        for (var t = 0; t < this._len; t++) this._pts[t].update()
      }, t
    }();
  S.MapParticleManager = y, (u = d = S.MapParticleId || (S.MapParticleId = {}))[u.DEFFAULT = 0] = "DEFFAULT", u[u.BATTLE = 1] = "BATTLE", u[u.BATTLE_PARADIGM = 2] = "BATTLE_PARADIGM";
  var v = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._vecs = [], e
      }
      return __extends(t, i), t.prototype.init = function(t, e) {
        if (i.prototype.init.call(this, t, e), t.geometry) try {
          this._mesh = t
        } catch (t) {}
        t.geometry && (this._geometry = t.geometry), t.material && (this._material = t.material)
      }, t.prototype.centerTrans = function(t, e, i) {
        return void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), this._geometry && this._geometry.applyMatrix((new THREE.Matrix4).makeTranslation(t, e, i)), this
      }, t.prototype.changeColor = function(t, e) {
        void 0 === t && (t = -1);
        var i = this;
        return this._chainFooter(function() {
          0 <= t && i.material.color.set(t), i.material.needsUpdate = !0, i._chainNext(e)
        }), this
      }, t.prototype.changeMaterial = function(e, i, n, s, a) {
        if (void 0 === e && (e = -1), void 0 === i && (i = -1), void 0 === n && (n = 1), void 0 === s && (s = !0), !this.material) return this;
        0 < n && 1 < (n += .3) && (n = 1);
        var o = this;
        return this._chainFooter(function() {
          if (o._core.loadData[e]) {
            var t = o._core.loadData[e];
            o.material.map = t
          } else o.material.map = null;
          0 <= i && o.material.color.set(i), 0 <= n && (o.alpha = n), o.material.needsUpdate = !0, o._chainNext(a), o.material.blending = s ? THREE.AdditiveBlending : THREE.NormalBlending
        }), this
      }, t.prototype.chainAlpha = function(t, e, i, n) {
        void 0 === e && (e = 0), void 0 === i && (i = {}), 0 < t && 1 < (t += .3) && (t = 1);
        var s = this;
        return this._chainFooter(function() {
          null == i && (i = {}), i.alpha = t, i.ease || (i.ease = Power0.easeNone), i.onComplete = function() {
            s._chainNext(n)
          }, TweenLite.to(s, e, i)
        }), this
      }, t.prototype.chainTexOffset = function(t, e, i, n, s) {
        void 0 === i && (i = 0), void 0 === n && (n = {});
        var a = this;
        return this._chainFooter(function() {
          null == n && (n = {}), n.texOffsetX = t, n.texOffsetY = e, n.ease || (n.ease = Power0.easeNone), n.onComplete = function() {
            a._chainNext(s)
          }, TweenLite.to(a, i, n)
        }), this
      }, t.prototype.tweenVertices = function(n, s, a, o) {
        if (void 0 === s && (s = 0), void 0 === a && (a = Power2.easeOut), !this.geometry) return this;
        var h = this,
          r = Math.min(this.geometry.vertices.length, n.length);
        return this._chainFooter(function() {
          for (var t = 0; t < r; t++) {
            var e = n[t],
              i = {
                x: e.x,
                y: e.y,
                z: e.z,
                ease: a
              };
            0 == t && (i.onUpdate = function() {
              h.geometry.verticesNeedUpdate = !0
            }, i.onComplete = function() {
              h._chainNext(o)
            }), TweenLite.to(h.geometry.vertices[t], s, i)
          }
        }), this
      }, t.prototype.hiteTest = function(t, e, i, n) {
        for (var s = this._vecs.length, a = 0; a < s - 1; a++) {
          var o = this._vecs[a].x + this.x,
            h = this._vecs[a].z + this.z,
            r = this._vecs[a + 1].x + this.x,
            c = this._vecs[a + 1].z + this.z;
          if (S.MathExtUtil.intersectLineSegment(i, n, t, e, o, h, r, c)) {
            var _ = S.MathExtUtil.getCrossPoint(o, h, r, c, t, e);
            return new S.Point(_.x + .2 * (_.x - t), _.y + .2 * (_.y - e))
          }
        }
        return null
      }, Object.defineProperty(t.prototype, "alpha", {
        get: function() {
          return this._material.opacity
        },
        set: function(t) {
          this._material.opacity = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "mesh", {
        get: function() {
          return this._mesh
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "geometry", {
        get: function() {
          return this._geometry
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "material", {
        get: function() {
          return this._material
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "texOffsetX", {
        get: function() {
          return this._material.map.offset.x
        },
        set: function(t) {
          this._material.map.offset.x = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "texOffsetY", {
        get: function() {
          return this._material.map.offset.y
        },
        set: function(t) {
          this._material.map.offset.y = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "texRepeatX", {
        get: function() {
          return this._material.map.repeat.x
        },
        set: function(t) {
          this._material.map.repeat.x = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "texRepeatY", {
        get: function() {
          return this._material.map.repeat.y
        },
        set: function(t) {
          this._material.map.repeat.y = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "color", {
        get: function() {
          return this._material.color.getHex()
        },
        set: function(t) {
          this._material.color.setHex(t)
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(i),
    m = function(a) {
      function t(t, e, i) {
        var n = a.call(this, t) || this,
          s = new THREE.Sprite(i);
        return n._sprite = s, a.prototype.init.call(n, s, e), n
      }
      return __extends(t, a), Object.defineProperty(t.prototype, "sprite", {
        get: function() {
          return this._sprite
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "material", {
        get: function() {
          return this._sprite.material
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "rotation", {
        get: function() {
          return this._sprite.material.rotation
        },
        set: function(t) {
          this._sprite.material.rotation = t
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(S.PrimBase = v);
  S.PrimSprite = m;
  var g = function(r) {
    function t(t, e, i, n, s) {
      void 0 === s && (s = -1);
      var a = r.call(this, t) || this,
        o = new THREE.Geometry;
      if (o.vertices.push(e), o.vertices.push(i), a._vecs = [new S.Vector3D(e.x, e.y, e.z), new S.Vector3D(i.x, i.y, i.z)], 0 <= s) {
        var h = new THREE.LineBasicMaterial({
          color: s,
          linewidth: 1
        });
        a._line = new THREE.Line(o, h)
      } else a._line = new THREE.Line(o), a._line.visible = !1;
      return r.prototype.init.call(a, a._line, n), a
    }
    return __extends(t, r), Object.defineProperty(t.prototype, "line", {
      get: function() {
        return this._line
      },
      enumerable: !0,
      configurable: !0
    }), t
  }(v);
  S.PrimLine = g;
  var T = function(_) {
      function t(t, e, i, n, s, a, o) {
        void 0 === n && (n = 1), void 0 === s && (s = 1), void 0 === a && (a = 1), void 0 === o && (o = 1);
        var h = _.call(this, t) || this,
          r = new THREE.PlaneGeometry(n, s, a, o),
          c = new THREE.Mesh(r, i);
        return _.prototype.init.call(h, c, e), h
      }
      return __extends(t, _), t
    }(v),
    w = function(y) {
      function t(t, e, i, n, s) {
        for (var a = y.call(this, t, e, i, n, n, s, s) || this, o = a._mesh.geometry, h = .5 * n, r = o.vertices, c = r.length, _ = 0; _ < c; _++) {
          var l = _ % (s + 1),
            p = Math.floor(_ / (s + 1)),
            d = S.MathUtil.toRad(l * (180 / s) + 180),
            u = S.MathUtil.toRad(p * (180 / s) + 180),
            f = r[_];
          f.x = h * Math.cos(d) * Math.sin(u), f.z = h * Math.sin(d) * Math.sin(u), f.y = h * Math.cos(u)
        }
        return o.computeFaceNormals(), o.computeVertexNormals(), a
      }
      return __extends(t, y), t
    }(S.PrimPlane = T);
  S.PrimDome = w;
  var x = function(T) {
    function t(t, e, i, n, s, a, o) {
      void 0 === o && (o = 0);
      for (var h = T.call(this, t) || this, r = 2 * Math.PI / n, c = S.MathUtil.toRad(o), _ = [], l = 0; l < n; l++) {
        var p = l * r + c,
          d = Math.cos(p),
          u = Math.sin(p),
          f = s * d,
          y = s * u,
          v = new THREE.Vector3(f, 0, y),
          m = new S.Vector3D(v.x + 2 * d, v.y, v.z + 2 * u);
        _[l] = v, h._vecs[l] = m
      }
      _[l] = new THREE.Vector3(0, a, 0), h._vecs[l] = h._vecs[0];
      var g = new THREE.Mesh(new THREE.ConvexGeometry(_), i);
      return T.prototype.init.call(h, g, e), h
    }
    return __extends(t, T), t
  }(v);
  S.PrimPyramid = x;
  var M = function(d) {
    function t(t, e, i, n, s, a, o, h, r, c) {
      void 0 === r && (r = !1), void 0 === c && (c = !0);
      var _ = d.call(this, t) || this,
        l = new THREE.CylinderGeometry(n, s, a, o, h, r),
        p = new THREE.Mesh(l, i);
      return d.prototype.init.call(_, p, e), c && _.centerTrans(0, .5 * a, 0), _
    }
    return __extends(t, d), t
  }(v);
  S.PrimCylinder = M;
  var E = function(p) {
    function t(t, e, i, n, s, a, o, h, r) {
      void 0 === o && (o = 1), void 0 === h && (h = 1), void 0 === r && (r = 1);
      var c = p.call(this, t) || this,
        _ = new THREE.BoxGeometry(n, s, a, o, h, r),
        l = new THREE.Mesh(_, i);
      return p.prototype.init.call(c, l, e), c
    }
    return __extends(t, p), t
  }(v);
  S.PrimCube = E;
  var I = function(c) {
    function t(t, e, i, n, s, a) {
      void 0 === s && (s = 8), void 0 === a && (a = 6);
      var o = c.call(this, t) || this,
        h = new THREE.SphereGeometry(n, s, a),
        r = new THREE.Mesh(h, i);
      return c.prototype.init.call(o, r, e), o
    }
    return __extends(t, c), t
  }(v);
  S.PrimSphere = I;
  var P = function() {
    function t() {}
    return t.init = function(t) {
      this._loadData = t.loadData
    }, t.getMaterial = function(t, e, i, n) {
      return void 0 === t && (t = -1), void 0 === e && (e = -1), void 0 === i && (i = 1), void 0 === n && (n = !1), new THREE.MeshBasicMaterial(this._getOpt({}, t, e, i, n))
    }, t.getSpMaterial = function(t, e, i, n) {
      return void 0 === t && (t = -1), void 0 === e && (e = -1), void 0 === i && (i = 1), void 0 === n && (n = !1), new THREE.SpriteMaterial(this._getOpt({}, t, e, i, n))
    }, t.getLambMaterial = function(t, e, i, n) {
      return void 0 === t && (t = -1), void 0 === e && (e = -1), void 0 === i && (i = 1), void 0 === n && (n = !1), new THREE.MeshLambertMaterial(this._getOpt({}, t, e, i, n))
    }, t._getOpt = function(t, e, i, n, s) {
      return void 0 === n && (n = 1), void 0 === s && (s = !1), t || (t = {}), t.transparent = !0, t.opacity = n, this._loadData[e] && (t.map = this._loadData[e]), 0 <= i && (t.color = i), t.side = s ? THREE.DoubleSide : THREE.FrontSide, t.depthWrite = !1, t
    }, t
  }();
  S.PrimUtil = P;
  var C = function(s) {
    function t(t, e) {
      var i = s.call(this, t) || this;
      i._addY = 0, i._ease = 20, i._fixX = !1, i._fixY = !1, i._fixZ = !1, i._shakeX = 0, i._shakeY = 0, i._shakeZ = 0, i._shakeInterval = -1, i._shakeVec = new THREE.Vector3;
      var n = new THREE.Object3D;
      return t.three.scene.add(n), i.init(e, n), i._camera = e, i._lookTarget = new THREE.Object3D, i._tmpLookTarget = i._lookTarget, i._tmpLookOffset = new THREE.Vector3, i
    }
    return __extends(t, s), t.prototype.playScene = function(t) {
      var e = this._core.three;
      switch (t) {
        case S.SceneId.TOP:
          this._radY = this._tmpY = Math.PI / 2, this._distance = 18, this._height = 14, this._ease = 20, this._camera.position.set(0, 5, 45), this._camera.fov = 60, this._lookTarget.position.set(0, 5, 35), this._updateLook();
          break;
        case S.SceneId.INPUT_NAME:
          break;
        case S.SceneId.START:
          this.changeEase(2, 2, 20), e.cameraTarget.setPos(e.nyanco.x, e.nyanco.y, e.nyanco.z), this.setLookTarget(e.cameraTarget.target, new THREE.Vector3(0, 0, 0));
          break;
        case S.SceneId.START_CRYSTAL:
          this.__offZ = -5, this.setRotation(-Math.PI / 6).changeEase(1.2, 2, 15)
      }
    }, t.prototype.update = function() {
      var t = this._core.three;
      switch (this._core.sceneId) {
        case S.SceneId.TOP:
        case S.SceneId.LOADING:
        case S.SceneId.INPUT_NAME:
          this._updateLook();
          break;
        case S.SceneId.START:
          t.cameraTarget.setPos(t.nyanco.x, t.nyanco.y + 5, t.nyanco.z);
          break;
        case S.SceneId.START_CRYSTAL:
          t.cameraTarget.setPos(t.nyanco.x, t.nyanco.y + 10, t.nyanco.z + this.__offZ);
          break;
        case S.SceneId.BATTLE_START:
      }
      switch (this._core.sceneId) {
        case S.SceneId.START:
        case S.SceneId.START_CRYSTAL:
        case S.SceneId.BATTLE_START:
        case S.SceneId.BATTLE_UPDATE:
        case S.SceneId.BATTLE_MY_TURN:
        case S.SceneId.BATTLE_ENEMY_TURN:
        case S.SceneId.BATTLE_END:
          this._updateDefult()
      }
    }, t.prototype.customEvent = function(t) {
      this._core.three;
      switch (t.id) {
        case S.CustomId.CRYSTAL_MOVE_COMP:
        case S.CustomId.CRYSTAL_SHOW_BOSS:
          break;
        case S.CustomId.CRYSTAL_BOSS_SERIF:
          this.__offZ = -8, this.setRotation(-Math.PI / 10).setDistance(22).changeEase(1.2, 2, 20)
      }
    }, t.prototype.resize = function() {
      var t = 60 * (Math.pow(S.Context.sth / S.Context.stw - 1, 3) + 1);
      100 < t && (t = 100), t < 20 && (t = 20), this._camera.fov = t;
      var e = S.Context.stw / S.Context.sth;
      this._camera.aspect = e, this._camera.updateProjectionMatrix()
    }, t.prototype.updateForce = function(t) {
      if (void 0 === t && (t = 0), 0 < t) {
        var e = this._ease;
        this._ease = t
      }
      return this._updateDefult(), 0 < t && (this._ease = e), this
    }, t.prototype._updateDefult = function() {
      this._tmpY += this._addY, this._tmpY < 0 && (this._tmpY += 2 * Math.PI, this._radY += 2 * Math.PI), 2 * Math.PI <= this._tmpY && (this._tmpY -= 2 * Math.PI, this._radY -= 2 * Math.PI), this._radY += (this._tmpY - this._radY) / this._ease;
      var t = this._radY,
        e = this._distance,
        i = e * Math.cos(t),
        n = this._height,
        s = e * Math.sin(t);
      this._lookTarget.position.x += (this._tmpLookTarget.position.x + this._tmpLookOffset.x - this._lookTarget.position.x) / this._ease, this._lookTarget.position.y += (this._tmpLookTarget.position.y + this._tmpLookOffset.y - this._lookTarget.position.y) / this._ease, this._lookTarget.position.z += (this._tmpLookTarget.position.z + this._tmpLookOffset.z - this._lookTarget.position.z) / this._ease, this._fixX || (this.x += (i + this._lookTarget.position.x - this.x) / this._ease), this._fixY || (this.y += (n + this._lookTarget.position.y - this.y) / this._ease), this._fixZ || (this.z += (s + this._lookTarget.position.z - this.z) / this._ease), 0 < this._shakeInterval && (this._shakeTime += S.Context.delta, this._shakeInterval <= this._shakeTime && (this._shakeTime -= this._shakeInterval, this._shakeVec.x = S.MathUtil.rand(-this._shakeX, this._shakeX), this._shakeVec.y = S.MathUtil.rand(-this._shakeY, this._shakeY), this._shakeVec.z = S.MathUtil.rand(-this._shakeZ, this._shakeZ)), this._parent.position.set(this._shakeVec.x, this._shakeVec.y, this._shakeVec.z)), this._updateLook()
    }, t.prototype.padMove = function(t) {
      var e = t.distance * Math.cos(t.radian);
      this._addY = -e / 10
    }, t.prototype.setLookTarget = function(t, e) {
      var i = this;
      return this._chainFooter(function() {
        e || (e = new THREE.Vector3), i._tmpLookTarget = t, i._tmpLookOffset = e, i._chainNext()
      }), this
    }, t.prototype.setHeight = function(t) {
      var e = this;
      return this._chainFooter(function() {
        e._height = t, e._chainNext()
      }), this
    }, t.prototype.setDistance = function(t) {
      var e = this;
      return this._chainFooter(function() {
        e._distance = t, e._chainNext()
      }), this
    }, t.prototype.setRotation = function(i) {
      var n = this;
      return this._chainFooter(function() {
        n._tmpY = i;
        var t = 1;
        n._radY < n._tmpY && (t = -1);
        var e = Math.abs(n._radY - n._tmpY);
        2 * Math.PI - e < e && (n._radY -= 2 * Math.PI * t), n._chainNext()
      }), this
    }, t.prototype.setShake = function(t, e, i, n) {
      void 0 === t && (t = 0), void 0 === e && (e = 0), void 0 === i && (i = 0), void 0 === n && (n = -1);
      var s = this;
      return this._chainFooter(function() {
        s._shakeX = t, s._shakeX = e, s._shakeX = i, s._shakeVec.set(0, 0, 0), s._shakeTime = 0, (s._shakeInterval = n) <= 0 && s._parent.position.set(0, 0, 0), s._chainNext()
      }), this
    }, t.prototype.fixPos = function(t, e, i) {
      void 0 === t && (t = !0), void 0 === e && (e = !0), void 0 === i && (i = !0);
      var n = this;
      return this._chainFooter(function() {
        n._fixX = t, n._fixY = e, n._fixZ = i, n._chainNext()
      }), this
    }, t.prototype.changeEase = function(t, e, i) {
      void 0 === i && (i = -1);
      var n = this;
      return this._chainFooter(function() {
        0 <= i && (n._ease = i), 0 < t ? TweenLite.to(n, t, {
          _ease: e,
          ease: Power0.easeNone
        }) : n._ease = e, n._chainNext()
      }), this
    }, t.prototype._updateLook = function() {
      switch (this._camera.lookAt(this._lookTarget.position), this._core.sceneId) {
        case S.SceneId.BATTLE_START:
        case S.SceneId.BATTLE_UPDATE:
        case S.SceneId.BATTLE_MY_TURN:
        case S.SceneId.BATTLE_ENEMY_TURN:
        case S.SceneId.BATTLE_END:
          this.rotationX += .044 * Math.sin(.71 * S.Context.time), this.rotationY += .044 * Math.cos(.87 * S.Context.time);
          break;
        case S.SceneId.TOP:
          this.rotationX += .039 * Math.sin(.83 * S.Context.time), this.rotationY += .039 * Math.cos(.91 * S.Context.time);
          break;
        default:
          this.rotationX += .025 * Math.sin(.69 * S.Context.time), this.rotationY += .025 * Math.cos(.81 * S.Context.time)
      }
    }, Object.defineProperty(t.prototype, "radianY", {
      get: function() {
        return this._radY
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "camera", {
      get: function() {
        return this._camera
      },
      enumerable: !0,
      configurable: !0
    }), t
  }(i)
}(nnf || (nnf = {})),
function(d) {
  var c = function() {
    function t() {}
    return t.POS_NYAN_DEF = new THREE.Vector3(0, 0, 10), t.POS_BOSS_DEF = new THREE.Vector3(0, 10, -10), t.CAMERA_ROT = -Math.PI / 12, t.CAMERA_DISTANCE = 22, t.CAMERA_HEIGHT = 12, t.CAMERA_TARGET = new THREE.Vector3(0, 8, 0), t
  }();
  d.ThreeVal = c;
  var t = function() {
    function t(t) {
      this._core = t, V.init(t), _._init(t)
    }
    return t.prototype.playScene = function(t) {
      switch (t) {
        case d.SceneId.BATTLE_START:
          this._battleStartStart();
          break;
        case d.SceneId.BATTLE_UPDATE:
          break;
        case d.SceneId.BATTLE_END:
          this._battleEndStart();
          break;
        case d.SceneId.END:
          this._endStart()
      }
    }, t.prototype.update = function() {
      this._core.sceneId
    }, t.prototype.resize = function() {}, t.prototype._battleStartStart = function() {
      this._nyanco || (this._nyanco = new F(this._core), this._boss = new X(this._core), this._floor = new n(this._core)), this._nyanco.init(), this._boss.init(), this._floor.show();
      var t = this._core.three;
      t.cameraTarget.setPosVec(c.CAMERA_TARGET), t.cameraMng.setRotation(c.CAMERA_ROT).setDistance(3).setHeight(6).updateForce(1);
      var e = 3;
      0 < d.Context._skip && (e = 1), t.cameraMng.setDistance(c.CAMERA_DISTANCE).setHeight(c.CAMERA_HEIGHT).changeEase(e, 2, 120), d.Context.bgm.play(d.DataId.BGM_BATTLE);
      var i = this;
      TweenLite.delayedCall(e, function() {
        i._core.main.playScene(d.SceneId.BATTLE_UPDATE)
      })
    }, t.prototype._battleEndStart = function() {
      var t = this._core.game.status,
        e = this._core.game.statusBoss;
      t.HP <= 0 ? this._nyanco.death() : e.HP <= 0 && this._boss.death()
    }, t.prototype._endStart = function() {
      this._floor.hide()
    }, Object.defineProperty(t.prototype, "nyanco", {
      get: function() {
        return this._nyanco
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "boss", {
      get: function() {
        return this._boss
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "floor", {
      get: function() {
        return this._floor
      },
      enumerable: !0,
      configurable: !0
    }), t
  }();
  d.ThreeBattleManager = t;
  var n = function() {
      function t(t) {
        this._core = t, this._container = new THREE.Object3D, this._core.three.scene.add(this._container), this._container.visible = !1, this._sky = new d.MapSkybox(t, this._container), this._sky.scale = 250, this._particles = new d.MapParticleManager(t, this._container)
      }
      return t.prototype.show = function() {
        this._container.visible = !0, this.changeParticle(d.MapParticleId.BATTLE), this._particles.show()
      }, t.prototype.hide = function() {
        this._container.visible = !1, this._particles.hide()
      }, t.prototype.changeParticle = function(t) {
        this._particles.init(t)
      }, t
    }(),
    _ = function() {
      function t() {}
      return t._init = function(t) {
        this._core = t
      }, t.getSprite = function() {
        var t = this.SPRITE + "",
          e = this._getKeyobj(t);
        return e || (e = new d.PrimSprite(this._core, this._core.three.scene, d.PrimUtil.getSpMaterial(-1, 16711680, .5))), this._setup(e, t), e
      }, t.getPlane = function() {
        var t = this.PLANE + "",
          e = this._getKeyobj(t);
        return e ? (e.geometry.vertices[0].set(-.5, .5, 0), e.geometry.vertices[1].set(.5, .5, 0), e.geometry.vertices[2].set(-.5, -.5, 0), e.geometry.vertices[3].set(.5, -.5, 0), e.geometry.verticesNeedUpdate = !0) : e = new d.PrimPlane(this._core, this._core.three.scene, d.PrimUtil.getMaterial(-1, 16711680, .5, !0), 1, 1), this._setup(e, t), e
      }, t.getCube = function() {
        var t = this.CUBE + "",
          e = this._getKeyobj(t);
        return e || (e = new d.PrimCube(this._core, this._core.three.scene, d.PrimUtil.getMaterial(-1, 16711680, .5), 1, 1, 1)), this._setup(e, t), e
      }, t.getDome = function() {
        var t = this.DOME + "",
          e = this._getKeyobj(t);
        return e || (e = new d.PrimDome(this._core, this._core.three.scene, d.PrimUtil.getMaterial(-1, 16711680, .5, !0), 1, 5)), this._setup(e, t), e
      }, t.getSphere = function(t, e) {
        void 0 === t && (t = 8), void 0 === e && (e = 6);
        var i = this.SPHERE + "_" + t + "_" + e,
          n = this._getKeyobj(i);
        return n || (n = new d.PrimSphere(this._core, this._core.three.scene, d.PrimUtil.getMaterial(-1, 16711680, .5), 1, t, e)), this._setup(n, i), n
      }, t.getCylinder = function(t, e, i, n, s) {
        void 0 === n && (n = 8), void 0 === s && (s = 1);
        var a = this.CYLINDER + "_" + t + "_" + e + "_" + i + "_" + n + "_" + s,
          o = this._getKeyobj(a);
        return o || (o = new d.PrimCylinder(this._core, this._core.three.scene, d.PrimUtil.getMaterial(-1, 16711680, .5, !0), t, e, i, n, s, !0, !0)), this._setup(o, a), o
      }, t.add = function(t) {
        t._que || (t._que = !0, this._obj[t._key] || (this._obj[t._key] = []), t.visible = !1, this._obj[t._key].push(t))
      }, t._setup = function(t, e) {
        void 0 === e && (e = ""), TweenLite.killTweensOf(t), t.visible = !1, t.alpha = 1, t.scale = 1, t.setRot(0, 0, 0), t.setPos(0, 0, 0), t.renderOrder = 1, t._key = e, t._que = !1
      }, t._getKeyobj = function(t) {
        return this._obj[t] && 0 < this._obj[t].length ? this._obj[t].pop() : null
      }, t.SPRITE = 0, t.PLANE = 1, t.CUBE = 2, t.SPHERE = 3, t.DOME = 4, t.CYLINDER = 5, t._obj = {}, t
    }(),
    u = function() {
      function t() {}
      return t.moveTrail = function(t, e, i, n, s, a, o, h) {
        void 0 === o && (o = 4), void 0 === h && (h = Power2.easeIn);
        var r = t;
        r.visible = !0, r.setPos(100, 100, 100), r.chainDelay(n).chainVisible(!0).chainMovePos(new THREE.Vector3(0, 0, 0), 0).tweenVertices([new THREE.Vector3(s.x, s.y, s.z - o), new THREE.Vector3(s.x, s.y, s.z + o), new THREE.Vector3(s.x, s.y, s.z - o), new THREE.Vector3(s.x, s.y, s.z + o)], 0).chainVisible(!0).tweenVertices([new THREE.Vector3(s.x, s.y, s.z - o), new THREE.Vector3(s.x, s.y, s.z + o), new THREE.Vector3(a.x, a.y, a.z - o), new THREE.Vector3(a.x, a.y, a.z + o)], e, h).tweenVertices([new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(a.x, a.y, a.z - 1), new THREE.Vector3(a.x, a.y, a.z + 1)], i, h).chainFunc(function() {
          _.add(r)
        })
      }, t
    }(),
    e = function() {
      function t(t) {
        this._nyancoCenterOffset = new THREE.Vector3(0, 5, 0), this._core = t, this._three = t.three, this._scene = t.three.scene
      }
      return t.prototype.update = function() {}, t.prototype._getPosNyanco = function(t) {
        void 0 === t && (t = !1);
        var e = this._three.nyanco.getPos();
        return t && (e.y = 0), e
      }, t.prototype._getPosBoss = function(t) {
        void 0 === t && (t = !1);
        var e = this._three.boss.getPos();
        return t && (e.y = 0), e
      }, Object.defineProperty(t.prototype, "_targetNyanco", {
        get: function() {
          return this._three.nyanco.target
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "_targetBoss", {
        get: function() {
          return this._three.boss.target
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "_targetDefault", {
        get: function() {
          return this._three.cameraTarget.target
        },
        enumerable: !0,
        configurable: !0
      }), t.prototype._addUpdate = function() {
        this._core.main.addUpdate(this)
      }, t.prototype._removeUpdate = function() {
        this._core.main.removeUpdate(this)
      }, t.prototype.show = function(t, e) {
        void 0 === t && (t = 0), this._showComplete = e
      }, t.prototype.hide = function(t, e) {
        void 0 === t && (t = 0), this._hideComplete = e
      }, t
    }(),
    i = function(n) {
      function t(t) {
        return n.call(this, t) || this
      }
      return __extends(t, n), t.prototype.init = function(t) {
        var e = "";
        switch (t) {
          case d.ActionType.SKILL:
            e = d.TextureId.CIRCLE_SKILL;
            break;
          case d.ActionType.SPECIAL:
            e = d.TextureId.CIRCLE_SPECIAL
        }
        this._plane = _.getPlane(), this._plane.changeMaterial(e, 16777215), this._plane.y = .01
      }, t.prototype.show = function(t, e) {
        void 0 === t && (t = 0), n.prototype.show.call(this, t, e);
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._show()
        })
      }, t.prototype.hide = function(t, e) {
        void 0 === t && (t = 0), n.prototype.show.call(this, t, e);
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._hide()
        })
      }, t.prototype.update = function() {
        this._plane.x = this._three.nyanco.x, this._plane.z = this._three.nyanco.z, this._plane.rotationZ += d.Context.delta
      }, t.prototype._show = function() {
        var t = this;
        this._addUpdate(), this.update(), this._plane.visible = !0, this._plane.setRot(-Math.PI / 2, 0, 0).chainAlpha(.5), this._plane.chainScale(0).chainScale(10, .6, {
          ease: Back.easeOut
        }), t._showComplete && this._plane.chainFunc(function() {
          t._showComplete()
        })
      }, t.prototype._hide = function() {
        var t = this;
        this._removeUpdate(), this._plane.chainScale(0, .5, {
          ease: Back.easeIn
        }).chainFunc(function() {
          t.__hide()
        })
      }, t.prototype.__hide = function() {
        _.add(this._plane), this._hideComplete && this._hideComplete()
      }, t
    }(e),
    s = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._time = 1, e._alpha = 1, e._fadeType = 0, e._blInterval = -1, e._rotSpeed = 0, e
      }
      return __extends(t, i), t.prototype.setInit = function(t, e) {
        return void 0 === e && (e = 1), this._sp = _.getSprite(), this._time = t, this._sp.scale = e, this._sp.rotation = 0, this._blInterval = .04, this._rotSpeed = 0, this
      }, t.prototype.setType1 = function(t, e, i) {
        return this._type = 1, this._start = t, this._speed = e, this._accele = i, this
      }, t.prototype.setType2 = function(t, e, i) {
        return void 0 === i && (i = Power2.easeOut), this._type = 2, this._start = t, this._end = e, this._ease = i, this
      }, t.prototype.setMate = function(t, e, i, n) {
        return void 0 === t && (t = -1), void 0 === e && (e = -1), void 0 === i && (i = 1), void 0 === n && (n = 0), this._sp.changeMaterial(t, e, i), this._alpha = i, this._fadeType = n, this
      }, t.prototype.setBlink = function(t) {
        return void 0 === t && (t = 0), this._blInterval = t, this
      }, t.prototype.setRot = function(t, e) {
        return void 0 === t && (t = 0), void 0 === e && (e = 0), this._sp.rotation = t, this._rotSpeed = e, this
      }, t.prototype.show = function(t, e) {
        if (void 0 === t && (t = 0), this._hideComplete = e, 0 < t) {
          var i = this;
          TweenLite.delayedCall(t, function() {
            i._show()
          })
        } else this._show()
      }, t.prototype._show = function() {
        var t = this;
        if (this._sp.setPosVec(this._start), this._sp.visible = !0, this._blTime = 0, this._core.main.addUpdate(this), 1 == this._type);
        else {
          var e = this._end;
          TweenLite.to(this._sp, this._time, {
            x: e.x,
            y: e.y,
            z: e.z,
            ease: this._ease
          })
        }
        if (0 == this._fadeType) {
          this._sp.alpha = 0;
          var i = .1 * this._time,
            n = this._time - 2 * i;
          this._sp.chainAlpha(this._alpha, i).chainDelay(n).chainAlpha(0, i).chainDelay(.1, function() {
            t._hide()
          })
        } else this._sp.chainAlpha(this._alpha), this._sp.chainAlpha(0, this._time).chainDelay(.1, function() {
          t._hide()
        })
      }, t.prototype.update = function() {
        1 == this._type && (this._sp.x += this._speed.x * d.Context.delta, this._sp.y += this._speed.y * d.Context.delta, this._sp.z += this._speed.z * d.Context.delta, this._speed.add(this._accele.clone().multiplyScalar(d.Context.delta))), 0 != this._rotSpeed && (this._sp.rotation += this._rotSpeed * d.Context.delta), 0 < this._blInterval && (this._blTime += d.Context.delta, this._blInterval <= this._blTime && (this._blTime -= this._blInterval, this._sp.visible = !this._sp.visible))
      }, t.prototype._hide = function() {
        this._core.main.removeUpdate(this), this._sp.rotation = 0, _.add(this._sp), this._hideComplete && this._hideComplete()
      }, t
    }(e),
    o = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._pts = [], e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        switch (t) {
          case d.XSkillId.HEAL:
          case d.XSkillId.POWER:
          case d.XSkillId.MOFU_HEAT:
            this._initHealType(t, d.ActionType.SKILL);
            break;
          case d.XSkillId.DRAIN_MP:
          case d.XSkillId.DRAIN_HP:
            this._initDrainType(t);
            break;
          case d.XSkillId.BOMB:
            this._initBomb(t, d.ActionType.SKILL);
            break;
          case d.XSkillId.VOLTEX:
            this._initVoltex(t, d.ActionType.SKILL)
        }
      }, t.prototype.initSp = function(t) {
        switch (t) {
          case d.XSpecialId.METEOR:
            break;
          case d.XSpecialId.CRYSIS:
            this._initBomb(t, d.ActionType.SPECIAL);
            break;
          case d.XSpecialId.FULLPOWER:
            this._initHealType(t, d.ActionType.SPECIAL);
            break;
          case d.XSpecialId.NYALTIME:
            this._initVoltex(t, d.ActionType.SPECIAL)
        }
      }, t.prototype.initBoss = function(t) {
        switch (t) {
          case d.XBossSkillId.HEAL:
            this._initBossHeal();
            break;
          case d.XBossSkillId.FLARE_STAR:
            this._initBossFlareStar();
            break;
          case d.XBossSkillId.ULTIMA:
            this._initBossUltima();
            break;
          case d.XBossSkillId.VANISHING:
            this._initBossVanishing();
            break;
          case d.XBossSkillId.ULTRANOVA:
            this._initBossFlareStar()
        }
      }, t.prototype._initHealType = function(t, e) {
        var i, n = this._getPosNyanco();
        this._interval = .1, this._len = 9;
        var s = d.TextureId.PT_KIRA,
          a = [65382];
        if (e == d.ActionType.SKILL) switch (t) {
          case d.XSkillId.POWER:
            s = d.TextureId.PT_ARROW, a = [16729088];
            break;
          case d.XSkillId.MOFU_HEAT:
            s = d.TextureId.PT_PLUS, a = [3407701, 2276351]
        } else switch (t) {
          case d.XSpecialId.FULLPOWER:
            a = [6737151, 16764023, 8978312]
        }
        for (var o = a.length, h = 0; h < this._len; h++) {
          var r = d.MathUtil.rand(1, 2.5);
          i = this._getParticle(h);
          var c = new THREE.Vector3(d.MathUtil.rand(-2.5, 2.5), d.MathUtil.rand(4, 6), d.MathUtil.rand(-2.5, 2.5));
          c.add(n);
          var _ = c.clone();
          _.y += d.MathUtil.rand(4, 8), i.setInit(1, r).setType2(c, _).setMate(s, a[h % o], .5)
        }
      }, t.prototype._initDrainType = function(t) {
        var e, i = this._getPosBoss();
        this._interval = .05, this._len = 24;
        var n = [d.TextureId.PT_BALL, d.TextureId.PT_PLUS],
          s = n.length,
          a = 0;
        switch (t) {
          case d.XSkillId.DRAIN_HP:
            a = 16750950;
            break;
          case d.XSkillId.DRAIN_MP:
            a = 3381759
        }
        for (var o = 0; o < this._len; o++) {
          e = this._getParticle(o);
          var h = new THREE.Vector3(d.MathUtil.rand(-30, 30), d.MathUtil.rand(-30, 30), d.MathUtil.rand(-30, 30));
          h.add(i);
          var r = new THREE.Vector3(d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2));
          r.add(i), e.setInit(d.MathUtil.rand(.9, 1.2), d.MathUtil.rand(1.2, 3.6)).setType2(h, r, Power2.easeIn).setMate(n[o % s], a, .5).setRot(Math.PI * Math.random())
        }
      }, t.prototype._initBomb = function(t, e) {
        var i, n = this._getPosBoss();
        this._interval = 0, this._len = 24;
        for (var s, a = d.TextureId.PT_BALL, o = (s = e == d.ActionType.SKILL ? [16750848] : [16750848, 16776960, 16764159]).length, h = 0; h < this._len; h++) {
          i = this._getParticle(h);
          var r = new THREE.Vector3(d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2));
          r.add(n);
          var c = new THREE.Vector3(d.MathUtil.rand(-60, 60), d.MathUtil.rand(0, 60), d.MathUtil.rand(-60, 60)),
            _ = new THREE.Vector3(0, d.MathUtil.rand(-90, -60), 0);
          i.setInit(d.MathUtil.rand(.6, .9), d.MathUtil.rand(.8, 2)).setType1(r, c, _).setMate(a, s[h % o], .5, 1)
        }
      }, t.prototype._initVoltex = function(t, e) {
        var i, n, s, a = this._getPosBoss();
        this._interval = .04, this._len = 24, e == d.ActionType.SKILL ? (s = [6737151], n = [d.TextureId.PT_BALL]) : (s = [16750848, 6737151, 16742399], n = [d.TextureId.PT_BALL, d.TextureId.PT_KIRA]);
        for (var o = s.length, h = n.length, r = 0; r < this._len; r++) {
          i = this._getParticle(r);
          var c = new THREE.Vector3(d.MathUtil.rand(-30, 30), d.MathUtil.rand(-30, 30), d.MathUtil.rand(-30, 30));
          c.add(a);
          var _ = new THREE.Vector3(d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2));
          _.add(a), i.setInit(d.MathUtil.rand(.9, 1.3), d.MathUtil.rand(1.5, 3.5)).setType2(c, _, Power2.easeIn).setMate(n[r % h], s[r % o], .6).setRot(Math.PI * Math.random())
        }
      }, t.prototype._initBossHeal = function() {
        var t, e = this._getPosBoss();
        this._interval = .1, this._len = 12;
        for (var i = 0; i < this._len; i++) {
          var n = d.MathUtil.rand(1, 2.5);
          t = this._getParticle(i);
          var s = new THREE.Vector3(d.MathUtil.rand(-3, 3), d.MathUtil.rand(1, 3), d.MathUtil.rand(-3, 3));
          s.add(e);
          var a = s.clone();
          a.y += d.MathUtil.rand(4, 8), t.setInit(1, n).setType2(s, a).setMate(d.TextureId.PT_KIRA, 6737151, .5)
        }
      }, t.prototype._initBossFlareStar = function() {
        var t, e = this._getPosNyanco();
        e.y += 5, this._interval = 0, this._len = 24;
        for (var i = [16750848, 16776960], n = i.length, s = 0; s < this._len; s++) {
          t = this._getParticle(s);
          var a = new THREE.Vector3(d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2));
          a.add(e);
          var o = new THREE.Vector3(d.MathUtil.rand(-60, 60), d.MathUtil.rand(0, 60), d.MathUtil.rand(-60, 60)),
            h = new THREE.Vector3(0, d.MathUtil.rand(-78, -60), 0);
          t.setInit(d.MathUtil.rand(.6, 1.2), d.MathUtil.rand(.6, 2.4)).setType1(a, o, h).setMate(d.TextureId.PT_BALL, i[s % n], .5, 1)
        }
      }, t.prototype._initBossUltima = function() {
        var t, e = this._getPosNyanco();
        e.y += 5, this._interval = .04, this._len = 24;
        for (var i = [d.TextureId.PT_BALL, d.TextureId.PT_KIRA], n = i.length, s = 0; s < this._len; s++) {
          t = this._getParticle(s);
          var a = new THREE.Vector3(d.MathUtil.rand(-30, 30), d.MathUtil.rand(-30, 30), d.MathUtil.rand(-30, 30));
          a.add(e);
          var o = new THREE.Vector3(d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2), d.MathUtil.rand(-2, 2));
          o.add(e), t.setInit(d.MathUtil.rand(.9, 1.2), d.MathUtil.rand(1, 3.5)).setType2(a, o, Power2.easeIn).setMate(i[s % n], 16759552, .5).setRot(Math.PI * Math.random())
        }
      }, t.prototype._initBossVanishing = function() {
        var t, e = this._getPosNyanco();
        this._interval = .1, this._len = 9;
        for (var i = 0; i < this._len; i++) {
          var n = d.MathUtil.rand(1.5, 3.5);
          t = this._getParticle(i);
          var s = new THREE.Vector3(d.MathUtil.rand(-2.4, 2.4), d.MathUtil.rand(10, 14), d.MathUtil.rand(-2.4, 2.4));
          s.add(e);
          var a = s.clone();
          a.y -= d.MathUtil.rand(3, 6), t.setInit(1, n).setType2(s, a).setMate(d.TextureId.PT_ARROW, 16750848, .5).setRot(Math.PI)
        }
      }, t.prototype.show = function(t, e) {
        void 0 === t && (t = 0), this._hideComplete = e, this._ct = 0;
        for (var i = this, n = 0; n < this._len; n++) {
          this._pts[n].show(n * this._interval + t, function() {
            i._complete()
          })
        }
      }, t.prototype._complete = function() {
        this._ct++, this._len <= this._ct && this._hideComplete && this._hideComplete()
      }, t.prototype._getParticle = function(t) {
        return this._pts[t] || (this._pts[t] = new s(this._core)), this._pts[t]
      }, t
    }(e),
    h = function(n) {
      function t(t) {
        var e = n.call(this, t) || this;
        return e._sc = 1, e._init(), e
      }
      return __extends(t, n), t.prototype.init = function(t) {
        var e;
        this._type = d.ActionType.SKILL, this._id = t;
        var i = [16737894, 16746632],
          n = d.TextureId.GRAD,
          s = 1;
        switch (e = this._getPosNyanco(!0), t) {
          case d.XSkillId.HEAL:
            i = [65382, 2293657], s = 1.2;
            break;
          case d.XSkillId.POWER:
            i = [16737792, 16746496], s = 1.2;
            break;
          case d.XSkillId.MOFU_HEAT:
            i = [6749969, 8978176], s = 1.2
        }
        this._setup(e, i, n, s)
      }, t.prototype.initSp = function(t) {
        var e;
        this._type = d.ActionType.SPECIAL, this._id = t;
        var i = [16755200, 16763904],
          n = d.TextureId.GRAD,
          s = 1;
        switch (e = this._getPosNyanco(!0), t) {
          case d.XSpecialId.FULLPOWER:
            i = [16737792, 16746496], s = 1.2
        }
        this._setup(e, i, n, s)
      }, t.prototype.initBoss = function(t) {
        var e;
        this._type = d.ActionType._BOSS, this._id = t;
        var i = [0, 0],
          n = d.TextureId.GRAD,
          s = 1;
        switch (t) {
          case d.XBossSkillId.HEAL:
            i = [39423, 2271999], n = d.TextureId.CYLINDER_WAT, s = 1.6, e = this._getPosBoss(!0);
            break;
          case d.XBossSkillId.VANISHING:
            i = [16724736, 16716066], n = d.TextureId.CYLINDER_WAT, s = 1.2, e = this._getPosNyanco(!0)
        }
        this._setup(e, i, n, s)
      }, t.prototype._setup = function(t, e, i, n) {
        void 0 === i && (i = d.TextureId.GRAD), void 0 === n && (n = 1), this._cylin0 = _.getCylinder(5, 3, 10), this._cylin1 = _.getCylinder(8, 3, 4), this._cylin0.changeMaterial(i, e[0]), this._cylin1.changeMaterial(i, e[1]), this._cylin0.setPosVec(t), this._cylin1.setPosVec(t), this._sc = n
      }, t.prototype.show = function(t, e) {
        void 0 === t && (t = 0), n.prototype.hide.call(this, t, e);
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._show()
        })
      }, t.prototype.hide = function(t, e) {
        void 0 === t && (t = 0), n.prototype.hide.call(this, t, e);
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._hide()
        })
      }, t.prototype.update = function() {
        this._cylin0.rotationY += .7 * d.Context.delta, this._cylin1.rotationY -= .7 * d.Context.delta
      }, t.prototype._show = function() {
        this._addUpdate(), this.__show(this._cylin0), this.__show(this._cylin1, this._showComplete)
      }, t.prototype.__show = function(t, e) {
        var i = t;
        i.chainScale(0).chainAlpha(.2).chainVisible(!0).chainScale(this._sc, .8, {
          ease: Back.easeOut
        }), e && i.chainFunc(function() {
          e()
        })
      }, t.prototype._hide = function() {
        this._removeUpdate(), this.__hide(this._cylin0), this.__hide(this._cylin1, this._hideComplete)
      }, t.prototype.__hide = function(t, e) {
        var i = t;
        i.chainScale(0, .8, {
          ease: Back.easeIn
        }).chainFunc(function() {
          _.add(i)
        }), e && i.chainFunc(function() {
          e()
        })
      }, t.prototype._init = function() {}, t
    }(e),
    r = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e, i;
        this._pts.init(t), t == d.XSkillId.DRAIN_HP ? (e = 16750950, i = d.TextureId.MK_MARU) : t == d.XSkillId.DRAIN_MP && (e = 3381759, i = d.TextureId.MK_MARU), this._sphere = _.getSphere(), this._sphere.changeMaterial(i, e)
      }, t.prototype.show = function(t, e) {
        void 0 === t && (t = 0), this._hideComplete = e;
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._show()
        })
      }, t.prototype.update = function() {
        this._sphere.rotationX += d.Context.delta, this._sphere.rotationZ += .88 * d.Context.delta
      }, t.prototype._show = function() {
        var t = this;
        this._pts.show(0, function() {
          t._next()
        }), d.Context.se.play(d.SoundId.DRAIN)
      }, t.prototype._next = function() {
        this._addUpdate();
        var t = this,
          e = this._getPosBoss(),
          i = this._getPosNyanco(),
          n = new THREE.Vector3(.5 * (e.x + i.x), d.MathUtil.rand(15, 18), .5 * (e.z + i.z));
        i.y += 4, this._sphere.visible = !0, this._sphere.setPosVec(e).chainAlpha(.5), this._sphere.chainTweens([.5], [{
          x: n.x,
          z: n.z,
          ease: Power0.easeNone
        }, {
          y: n.y,
          scale: 3,
          ease: Power2.easeOut
        }]).chainTweens([.5], [{
          x: i.x,
          z: i.z,
          ease: Power0.easeNone
        }, {
          y: i.y,
          scale: 1,
          ease: Power2.easeIn
        }]).chainFunc(function() {
          t._end()
        })
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._sphere), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    l = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.init(t), this._cube = _.getCube(), this._sphere = _.getSphere(), this._dome = _.getDome(), this._plane = _.getPlane(), this._cube.changeMaterial(-1, 16711782), this._cube.scale = 1, this._sphere.changeMaterial(d.TextureId.CLOUD, 3381759), this._sphere.scale = 1.5, this._dome.changeMaterial(d.TextureId.CLOUD, 16711782), this._plane.changeMaterial(d.TextureId.FL_CIRCLE, 16711680), this._dome.rotationX = this._plane.rotationX = -Math.PI / 2
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype.update = function() {
        this._sphere.setPosVec(this._cube.getPos()), this._cube.rotationX += .9 * d.Context.delta, this._cube.rotationY += .7 * d.Context.delta, this._sphere.scale = 1.5 * this._cube.scale
      }, t.prototype._show = function() {
        var t = this,
          e = this._getPosNyanco(),
          i = this._getPosBoss(),
          n = new THREE.Vector3(.5 * (e.x + i.x), d.MathUtil.rand(15, 18), .5 * (e.z + i.z));
        e.y += 2, i.y = 1, d.Context.se.play(d.SoundId.BOMB_THROW), this._cube.visible = this._sphere.visible = !0, this._cube.setPosVec(e).chainAlpha(.4), this._sphere.setPosVec(e).chainAlpha(.6), this._cube.chainTweens([.4], [{
          x: n.x,
          z: n.z,
          ease: Power0.easeNone
        }, {
          y: n.y,
          scale: 2.5,
          ease: Power2.easeOut
        }]).chainTweens([.4], [{
          x: i.x,
          z: i.z,
          ease: Power0.easeNone
        }, {
          y: i.y,
          scale: 1,
          ease: Power2.easeIn
        }]).chainFunc(function() {
          t._next()
        }), this._addUpdate()
      }, t.prototype._next = function() {
        var t = this;
        _.add(this._cube), _.add(this._sphere), this._removeUpdate(), this._dome.visible = this._plane.visible = !0, d.Context.se.play(d.SoundId.BOMB_EXP), this._pts.show();
        var e = this._getPosBoss(!0);
        this._dome.setPosVec(e).chainScale(0).chainAlpha(.8).chainTweens([.7], [{
          scale: 50,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]).chainDelay(.3, function() {
          t._end()
        }), this._plane.setPosVec(e).chainScale(0).chainAlpha(.7).chainTweens([.7], [{
          scale: 56,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        _.add(this._dome), _.add(this._plane), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    p = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.init(t), this._cube = _.getCube(), this._sphere = _.getSphere(), this._sphere2 = _.getSphere(), this._cube.changeMaterial(d.TextureId.MK_DOT, 13421568), this._sphere.changeMaterial(d.TextureId.CLOUD, 12316160), this._sphere2.changeMaterial(d.TextureId.CLOUD, 16777011)
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype._show = function() {
        d.Context.se.play(d.SoundId.VOLTEX_IN);
        var t = this;
        this._pts.show();
        var e = this._getPosBoss();
        this._cube.setPosVec(e), this._sphere.setPosVec(e), this._sphere2.setPosVec(e), this._cube.chainScale(18).chainAlpha(0).chainVisible(!0).chainAlpha(.5, .2).chainTween(1.6, {
          scale: 0,
          rotationX: d.MathUtil.rand(-2, 2),
          rotationY: d.MathUtil.rand(-2, 2),
          ease: Power2.easeIn
        }).chainFunc(function() {
          t._next()
        })
      }, t.prototype._next = function() {
        d.Context.se.play(d.SoundId.VOLTEX_EXP);
        var t = this;
        _.add(this._cube), this._sphere.chainScale(0).chainAlpha(.9).chainVisible(!0).chainTweens([.7], [{
          scale: 20,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]), this._sphere2.chainScale(0).chainAlpha(.9).chainDelay(.15).chainVisible(!0).chainTweens([.9], [{
          scale: 22,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power2.easeIn
        }]).chainDelay(.2, function() {
          t._end()
        }), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        _.add(this._sphere), _.add(this._sphere2), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    f = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._spheres = [], e._planes = [], e._len = 3, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        for (var e = [16776960, 16750848, 16711680], i = 0; i < this._len; i++) {
          var n = _.getSphere();
          n.changeMaterial(d.TextureId.CLOUD_ICE, e[i]), this._spheres[i] = n;
          var s = _.getPlane();
          s.changeMaterial(d.TextureId.FL_CIRCLE, e[i]), this._planes[i] = s
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.chainDelay(.7).changeEase(0, 12).setLookTarget(this._targetBoss).setDistance(21).setRotation(Math.PI / 12)
      }, t.prototype.update = function() {
        for (var t = [.7, 1, 1.3], e = 0; e < this._len; e++) this._spheres[e].rotationY -= d.Context.delta * t[e], this._planes[e].rotationZ += d.Context.delta * t[e]
      }, t.prototype._show = function() {
        this._addUpdate();
        for (var t = this, e = this._getPosBoss(!1), i = e.clone().add(new THREE.Vector3(0, 12, 0)), n = this._getPosBoss(!0), s = 0; s < this._len; s++) {
          var a = this._spheres[s],
            o = this._planes[s],
            h = .4 * s;
          d.Context.se.play(d.SoundId.APPLE, h + .4), a.setPosVec(i).chainAlpha(0).chainScale(10).chainDelay(h).chainVisible(!0).chainAlpha(.6, .2).chainMovePos(e, .8, {
            ease: Bounce.easeOut
          }).chainAlpha(0, .2), o.setPosVec(n).chainAlpha(.6).chainScale(0).setRot(-Math.PI / 2, 0, 0).chainDelay(h + .4).chainVisible(!0).chainTweens([.6], [{
            scale: 38,
            ease: Power2.easeOut
          }, {
            alpha: 0,
            ease: Power0.easeNone
          }]), s == this._len - 1 && a.chainFunc(function() {
            t._end()
          })
        }
      }, t.prototype._next = function() {}, t.prototype._end = function() {
        this._removeUpdate();
        for (var t = 0; t < this._len; t++) _.add(this._spheres[t]), _.add(this._planes[t]);
        this._valComplete && this._valComplete(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    y = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._cubes = [], e._trails = [], e._spheres = [], e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = this._core.pixi.battle.qte;
        this._len = [5, 6, 7, 8, 10][e.score];
        for (var i = 0; i < this._len; i++) {
          var n = _.getCube();
          n.changeMaterial(d.TextureId.TAIL, 3381759), this._cubes[i] = n;
          var s = _.getPlane();
          s.changeMaterial(d.TextureId.TRAIL, 4500223), this._trails[i] = s;
          var a = _.getSphere();
          a.changeMaterial(d.TextureId.CLOUD, 5601279), this._spheres[i] = a
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.chainDelay(.7).changeEase(0, 12).setLookTarget(this._targetDefault, new THREE.Vector3(0, -1, 0)).setDistance(24).setRotation(-Math.PI / 9)
      }, t.prototype.update = function() {
        for (var t = 0; t < this._len; t++) {
          var e = this._cubes[t];
          e.rotationX += .63 * d.Context.delta, e.rotationZ += .92 * d.Context.delta
        }
      }, t.prototype._show = function() {
        this._addUpdate();
        for (var t = this, e = 0; e < this._len; e++) {
          var i = null;
          e == this._len - 1 && (i = function() {
            t._next()
          }), this.__show(e, i)
        }
      }, t.prototype.__show = function(t, e) {
        var i = this,
          n = d.MathUtil.toRad(360 * t / this._len),
          s = this._getPosNyanco().add(this._nyancoCenterOffset);
        s.x += 12 * Math.cos(n), s.y += 12 * Math.sin(n);
        var a = this._getPosBoss().add(new THREE.Vector3(d.MathUtil.rand(-4, 4), d.MathUtil.rand(-4, 4), d.MathUtil.rand(-4, 4))),
          o = .1 * t;
        this._cubes[t].setPosVec(s).chainAlpha(.6).chainScale(0).setRot(Math.random(), Math.random(), Math.random()).chainDelay(o).chainVisible(!0).chainScale(2.5, .4, {
          ease: Back.easeOut
        }), d.Context.se.play(d.SoundId.TAIL, o);
        var h = .6 + .08 * t,
          r = this._trails[t].chainAlpha(.5);
        u.moveTrail(r, .5, .3, o + h, s, a, d.MathUtil.rand(.3, .9)), this._spheres[t].setPosVec(a).chainAlpha(.5).chainScale(0).chainDelay(o + h + .5).chainVisible(!0).chainFunc(function() {
          d.Context.se.play(d.SoundId.TAIL_HIT), i._valComplete && i._valComplete()
        }).chainTweens([.5], [{
          scale: 12,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]), e && this._spheres[t].chainFunc(e)
      }, t.prototype._next = function() {
        for (var t = this, e = 0; e < this._len; e++) {
          var i = this._cubes[e];
          i.chainDelay(.1 * e).chainScale(0, .5, {
            ease: Back.easeIn
          }), 3 == e && i.chainFunc(function() {
            t._end()
          }), e == this._len - 1 && i.chainFunc(function() {
            t._kill()
          })
        }
      }, t.prototype._end = function() {
        this._hideComplete && this._hideComplete()
      }, t.prototype._kill = function() {
        this._removeUpdate();
        for (var t = 0; t < this._len; t++) _.add(this._cubes[t]), _.add(this._spheres[t])
      }, t.prototype._init = function() {}, t
    }(e),
    v = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._spheres = [], e._domes = [], e._trails = [], e._len = 5, e._now = 0, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getPlane();
        e.changeMaterial(d.TextureId.FL_CIRCLETX, 16768409, .5), e.rotationX = Math.PI / 2, this._plane = e, (e = _.getPlane()).changeMaterial(d.TextureId.TAIL, 11184725, .2), e.rotationX = Math.PI / 2, this._plane2 = e;
        var i = this._core.pixi.battle.qte;
        this._len = [5, 7, 9, 12, 15][i.score];
        for (var n = [65382, 52428], s = 0; s < this._len; s++) {
          var a = _.getSphere();
          a.changeMaterial(d.TextureId.CLOUD, 15759788, .8), this._spheres[s] = a;
          var o = _.getDome();
          o.changeMaterial(d.TextureId.CLOUD, 14548957, .6), o.rotationX = -Math.PI / 2, this._domes[s] = o;
          var h = _.getPlane();
          h.changeMaterial(d.TextureId.TRAIL, n[s % 2], .5), this._trails[s] = h
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype.update = function() {
        this._plane.rotationZ += d.Context.delta, this._plane2.rotationZ -= d.Context.delta
      }, t.prototype._show = function() {
        var t = this;
        this._now = 0;
        var e = this._getPosNyanco();
        e.y += 80;
        var i = this._plane;
        i.setPosVec(e).chainScale(0).chainVisible(!0).chainScale(50, .6);
        var n = this._getPosNyanco();
        n.y += 90, (i = this._plane2).rotationZ = Math.random(), i.setPosVec(n).chainScale(0).chainDelay(.2).chainVisible(!0).chainScale(66, .7, {
          ease: Back.easeOut
        }), d.Context.se.play(d.SoundId.METEOR_IN);
        for (var s = 0; s < this._len; s++) {
          var a = this._spheres[s];
          a.visible = !0;
          var o = e.clone();
          o.y += -10, o.x = d.MathUtil.rand(-15, 15), o.z = d.MathUtil.rand(-15, 15), a.setPosVec(o), a.scale = 0;
          var h = t._getPosBoss();
          h.x += d.MathUtil.rand(-3, 3), h.y = 0, h.z += d.MathUtil.rand(-3, 3);
          var r = .15 * s + .3,
            c = .15 * s + .4 + d.MathUtil.rand(0, .1);
          a.chainDelay(r).chainScale(d.MathUtil.rand(4, 6), .7, {
            ease: Back.easeOut
          }).chainDelay(c).chainMovePos(h, .6, {
            ease: Power2.easeIn
          }).chainFunc(function() {
            t._next()
          });
          var _ = this._trails[s];
          u.moveTrail(_, .5, .6, r + c + .7, o, h, 3)
        }
        var l = this._spheres[0].getPos(),
          p = this._three.cameraMng.getPos();
        l.distanceTo(p);
        this._three.cameraMng.changeEase(0, 18).setDistance(20).fixPos(!1, !0, !1).setLookTarget(this._plane.target).chainDelay(1.4).fixPos(!1, !1, !1).setLookTarget(this._targetBoss).setDistance(25).setRotation(-Math.PI / 9).chainDelay(.5).setShake(1.6, 1.6, 1.6, .04).chainDelay(.3 * this._len + .2).setShake(), this._addUpdate()
      }, t.prototype._next = function() {
        var t = this,
          e = this._now;
        this._now++;
        var i = this._len <= this._now;
        _.add(this._spheres[e]);
        var n = this._domes[e];
        n.visible = !0, n.setPosVec(this._spheres[e].getPos()), n.scale = 0, n.alpha = 1, n.chainTween(.6, {
          scale: d.MathUtil.rand(40, 70),
          alpha: 0,
          ease: Power0.easeOut
        }), i && n.chainDelay(.2, function() {
          t._end()
        }), this._valComplete && this._valComplete(), d.Context.se.play(d.SoundId.METEOR_HIT)
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._plane), _.add(this._plane2);
        for (var t = 0; t < this._len; t++) _.add(this._domes[t]);
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    m = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._cubes = [], e._spheres = [], e._len = 3, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initSp(t);
        for (var e = 0; e < this._len; e++) {
          var i = _.getCube(),
            n = _.getSphere();
          i.changeMaterial(d.TextureId.CLOUD, 10092390), n.changeMaterial(d.TextureId.CLOUD, 16750950), this._cubes[e] = i, this._spheres[e] = n
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype._show = function() {
        for (var t = this, e = this._getPosBoss(), i = 0, n = 0; n < this._len; n++) {
          var s = this._spheres[n],
            a = this._cubes[n];
          d.Context.se.play(d.SoundId.CRYSIS_IN, .4 * i + .6), s.setPosVec(e).chainDelay(.4 * i).chainAlpha(0).chainScale(40).chainVisible(!0).chainAlpha(.6, .3).chainScale(0, 1, {
            ease: Power1.easeOut
          }).chainVisible(!1), i++, a.setPosVec(e).chainDelay(.4 * i).chainAlpha(0).chainScale(40).chainVisible(!0).chainAlpha(.6, .3).chainScale(0, 1, {
            rotationX: d.MathUtil.rand(-1, 1),
            rotationZ: d.MathUtil.rand(-1, 1),
            ease: Power1.easeOut
          }).chainVisible(!1), i++, n + 1 == this._len && s.chainFunc(function() {
            t._next()
          })
        }
        this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetBoss, new THREE.Vector3(0, 0, 2)).setDistance(20).setRotation(-Math.PI / 10)
      }, t.prototype._next = function() {
        var t = this;
        this._getPosBoss();
        d.Context.se.play(d.SoundId.BOMB_EXP), this._pts.show();
        for (var e = [16711680, 16750899], i = 0; i < 2; i++) {
          var n = this._spheres[i];
          n.changeMaterial(d.TextureId.CLOUD, e[i]).chainVisible(!0), n.chainAlpha(.7).chainScale(60, .9 + .2 * i, {
            alpha: 0,
            ease: Power1.easeOut
          })
        }
        this._three.cameraMng.setDistance(30).setShake(2, 2, 2, .04).chainDelay(.7).setShake().chainDelay(.5).chainFunc(function() {
          t._end()
        }), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        for (var t = 0; t < this._len; t++) _.add(this._cubes[t]), _.add(this._spheres[t]);
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    g = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._planes = [], e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initSp(t);
        var e = _.getSphere();
        e.changeMaterial(-1, 16768307), this._sphere = e;
        for (var i = 0; i < 2; i++) {
          var n = _.getPlane();
          n.changeMaterial(d.TextureId.FL_CIRCLE, 16724753, .5), this._planes[i] = n
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype._show = function() {
        var t = this,
          e = this._getPosNyanco();
        e.y += 5, d.Context.se.play(d.SoundId.FULLPOWER1), d.Context.se.play(d.SoundId.FULLPOWER2, .8), this._pts.show(), this._sphere.setPosVec(e), this._sphere.chainAlpha(.8).chainScale(0).chainVisible(!0).chainDelay(.8).chainTweens([1.4], [{
          scale: 20,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]).chainFunc(function() {
          _.add(t._sphere)
        });
        for (var i = [Math.PI / 6, -Math.PI / 6], n = 0; n < 2; n++) {
          var s = this._planes[n];
          s.setRot(-Math.PI / 2, i[n], 0).setPosVec(e), s.chainAlpha(0).chainScale(0).chainVisible(!0).chainScale(16, 1, {
            alpha: .6,
            ease: Power2.easeOut
          }).chainAlpha(0, .5).chainVisible(!1)
        }
        this._three.cameraMng.chainDelay(1.5).chainFunc(function() {
          t._end()
        })
      }, t.prototype._end = function() {
        for (var t = 0; t < 2; t++) _.add(this._planes[t]);
        this._valComplete && this._valComplete(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    T = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._domes = [], e._trails = [], e._len = 11, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initSp(t);
        var e = _.getPlane();
        e.renderOrder = 0, e.changeMaterial(d.TextureId.FL_CIRCLE2, 16768290), this._plane = e;
        var i = _.getSprite();
        i.changeMaterial(d.TextureId.NYANCO, 14522777), this._panel = i;
        for (var n = [16763904, 13434675], s = 0; s < 2; s++) {
          var a = _.getDome();
          a.changeMaterial(d.TextureId.CLOUD, n[s]), this._domes[s] = a
        }
        var o = (n = [16764057, 16751052]).length;
        for (s = 0; s < this._len; s++) {
          var h = _.getPlane();
          h.changeMaterial(d.TextureId.TRAIL, n[s % o]), this._trails[s] = h
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype.update = function() {
        this._plane.rotationZ += d.Context.delta
      }, t.prototype._show = function() {
        var t = this,
          e = this._getPosBoss();
        e.y = 0, d.Context.se.play(d.SoundId.ULTIMA_IN), this._pts.show(), this._plane.setRot(-Math.PI / 2, 0, 0).setPosVec(e).chainAlpha(0).chainVisible(!0).chainScale(50).chainScale(0, 2, {
          alpha: .7,
          ease: Power2.easeIn
        }).chainFunc(function() {
          t._next()
        }), this._three.cameraMng.changeEase(0, 12).setDistance(18).setLookTarget(this._targetBoss).setRotation(Math.PI / 12), this._addUpdate()
      }, t.prototype._next = function() {
        var t = this,
          e = this._getPosBoss();
        e.y = 0, d.Context.se.play(d.SoundId.ULTIMA_EXP), d.Context.se.play(d.SoundId.NYALTIMA, .3), this._plane.chainAlpha(.7).chainScale(0).chainScale(60, .7, {
          alpha: 0,
          ease: Power2.easeOut
        });
        for (var i = 0; i < 2; i++) {
          this._domes[i].setRot(-Math.PI / 2, 0, 0).setPosVec(e).chainVisible(!0).chainScale(0).chainAlpha(.8).chainTweens([1 + .5 * i], [{
            scale: 70,
            ease: Power1.easeOut
          }, {
            alpha: 0,
            ease: Power1.easeIn
          }])
        }
        var n = [];
        for (i = 0; i < this._len; i++) n[i] = i;
        for (i = 0; i < this._len; i++) {
          var s = d.MathUtil.randInt(0, this._len - 1);
          n[i] += n[s], n[s] = n[i] - n[s], n[i] -= n[s]
        }
        var a = 2 * Math.PI / this._len,
          o = Math.random() * Math.PI;
        for (i = 0; i < this._len; i++) {
          var h = this._trails[i].chainAlpha(.4),
            r = e,
            c = e.clone(),
            _ = n[i] * a + o;
          c.x += 80 * Math.sin(_), c.z += 80 * Math.cos(_), c.y += d.MathUtil.rand(40, 100), u.moveTrail(h, d.MathUtil.rand(.3, .2), d.MathUtil.rand(.4, .5), .07 * i + .15, r, c, d.MathUtil.rand(.5, 2))
        }
        var l = this._getPosBoss();
        l.y -= 5;
        var p = this._getPosBoss();
        p.y += 10, this._panel.setPosVec(l).chainAlpha(0).chainVisible(!0).chainScale(24).chainDelay(.2).chainAlpha(.95, .2).chainMovePos(p, 1.4, {
          alpha: 0,
          ease: Power2.easeOut
        }).chainFunc(function() {
          t._end()
        }), this._three.cameraMng.changeEase(0, 10).setDistance(32).setShake(2.5, 2.5, 2.5, .04).chainDelay(1).setShake(1.6, 1.6, 1.6, .04)
      }, t.prototype._end = function() {
        this._valComplete && this._valComplete(), this._removeUpdate(), this._three.cameraMng.setShake(), _.add(this._plane), _.add(this._panel);
        for (var t = 0; t < 2; t++) _.add(this._domes[t]);
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    S = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._spheres = [], e._trails = [], e._len = 9, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getCylinder(5, 3, 10);
        e.changeMaterial(d.TextureId.CYLINDER_LIN, 10079334), this._cylinder = e;
        var i = _.getPlane();
        i.changeMaterial(d.TextureId.FL_CIRCLE2, 10079232), this._plane = i;
        for (var n = 0; n < 2; n++) {
          var s = _.getSphere();
          s.changeMaterial(d.TextureId.CLOUD, 13421568), this._spheres[n] = s
        }
        for (n = 0; n < this._len; n++) {
          var a = _.getPlane();
          a.changeMaterial(d.TextureId.TRAIL, 16763955), this._trails[n] = a
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype.update = function() {
        this._cylinder.rotationY += d.Context.delta, this._plane.rotationZ -= d.Context.delta
      }, t.prototype._show = function() {
        this._addUpdate(), d.Context.se.play(d.SoundId.MUGIWARA, .3);
        var t = this,
          e = this._getPosBoss(!0);
        this._cylinder.setPosVec(e).chainScale(0).chainAlpha(.6).chainDelay(.4).chainVisible(!0).chainScale(2.6, .7, {
          ease: Back.easeOut
        }), this._plane.renderOrder = 0, this._plane.setPosVec(e).setRot(-Math.PI / 2, 0, 0).chainScale(0).chainAlpha(.6).chainDelay(.1).chainVisible(!0).chainScale(30, .9, {
          ease: Back.easeOut
        }).chainFunc(function() {
          t._next()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetDefault).setDistance(22).setRotation(Math.PI / 12)
      }, t.prototype._next = function() {
        for (var t = this, e = this._getPosBoss(!0), i = 0; i < this._len; i++) {
          var n = e.clone(),
            s = e.clone();
          n.y += d.MathUtil.rand(20, 30), n.x += d.MathUtil.rand(-40, 40), n.z += d.MathUtil.rand(-40, 40), s.x += d.MathUtil.rand(-5, 5), s.z += d.MathUtil.rand(-5, 5);
          var a = this._trails[i].chainAlpha(.5);
          u.moveTrail(a, .6, .5, .2 * i, n, s, d.MathUtil.rand(.5, 3))
        }
        var o = [function() {
          d.Context.se.play(d.SoundId.DRAINUP), t._valComplete && t._valComplete()
        }, function() {
          d.Context.se.play(d.SoundId.DRAINUP), t._valComplete && t._valComplete()
        }];
        for (i = 0; i < 2; i++) {
          var h = this._spheres[i];
          this._moveSphere(h, .6 + .6 * i, o[i])
        }
        this._three.cameraMng.changeEase(0, 12).setDistance(28).chainDelay(.4).setShake(1.6, 1.6, 1.6, .04).chainDelay(1.8).setShake().chainFunc(function() {
          t._next2()
        })
      }, t.prototype._moveSphere = function(t, e, i) {
        void 0 === e && (e = 0);
        var n = this._getPosBoss(),
          s = this._getPosNyanco(),
          a = new THREE.Vector3(.5 * (n.x + s.x), d.MathUtil.rand(15, 20), .5 * (n.z + s.z));
        a.x += d.MathUtil.rand(-2, 2), a.y += d.MathUtil.rand(-2, 2), s.y += 5, t.setPosVec(n).chainAlpha(.6).chainDelay(e).chainVisible(!0), t.chainTweens([.5], [{
          x: a.x,
          z: a.z,
          ease: Power0.easeNone
        }, {
          y: a.y,
          scale: 3,
          ease: Power2.easeOut
        }]).chainTweens([.5], [{
          x: s.x,
          z: s.z,
          ease: Power0.easeNone
        }, {
          y: s.y,
          scale: 1,
          ease: Power2.easeIn
        }]).chainFunc(function() {
          _.add(t)
        }), i && t.chainFunc(i)
      }, t.prototype._next2 = function() {
        var t = this;
        this._cylinder.chainScale(0, .6, {
          ease: Back.easeIn
        }), this._plane.chainScale(0, .6, {
          ease: Back.easeIn
        }).chainFunc(function() {
          t._end()
        })
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._cylinder), _.add(this._plane), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    w = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getCube(),
          i = [16737792, 10092288, 39423][d.MathUtil.randInt(0, 2)];
        e.changeMaterial(-1, i), this._cube = e;
        var n = _.getDome();
        n.changeMaterial(d.TextureId.CLOUD, i), this._dome = n
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 8).setRotation(Math.PI / 5).setHeight(7).setDistance(24)
      }, t.prototype.update = function() {}, t.prototype._show = function() {
        var t = this,
          e = this._getPosBoss(),
          i = this._getPosNyanco();
        i.y = 5, this._cube.setPosVec(e).chainAlpha(.7).chainScale(3).chainVisible(!0).chainMovePos(i, .4, {
          scale: 2,
          ease: Power2.easeIn
        }).chainFunc(function() {
          t._next()
        }), d.Context.se.play(d.SoundId.BOMB_THROW, 0, .6)
      }, t.prototype._next = function() {
        _.add(this._cube);
        var t = this,
          e = this._getPosNyanco();
        this._dome.setPosVec(e).setRot(-Math.PI / 2, 0, 0).chainAlpha(.7).chainScale(0).chainVisible(!0).chainTweens([.5], [{
          scale: 22,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]).chainFunc(function() {
          t._end()
        }), d.Context.se.play(d.SoundId.SHOOT), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        _.add(this._dome), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    x = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initBoss(t), this._cylinder.initBoss(t);
        var e = _.getPlane();
        e.changeMaterial(d.TextureId.FL_CIRCLE, 56831), this._plane = e
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype.update = function() {
        this._plane.rotationZ += d.Context.delta
      }, t.prototype._show = function() {
        var t = this;
        this._addUpdate(), d.Context.se.play(d.SoundId.HEAL, .3);
        var e = this._getPosBoss(!0);
        this._plane.renderOrder = 0, this._plane.setPosVec(e).setRot(-Math.PI / 2, 0, 0).chainScale(0).chainAlpha(.7).chainDelay(.3).chainVisible(!0).chainScale(20, .7, {
          ease: Back.easeOut
        }), this._cylinder.show(.3), this._pts.show(.7), this._three.cameraMng.changeEase(0, 15).setLookTarget(this._targetBoss).setRotation(Math.PI / 8).chainDelay(1.4, function() {
          t._next()
        }).chainDelay(.4, function() {
          t._end()
        })
      }, t.prototype._next = function() {
        d.Context.se.play(d.SoundId.HEALUP), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        var t = this;
        this._cylinder.hide(), this._plane.chainScale(0, .6, {
          ease: Back.easeIn
        }).chainFunc(function() {
          _.add(t._plane)
        }), this._removeUpdate(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core), this._cylinder = new h(this._core)
      }, t
    }(e),
    M = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._planes = [], e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getCylinder(1, 1, 3);
        e.changeMaterial(d.TextureId.CLOUD, 16711680), this._cylinder = e, this._len = 2;
        for (var i = 0; i < this._len; i++) {
          var n = _.getPlane();
          n.changeMaterial(d.TextureId.FL_TOGE, 16750848), this._planes[i] = n
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(20)
      }, t.prototype.update = function() {
        this._cylinder.rotationY += .8 * d.Context.delta;
        for (var t = [d.Context.delta, -d.Context.delta], e = 0; e < this._len; e++) {
          var i = this._planes[e];
          i.rotationZ += t[e], i.visible = .7 < Math.random()
        }
      }, t.prototype._show = function() {
        var t = this,
          e = this._getPosNyanco(!0);
        d.Context.se.play(d.SoundId.FLAME), this._addUpdate(), this._cylinder.setPosVec(e).chainScale(0).chainAlpha(.7).chainVisible(!0).chainScale(6, .4, {
          ease: Power2.easeOut
        }).chainDelay(1.3).chainFunc(function() {
          t._next()
        });
        for (var i = 0; i < this._len; i++) this.__show(i, this._planes[i])
      }, t.prototype.__show = function(t, e) {
        var i = this._getPosNyanco(!0);
        i.y += 6 * t, e.setPosVec(i).setRot(-Math.PI / 2, 0, 0).chainDelay(.2 * t + .2).chainAlpha(.4).chainVisible(!0).chainScale(18, .5, {
          ease: Back.easeOut
        })
      }, t.prototype._next = function() {
        var t = this;
        this._cylinder.chainScale(0, .4, {
          ease: Power2.easeIn
        }).chainDelay(.1, function() {
          t._end()
        });
        for (var e = 0; e < this._len; e++) this.__next(e, this._planes[e]);
        this._valComplete && this._valComplete()
      }, t.prototype.__next = function(t, e) {
        e.chainDelay(.1 * t).chainScale(0, .5, {
          ease: Back.easeIn
        }).chainFunc(function() {
          _.add(e)
        })
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._cylinder), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    E = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getSphere(5, 4);
        e.changeMaterial(d.TextureId.CLOUD_ICE, 43775), this._sphere = e;
        var i = _.getPlane();
        i.changeMaterial(d.TextureId.FL_CIRCLE, 3394815), this._plane = i
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(25)
      }, t.prototype.update = function() {
        this._sphere.rotationY += .5 * d.Context.delta
      }, t.prototype._show = function() {
        var t = this;
        this._addUpdate();
        var e = this._getPosNyanco();
        e.y += 20;
        var i = this._getPosNyanco();
        i.y += 5, this._sphere.setPosVec(e).chainAlpha(0).chainScale(10).chainVisible(!0).chainAlpha(.8, .3).chainMovePos(i, 1, {
          ease: Bounce.easeOut
        }).chainFunc(function() {
          t._next()
        }), this._plane.setPosVec(this._getPosNyanco()).setRot(-Math.PI / 2, 0, 0).chainDelay(.7).chainScale(0).chainAlpha(.6).chainVisible(!0).chainTweens([.7], [{
          scale: 32,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]), d.Context.se.play(d.SoundId.ICE, .3)
      }, t.prototype._next = function() {
        var t = this;
        this._sphere.chainAlpha(0, .3).chainFunc(function() {
          t._end()
        }), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        _.add(this._sphere), _.add(this._plane), this._removeUpdate(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    I = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getSphere();
        e.changeMaterial(-1, 16776960), this._sphere0 = e;
        var i = _.getSphere();
        i.changeMaterial(d.TextureId.MK_WAVE, 16763955), this._sphere1 = i
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {
        this._sphere1.visible = Math.random() < .7, this._sphere1.rotationX += .44 * d.Context.delta, this._sphere1.rotationZ += .55 * d.Context.delta
      }, t.prototype._show = function() {
        this._addUpdate();
        var t = this,
          e = this._getPosNyanco();
        e.y = 5;
        for (var i = [this._sphere0, this._sphere1], n = 0; n < 2; n++) {
          var s = i[n];
          s.setPosVec(e).chainAlpha(.5).chainScale(0).chainDelay(.3 * n).chainVisible(!0).chainScale(10 + 4 * n, .5, {
            ease: Back.easeOut
          }).chainDelay(.6)
        }
        for (s.chainFunc(function() {
            t._next()
          }), n = 0; n < 4; n++) this._three.cameraMng.chainDelay(.3).chainFunc(function() {
          t._valComplete && t._valComplete()
        });
        d.Context.se.play(d.SoundId.THUNDER)
      }, t.prototype._next = function() {
        for (var t = this, e = [this._sphere0, this._sphere1], i = 0; i < 2; i++) {
          var n = e[i];
          n.chainScale(0, .4, {
            ease: Back.easeIn
          }).chainDelay(.3)
        }
        n.chainFunc(function() {
          t._end()
        })
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._sphere0), _.add(this._sphere1), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    P = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._planes = [], e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initBoss(t);
        var e = _.getSphere();
        e.changeMaterial(d.TextureId.CLOUD, 16724736), this._sphere = e;
        for (var i = 0; i < 2; i++) {
          var n = _.getPlane();
          n.changeMaterial(d.TextureId.FL_CIRCLE, 14540083), this._planes[i] = n
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {
        this._sphere.rotationY += .6 * d.Context.delta, this._sphere.rotationZ += .77 * d.Context.delta
      }, t.prototype._show = function() {
        this._addUpdate();
        var t = this,
          e = this._getPosNyanco();
        e.y += 5, this._sphere.setPosVec(e).chainScale(40).chainAlpha(0).chainVisible(!0).chainScale(0, 1, {
          alpha: .7,
          ease: Power2.easeIn
        }).chainFunc(function() {
          t._next()
        }), d.Context.se.play(d.SoundId.FLARESTAR, .5)
      }, t.prototype._next = function() {
        var t = this,
          e = this._getPosNyanco();
        e.y += 5;
        this._sphere.changeMaterial(d.TextureId.CLOUD, 16711680), this._sphere.chainAlpha(.7).chainScale(12, .8, {
          ease: Power1.easeOut
        }).chainFunc(function() {
          t._next2()
        }).chainTweens([.8], [{
          scale: 30,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]).chainFunc(function() {
          t._end()
        });
        for (var i = [Math.PI / 5, -Math.PI / 5], n = 0; n < 2; n++) {
          this._planes[n].setPosVec(e).setRot(-Math.PI / 2, i[n], 0).chainAlpha(.7).chainScale(0).chainDelay(.1 * n + .1).chainVisible(!0).chainTweens([1], [{
            scale: 40,
            ease: Power2.easeOut
          }, {
            alpha: 0,
            ease: Power0.easeNone
          }])
        }
        this._three.cameraMng.setShake(1.4, 1.4, 1.4, .04).chainDelay(.8).setShake(2.2, 2.2, 2.2, .03).chainDelay(.8).setShake()
      }, t.prototype._next2 = function() {
        this._pts.show(.1), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._sphere);
        for (var t = 0; t < 2; t++) _.add(this._planes[t]);
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    C = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._trails = [], e._len = 10, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getCylinder(5, 3, 10);
        e.changeMaterial(d.TextureId.CYLINDER_WAT, 10075033), this._cylinder = e;
        for (var i = [12303291, 7829367, 4473924, 4474009], n = i.length, s = 0; s < this._len; s++) {
          var a = _.getPlane();
          a.changeMaterial(d.TextureId.TRAIL, i[s % n]), this._trails[s] = a
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {
        this._cylinder.rotationY += .8 * d.Context.delta
      }, t.prototype._show = function() {
        this._addUpdate();
        var t = this,
          e = this._getPosNyanco();
        this._cylinder.setPosVec(e).chainScale(0).chainAlpha(.4).chainVisible(!0).chainScale(2, .9, {
          ease: Back.easeOut
        }).chainDelay(.7).chainFunc(function() {
          t._next()
        });
        for (var i = 0; i < this._len; i++) {
          var n = e.clone(),
            s = e.clone();
          n.y += d.MathUtil.rand(30, 40), n.x += d.MathUtil.rand(-50, 50), n.z += d.MathUtil.rand(-50, 50), s.x += d.MathUtil.rand(-4, 4), s.z += d.MathUtil.rand(-4, 4);
          var a = this._trails[i].chainAlpha(.5);
          u.moveTrail(a, .6, .5, .1 * i, n, s, d.MathUtil.rand(1, 4))
        }
        d.Context.se.play(d.SoundId.HELLBOUND)
      }, t.prototype._next = function() {
        var t = this;
        this._cylinder.chainScale(0, .8, {
          ease: Back.easeIn
        }).chainFunc(function() {
          t._end()
        }), this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        _.add(this._cylinder), this._removeUpdate(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    A = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._domes = [], e._trails = [], e._len = 10, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initBoss(t);
        var e = _.getPlane();
        e.renderOrder = 0, e.changeMaterial(d.TextureId.FL_CIRCLE2, 14540032), this._plane = e;
        for (var i = [16763904, 13434675], n = 0; n < 2; n++) {
          var s = _.getDome();
          s.changeMaterial(d.TextureId.CLOUD, i[n]), this._domes[n] = s
        }
        for (n = 0; n < this._len; n++) {
          var a = _.getPlane();
          a.changeMaterial(d.TextureId.TRAIL, 16764057), this._trails[n] = a
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        })
      }, t.prototype.update = function() {
        this._plane.rotationZ += d.Context.delta
      }, t.prototype._show = function() {
        var t = this,
          e = this._getPosNyanco();
        e.y = 0, this._pts.show(), this._plane.setRot(-Math.PI / 2, 0, 0).setPosVec(e).chainAlpha(0).chainVisible(!0).chainScale(50).chainScale(0, 2, {
          alpha: .7,
          ease: Power2.easeIn
        }).chainFunc(function() {
          t._next()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(20), this._addUpdate(), d.Context.se.play(d.SoundId.ULTIMA_IN)
      }, t.prototype._next = function() {
        d.Context.se.play(d.SoundId.ULTIMA_EXP);
        var t = this,
          e = this._getPosNyanco();
        e.y = 0, this._plane.chainAlpha(.7).chainScale(0).chainScale(60, .7, {
          alpha: 0,
          ease: Power2.easeOut
        });
        for (var i = 0; i < 2; i++) {
          this._domes[i].setRot(-Math.PI / 2, 0, 0).setPosVec(e).chainVisible(!0).chainScale(0).chainAlpha(.7).chainTweens([.9 + .4 * i], [{
            scale: 70,
            ease: Power1.easeOut
          }, {
            alpha: 0,
            ease: Power0.easeNone
          }])
        }
        var n = [];
        for (i = 0; i < this._len; i++) n[i] = i;
        for (i = 0; i < this._len; i++) {
          var s = d.MathUtil.randInt(0, this._len - 1);
          n[i] += n[s], n[s] = n[i] - n[s], n[i] -= n[s]
        }
        var a = 2 * Math.PI / this._len,
          o = Math.random() * Math.PI;
        for (i = 0; i < this._len; i++) {
          var h = this._trails[i].chainAlpha(.4),
            r = e,
            c = e.clone(),
            _ = n[i] * a + o;
          c.x += 80 * Math.sin(_), c.z += 80 * Math.cos(_), c.y += d.MathUtil.rand(40, 100), u.moveTrail(h, d.MathUtil.rand(.3, .2), d.MathUtil.rand(.4, .5), .07 * i + .15, r, c, d.MathUtil.rand(.5, 2))
        }
        this._three.cameraMng.changeEase(0, 10).setRotation(-Math.PI / 8).setDistance(32).setShake(2.4, 2.4, 2.4, .04).chainDelay(1).setShake(1.6, 1.6, 1.6, .04).chainDelay(.4).chainFunc(function() {
          t._end()
        })
      }, t.prototype._end = function() {
        this._valComplete && this._valComplete(), this._removeUpdate(), this._three.cameraMng.setShake(), _.add(this._plane);
        for (var t = 0; t < 2; t++) _.add(this._domes[t]);
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    b = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initBoss(t), this._cylinder.initBoss(t)
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setRotation(-Math.PI / 3).setDistance(18)
      }, t.prototype.update = function() {}, t.prototype._show = function() {
        var t = this;
        this._cylinder.show(), this._pts.show(.4), this._three.cameraMng.chainDelay(.8, function() {
          t._next()
        }).chainDelay(1, function() {
          t._end()
        }), d.Context.se.play(d.SoundId.VANISHING)
      }, t.prototype._next = function() {
        this._valComplete && this._valComplete()
      }, t.prototype._end = function() {
        this._cylinder.hide(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core), this._cylinder = new h(this._core)
      }, t
    }(e),
    L = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._planes = [], e._trails = [], e._tlen = 16, e._sphere = [], e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        this._pts.initBoss(t);
        var e = _.getPlane();
        e.changeMaterial(d.TextureId.FL_CIRCLE2, 16711680), this._floor = e, (s = _.getPlane()).changeMaterial(d.TextureId.TAIL, 5592320), this._plane2 = s;
        for (var i = [16763904, 16755200], n = 0; n < 2; n++) {
          var s;
          (s = _.getPlane()).changeMaterial(d.TextureId.FL_CIRCLETX, i[n]), this._planes[n] = s;
          var a = _.getSphere();
          a.changeMaterial(d.TextureId.CLOUD, 16733440), this._sphere[n] = a
        }
        var o = (i = [14522624, 15654144, 11197730]).length;
        for (n = 0; n < this._tlen; n++) {
          var h = _.getPlane();
          h.changeMaterial(d.TextureId.TRAIL, i[n % o]), this._trails[n] = h
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .4, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).fixPos(!1, !0, !1).setLookTarget(this._targetNyanco, new THREE.Vector3(0, 60, 0)).setDistance(26)
      }, t.prototype.update = function() {
        for (var t = [d.Context.delta, -d.Context.delta], e = 0; e < 2; e++) {
          this._planes[e].rotationZ += t[e]
        }
        this._plane2.rotationZ += .6 * d.Context.delta
      }, t.prototype._show = function() {
        d.Context.se.play(d.SoundId.ULTRANOVA);
        var t = this;
        this._addUpdate();
        var e = this._getPosNyanco();
        e.add(new THREE.Vector3(0, 65, 0));
        var i = e.clone().add(new THREE.Vector3(0, -10, 0)),
          n = e.clone().add(new THREE.Vector3(0, -20, 0));
        (o = this._plane2).setPosVec(e).setRot(Math.PI / 2, 0, Math.random()).chainAlpha(.25).chainScale(0).chainDelay(0).chainVisible(!0).chainScale(77, .6, {
          ease: Back.easeOut
        });
        for (var s = [i, n], a = 0; a < 2; a++) {
          var o = this._planes[a];
          o.setPosVec(s[a]).setRot(Math.PI / 2, 0, 0).chainAlpha(.6).chainScale(0).chainDelay(.3 * (a + 1)).chainVisible(!0).chainScale(60, .6, {
            ease: Back.easeOut
          })
        }
        this._three.cameraMng.chainDelay(1.5).fixPos(!1, !1, !1).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(12).chainFunc(function() {
          t._next()
        })
      }, t.prototype._next = function() {
        for (var t = this, e = this._getPosNyanco(), i = 0; i < this._tlen; i++) {
          var n = e.clone(),
            s = e.clone();
          n.y += d.MathUtil.rand(40, 50), n.x += d.MathUtil.rand(-60, 60), n.z += d.MathUtil.rand(-60, 60), s.x += d.MathUtil.rand(-12, 12), s.z += d.MathUtil.rand(-12, 12);
          var a = this._trails[i].chainAlpha(.5);
          u.moveTrail(a, .6, .5, .1 * i, n, s, d.MathUtil.rand(.4, 3))
        }
        this._three.cameraMng.chainDelay(.6).setShake(1.6, 1.6, 1.6, .04).changeEase(0, 44).setDistance(33).chainDelay(1).chainFunc(function() {
          t._next2()
        })
      }, t.prototype._next2 = function() {
        for (var t = this, e = this._getPosNyanco().add(this._nyancoCenterOffset), i = function() {
            t._valComplete && t._valComplete()
          }, n = 0; n < 2; n++) {
          var s = this._sphere[n];
          s.setPosVec(e).chainScale(0).chainAlpha(.7).chainDelay(.5 * n).chainVisible(!0).chainTweens([2], [{
            scale: 40,
            ease: Power2.easeOut
          }, {
            alpha: 0,
            ease: Power2.easeIn
          }]), 1 == n && s.chainFunc(i).chainDelay(.2).chainFunc(function() {
            t._end()
          })
        }
        this._pts.show(.5), this._floor.setPosVec(e).setRot(-Math.PI / 2, 0, 0).chainScale(0).chainAlpha(.6).chainDelay(.2).chainVisible(!0).chainTweens([2.2], [{
          scale: 60,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]), this._three.cameraMng.chainDelay(.2).setShake(3, 3, 3, .04).chainDelay(1.4).setShake()
      }, t.prototype._end = function() {
        this._removeUpdate();
        for (var t = 0; t < 2; t++) _.add(this._planes[t]), _.add(this._sphere[t]);
        _.add(this._plane2), _.add(this._floor), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {
        this._pts = new o(this._core)
      }, t
    }(e),
    k = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getSphere();
        e.changeMaterial(-1, 16777215), this._sphere = e
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .6, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setDistance(39)
      }, t.prototype.update = function() {}, t.prototype._show = function() {
        var t = this;
        this._core.three.effectMng.start(.4, d.EffectId.PARADIGM);
        var e = this._core.three.cameraTarget.getPos();
        this._sphere.setPosVec(e).chainScale(0).chainAlpha(.3).chainVisible(!0).chainScale(80, 2.2, {
          alpha: 0,
          ease: Power2.easeIn
        }), this._three.cameraMng.chainDelay(1).chainFunc(function() {
          t._next()
        }), d.Context.se.play(d.SoundId.PARADIGM)
      }, t.prototype._next = function() {
        var t = this;
        this._core.three.effectMng.start(1, d.EffectId.PARADIGM), this._valComplete && this._valComplete(), this._three.cameraMng.chainDelay(1.2).chainFunc(function() {
          t._end()
        })
      }, t.prototype._end = function() {
        _.add(this._sphere), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    D = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getSphere();
        e.changeMaterial(d.TextureId.MK_DOT, 5592405), this._sphere = e
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {
        this._sphere.rotationX += 1.11 * d.Context.delta, this._sphere.rotationY += 1.22 * d.Context.delta, this._sphere.visible = .65 < Math.random()
      }, t.prototype._show = function() {
        this._addUpdate();
        var t = this,
          e = this._getPosNyanco().add(this._nyancoCenterOffset),
          i = this._sphere;
        i.setPosVec(e).chainScale(0).chainAlpha(1).chainVisible(!0).chainScale(15, .7, {
          ease: Back.easeOut
        });
        for (var n = 0; n < 12; n++) i.chainScale(d.MathUtil.rand(-3, 3) + 15).chainDelay(.06);
        i.chainScale(20).chainScale(0, .5, {
          ease: Power2.easeIn
        }).chainFunc(function() {
          t._end()
        }), this._three.cameraMng.chainDelay(.7).setShake(1.6, 1.6, 1.6, .06).chainDelay(.72 + .2).setShake(), d.Context.se.play(d.SoundId.PHANTOM)
      }, t.prototype._next = function() {}, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._sphere), this._valComplete && this._valComplete(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    R = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._spheres = [], e._trails = [], e._domes = [], e._len = 8, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        for (var e = [16776960, 16768307, 16755319], i = [16750899, 16746581], n = e.length, s = i.length, a = 0; a < this._len; a++) {
          var o = _.getSphere();
          o.changeMaterial(d.TextureId.CLOUD, 16724736), this._spheres[a] = o;
          var h = _.getPlane();
          h.changeMaterial(d.TextureId.TRAIL, e[a % n]), this._trails[a] = h;
          var r = _.getDome();
          r.changeMaterial(d.TextureId.CLOUD, i[a % s]), this._domes[a] = r
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {}, t.prototype._show = function() {
        for (var t = this, e = 0; e < this._len; e++) {
          var i = null;
          e == this._len - 3 && (i = function() {
            t._end()
          }), e == this._len - 1 && (i = function() {
            t._kill()
          }), this.__show(e, i)
        }
        this._three.cameraMng.chainDelay(.5).setShake(1.5, 1.5, 1.5, .04).chainDelay(.2 * this._len).setShake()
      }, t.prototype.__show = function(t, e) {
        var i = .2 * t,
          n = this,
          s = this._getPosNyanco().add(new THREE.Vector3(d.MathUtil.rand(-15, 15), 30, d.MathUtil.rand(-15, 15) - 25)),
          a = this._getPosNyanco().add(new THREE.Vector3(d.MathUtil.rand(-5, 5), 0, d.MathUtil.rand(-5, 5))),
          o = this._trails[t].chainAlpha(.5);
        u.moveTrail(o, .5, .4, i, s, a, d.MathUtil.rand(.6, 1.4)), this._spheres[t].setPosVec(s).chainAlpha(.6).chainScale(6).chainDelay(i).chainVisible(!0).chainMovePos(a, .5, {
          ease: Power2.easeIn
        }).chainAlpha(0, .1).chainVisible(!1), this._domes[t].setPosVec(a).setRot(-Math.PI / 2, 0, 0).chainScale(0).chainAlpha(.6).chainDelay(i + .5).chainFunc(function() {
          d.Context.se.play(d.SoundId.METEOR_HIT), n._valComplete && n._valComplete()
        }).chainVisible(!0).chainTweens([1.2], [{
          scale: d.MathUtil.rand(32, 38),
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]).chainVisible(!1), e && this._domes[t].chainFunc(e)
      }, t.prototype._kill = function() {
        for (var t = 0; t < this._len; t++) _.add(this._spheres[t]), _.add(this._domes[t])
      }, t.prototype._end = function() {
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    O = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getSphere();
        e.changeMaterial(d.TextureId.CLOUD, 16737792), this._sphere = e;
        var i = _.getPlane();
        i.changeMaterial(d.TextureId.TRAIL, 16750848), this._trail = i;
        var n = _.getDome();
        n.changeMaterial(d.TextureId.CLOUD, 16750899), this._dome = n
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {}, t.prototype._show = function() {
        var t = this,
          e = this._getPosNyanco().add(new THREE.Vector3(d.MathUtil.rand(-15, 15), 30, d.MathUtil.rand(-15, 15) - 25)),
          i = this._getPosNyanco(),
          n = this._trail.chainAlpha(.5);
        u.moveTrail(n, .5, .4, .2, e, i, d.MathUtil.rand(.6, 1.4)), this._sphere.setPosVec(e).chainAlpha(.6).chainScale(6).chainDelay(.2).chainVisible(!0).chainMovePos(i, .5, {
          ease: Power2.easeIn
        }).chainAlpha(0, .1).chainVisible(!1), this._dome.setPosVec(i).setRot(-Math.PI / 2, 0, 0).chainScale(0).chainAlpha(.6).chainDelay(.7).chainFunc(function() {
          d.Context.se.play(d.SoundId.METEOR_HIT), t._valComplete && t._valComplete()
        }).chainVisible(!0).chainTweens([1.4], [{
          scale: 36,
          ease: Power2.easeOut
        }, {
          alpha: 0,
          ease: Power0.easeNone
        }]).chainVisible(!1).chainFunc(function() {
          t._kill()
        }), TweenLite.delayedCall(1.2, function() {
          t._end()
        }), this._three.cameraMng.chainDelay(.7).setShake(1.6, 1.6, 1.6, .04).chainDelay(.4).setShake()
      }, t.prototype._kill = function() {
        _.add(this._sphere), _.add(this._dome)
      }, t.prototype._end = function() {
        this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    U = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._planes = [], e._len = 3, e._init(), e
      }
      return __extends(t, i), t.prototype.init = function(t) {
        var e = _.getCylinder(1, 1, 3);
        e.changeMaterial(d.TextureId.CLOUD_ICE, 3390463), this._cylinder = e;
        for (var i = 0; i < this._len; i++) {
          var n = _.getPlane();
          n.changeMaterial(d.TextureId.FL_CIRCLETX, 5623022), this._planes[i] = n
        }
      }, t.prototype.show = function(t, e, i) {
        void 0 === t && (t = 0), t += .2, this._hideComplete = e, this._valComplete = i;
        var n = this;
        TweenLite.delayedCall(t, function() {
          n._show()
        }), this._three.cameraMng.changeEase(0, 12).setLookTarget(this._targetNyanco, this._nyancoCenterOffset).setDistance(26)
      }, t.prototype.update = function() {
        this._cylinder.rotationY -= d.Context.delta;
        for (var t = 0; t < this._len; t++) this._planes[t].rotationZ += d.Context.delta
      }, t.prototype._show = function() {
        this._addUpdate();
        for (var t = this._getPosBoss(), e = this, i = 0; i < this._len; i++) {
          var n = this._getPosNyanco();
          n.z += 11 * i - 11, n.y = t.y;
          var s = this._planes[i];
          s.setPosVec(n).chainAlpha(.5).chainScale(0).chainDelay(.2 * i).chainVisible(!0).chainScale(33, .7, {
            ease: Back.easeOut
          }), d.Context.se.play(d.SoundId.MEGAFLARE, .2 * i), i == this._len - 1 && s.chainFunc(function() {
            e._next()
          })
        }
      }, t.prototype._next = function() {
        var t = this,
          e = this._getPosBoss();
        d.Context.se.play(d.SoundId.ULTIMA_EXP), this._cylinder.scaleY = 0, this._cylinder.scaleX = this._cylinder.scaleZ = 12, this._cylinder.setPosVec(e).setRot(Math.PI / 2, 0, 0).chainAlpha(.5).chainVisible(!0).chainTween(.9, {
          scaleY: 20,
          ease: Power1.easeOut
        }).chainDelay(.5, function() {
          t._next2()
        }), this._three.cameraMng.chainDelay(.1).setShake(1.8, 1.8, 1.8, .04)
      }, t.prototype._next2 = function() {
        var t = this;
        this._cylinder.chainTween(.6, {
          scaleY: 0,
          z: 60,
          ease: Power1.easeIn
        });
        for (var e = 0; e < this._len; e++) {
          var i = this._planes[e];
          i.chainDelay(.15 * e).chainScale(0, .6, {
            ease: Back.easeOut
          }), e == this._len - 1 && i.chainFunc(function() {
            t._end()
          })
        }
        this._three.cameraMng.chainDelay(.1).setShake()
      }, t.prototype._end = function() {
        this._removeUpdate(), _.add(this._cylinder);
        for (var t = 0; t < this._len; t++) _.add(this._planes[t]);
        this._valComplete && this._valComplete(), this._hideComplete && this._hideComplete()
      }, t.prototype._init = function() {}, t
    }(e),
    a = function() {
      function t(t) {
        this._core = t
      }
      return t.prototype.start = function(t, e) {
        this._skillBase = t, this._complete = e
      }, t.prototype._backToDefault = function(t) {
        void 0 === t && (t = .5);
        var e = this._core.three;
        e.cameraMng.chainDelay(t).fixPos(!1, !1, !1).changeEase(0, 12).setLookTarget(e.cameraTarget.target).setShake().setRotation(c.CAMERA_ROT).setDistance(c.CAMERA_DISTANCE).setHeight(c.CAMERA_HEIGHT), e.nyanco.chainDelay(t).chainAnimation(d.DataId.VMD_IDLE, 1).chainFunc(this._complete)
      }, t
    }(),
    B = function(a) {
      function t(t) {
        var e = a.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, a), t.prototype.start = function(t, e) {
        a.prototype.start.call(this, t, e), this._sd = t;
        var i = this._core.three,
          n = this._core.pixi,
          s = this;
        i.nyanco.chainAnimation(d.DataId.VMD_SKILL, 1, .1, function() {
          n.battle.status.addMP(-t.mp, !1), n.battle.display.showSkill(t), i.cameraMng.changeEase(0, 12).setLookTarget(i.nyanco.target, new THREE.Vector3(0, 5, 0)).setRotation(-Math.PI / 3).setDistance(15)
        }).chainDelay(.3, function() {
          s._next()
        })
      }, t.prototype._next = function() {
        var t = this._sd.id;
        switch (this._circle.init(d.ActionType.SKILL), this._circle.show(), this._cylinder.init(t), this._cylinder.show(.2), t) {
          case d.XSkillId.HEAL:
          case d.XSkillId.POWER:
          case d.XSkillId.MOFU_HEAT:
            d.Context.se.play(d.SoundId.HEAL, .3);
            break;
          default:
            d.Context.se.play(d.SoundId.MAGICK)
        }
        switch (t) {
          case d.XSkillId.HEAL:
          case d.XSkillId.POWER:
          case d.XSkillId.MOFU_HEAT:
            this._nextHealType(t);
            break;
          case d.XSkillId.DRAIN_MP:
          case d.XSkillId.DRAIN_HP:
            this._nextDrainType(t);
            break;
          case d.XSkillId.BOMB:
            this._nextBomb();
            break;
          case d.XSkillId.VOLTEX:
            this._nextVoltex();
            break;
          case d.XSkillId.APPLE:
            this._nextApple();
            break;
          case d.XSkillId.TAIL:
            this._nextTail()
        }
      }, t.prototype._nextHealType = function(t) {
        var e = this._core.three,
          i = (this._core.pixi, this);
        switch (this._ptmng.init(this._sd.id), this._ptmng.show(.4), t) {
          case d.XSkillId.HEAL:
            d.Context.se.play(d.SoundId.HEALUP, .8);
            break;
          case d.XSkillId.POWER:
          case d.XSkillId.MOFU_HEAT:
            d.Context.se.play(d.SoundId.POWERUP, .4)
        }
        e.cameraMng.chainDelay(.8, function() {
          V.startSkill(i._sd.id)
        }).chainDelay(1, function() {
          i._backToDefault()
        })
      }, t.prototype._nextDrainType = function(t) {
        var e = this._core.three,
          i = (this._core.pixi, this);
        this._drain || (this._drain = new r(this._core)), this._drain.init(this._sd.id);
        var n = function() {
            i._backToDefault()
          },
          s = function() {
            V.startSkill(i._sd.id), e.cameraMng.chainDelay(.2, n)
          };
        e.cameraMng.chainDelay(.7).changeEase(0, 12).setLookTarget(e.cameraTarget.target).setDistance(20).setRotation(Math.PI / 12).chainDelay(.3, function() {
          i._drain.show(0, s)
        })
      }, t.prototype._nextBomb = function() {
        var t = this._core.three,
          e = (this._core.pixi, this);
        this._bomb || (this._bomb = new l(this._core)), this._bomb.init(this._sd.id);
        var i = function() {
            e._backToDefault()
          },
          n = function() {
            V.startSkill(e._sd.id)
          };
        t.cameraMng.chainDelay(.7).changeEase(0, 12).setLookTarget(t.cameraTarget.target).setDistance(18).setRotation(Math.PI / 12).chainDelay(.3, function() {
          e._bomb.show(0, i, n), t.cameraMng.chainDelay(.8).changeEase(0, 6).setDistance(30)
        })
      }, t.prototype._nextVoltex = function() {
        var t = this._core.three,
          e = (this._core.pixi, this);
        this._voltex || (this._voltex = new p(this._core)), this._voltex.init(this._sd.id);
        var i = function() {
            e._backToDefault()
          },
          n = function() {
            V.startSkill(e._sd.id)
          };
        t.cameraMng.chainDelay(.7).changeEase(0, 12).setLookTarget(t.boss.target).setDistance(20).setRotation(Math.PI / 12).chainDelay(.3, function() {
          e._voltex.show(0, i, n)
        })
      }, t.prototype._nextApple = function() {
        var t = this;
        this._core.pixi;
        this._apple || (this._apple = new f(this._core)), this._apple.init(this._sd.id), this._apple.show(1, function() {
          t._backToDefault()
        }, function() {
          V.startSkill(t._sd.id)
        })
      }, t.prototype._nextTail = function() {
        var t = this;
        this._core.pixi;
        this._tail || (this._tail = new y(this._core)), this._tail.init(this._sd.id), this._tail.show(1, function() {
          t._backToDefault()
        }, function() {
          V.startSkill(t._sd.id)
        })
      }, t.prototype._backToDefault = function() {
        this._cylinder.hide(), this._circle.hide(), a.prototype._backToDefault.call(this)
      }, t.prototype._init = function() {
        this._circle = new i(this._core), this._cylinder = new h(this._core), this._ptmng = new o(this._core)
      }, t
    }(a),
    N = function(a) {
      function t(t) {
        var e = a.call(this, t) || this;
        return e.__ct = 0, e._init(), e
      }
      return __extends(t, a), t.prototype.start = function(t, e) {
        a.prototype.start.call(this, t, e), this._sd = t;
        var i = this._core.three,
          n = this._core.pixi,
          s = this;
        i.nyanco.chainAnimation(d.DataId.VMD_SPECIAL, 1, .1, function() {
          n.battle.status.addSP(-t.sp, !1), n.battle.display.showSkill(t), i.cameraMng.changeEase(0, 12).setLookTarget(i.nyanco.target, new THREE.Vector3(0, 5, 0)).setRotation(-Math.PI / 3).setDistance(15)
        }).chainDelay(.3, function() {
          s._next()
        })
      }, t.prototype._next = function() {
        var t = this._sd.id;
        switch (this._circle.init(d.ActionType.SPECIAL), this._circle.show(), this._cylinder.initSp(t), this._cylinder.show(.2), t) {
          case d.XSpecialId.FULLPOWER:
            d.Context.se.play(d.SoundId.HEAL, .3);
            break;
          default:
            d.Context.se.play(d.SoundId.MAGICK)
        }
        switch (t) {
          case d.XSpecialId.METEOR:
            this._nextMeteor();
            break;
          case d.XSpecialId.CRYSIS:
            this._nextCrysis();
            break;
          case d.XSpecialId.FULLPOWER:
            this._nextFullpower();
            break;
          case d.XSpecialId.NYALTIME:
            this._nextNyaltima();
            break;
          case d.XSpecialId.MUGIWARA:
            this._nextMugiwara()
        }
      }, t.prototype._nextMeteor = function() {
        var t = this;
        this._meteor || (this._meteor = new v(this._core)), this._meteor.init(this._sd.id), this._meteor.show(1, function() {
          t._backToDefault()
        }, function() {
          V.startSpecial(t._sd.id)
        })
      }, t.prototype._nextCrysis = function() {
        var t = this;
        this._crysis || (this._crysis = new m(this._core)), this._crysis.init(this._sd.id), this._crysis.show(1, function() {
          t._backToDefault()
        }, function() {
          V.startSpecial(t._sd.id)
        })
      }, t.prototype._nextFullpower = function() {
        var t = this;
        this._fullpower || (this._fullpower = new g(this._core)), this._fullpower.init(this._sd.id), this._fullpower.show(.6, function() {
          t._backToDefault()
        }, function() {
          V.startSpecial(t._sd.id)
        })
      }, t.prototype._nextNyaltima = function() {
        var t = this;
        this._nyaltima || (this._nyaltima = new T(this._core)), this._nyaltima.init(this._sd.id), this._nyaltima.show(1, function() {
          t._backToDefault()
        }, function() {
          V.startSpecial(t._sd.id)
        })
      }, t.prototype._nextMugiwara = function() {
        var t = this;
        this.__ct = 0;
        this._mugiwara || (this._mugiwara = new S(this._core)), this._mugiwara.init(this._sd.id), this._mugiwara.show(1, function() {
          t._backToDefault()
        }, function() {
          V.startSpecial(t._sd.id, t.__ct), t.__ct++
        })
      }, t.prototype._backToDefault = function() {
        this._cylinder.hide(), this._circle.hide(), a.prototype._backToDefault.call(this)
      }, t.prototype._init = function() {
        this._circle = new i(this._core), this._cylinder = new h(this._core)
      }, t
    }(a),
    H = function(a) {
      function t(t) {
        var e = a.call(this, t) || this;
        return e._init(), e
      }
      return __extends(t, a), t.prototype.start = function(t, e) {
        a.prototype.start.call(this, t, e), this._sd = t;
        var i = this._core.three,
          n = this._core.pixi,
          s = this;
        i.cameraMng.chainFunc(function() {
          n.battle.statusBoss.addMP(-t.mp, !1), n.battle.display.showSkill(t, !0)
        }).chainDelay(.2, function() {
          s._next()
        })
      }, t.prototype._next = function() {
        switch (this._sd.id) {
          case d.XBossSkillId.SHOOT:
            this._nextShoot();
            break;
          case d.XBossSkillId.HEAL:
            this._nextHeal();
            break;
          case d.XBossSkillId.FLAME:
            this._nextFlame();
            break;
          case d.XBossSkillId.ICE:
            this._nextIce();
            break;
          case d.XBossSkillId.THUNDER:
            this._nextThunder();
            break;
          case d.XBossSkillId.FLARE_STAR:
            this._nextFlareStar();
            break;
          case d.XBossSkillId.HELLBOUND:
            this._nextHellbound();
            break;
          case d.XBossSkillId.ULTIMA:
            this._nextUltima();
            break;
          case d.XBossSkillId.VANISHING:
            this._nextVanishing();
            break;
          case d.XBossSkillId.ULTRANOVA:
            this._nextUltranova();
            break;
          case d.XBossSkillId.PARADIGM:
            this._nextParadigm();
            break;
          case d.XBossSkillId.PHANTOM:
            this._nextPhantom();
            break;
          case d.XBossSkillId.SSTAR:
            this._nextSStar();
            break;
          case d.XBossSkillId.PMETEOR:
            this._nextPMeteor();
            break;
          case d.XBossSkillId.MEGA_FLARE:
            this._nextMegaflare()
        }
      }, t.prototype._nextShoot = function() {
        var t = this;
        this._shoot || (this._shoot = new w(this._core)), this._shoot.init(this._sd.id), this._shoot.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextHeal = function() {
        var t = this;
        this._heal || (this._heal = new x(this._core)), this._heal.init(this._sd.id), this._heal.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextFlame = function() {
        var t = this;
        this._flame || (this._flame = new M(this._core)), this._flame.init(this._sd.id), this._flame.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextIce = function() {
        var t = this;
        this._ice || (this._ice = new E(this._core)), this._ice.init(this._sd.id), this._ice.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextThunder = function() {
        var t = this;
        this._thunder || (this._thunder = new I(this._core)), this._thunder.init(this._sd.id), this._thunder.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextFlareStar = function() {
        var t = this;
        this._flarestar || (this._flarestar = new P(this._core)), this._flarestar.init(this._sd.id), this._flarestar.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextHellbound = function() {
        var t = this;
        this._hellbound || (this._hellbound = new C(this._core)), this._hellbound.init(this._sd.id), this._hellbound.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextUltima = function() {
        var t = this;
        this._ultima || (this._ultima = new A(this._core)), this._ultima.init(this._sd.id), this._ultima.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextVanishing = function() {
        var t = this;
        this._vanishing || (this._vanishing = new b(this._core)), this._vanishing.init(this._sd.id), this._vanishing.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextUltranova = function() {
        var t = this;
        this._ultranova || (this._ultranova = new L(this._core)), this._ultranova.init(this._sd.id), this._ultranova.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextParadigm = function() {
        var t = this;
        this._paradigm || (this._paradigm = new k(this._core)), this._paradigm.init(this._sd.id), this._paradigm.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextPhantom = function() {
        var t = this;
        this._phantom || (this._phantom = new D(this._core)), this._phantom.init(this._sd.id), this._phantom.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextSStar = function() {
        var t = this;
        this._sstar || (this._sstar = new R(this._core)), this._sstar.init(this._sd.id), this._sstar.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextPMeteor = function() {
        var t = this;
        this._pmeteor || (this._pmeteor = new O(this._core)), this._pmeteor.init(this._sd.id), this._pmeteor.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._nextMegaflare = function() {
        var t = this;
        this._megaflare || (this._megaflare = new U(this._core)), this._megaflare.init(this._sd.id), this._megaflare.show(0, function() {
          t._backToDefault()
        }, function() {
          V.startBossSkill(t._sd.id)
        })
      }, t.prototype._backToDefault = function() {
        a.prototype._backToDefault.call(this)
      }, t.prototype._init = function() {}, t
    }(a),
    V = function() {
      function l() {}
      return l.init = function(t) {
        this._core = t
      }, l.startAttack = function() {
        var t = this._core.pixi.battle,
          e = t.statusBoss,
          i = t.qte.score,
          n = t.qte.scoreRate,
          s = 2 * l.damageBase();
        s += s * n, 0 == i && (s *= .6), 1 == i && (s *= .8), 3 == i && (s *= 1.2), 4 == i && (s *= 2), s = this._applyBure(s), e.addHP(-s)
      }, l.startSkill = function(t) {
        var e, i = this._core.game,
          n = this._core.pixi.battle,
          s = n.status,
          a = n.statusBoss,
          o = n.qte.score,
          h = n.qte.scoreRate;
        switch (t) {
          case d.XSkillId.HEAL:
            e = l.recoverBase(), e += e * h * 2.2, 4 == o && (e += d.MathUtil.rand(550, 600)), e = this._applyBure(e), s.addHP(e);
            break;
          case d.XSkillId.POWER:
            var r = [3, 4, 5, 6, 8][o],
              c = new d.StatusStateData(d.ActionType.SKILL, d.XSkillId.POWER).init(r, .18, .16, .2, .15, .2, .2);
            s.addState(c);
            break;
          case d.XSkillId.DRAIN_MP:
            e = l.damageSkillBase() * (.4 + .2 * h), e = this._applyBure(e), .5 * (1 - h) < Math.random() ? (d.Context.se.play(d.SoundId.DRAINUP), this._core.game.statusBoss.MP < e && (e = this._core.game.statusBoss.MP), a.addMP(-e), s.addMP(e)) : this._showMiss(!0);
            break;
          case d.XSkillId.DRAIN_HP:
            e = l.damageSkillBase() * (2 + 6.4 * h), e = this._applyBure(e), 0 == o && Math.random() < .2 ? this._showMiss(!0) : (d.Context.se.play(d.SoundId.DRAINUP), a.addHP(-e), s.addHP(e));
            break;
          case d.XSkillId.MOFU_HEAT:
            r = [3, 4, 5, 6, 8][o], c = new d.StatusStateData(d.ActionType.SKILL, d.XSkillId.MOFU_HEAT).init(r, .33, -.22, .33, -.22, .1, .1);
            s.addState(c);
            break;
          case d.XSkillId.BOMB:
            e = 11 * l.damageSkillBase(), e *= [1, 1.1, 1.3, 1.5, 2.5][o], e = this._applyBure(e), a.addHP(-e);
            break;
          case d.XSkillId.VOLTEX:
            e = l.damageSkillBase() * (18 + 8 * h), e = this._applyBure(e), a.addHP(-e);
            break;
          case d.XSkillId.APPLE:
            var _ = 1 - i.status.getHPRate();
            e = Math.pow(_, 1.3) * l.damageSkillBase() * (58 + 30 * h), e = this._applyBure(e), a.addHP(-e);
            break;
          case d.XSkillId.TAIL:
            e = l.damageSkillBase() * d.MathUtil.rand(3.4, 4.5), a.addHP(-e)
        }
      }, l.startSpecial = function(t, e) {
        var i;
        void 0 === e && (e = 0);
        var n = this._core.pixi.battle,
          s = n.status,
          a = n.statusBoss,
          o = n.qte.score,
          h = n.qte.scoreRate;
        switch (t) {
          case d.XSpecialId.METEOR:
            i = l.damageSpecialBase() * (3.3 + (.16 + .16 * Math.random()) * h), i = this._applyBure(i), a.addHP(-i);
            break;
          case d.XSpecialId.CRYSIS:
            i = l.damageSpecialBase() * (18 + 12 * h), i = this._applyBure(i), a.addHP(-i);
            break;
          case d.XSpecialId.FULLPOWER:
            var r = [5, 6, 7, 8, 9][o],
              c = new d.StatusStateData(d.ActionType.SPECIAL, d.XSpecialId.FULLPOWER).init(r, .39, .3, .39, .3, .5, .5);
            s.addState(c);
            break;
          case d.XSpecialId.NYALTIME:
            i = l.damageSpecialBase() * (60 + 27 * h), 3 == o && (i *= 1.1), 4 == o && (i *= 1.2), i = this._applyBure(i), a.addHP(-i);
            break;
          case d.XSpecialId.MUGIWARA:
            0 == e ? (i = l.damageSpecialBase() * (10 + 20 * h), i = this._applyBure(i), a.addHP(-i), s.addHP(i)) : (i = l.damageSpecialBase() * (1 + 2 * h), i = this._applyBure(i), this._core.game.statusBoss.MP < i && (i = this._core.game.statusBoss.MP), a.addMP(-i), s.addMP(i))
        }
      }, l.startBossSkill = function(t) {
        var e, i, n = this._core.game,
          s = this._core.pixi.battle,
          a = s.status,
          o = s.statusBoss;
        switch (t) {
          case d.XBossSkillId.SHOOT:
            e = l.damageSpecialBase(!0), e = this._applyBure(e), e = this._applyGuard(e), this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.HEAL:
            e = 20 * l.recoverBase(!0), this._core.game.paradigm && (e *= 2), e = this._applyBure(e, .5), o.addHP(e);
            break;
          case d.XBossSkillId.FLAME:
            e = l.damageBase(!0) * d.MathUtil.rand(3, 4), e = this._applyBure(e), e = this._applyGuard(e), this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.ICE:
            e = 3 * l.damageSkillBase(!0), e = this._applyBure(e), e = this._applyGuard(e), this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.THUNDER:
            e = l.damageSpecialBase(!0) * d.MathUtil.rand(.3, .55), e = this._applyBure(e), Math.random() < .5 && (e = this._applyGuard(e)), this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.FLARE_STAR:
            e = 50 * n.status.LV, this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.HELLBOUND:
            e = 2.5 * l.damageSpecialBase(!1), .9 * n.status.MAX_HP < e && (e = .9 * n.status.MAX_HP), e = this._applyBure(e), e = this._applyGuard(e), this._checkLucky(2) ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.ULTIMA:
            (e = 6.6 * l.damageSpecialBase(!0)) < (i = .5 * n.status.HP) && (e = i), .9 * n.status.MAX_HP < e && (e = .9 * n.status.MAX_HP), e < 2500 && (e = 2500), e = this._applyBure(e), e = this._applyGuard(e), a.addHP(-e);
            break;
          case d.XBossSkillId.VANISHING:
            var h = new d.StatusStateData(d.ActionType._BOSS, d.XBossSkillId.VANISHING).init(5, -.2, -.1, -.2, -.1, -.1, -.2);
            this._checkLucky(4) ? this._showMiss() : a.addState(h);
            break;
          case d.XBossSkillId.ULTRANOVA:
            e = .96 * n.status.MAX_HP, e = this._applyBure(e, .03), e = this._applyGuard(e, .66), a.addHP(-e);
            break;
          case d.XBossSkillId.PARADIGM:
            this._core.game.paradigm = !0;
            h = new d.StatusStateData(-1, -1).init(1e3, 0, .3, 0, .35, .35, .35);
            o.addState(h), this._core.three.battle.floor.changeParticle(d.MapParticleId.BATTLE_PARADIGM);
            break;
          case d.XBossSkillId.PHANTOM:
            e = .49 * n.status.HP, e = this._applyBure(e), a.addHP(-e);
            break;
          case d.XBossSkillId.SSTAR:
            (e = l.damageSkillBase(!0) * d.MathUtil.rand(.8, 1.4)) < 100 && (e = 100), e = this._applyBure(e), Math.random() < .5 && (e = this._applyGuard(e)), this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.PMETEOR:
            (e = l.damageSkillBase(!0) * d.MathUtil.rand(3, 8)) < 100 && (e = 100), e = this._applyBure(e), e = this._applyGuard(e), this._checkLucky() ? this._showMiss() : a.addHP(-e);
            break;
          case d.XBossSkillId.MEGA_FLARE:
            (e = 4.6 * l.damageSpecialBase(!0)) < (i = .36 * n.status.HP) && (e = i), .9 * n.status.MAX_HP < e && (e = .9 * n.status.MAX_HP), e < 1800 && (e = 1800), e = this._applyBure(e), e = this._applyGuard(e), this._checkLucky(.5) ? this._showMiss() : a.addHP(-e)
        }
      }, l.damageBase = function(t) {
        void 0 === t && (t = !1);
        var e = this._core.game.status,
          i = this._core.game.statusBoss;
        t && (e = this._core.game.statusBoss, i = this._core.game.status);
        var n = 1.5 * e.getATK() - i.getDEF();
        return n < 0 && (n = 0), n
      }, l.damageSkillBase = function(t) {
        void 0 === t && (t = !1);
        var e = this._core.game.status,
          i = this._core.game.statusBoss;
        t && (e = this._core.game.statusBoss, i = this._core.game.status);
        var n = 1.5 * e.getMAT() - i.getMDF();
        return n < 0 && (n = 0), n
      }, l.damageSpecialBase = function(t) {
        void 0 === t && (t = !1);
        var e = this._core.game.status,
          i = this._core.game.statusBoss;
        t && (e = this._core.game.statusBoss, i = this._core.game.status);
        var n = 1.5 * (e.getATK() + e.getMAT()) - (i.getDEF() + i.getMDF());
        return n < 0 && (n = 0), n
      }, l.recoverBase = function(t) {
        void 0 === t && (t = !1);
        var e = this._core.game.status;
        t && (e = this._core.game.statusBoss);
        var i = 2 * e.getMAT();
        return i < 0 && (i = 0), i
      }, l._applyBure = function(t, e) {
        return void 0 === e && (e = .05), t + d.MathUtil.rand(0, t * e)
      }, l._applyGuard = function(t, e) {
        return void 0 === e && (e = .5), this._core.game.status.isGurad ? t * e : t
      }, l._checkLucky = function(t) {
        if (void 0 === t && (t = 1), this._core.game.paradigm) return !1;
        var e = this._core.game.status,
          i = this._core.game.statusBoss,
          n = Math.pow(e.getLUK() - i.getLUK(), 1.5) / 1e5 * t;
        return Math.random() < n
      }, l._showMiss = function(t) {
        void 0 === t && (t = !1);
        var e = d.BattleDisplay.TARGET_NYAN;
        t && (e = d.BattleDisplay.TARGET_BOSS), this._core.pixi.battle.display.showNumber("miss", d.BattleDisplay.TYPE_DAMAGE, e)
      }, l
    }(),
    F = function() {
      function t(t) {
        this._core = t, this._three = t.three, this._pixi = t.pixi, this.__attack = new d.SkillBase({
          name: "たたかう",
          nameEn: "ATTACK"
        })
      }
      return t.prototype.init = function() {}, t.prototype.startAttack = function(t, e) {
        this._startup(t, e);
        var i = this,
          n = this._three,
          s = this._pixi,
          a = n.nyanco.getPos(),
          o = n.boss.getPos().sub(a),
          h = o.distanceTo(new THREE.Vector3),
          r = (h - 8) / h;
        a.x += o.x * r, a.z += o.z * r;
        this._core.config.japanese;
        n.nyanco.chainAnimation(d.DataId.VMD_RUN, 1.2, .1, function() {
          s.battle.display.showSkill(i.__attack), n.cameraMng.changeEase(0, 12).setRotation(d.MathUtil.rand(Math.PI / 6, Math.PI / 3)).setDistance(25).chainDelay(1).setRotation(c.CAMERA_ROT).setDistance(c.CAMERA_DISTANCE)
        }).chainMove(a, 1.2).chainAnimation(d.DataId.VMD_ATTACK, 1, .1).chainDelay(.5, function() {
          V.startAttack(), d.Context.se.play(d.SoundId.ATTACK)
        }).chainDelay(.2).chainAnimation(d.DataId.VMD_RUN, 1.2).chainMove(c.POS_NYAN_DEF, 1.2).chainAnimation(d.DataId.VMD_IDLE, 1).chainLookAt(n.boss.getPos(), !0, e)
      }, t.prototype.startSkill = function(t, e) {
        this._startup(t, e), this._xskill || (this._xskill = new B(this._core)), this._xskill.start(t.skill, e)
      }, t.prototype.startSpecial = function(t, e) {
        this._startup(t, e), this._xspecial || (this._xspecial = new N(this._core)), this._xspecial.start(t.skillSp, e)
      }, t.prototype.startGuard = function(t, e) {
        this._startup(t, e), this._core.game.status.isGurad = !0, this._three.nyanco.chainAnimation(d.DataId.VMD_GUARD).chainDelay(.6, e)
      }, t.prototype.death = function() {
        this._three.nyanco.changeAnimation(d.DataId.VMD_DOWN, 1, 1.2, Bounce.easeOut);
        var t = this;
        this._pixi.cover.setup(0, 1, !0).show(2, 1.5, Power0.easeNone, function() {
          t._end()
        }), TweenLite.delayedCall(1.5, function() {
          d.Context.bgm.play(-1)
        })
      }, t.prototype._end = function() {
        this._core.main.playScene(d.SceneId.END)
      }, t.prototype._startup = function(t, e) {
        this._data = t, this._complete = e
      }, t
    }(),
    X = function() {
      function t(t) {
        this.__count = 0, this._core = t, this._three = t.three, this._pixi = t.pixi
      }
      return t.prototype.init = function() {
        this.__count = 0
      }, t.prototype.startSkill = function(t, e) {
        this._data = t, this._complete = e, this._xboss || (this._xboss = new H(this._core)), this._xboss.start(t, e)
      }, t.prototype.death = function() {
        var t = this;
        this._pixi.cover.setup(16777215, 1, !0), this.__count = 0, TweenLite.delayedCall(.9, function() {
          t.__fadeout()
        })
      }, t.prototype.__fadeout = function() {
        d.Context.bgm.play(-1);
        var t = this;
        TweenLite.delayedCall(.9, function() {
          t.__next()
        })
      }, t.prototype.__next = function() {
        var t = this,
          e = [1.2, .6, 1.4];
        if (this.__count == e.length) d.Context.se.play(d.SoundId.BOSS_DEATH), this._core.three.effectMng.start(2.8, d.EffectId.PARADIGM), this._pixi.cover.show(3, 0, Power0.easeNone, function() {
          t._end()
        });
        else {
          d.Context.se.play(d.SoundId.BOSS_FLASH);
          var i = e[this.__count],
            n = [.55, .45, .45][this.__count];
          this._pixi.cover.show(0).hide(n, 0, Power1.easeIn), this._core.three.effectMng.start(n, d.EffectId.PARADIGM), TweenLite.delayedCall(i, function() {
            t.__next()
          })
        }
        this.__count++
      }, t.prototype._end = function() {
        this._core.main.playScene(d.SceneId.END)
      }, t
    }()
}(nnf || (nnf = {})),
function(_) {
  var t = function() {
    function t(t) {
      this._core = t
    }
    return t.prototype.init = function() {
      var e = this,
        t = 1;
      1 < window.devicePixelRatio && (t = 2), this._renderer = new PIXI.WebGLRenderer(_.Context.stw, _.Context.sth, {
        transparent: !0,
        resolution: t
      }), this._renderer.autoResize = !0, document.getElementById("view_ui").appendChild(this._renderer.view), this._stage = new PIXI.Container, this._ui = new r(this._core, this._stage), this._textMng = new s(this._core, this._stage), this._statusMng = new o(this._core, this._stage), this._ui.addEventListener(r.CLICK_STATUS, function(t) {
        e._clickStatus(t)
      }), this._statusMng.addEventListener(o.CLICK_CLOSE, function(t) {
        e._clickStatusClose(t)
      }), this._cover = new c(this._stage), this._btFull = new n(this._stage)
    }, t.prototype.changeQuality = function(t) {}, t.prototype.changeLanguage = function() {}, t.prototype.playScene = function(t) {
      switch (t) {
        case _.SceneId.TOP:
          this._btFull.show();
          break;
        case _.SceneId.LOADING:
          break;
        case _.SceneId.BATTLE_START:
          this._battle || (this._battle = new _.PixiBattleManager(this._core))
      }
      this._ui.playScene(t), this._textMng.playScene(t), this._statusMng.playScene(t), this._battle && this._battle.playScene(t)
    }, t.prototype.resize = function() {
      this._ui && (this._ui.resize(), this._textMng.resize(), this._statusMng.resize()), this._cover && this._cover.resize(), this._battle && this._battle.resize(), this._btFull.resize(), this._renderer.resize(_.Context.stw, _.Context.sth)
    }, t.prototype.update = function() {
      this._battle && this._battle.update(), this._renderer.render(this._stage)
    }, t.prototype._clickStatus = function(t) {
      this._statusMng.show()
    }, t.prototype._clickStatusClose = function(t) {
      this._statusMng.hide()
    }, Object.defineProperty(t.prototype, "ui", {
      get: function() {
        return this._ui
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "cover", {
      get: function() {
        return this._cover
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "battle", {
      get: function() {
        return this._battle
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "stage", {
      get: function() {
        return this._stage
      },
      enumerable: !0,
      configurable: !0
    }), t
  }();
  _.PixiManager = t;
  var e, i, h = function(e) {
    function t(t) {
      return e.call(this, t) || this
    }
    return __extends(t, e), t.UPDATE = "update", t
  }(_.Event);
  _.PadEvent = h, (i = e = _.PadEventMode || (_.PadEventMode = {}))[i.MOVE = 0] = "MOVE", i[i.ROTATE = 1] = "ROTATE";
  var a = function(e) {
    function t(t) {
      return e.call(this, t) || this
    }
    return __extends(t, e), t.SHOW_COMPLETE = "showComplete", t.HIDE_COMPLETE = "hideComplete", t
  }(_.Event);
  _.DisplayEvent = a;
  var n = function(i) {
      function t(t) {
        var e = i.call(this) || this;
        return e._showed = !1, e._enabled = aidn.util.enabledFullscreen(), t && t.addChild(e), $("#bt_full").click(function() {
          aidn.util.fullscreen()
        }), e
      }
      return __extends(t, i), t.prototype.show = function() {
        this._enabled && (_.Context._rec || ($("#bt_full").css("display", "block"), this.parent.setChildIndex(this, this.parent.children.length - 1), this.visible = this._showed = !0, this.alpha = 0, this.resize(), TweenLite.to(this, .1, {
          alpha: 1,
          ease: Power0.easeNone
        })))
      }, t.prototype.hide = function() {
        if (this._enabled) {
          $("#bt_full").css("display", "none");
          var t = this;
          TweenLite.to(this, .1, {
            alpha: 0,
            ease: Power0.easeNone,
            function: function() {
              t.visible = t._showed = !1
            }
          })
        }
      }, t.prototype.resize = function() {
        if (this._showed) {
          this.parent.setChildIndex(this, this.parent.children.length - 1), aidn.util.checkFullscreen() ? this.visible = !1 : this.visible = !0, this.x = _.Context.stw, this.y = 0;
          var t = 25,
            e = 6,
            i = 8;
          _.Context.isMobile || (t *= 1.5, e *= 1.5, i *= 1.5), this.clear(), this.beginFill(0, 0), this.drawRect(-t, 0, t, t), this.lineStyle(1, 16777215), this.moveTo(-e, e + i), this.lineTo(-e, e), this.lineTo(-e - i, e)
        }
      }, t
    }(PIXI.Graphics),
    s = function(s) {
      function t(t, e) {
        var i = s.call(this) || this;
        i._hiding = !1, i._state = 0, i._compCount = 0, i._core = t, i._stage = e;
        var n = i;
        return i._core.main.addEventListener(_.CustomEvent.CUSTOM, function(t) {
          n._customEvent(t)
        }), i._loadcmd = new _.BattleLoadCommand(i._core.loadData), i._audioLoadCmd = new _.BattleAudioLoadCommand(i._core.loadData), i
      }
      return __extends(t, s), t.prototype.playScene = function(t) {
        switch (t) {
          case _.SceneId.TOP:
            this._txMapName && (this._txMapName.hide(), this._txMapName.visible = !1);
            break;
          case _.SceneId.START:
            this._startMapText();
            break;
          case _.SceneId.START_CRYSTAL:
            break;
          case _.SceneId.BATTLE_START:
            this._hideCover()
        }
      }, t.prototype.resize = function() {
        switch (this._core.sceneId) {
          case _.SceneId.START:
            var t = this._txMapName;
            .9 * _.Context.stw < t.width ? t.scale = .9 * _.Context.stw / t.width : t.scale = 1, t.x = .5 * (_.Context.stw - t.width * t.scale), t.y = .5 * (_.Context.sth - t.height * t.scale);
            break;
          case _.SceneId.START_CRYSTAL:
            this._resizeSerif()
        }
      }, t.prototype._customEvent = function(t) {
        switch (t.id) {
          case _.CustomId.CRYSTAL_MOVE_COMP:
            this._startCrystalMoveComp();
            break;
          case _.CustomId.CRYSTAL_BOSS_SERIF:
            this._startCrystalBossSerif()
        }
      }, t.prototype._startMapText = function() {
        this._txMapName || (this._txMapName = new v(this._stage)), this._txMapName.visible = !0;
        var t, e, i, n = this._txMapName;
        this._core.config.japanese ? (t = "追想と忘却の狭間 最深層", i = !(e = 3)) : (t = "回 忆 与 遗 忘\n之 虚 无 最 深 层 ", i = !(e = 0));
        var s = t.length,
          a = 32;
        _.Context.isMobile || (a = 45);
        var o = (new y).setText(a, 16777215, e, 2, 1).setSplit(!0, !0, i).setMultiline(!1).setShadow(0, 3, 45);
        n.init(o), n.setDisplayOption(new f(.3, .5, d.TX_PARA, 1.2 / s), null), n.text = t, n.show(), this._tw && this._tw.kill(), this._tw = TweenLite.delayedCall(3.5, function() {
          n.hide()
        })
      }, t.prototype._startCrystalMoveComp = function() {
        var t = this;
        TweenLite.delayedCall(.8, function() {
          t._startCrystalMoveCompDelay()
        })
      }, t.prototype._startCrystalMoveCompDelay = function() {
        this._txSerif || (this._txSerif = new v(this._stage)), this._state = 0;
        var t = this._txSerif,
          e = (new y).setText(32, 0, 0, 2).setBg(!0, 16777215, .7, 20).setSplit(!0, !0, !1).setMultiline(!0);
        t.init(e), t.setDisplayOption(new f(.1, 0, d.TX_PARA, .02), new f(.7, 0, d.BG_ZOOM), new f(.1, 0, d.TX_PARA, .004), new f(.5, 0, d.BG_ZOOM)), t.width = 720;
        var i = this._core.game.status.NAME + ":\n";
        this._serifs = [i + '这就是从著名的Crypton诞生出来的\n"让一切回归的水晶"……', i + "如果让这个与音魂的吊坠共鸣的话 ，\n名存实亡的术力口世界也一定会……"], 0 < _.Context._skip && (this._serifs = []), this._nextSerif();
        var n = this;
        t.addEventListener(a.HIDE_COMPLETE, function() {
          n._serifHideComplete()
        }), $(window).on(_.EventName.END + ".serif", function() {
          n._clickSerif()
        }), _.Context.pcTouchEnabled && $(window).on(_.EventName.TOUCH_END + ".serif", function() {
          n._clickSerif()
        })
      }, t.prototype._startCrystalBossSerif = function() {
        var t = this;
        TweenLite.delayedCall(.6, function() {
          t._startCrystalBossSerifDelay()
        })
      }, t.prototype._startCrystalBossSerifDelay = function() {
        this._state = 1;
        var t = this._core.game.status.NAME + ":\n";
        this._serifs = [t + "！？！？！？！？"], 0 < _.Context._skip && (this._serifs = []), this._nextSerif()
      }, t.prototype._startBossSerif = function() {
        this._state = 2;
        var t = this._txSerif;
        t.init(t.option.setText(32, 16777215, 0, 2).setBg(!0, 0, .7, 20));
        var e = "？？？:\n";
        this._serifs = [e + "掌管一切的世间规律消失了", e + "又有新的道理要诞生了", e + "逆着胎动的宇宙趋势的人啊……", e + "现在在这里释放我那森罗万象的力量", e + "把你的宏愿埋葬到永恒的尽头吧……"], 0 < _.Context._skip && (this._serifs = []), this._nextSerif()
      }, t.prototype._nextSerif = function() {
        if (0 < this._serifs.length) {
          var t = this._serifs.shift();
          this._txSerif.text = t, this._txSerif.show(), this._hiding = !1, this._resizeSerif()
        } else if (0 == this._state) this._core.main.dispatchCustomEvent(_.CustomId.CRYSTAL_SHOW_BOSS);
        else if (1 == this._state) this._startBossSerif();
        else if (2 == this._state) {
          var e = this;
          TweenLite.delayedCall(.5, function() {
            e._showCover()
          }), this._loadStart()
        }
      }, t.prototype._clickSerif = function() {
        this._hiding || (this._hiding = !0, this._txSerif.hide())
      }, t.prototype._serifHideComplete = function() {
        this._nextSerif()
      }, t.prototype._resizeSerif = function() {
        if (this._txSerif) {
          var t = _.Context.stw,
            e = _.Context.sth,
            i = this._txSerif,
            n = Math.min(6 * e / 4, t);
          n < i.width + 20 ? i.scale = (n - 20) / i.width : i.scale = 1, i.x = .5 * (t - i.width * i.scale);
          var s = Math.max(10, (e / (i.charHeight * i.scale) - 20) * (i.charHeight * i.scale) * .3);
          .2 * e < s && (s = .2 * e), this._state <= 1 ? i.y = e - i.height * i.scale - s : i.y = s
        }
      }, t.prototype._showCover = function() {
        this._txSerif.clearEventListener(), $(window).off(_.EventName.END + ".serif"), _.Context.pcTouchEnabled && $(window).off(_.EventName.TOUCH_END + ".serif");
        var t = this,
          e = 2;
        0 < _.Context._skip && (e = .6), _.Context.se.play(_.SoundId.BATTLE), this._core.three.effectMng.start(e, _.EffectId.SHOW_BATTLE_COVER);
        var i = this._core.pixi.cover;
        i.setup(16777215, 1), i.show(e, 0, Power1.easeIn, function() {
          $("#scene_loading_battle").stop().fadeIn(200, "linear"), t._next()
        })
      }, t.prototype._hideCover = function() {
        this._core.pixi.cover.hide(2, 0, Power1.easeIn)
      }, t.prototype._loadStart = function() {
        var t = this;
        this._compCount = 0, this._core.config.sound && !this._audioLoadCmd.loaded ? (this._audioLoadCmd.addEventListener(_.CommandEvent.COMPLETE, function() {
          t._audioLoadComplete()
        }), this._audioLoadCmd.execute()) : this._audioLoadComplete()
      }, t.prototype._audioLoadComplete = function() {
        var t = this;
        this._loadcmd.loaded ? this._next() : (this._loadcmd.addEventListener(_.CommandEvent.COMPLETE, function() {
          t._loadComplete()
        }), this._loadcmd.execute())
      }, t.prototype._loadComplete = function() {
        this._core.three.nyanco.initBattle(), this._next()
      }, t.prototype._next = function() {
        this._compCount++, 2 <= this._compCount && ($("#scene_loading_battle").stop().fadeOut(200, "linear"), this._core.main.playScene(_.SceneId.BATTLE_START))
      }, t
    }(_.EventDispatcher),
    o = function(n) {
      function e(t, e) {
        var i = n.call(this) || this;
        return i._showed = !1, i._core = t, i._stage = e, i
      }
      return __extends(e, n), e.prototype.show = function() {
        this._showed || (this._showed = !0, this._container.visible = !0, this._bg.show(), this._tx.show())
      }, e.prototype.hide = function() {
        this._showed && (this._showed = !1, this._bg && (this._bg.hide(), this._tx.hide()))
      }, e.prototype.playScene = function(t) {
        switch (t) {
          case _.SceneId.TOP:
            this._reset();
            break;
          case _.SceneId.START:
            this._init();
            break;
          case _.SceneId.START_CRYSTAL:
        }
      }, e.prototype.resize = function() {
        switch (this._core.sceneId) {
          case _.SceneId.START:
            this._resize()
        }
      }, e.prototype._init = function() {
        if (!this._container) {
          var t = this,
            e = (new y).setText(24, 0, 0, 3).setSplit(!0, !0).setMultiline(!1).setBg(!0, 16777215, 1, 30);
          this._container = new PIXI.Container, this._stage.addChild(this._container), this._bg = new m(this._container).setColor(0, .7), this._bg.setSize(_.Context.stw, _.Context.sth), this._bg.setDisplayOption(new f(.3, 0, d.ALPHA), new f(.6, 0, d.ALPHA)), this._bg.interactive = this._bg.buttonMode = !0, this._bg.on(_.EventName.START, function() {
            t._clickClose()
          }), _.Context.pcTouchEnabled && this._bg.on(_.EventName.TOUCH_START, function() {
            t._clickClose()
          }), this._tx = new v(this._container), this._tx.init(e).setDisplayOption(new f(.1, 0, d.TX_PARA, .01), new f(1.2, 0, d.BG_ZOOM), new f(.1, 0, d.TX_PARA, .005), new f(.9, 0, d.BG_SLIDE))
        }
        var i = this._core.game.status,
          n = "";
        n += "LV: " + i.LV + "\n", n += "名称:\n" + i.NAME + "\n\n", n += "HP: " + i.HP + " / " + i.MAX_HP + "\n", n += "MP:  " + i.MP + " /  " + i.MAX_MP + "\n", n += "SP:    0 /   " + _.StringUtil.keta(i.MAX_SP, 2) + "\n\n", n += "攻击: " + i.ATK + "  防御: " + i.DEF + "\n", n += "魔法攻击: " + i.MAT + "  魔法防御: " + i.MDF + "\n", n += "SPD: " + i.SPD + "  运气: " + i.LUK, this._tx.text = n
      }, e.prototype._clickClose = function() {
        var t = new _.CustomEvent(e.CLICK_CLOSE);
        this.dispatchEvent(t)
      }, e.prototype._reset = function() {
        this._container && (this._container.visible = !1, this.hide())
      }, e.prototype._resize = function() {
        var t = _.Context.stw,
          e = _.Context.sth;
        this._bg.setSize(t, e);
        var i = this._tx.width,
          n = this._tx.height,
          s = 1,
          a = e;
        n < i && (a = e - 20), t / a < i / n ? t < this._tx.width && (s = t / this._tx.width) : a < this._tx.height && (s = a / this._tx.height), this._tx.scale = s, this._tx.x = .5 * (t - i * s), this._tx.y = .5 * (e - n * s)
      }, e.CLICK_CLOSE = "clickClose", e
    }(_.EventDispatcher),
    r = function(n) {
      function e(t, e) {
        var i = n.call(this) || this;
        return i._core = t, i._stage = e, i
      }
      return __extends(e, n), e.prototype.playScene = function(t) {
        switch (t) {
          case _.SceneId.TOP:
            this._end(0);
            break;
          case _.SceneId.START:
            this._init(), this._start();
            break;
          case _.SceneId.START_CRYSTAL:
            this._end()
        }
      }, e.prototype.resize = function() {
        if (this._uiCircPad) {
          this._uiCircPad.resize();
          var t = this._uiCircPad.width + this._uiCircPad.x;
          this._uiHPad.resize(t), this._resizeStatus()
        }
      }, e.prototype._init = function() {
        if (!this._uiCircPad) {
          var e = this;
          this._uiCircPad = new S(this._stage, this._core), this._uiCircPad.addEventListener(h.UPDATE, function(t) {
            e._padMove(t)
          }), this._uiHPad = new T(this._stage, this._core), this._uiHPad.addEventListener(h.UPDATE, function(t) {
            e._padMove(t)
          }), this._uiStatus = new p(this._stage).init(this._core.loadData[_.TexturePixiId.BT_STATUS]), this._uiStatus.initButton(function() {
            e._clickStatus()
          })
        }
      }, e.prototype._start = function() {
        this._uiCircPad.show(), this._uiHPad.show(), this._uiStatus.show()
      }, e.prototype._end = function(t) {
        void 0 === t && (t = .3), this._uiCircPad && (this._uiCircPad.hide(t), this._uiHPad.hide(t), this._uiStatus.hide(t))
      }, e.prototype._padMove = function(t) {
        this.dispatchEvent(t)
      }, e.prototype._clickStatus = function() {
        _.Context.se.play(_.SoundId.CLICK_STATUS);
        var t = new _.CustomEvent(e.CLICK_STATUS);
        this.dispatchEvent(t)
      }, e.prototype._resizeStatus = function() {
        var t = _.Context.stw,
          e = _.Context.sth,
          i = .15 * Math.min(t, e);
        70 < i && (i = 70), this._uiStatus.scale = i / this._uiStatus.width;
        var n = 30;
        !_.Context.isMobile && 450 <= t && (n = 40), this._uiStatus.x = t - i - n, this._uiStatus.y = e - i - n
      }, e.CLICK_STATUS = "clickStatus", e
    }(_.EventDispatcher),
    c = function() {
      function t(t) {
        this._color = 16777215, this._alpha = 1, this._parent = t, this._graphic = new PIXI.Graphics, this._graphic.visible = !1, t.addChild(this._graphic)
      }
      return t.prototype.setup = function(t, e, i) {
        return void 0 === e && (e = 1), void 0 === i && (i = !0), this._color = t, this._alpha = e, this._foreground = i, this
      }, t.prototype.show = function(t, e, i, n) {
        void 0 === e && (e = 0), void 0 === i && (i = Power0.easeNone), this.resize();
        var s = this._graphic;
        return this._foreground && this._parent.setChildIndex(s, this._parent.children.length - 1), s.visible = !0, s.alpha = 0, TweenLite.killTweensOf(s), 0 < t || 0 < e ? TweenLite.to(s, t, {
          alpha: 1,
          delay: e,
          ease: i,
          onComplete: n
        }) : (s.alpha = 1, n && n()), this
      }, t.prototype.hide = function(t, e, i, n) {
        void 0 === e && (e = 0), void 0 === i && (i = Power0.easeNone), this.resize();
        var s = this._graphic;
        return this._foreground && this._parent.setChildIndex(s, this._parent.children.length - 1), TweenLite.killTweensOf(s), TweenLite.to(s, t, {
          alpha: 0,
          delay: e,
          ease: i,
          onComplete: function() {
            s.visible = !1, n && n()
          }
        }), this
      }, t.prototype.resize = function() {
        var t = this._graphic;
        t.clear(), t.beginFill(this._color, this._alpha), t.drawRect(0, 0, _.Context.stw, _.Context.sth)
      }, t
    }();
  _.Cover = c;
  var l = function(i) {
      function t(t) {
        var e = i.call(this) || this;
        return e._ui = new PIXI.Container, e._ui.visible = e._showed = !1, t && (e._parent = t, e._parent.addChild(e._ui)), e
      }
      return __extends(t, i), t.prototype.initButton = function(t, e, i) {
        var n = this._ui;
        this.buttonActive(), _.Context.isMobile || _.Context._rec || (null != e && n.on("mouseover", e), null != i && n.on("mouseout", i)), n.on(_.EventName.START, t), _.Context.pcTouchEnabled && n.on(_.EventName.TOUCH_START, t)
      }, t.prototype.buttonActive = function() {
        var t = this._ui;
        t.interactive = t.buttonMode = !0
      }, t.prototype.buttonDisactive = function() {
        var t = this._ui;
        t.interactive = t.buttonMode = !1
      }, t.prototype.show = function(t) {
        void 0 === t && (t = .3), this._ui.visible = this._showed = !0, this._ui.alpha = 0, TweenLite.to(this._ui, t, {
          alpha: 1
        })
      }, t.prototype.hide = function(t) {
        void 0 === t && (t = .3);
        var e = this;
        TweenLite.to(this._ui, t, {
          alphe: 0,
          onComplete: function() {
            e._ui.visible = e._showed = !1
          }
        })
      }, t.prototype.resize = function() {}, Object.defineProperty(t.prototype, "x", {
        get: function() {
          return this._ui.x
        },
        set: function(t) {
          this._ui.x = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "y", {
        get: function() {
          return this._ui.y
        },
        set: function(t) {
          this._ui.y = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "width", {
        get: function() {
          return 0 <= this.__width ? this.__width : this._ui.width
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "height", {
        get: function() {
          return 0 <= this.__height ? this.__height : this._ui.height
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "scale", {
        get: function() {
          return this._ui.scale.x
        },
        set: function(t) {
          this._ui.scale.set(t, t)
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "alpha", {
        get: function() {
          return this._ui.alpha
        },
        set: function(t) {
          this._ui.alpha = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "visible", {
        get: function() {
          return this._ui.visible
        },
        set: function(t) {
          this._ui.visible = this._showed = t
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "ui", {
        get: function() {
          return this._ui
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(_.EventDispatcher),
    p = function(i) {
      function t(t) {
        return i.call(this, t) || this
      }
      return __extends(t, i), t.prototype.init = function(t, e) {
        var i;
        return void 0 === e && (e = "tl"), this._sprite ? (i = this._sprite).texture = t : (i = new PIXI.Sprite(t), this._ui.addChild(i), this._sprite = i), e = e.toLowerCase(), i.anchor.x = .5, i.anchor.y = .5, 0 <= e.indexOf("l") && (i.anchor.x = 0), 0 <= e.indexOf("r") && (i.anchor.x = 1), 0 <= e.indexOf("t") && (i.anchor.y = 0), 0 <= e.indexOf("b") && (i.anchor.y = 1), i.x = i.y = 0, this.__width = i.width, this.__height = i.height, this
      }, t.prototype.initButton = function(t) {
        var e = this;
        i.prototype.initButton.call(this, t, function() {
          e._mouseover()
        })
      }, t.prototype._mouseover = function() {
        this.alpha = 0, TweenLite.to(this, .2, {
          alpha: 1,
          ease: Power0.easeNone
        })
      }, t
    }(_.UIBase = l);
  _.UIImage = p;
  var d, u, f = function() {
    function t(t, e, i, n) {
      void 0 === e && (e = 0), void 0 === i && (i = 0), void 0 === n && (n = .04), this.time = t, this.delay = e, this.type = i, this.interval = n
    }
    return t.ALPHA = 0, t.ZOOM = 1, t.SLIDE = 2, t.SLIDE_H = 3, t
  }();
  _.UIDisplayOption = f, (u = d = _.UIDisplayType || (_.UIDisplayType = {}))[u.ALPHA = 0] = "ALPHA", u[u.BG_ZOOM = 1] = "BG_ZOOM", u[u.BG_SLIDE = 2] = "BG_SLIDE", u[u.BG_SLIDE_H = 3] = "BG_SLIDE_H", u[u.TX_PARA = 4] = "TX_PARA", u[u.TX_PARA_UP = 5] = "TX_PARA_UP";
  var y = function() {
    function e() {
      this.style = {}, this.useBg = !1, this.bgColor = 16777215, this.bgAlpha = 1, this.bgPadding = 0, this.leading = 0, this.letterSpacing = 0, this.isMultiline = !1, this.isSplit = !1, this.isMonospaced = !1, this.engOnly = !1, this.align = 0, this.style.wordWrap = !1, this.style.align = "left"
    }
    return e.prototype.setBg = function(t, e, i, n) {
      return void 0 === t && (t = !1), void 0 === e && (e = 16777215), void 0 === i && (i = 1), void 0 === n && (n = 0), this.useBg = t, this.bgColor = e, this.bgAlpha = i, this.bgPadding = n, this
    }, e.prototype.setText = function(t, e, i, n, s) {
      return void 0 === t && (t = 32), void 0 === e && (e = 0), void 0 === i && (i = 0), void 0 === n && (n = 0), void 0 === s && (s = 0), this.style.fontSize = t, this.style.fontFamily = "Noto Sans SC", this.style.fill = e, this.style.letterSpacing = i, this.leading = n, this.letterSpacing = i, this.align = s, this
    }, e.prototype.setMultiline = function(t) {
      return void 0 === t && (t = !0), this.isMultiline = t, this
    }, e.prototype.setSplit = function(t, e, i) {
      return void 0 === t && (t = !0), void 0 === e && (e = !1), void 0 === i && (i = !1), this.isSplit = t, this.isMonospaced = e, this.engOnly = i, this
    }, e.prototype.setStroke = function(t, e) {
      return void 0 === e && (e = 1), this.style.stroke = t, this.style.strokeThickness = e, this
    }, e.prototype.setShadow = function(t, e, i) {
      return void 0 === e && (e = 5), void 0 === i && (i = Math.PI / 6), this._shadowColor = t, this.style.dropShadow = !0, this.style.dropShadowColor = _.StringUtil.getColor(t), this.style.dropShadowDistance = e, this.style.dropShadowAngle = i, this
    }, e.prototype.clone = function() {
      var t = (new e).setBg(this.useBg, this.bgColor, this.bgAlpha, this.bgPadding).setText(this.style.fontSize, this.style.fill, this.style.letterSpacing, this.leading, this.align).setMultiline(this.isMultiline).setSplit(this.isSplit, this.isMonospaced);
      return 0 <= this.style.stroke && t.setStroke(this.style.stroke, this.style.strokeThickness), this.style.dropShadow && t.setShadow(this._shadowColor, this.style.dropShadowDistance, this.style.dropShadowAngle), t
    }, e
  }();
  _.UITextInitOption = y;
  var v = function(n) {
    function t(t) {
      var e = n.call(this, t) || this;
      return e._txs = [], e._len = 0, e._charW = 0, e
    }
    return __extends(t, n), Object.defineProperty(t.prototype, "charHeight", {
      get: function() {
        return this._txs[0].height
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "option", {
      get: function() {
        return this._option
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "__txs", {
      get: function() {
        return this._txs
      },
      enumerable: !0,
      configurable: !0
    }), t.prototype.init = function(t) {
      (this._option = t).useBg && (this._bg || (this._bg = new m(this._ui)), this._bg.setColor(t.bgColor, t.bgAlpha)), t.isSplit ? t.style.letterSpacing = 0 : t.style.letterSpacing = t.letterSpacing, this.changeTextSpacing(t.letterSpacing, t.engOnly);
      for (var e = this._txs.length, i = 0; i < e; i++) this._txs[i].style = t.style;
      return t.isMultiline ? 0 < this.__width ? this.width = this.__width : this.width = 500 : this._update(), this
    }, t.prototype.initButton = function(t, e) {
      var i = this;
      return n.prototype.initButton.call(this, t, function() {
        i._mouseover(), e && e()
      }), this
    }, t.prototype.setDisplayOption = function(t, e, i, n) {
      return this._optShow = t, (this._optHide = i) || (this._optHide = t), this._optBgShow = e, this._optBgHide = n, this._bg && this._bg.setDisplayOption(e, n), this
    }, t.prototype.changeTextColor = function(t, e, i) {
      void 0 === e && (e = 0), void 0 === i && (i = -1);
      var n = this._option;
      if (n.style.fill == t) return this;
      n.style.fill = t;
      var s = this._txs.length;
      (i < 0 || s < i) && (i = s);
      for (var a = e; a < i; a++) this._txs[a].style = n.style;
      return this
    }, t.prototype.changeBgColor = function(t) {
      var e = this._option;
      return e.useBg && e.bgColor != t && (e.bgColor = t, this._bg.setColor(e.bgColor, e.bgAlpha)), this
    }, t.prototype.changeTextSpacing = function(t, e) {
      void 0 === e && (e = !1);
      var i = this._option;
      if (i.letterSpacing = t, i.engOnly = e, i.isSplit && i.isMonospaced) {
        var n = this._txs[0];
        n || (n = new PIXI.Text("", i.style), this._ui.addChild(n), this._txs[0] = n);
        var s = n.text;
        i.engOnly ? n.text = "A" : n.text = "あ", n.style = i.style, this._charW = n.width, n.text = s, n.visible = !1
      }
      return this
    }, t.prototype.update = function() {
      this._update()
    }, t.prototype.show = function(t) {
      void 0 === t && (t = 0);
      var e = this,
        i = function() {
          e._ui.visible = e._showed = !0, e._start(e._optShow, !0), e._bg && e._bg.show()
        };
      t <= 0 ? i() : TweenLite.delayedCall(t, i)
    }, t.prototype.hide = function() {
      this._showed = !1, this._start(this._optHide, !1), this._bg && this._bg.hide()
    }, t.prototype.mouseover = function() {
      this._mouseover()
    }, t.prototype._mouseover = function() {
      if (this._showed) {
        var t = this._ui;
        t.alpha = 0, TweenLite.to(t, .15, {
          alpha: 1,
          ease: Power0.easeNone
        }), this._bg && this._bg.mouseoverHandler()
      }
    }, t.prototype._start = function(t, e) {
      for (var i = t.delay, n = 0; n < this._len; n++) {
        var s = this._txs[n];
        switch (TweenLite.killTweensOf(s), s.visible = !0, e && (s.alpha = 0), t.type) {
          case d.ALPHA:
            break;
          case d.TX_PARA:
            i = t.delay + n * t.interval;
            break;
          case d.TX_PARA_UP:
            i = t.delay + n * t.interval;
            var a = .36 * t.time,
              o = t.time - a;
            TweenLite.to(s, a, {
              alpha: 1,
              delay: i,
              ease: Power2.easeOut,
              y: s.y - 1.2 * s.height
            }), TweenLite.to(s, o, {
              alpha: e ? 1 : 0,
              delay: i + a,
              ease: Bounce.easeOut,
              y: s.y
            });
            continue
        }
        var h = {
          alpha: e ? 1 : 0,
          delay: i,
          ease: Power0.easeNone
        };
        TweenLite.to(s, t.time, h)
      }
      var r = this;
      TweenLite.killTweensOf(this), TweenLite.to(this, i + t.time, {
        onComplete: function() {
          r._complete(e)
        }
      })
    }, t.prototype._complete = function(i) {
      var n = this,
        s = setInterval(function() {
          if (!n._bg || n._bg.showed == i) {
            n._showed = n._ui.visible = i, clearInterval(s);
            var t = i ? a.SHOW_COMPLETE : a.HIDE_COMPLETE,
              e = new a(t);
            n.dispatchEvent(e)
          }
        }, 30)
    }, t.prototype._update = function() {
      if (this._text) {
        var t, e, i = this._text,
          n = i.length,
          s = this._option,
          a = s.bgPadding,
          o = 0,
          h = 0,
          r = 0,
          c = 0,
          _ = 0;
        if (!s.isSplit)
          for (t = 0; t < this._txs.length; t++) this._txs[t].text = "";
        var l, p = [0];
        for (t = 0; t < n; t++)
          if (this._txs[o] ? (e = this._txs[o]).visible = !0 : (this._txs[o] = e = new PIXI.Text("", s.style), this._ui.addChild(e)), s.isSplit) {
            if (e.text = i.charAt(t), e.x = h + a, e.y = r + a, e.__x = e.x, e.__cw = this._charW, s.isMonospaced ? (h += this._charW, e.x += (this._charW - e.width) / 2) : h += e.width, c < h + a && "\n" != e.text && (c = h + a), s.isMultiline && this.__width < h + 2 * a || "\n" == e.text) {
              var d = e.text;
              h = 0, e.text = "a", r += e.height + s.leading, p.push(o), o--, "\n" != d && t--, h -= s.letterSpacing
            }
            h += s.letterSpacing, o++
          } else {
            var u = e.text;
            " " != e.text ? e.text += i.charAt(t) : e.text = i.charAt(t), e.x = h + a, e.y = r + a, c < e.width + a && (c = e.width + a), s.isMultiline && this.__width < e.width + 2 * a && (e.text = u, r += e.height + s.leading, o++, t--)
          } if (1 == s.align && s.isSplit && 2 <= p.length)
          for (p.push(o), t = 1; t < p.length; t++) {
            var f = 0;
            if (s.isMonospaced) f = (this._charW + s.letterSpacing) * (p[t] - p[t - 1]);
            else
              for (l = p[t - 1]; l < p[t]; l++) f += this._txs[l].width + s.letterSpacing;
            var y = .5 * (c - a - (f -= s.letterSpacing));
            for (l = p[t - 1]; l < p[t]; l++)(e = this._txs[l]).x += y
          }
        for (e && (_ = r + e.height + a, this.__height = _ + a), s.isMultiline || (this.__width = c + a), s.isSplit || o++, this._len = o, n = this._txs.length, t = o; t < n; t++)(e = this._txs[t]).visible = !1;
        s.useBg && this._bg.setSize(this.__width, this.__height)
      }
    }, Object.defineProperty(t.prototype, "text", {
      get: function() {
        return this._text
      },
      set: function(t) {
        this._text = t, this._update()
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(t.prototype, "width", {
      get: function() {
        return 0 <= this.__width ? this.__width : this._ui.width
      },
      set: function(t) {
        this._option.isMultiline && (this.__width = t, this._update())
      },
      enumerable: !0,
      configurable: !0
    }), t
  }(l);
  _.UIText = v;
  var m = function(i) {
    function t(t) {
      var e = i.call(this) || this;
      return e._ps = [], e._ts = [], e._len = 0, e._color = 16777215, e._alpha = 1, e._showed = !1, t && t.addChild(e), e.visible = !1, e
    }
    return __extends(t, i), Object.defineProperty(t.prototype, "showed", {
      get: function() {
        return this._showed
      },
      enumerable: !0,
      configurable: !0
    }), t.prototype.setColor = function(t, e) {
      return void 0 === t && (t = 16777215), void 0 === e && (e = 1), this._color = t, this._alpha = e, this
    }, t.prototype.setSize = function(t, e, i, n) {
      void 0 === i && (i = 4), void 0 === n && (n = 3);
      var s, a = (this._w = t) / (i - 1),
        o = (this._h = e) / (n - 1),
        h = 0;
      for (s = 0; s < i; s++) this._ts[h++] = new _.Point(s * a, 0);
      for (s = 1; s < n - 1; s++) this._ts[h++] = new _.Point(t, s * o);
      for (s = i - 1; 0 <= s; s--) this._ts[h++] = new _.Point(s * a, e);
      for (s = n - 2; 1 <= s; s--) this._ts[h++] = new _.Point(0, s * o);
      for (this._len = h, s = 0; s < this._len; s++) this._ps[s] || (this._ps[s] = new _.Point);
      if (this._showed) {
        for (s = 0; s < this._len; s++) this._ps[s].set(this._ts[s].x, this._ts[s].y);
        this._draw()
      }
      return this
    }, t.prototype.setDisplayOption = function(t, e) {
      this._optShow = t, (this._optHide = e) || (this._optHide = t)
    }, t.prototype.mouseoverHandler = function() {
      if (this._showed) {
        for (var t = 0; t < this._len; t++) {
          var e = .3 * this._h,
            i = this._ts[t],
            n = this._ps[t];
          n.x = i.x + _.MathUtil.rand(-e, e), n.y = i.y + _.MathUtil.rand(-e, e);
          var s = Elastic.easeOut.config(1, .4);
          TweenLite.killTweensOf(n), TweenLite.to(n, .8, {
            x: i.x,
            y: i.y,
            ease: s
          })
        }
        var a = this;
        TweenLite.to(this, .8, {
          onUpdate: function() {
            a._draw()
          }
        })
      }
    }, t.prototype.show = function() {
      this.visible = !0, this._showed = !1, this._start(this._optShow, !0)
    }, t.prototype.hide = function() {
      this._showed = !0, this._start(this._optHide, !1)
    }, t.prototype._start = function(t, e) {
      for (var i = .5 * this._w, n = .5 * this._h, s = 0; s < this._len; s++) {
        var a, o = this._ts[s].clone(),
          h = this._ps[s].set(o.x, o.y);
        switch (a = e ? h : o, t.type) {
          case d.BG_ZOOM:
            a.set(i, n);
            break;
          case d.BG_SLIDE:
            a.x = 0;
            break;
          case d.BG_SLIDE_H:
            a.y = 0
        }
        if (t.type != d.ALPHA) {
          var r, c = _.MathUtil.rand(.8 * t.time, t.time);
          r = e ? Elastic.easeOut.config(1, .4) : Elastic.easeIn.config(1, .4), TweenLite.to(h, c, {
            x: o.x,
            y: o.y,
            ease: r,
            delay: t.delay
          })
        }
      }
      t.type != d.ALPHA ? this._drawStart(t.time, t.delay, e) : (this.alpha = e ? 0 : 1, this._drawStart(t.time, t.delay, e, e ? 1 : 0))
    }, t.prototype._drawStart = function(t, e, i, n) {
      void 0 === e && (e = 0), void 0 === i && (i = !0), void 0 === n && (n = 1);
      var s = this;
      TweenLite.killTweensOf(this), TweenLite.to(this, t, {
        alpha: n,
        delay: e,
        onUpdate: function() {
          s._draw()
        },
        onComplete: function() {
          if (s._showed = i) {
            for (var t = 0; t < s._len; t++) s._ps[t].set(s._ts[t].x, s._ts[t].y);
            s._draw()
          } else s.visible = !1
        }
      })
    }, t.prototype._draw = function() {
      var t, e;
      for (this.clear(), this.beginFill(this._color, this._alpha), t = 0; t < this._len; t++) e = this._ps[t], 0 != t ? this.lineTo(e.x, e.y) : this.moveTo(e.x, e.y);
      this.endFill()
    }, t
  }(PIXI.Graphics);
  _.UIBg = m;
  var g = function(i) {
      function t(t) {
        var e = i.call(this, t) || this;
        return e._activeX = !0, e._activeY = !0, e
      }
      return __extends(t, i), t.prototype.init = function(t, e, i, n, s) {
        void 0 === i && (i = !0), void 0 === n && (n = !0), void 0 === s && (s = 0), this.__base = t, this.__pad = e, this._activeX = i, this._activeY = n, this._mode = s, this.__name = "pad" + Date.now(), this._ui.addChild(this.__base), this._ui.addChild(this.__pad), this.__base.buttonMode = !0, this.__base.interactive = !0;
        var a = this;
        this.__base.on(_.EventName.START, function(t) {
          a.__start(t)
        }), _.Context.pcTouchEnabled && this.__base.on(_.EventName.TOUCH_START, function(t) {
          a.__start(t)
        })
      }, t.prototype.show = function(t) {
        void 0 === t && (t = .3), this.__pad.x = 0, this.__pad.y = 0, i.prototype.show.call(this, t)
      }, t.prototype.hide = function(t) {
        void 0 === t && (t = .3), $(window).off(_.EventName.MOVE + "." + this.__name), $(window).off(_.EventName.END + "." + this.__name), _.Context.pcTouchEnabled && ($(window).off(_.EventName.TOUCH_MOVE + "." + this.__name), $(window).off(_.EventName.TOUCH_END + "." + this.__name)), i.prototype.hide.call(this, t)
      }, t.prototype.__calc = function(t) {
        var e = new h(h.UPDATE);
        if (e.mode = this._mode, t) {
          var i, n, s = t.x - this._ui.x,
            a = t.y - this._ui.y;
          this._activeX && this._activeY ? (i = Math.atan2(a, s), n = Math.sqrt(s * s + a * a) / this._radius) : this._activeX ? (i = Math.atan2(0, s), n = Math.abs(s / this._radius)) : (i = Math.atan2(0, a), n = Math.abs(a / this._radius)), 1 < n && (n = 1);
          var o = (this._radius - this._radiusPad) * n;
          this.__pad.x = o * Math.cos(i), this.__pad.y = o * Math.sin(i), e.radian = i, e.distance = n, this.dispatchEvent(e)
        } else TweenLite.to(this.__pad, .15, {
          x: 0,
          y: 0,
          ease: Power2.easeOut
        }), e.radian = 0, e.distance = 0, this.dispatchEvent(e)
      }, t.prototype.__start = function(t) {
        var e = t.data.getLocalPosition(t.target);
        e.x += t.target.worldTransform.tx, e.y += t.target.worldTransform.ty, TweenLite.killTweensOf(this.__pad), this.__calc(e), $(window).on(_.EventName.MOVE + "." + this.__name, {
          this: this
        }, this.__move), $(window).on(_.EventName.END + "." + this.__name, {
          this: this
        }, this.__end), _.Context.pcTouchEnabled && ($(window).on(_.EventName.TOUCH_MOVE + "." + this.__name, {
          this: this
        }, this.__move), $(window).on(_.EventName.TOUCH_END + "." + this.__name, {
          this: this
        }, this.__end))
      }, t.prototype.__move = function(t) {
        var e = aidn.event.getPos(t);
        t.data.this.__calc(e)
      }, t.prototype.__end = function(t) {
        t.data.this.__calc(), $(window).off(_.EventName.MOVE + "." + t.data.this.__name), $(window).off(_.EventName.END + "." + t.data.this.__name), _.Context.pcTouchEnabled && ($(window).off(_.EventName.TOUCH_MOVE + "." + t.data.this.__name), $(window).off(_.EventName.TOUCH_END + "." + t.data.this.__name))
      }, t
    }(l),
    T = function(n) {
      function t(t, e) {
        var i = n.call(this, t) || this;
        return i._core = e, i._init(), i
      }
      return __extends(t, n), t.prototype._init = function() {
        this._base = (new p).init(this._core.loadData["HPadBase.png"], ""), this._pad = (new p).init(this._core.loadData["HPad.png"], ""), this._base.show(0), this._pad.show(0), this._draw(), n.prototype.init.call(this, this._base.ui, this._pad.ui, !0, !1, e.ROTATE)
      }, t.prototype._draw = function() {
        var t = _.Context.stw,
          e = _.Context.sth,
          i = .12 * Math.min(t, e);
        60 < i && (i = 60), this._radius = i, this._radiusPad = .4 * i, this._base.scale = 2 * this._radius / this._base.width, this._pad.scale = 2 * this._radiusPad / this._pad.width
      }, t.prototype.resize = function(t) {
        void 0 === t && (t = 0);
        var e = _.Context.stw,
          i = _.Context.sth;
        this._draw();
        var n = this._radius,
          s = this._radiusPad,
          a = 30;
        !_.Context.isMobile && 450 <= e && (a = 40);
        var o = n + a + t,
          h = i - s - a;
        this._ui.x = o, this._ui.y = h, this.__width = this.__height = this._radius
      }, t
    }(g),
    S = function(n) {
      function t(t, e) {
        var i = n.call(this, t) || this;
        return i._core = e, i._init(), i
      }
      return __extends(t, n), t.prototype._init = function() {
        this._circle = (new p).init(this._core.loadData["PadBase.png"], ""), this._pad = (new p).init(this._core.loadData["Pad.png"], ""), this._circle.show(0), this._pad.show(0), this._draw(), n.prototype.init.call(this, this._circle.ui, this._pad.ui, !0, !0, e.MOVE)
      }, t.prototype._draw = function() {
        var t = _.Context.stw,
          e = _.Context.sth,
          i = .16 * Math.min(t, e);
        80 < i && (i = 80), this._radius = i, this._radiusPad = .4 * i, this._circle.scale = 2 * this._radius / this._circle.width, this._pad.scale = 2 * this._radiusPad / this._pad.width
      }, t.prototype.resize = function() {
        var t = _.Context.stw,
          e = _.Context.sth;
        this._offset = 10, !_.Context.isMobile && 450 <= t && (this._offset = 20), this._draw();
        var i = this._radius,
          n = this._offset,
          s = i + n,
          a = e - i - n;
        this._ui.x = s, this._ui.y = a, this.__width = this.__height = this._radius
      }, t
    }(g)
}(nnf || (nnf = {})),
function(w) {
  var c = function() {
      function t() {}
      return t.TURN = .3, t.SCORES = [.2, .1, .2, .4, .7], t.COUNTS = [2, 3, 3, 5], t.ATTACK = .3, t.SKILL = 0, t.SPECIAL = 0, t.GUARD = 0, t
    }(),
    t = function() {
      function t(t) {
        this._core = t
      }
      return t.prototype.playScene = function(t) {
        switch (t) {
          case w.SceneId.BATTLE_START:
            this._battleStartStart();
            break;
          case w.SceneId.BATTLE_UPDATE:
            this._battleUpdateStart();
            break;
          case w.SceneId.BATTLE_MY_TURN:
            this._battleMyTurnStart();
            break;
          case w.SceneId.BATTLE_ENEMY_TURN:
            this._battleEnemyTurnStart();
            break;
          case w.SceneId.BATTLE_END:
            this._battleEndStart();
            break;
          case w.SceneId.END:
            this._endStart()
        }
      }, t.prototype.update = function() {
        switch (this._core.sceneId) {
          case w.SceneId.BATTLE_UPDATE:
            this._battleUpdate();
            break;
          case w.SceneId.BATTLE_MY_TURN:
            this._qte.update();
            break;
          case w.SceneId.BATTLE_ENEMY_TURN:
        }
        switch (this._core.sceneId) {
          case w.SceneId.BATTLE_START:
          case w.SceneId.BATTLE_UPDATE:
          case w.SceneId.BATTLE_MY_TURN:
          case w.SceneId.BATTLE_ENEMY_TURN:
            this._statusBoss.updatePos()
        }
      }, t.prototype.resize = function() {
        this._status && (this._status.resize(), this._statusBoss.resize(), this._command.resize(), this._endDisp.resize(), this._qte.resize())
      }, t.prototype._battleStartStart = function() {
        this._totalTime = 0, this._startTime = w.Context.time;
        var t = this._core.game.status,
          e = this._core.game.statusBoss;
        t.init(), e.init();
        for (var i = this._core.game.skillEnemyList.length, n = 0; n < i; n++) this._core.game.skillEnemyList[n].count = 0;
        w.Context._skip && (t.HP = t._HP = 200, e.HP = 200, t.SP = t.MAX_SP), this._status || (this._status = new r(this._core), this._statusBoss = new _(this._core), this._command = new l(this._core), this._boss = new p(this._core), this._display = new h(this._core), this._endDisp = new s(this._core), this._qte = new a(this._core)), this._status.show(), this._statusBoss.show(), this._command.init(), this._boss.init(), this._qte.init()
      }, t.prototype._battleUpdateStart = function() {
        var t = this._core.game.status,
          e = this._core.game.statusBoss;
        (t.HP <= 0 || e.HP <= 0) && this._core.main.playScene(w.SceneId.BATTLE_END)
      }, t.prototype._battleMyTurnStart = function() {
        var t = Math.floor((this._core.game.status.MAX_SP - 10) / 40);
        t < 0 && (t = 0), this._status.poolSP(c.TURN + t, !0), this._command.show(), this._status.updateState()
      }, t.prototype._battleEnemyTurnStart = function() {
        this._boss.start()
      }, t.prototype._battleEndStart = function() {}, t.prototype._endStart = function() {
        this._status.hide(), this._statusBoss.hide();
        this._core.game.status;
        this._core.game.statusBoss.HP <= 0 ? (this._core.config.addWin(), this._endDisp.setup(!0)) : this._endDisp.setup(!1), this._endDisp.show()
      }, t.prototype._battleUpdate = function() {
        var t = this._core.game.status,
          e = this._core.game.statusBoss,
          i = t.updateGage(),
          n = e.updateGage();
        this._status.updateGage(i), 1 <= i ? (this._status.compGage(), this._core.main.playScene(w.SceneId.BATTLE_MY_TURN)) : 1 <= n && this._core.main.playScene(w.SceneId.BATTLE_ENEMY_TURN)
      }, Object.defineProperty(t.prototype, "display", {
        get: function() {
          return this._display
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "status", {
        get: function() {
          return this._status
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "statusBoss", {
        get: function() {
          return this._statusBoss
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "qte", {
        get: function() {
          return this._qte
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "totalTime", {
        get: function() {
          return w.Context.time - this._startTime
        },
        enumerable: !0,
        configurable: !0
      }), t
    }();
  w.PixiBattleManager = t;
  var o, e, s = function() {
      function t(t) {
        this._twText = "", this._core = t, this._subparent = new PIXI.Container, this._core.pixi.stage.addChild(this._subparent), this._parent = new PIXI.Container, this._core.pixi.stage.addChild(this._parent), this._init()
      }
      return t.prototype._init = function() {
        var t = this;
        this._nyancoWin = new w.UIImage(this._subparent).init(this._core.loadData[w.TexturePixiId.NYANCO_WIN]), this._nyancoLose = new w.UIImage(this._subparent).init(this._core.loadData[w.TexturePixiId.NYANCO_LOSE]), this._nyancoWin.visible = this._nyancoLose.visible = !1, this._parent.visible = this._subparent.visible = !1, this._nyancoWin.alpha = this._nyancoLose.alpha = .4, this._tx = this._getText(null, -1, 32, !0), this._txBody = this._getText(null, -1, 26), this._txSub = this._getText(null, -1, 20), this._btTweet = this._getText(function() {
          t._clickTweet()
        }, 16777215, 32, !0), this._btBack = this._getText(function() {
          t._clickBack()
        }, 16777215, 32, !0), this._btTweet.text = "分 享 到 X", this._btBack.text = "回 到 标 题 界 面", this._txSub.addEventListener(w.DisplayEvent.HIDE_COMPLETE, function() {
          t._hideComplete()
        })
      }, t.prototype.setup = function(t) {
        this._nyancoWin.visible = this._nyancoLose.visible = !1, this._parent.visible = this._subparent.visible = !1, this._gameclear = t;
        var e, i, n = !this._core.config.japanese,
          s = 0;
        n || (s = -4), this._txBody.changeTextSpacing(s, n), this._txSub.changeTextSpacing(s, n), this._twText = "";
        var a = this._core.game.status.NAME,
          o = this._core.game.status.LV,
          h = this._core.pixi.battle.totalTime,
          r = Math.floor(h / 60),
          c = Math.round(h % 60),
          _ = "LV:" + o + " " + a + " 用 时:" + r + "m" + w.StringUtil.keta(c, 2, "0") + "s";
        if (t) {
          this._nyancoWin.visible = !0, this._tx.changeTextColor(16737945), this._txBody.changeTextColor(0), this._txSub.changeTextColor(0), this._btTweet.changeTextColor(16777215).changeBgColor(0), this._btBack.changeTextColor(16777215).changeBgColor(0);
          var l, p = [75, 50, 40],
            d = [2, 4, 6, 8, 10, 30];
          for (l = 0; l < p.length && !(p[l] <= o); l++);
          for (var u = 0; u < d.length && !(h <= 60 * (d[u] + l)); u++);
          this._core.config.setMaxRank(u);
          var f, y = this._core.config.getRankText(u, n);
          this._tx.text = "恭 喜 你 完 成 游 戏 ！", f = n ? "感 谢 你 的 游 玩 ！" : "プレイいただきありがとうございます。", this._txBody.text = f, f = y + "\n" + _, this._txSub.text = f, this._txSub.changeTextColor(16737894, 0, y.length), this._twText += "GAME CLEAR! / " + y + "\n" + _, e = [this._tx, this._txBody, this._txSub, this._btTweet, this._btBack], i = [0, 15, 20, 45, 30]
        } else this._nyancoLose.visible = !0, this._tx.changeTextColor(16777215), this._txSub.changeTextColor(16777215), this._btTweet.changeTextColor(0).changeBgColor(16777215), this._btBack.changeTextColor(0).changeBgColor(16777215), this._tx.text = "游 戏 失 败", this._txSub.text = _, this._twText += "游 戏 失 败 " + _, e = [this._tx, this._txSub, this._btTweet, this._btBack], i = [0, 20, 45, 30];
        this._subparent.parent.setChildIndex(this._subparent, this._subparent.parent.children.length - 1), this._parent.parent.setChildIndex(this._parent, this._parent.parent.children.length - 1);
        var v, m = e.length,
          g = 0;
        for (v = 0; v < m; v++) g < e[v].width && (g = e[v].width);
        var T = 0;
        for (v = 0; v < m; v++) {
          var S = e[v];
          S.x = .5 * -S.width, S.y = T + i[v], T = S.y + S.height
        }
        this._tWidth = g, this._tHeight = T, this._list = e, this._showed = !1, this._hiding = !1
      }, t.prototype.show = function() {
        var t, e = this;
        t = this._gameclear ? 1.4 : .8, TweenLite.delayedCall(t, function() {
          e._show()
        })
      }, t.prototype._show = function() {
        this._showed = !0, this.resize();
        for (var t = this._list.length, e = 0; e < t; e++) this._list[e].show(.3 * e);
        this._parent.visible = !0, this._subparent.visible = !0, this._subparent.alpha = 0, TweenLite.to(this._subparent, .6, {
          alpha: 1,
          ease: Power0.easeNone
        })
      }, t.prototype.hide = function() {
        for (var t = this._list.length, e = 0; e < t; e++) this._list[e].hide();
        TweenLite.to(this._subparent, .6, {
          alpha: 0,
          ease: Power0.easeNone
        })
      }, t.prototype.resize = function() {
        if (this._showed) {
          var t = w.Context.stw,
            e = w.Context.sth,
            i = .5 * t,
            n = this._tWidth,
            s = this._tHeight,
            a = Math.min(1, .9 * t / n, .8 * e / s);
          this._parent.scale.set(a, a), this._parent.x = i, this._parent.y = .5 * (e - s * a), this._resizeWin(t, e), this._resizeLose(t, e)
        }
      }, t.prototype._resizeWin = function(t, e) {
        var i = .7 * e / this._nyancoWin.height;
        1 < i && (i = 1), this._nyancoWin.scale = i, this._nyancoWin.x = t - this._nyancoWin.width * i - .05 * t, this._nyancoWin.y = .5 * (e - this._nyancoWin.height * i)
      }, t.prototype._resizeLose = function(t, e) {
        var i = .7 * t / this._nyancoLose.width;
        1 < i && (i = 1), this._nyancoLose.scale = i, this._nyancoLose.x = .5 * (t - this._nyancoLose.width * i), this._nyancoLose.y = e - this._nyancoLose.height * i - .09 * e
      }, t.prototype._getText = function(t, e, i, n) {
        void 0 === e && (e = -1), void 0 === i && (i = 32), void 0 === n && (n = !1);
        var s, a, o = (new w.UITextInitOption).setText(i, 0, 0, 10, 1).setSplit(!0, !0, n).setMultiline(!1),
          h = null,
          r = null;
        0 <= e ? (o.setBg(!0, e, 1, 6), h = new w.UIDisplayOption(.6, 0, w.UIDisplayType.BG_SLIDE), r = new w.UIDisplayOption(.6, 0, w.UIDisplayType.BG_SLIDE), s = new w.UIDisplayOption(.4, 0, w.UIDisplayType.ALPHA), a = new w.UIDisplayOption(.4, 0, w.UIDisplayType.ALPHA)) : (s = new w.UIDisplayOption(.1, 0, w.UIDisplayType.TX_PARA, .024), a = new w.UIDisplayOption(.1, 0, w.UIDisplayType.TX_PARA, .024));
        var c = new w.UIText(this._parent).init(o);
        return c.setDisplayOption(s, h, a, r), null != t && c.initButton(t), c
      }, t.prototype._hideComplete = function() {
        this._showed = !1;
        var t = this;
        this._core.pixi.cover.hide(1, 0, Power0.easeNone, function() {
          t._core.main.playScene(w.SceneId.TOP), t._subparent.visible = !1, t._parent.visible = !1
        })
      }, t.prototype._clickTweet = function() {
        aidn.social.shareTw(w.Context._url, !0, this._twText, "daniwell_aidn", w.Context._hashtag)
      }, t.prototype._clickBack = function() {
        this._hiding || (this._hiding = !0, this.hide())
      }, t
    }(),
    a = function() {
      function t(t) {
        this._texts = ["BAD", "GOOD", "NICE", "GREAT", "EXCELLENT"], this._cols = [52479, 52377, 16750848, 16737843, 16737996], this._txWidth = 0, this._score = 0, this._scoreRate = 0, this.__st = 0, this._core = t, this._parent = new PIXI.Container, this._core.pixi.stage.addChild(this._parent), this._cover = new w.Cover(this._parent), this._cover.setup(0, .8, !1), this._cover.show(0), this._gage = new PIXI.Graphics, this._parent.addChild(this._gage), this._gra = new PIXI.Graphics, this._parent.addChild(this._gra), this._txT = this._getText(0), this._txS = this._getText(1), this._txT.text = w.Context.isMobile ? "点 击 ！" : "点击！", this._txS.text = this._texts[4], this._txWidth = this._txS.width;
        var e = this;
        this._parent.interactive = this._parent.buttonMode = !0, this._parent.on(w.EventName.START, function() {
          e._touch()
        }), w.Context.pcTouchEnabled && this._parent.on(w.EventName.TOUCH_START, function() {
          e._touch()
        })
      }
      return t.prototype.init = function() {
        this._parent.visible = this._showed = this._touched = !1, this._progress = this.__time = 0, this.setSpeed(2.5, !1)
      }, t.prototype.resize = function() {
        if (this._showed) {
          var t = w.Context.stw,
            e = w.Context.sth,
            i = .5 * t,
            n = .5 * e;
          this._cover.resize(), this._gage.x = this._gra.x = i, this._gage.y = this._gra.y = n, this._draw(!0);
          var s = Math.min(.7 * t / this._txWidth, 1);
          this._txT.scale = this._txS.scale = s, this._txT.x = .5 * (t - s * this._txT.width), this._txT.y = .5 * (e - s * this._txT.height), this._txS.x = .5 * (t - s * this._txS.width), this._txS.y = .5 * (e - s * this._txS.height)
        }
      }, t.prototype.show = function(t) {
        this._showed = !0, this.resize(), this._parent.visible = !0, this._callback = t, this._txT.show(), this._parent.alpha = 0, TweenLite.to(this._parent, .2, {
          alpha: 1,
          ease: Power0.easeNone
        })
      }, t.prototype.update = function() {
        this._showed && !this._touched && (this._isRandom ? (this.__time += w.Context.delta, this._speed <= this.__time && (this.__time -= this._speed, this._progress = Math.random())) : (1 == this._progress && (this._progress = 0), this._progress < 0 && (this._progress = 1), this._progress += w.Context.delta * this._speed, 1 < this._progress && (this._progress = 1)), this._gra.rotation += .5 * w.Context.delta, this._draw())
      }, t.prototype.setSpeed = function(t, e) {
        void 0 === t && (t = 2.5), void 0 === e && (e = !1), this._speed = t, this._isRandom = e
      }, t.prototype._draw = function(t) {
        void 0 === t && (t = !1);
        var e = w.Context.stw,
          i = w.Context.sth,
          n = this._gage;
        n.clear();
        var s = .4 * Math.min(e, i, 600);
        if (n.beginFill(16777215, .4), n.drawCircle(0, 0, s * this._progress), t) {
          (n = this._gra).clear(), n.lineStyle(3, 16777215), n.drawCircle(0, 0, s);
          for (var a = s + 10, o = s + 15, h = 0; h < 4; h++) {
            var r = h * Math.PI / 2,
              c = Math.cos(r),
              _ = Math.sin(r);
            n.moveTo(c * a, _ * a), n.lineTo(c * o, _ * o)
          }
        }
      }, t.prototype._touch = function() {
        if (!this._touched) {
          this._touched = !0;
          var t = this._progress,
            e = 0;
          e = t < .2 ? 0 : t < .45 ? 1 : t < .7 ? 2 : t < .92 ? 3 : 4;
          var i = [w.SoundId.QTE0, w.SoundId.QTE1, w.SoundId.QTE1, w.SoundId.QTE1, w.SoundId.QTE1];
          w.Context.se.play(i[e]), this._core.pixi.battle.status.poolSP(c.SCORES[e]), this._score = e, this._scoreRate = t, this._txS.changeTextColor(this._cols[e]), this._txS.text = this._texts[e], this.resize(), this._txT.hide(), this._txS.show();
          var n = this;
          TweenLite.delayedCall(1, function() {
            n._hide()
          })
        }
      }, t.prototype._hide = function() {
        var t = this;
        this._txS.hide(), TweenLite.to(this._parent, .3, {
          alpha: 0,
          ease: Power0.easeNone,
          onComplete: function() {
            t._parent.visible = t._showed = t._touched = !1, t._progress = t.__time = 0, t._callback && t._callback()
          }
        })
      }, t.prototype._getText = function(t) {
        void 0 === t && (t = 0);
        var e = (new w.UITextInitOption).setSplit(!0, !0, !0).setMultiline(!1);
        0 == t ? e.setText(24, 16777215, 0) : e.setText(40, 16777215, 0).setShadow(0, 2);
        var i = new w.UIText(this._parent).init(e);
        return 0 == t ? i.setDisplayOption(new w.UIDisplayOption(.2, 0, w.UIDisplayType.ALPHA), null, new w.UIDisplayOption(.2, 0, w.UIDisplayType.ALPHA)) : i.setDisplayOption(new w.UIDisplayOption(.3, 0, w.UIDisplayType.TX_PARA_UP, .05), null, new w.UIDisplayOption(.2, 0, w.UIDisplayType.ALPHA)), i
      }, Object.defineProperty(t.prototype, "score", {
        get: function() {
          return this._score
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(t.prototype, "scoreRate", {
        get: function() {
          return this._scoreRate
        },
        enumerable: !0,
        configurable: !0
      }), t
    }();
  (e = o = w.BattleDisplay || (w.BattleDisplay = {}))[e.TYPE_DAMAGE = 0] = "TYPE_DAMAGE", e[e.TYPE_RECOVER = 1] = "TYPE_RECOVER", e[e.TYPE_SPECIAL = 2] = "TYPE_SPECIAL", e[e.TYPE_MP_DAMAGE = 3] = "TYPE_MP_DAMAGE", e[e.TYPE_MP_RECOVER = 4] = "TYPE_MP_RECOVER", e[e.TARGET_BOSS = 5] = "TARGET_BOSS", e[e.TARGET_NYAN = 6] = "TARGET_NYAN";
  var y, i, h = function() {
      function t(t) {
        this.MAX_LEN = 12, this._skillW = 0, this._skillH = 0, this.__times = [], this._core = t, this._three = t.three, this._parent = new PIXI.Container, this._core.pixi.stage.addChild(this._parent), this._init()
      }
      return t.prototype.showNumber = function(t, e, i) {
        void 0 === e && (e = o.TYPE_DAMAGE), void 0 === i && (i = o.TARGET_BOSS), this._now++, this._len <= this._now && (this._now = 0), this._resize();
        var n, s = this._txs[this._now];
        switch (e) {
          case o.TYPE_DAMAGE:
            s.changeTextColor(16777215);
            break;
          case o.TYPE_RECOVER:
            s.changeTextColor(65433);
            break;
          case o.TYPE_SPECIAL:
            s.changeTextColor(6732799);
            break;
          case o.TYPE_MP_DAMAGE:
            s.changeTextColor(16764108);
            break;
          case o.TYPE_MP_RECOVER:
            s.changeTextColor(16763955)
        }
        switch (i) {
          case o.TARGET_BOSS:
            n = this._three.boss.get2D();
            break;
          default:
            n = this._three.nyanco.get2D()
        }
        var a = 20;
        0 <= this.__times[i] && (w.Context.time - this.__times[i] < .8 && (a = 50));
        s.text = t.toString(), s.x = n.x - s.width * s.scale * .5 + w.MathUtil.rand(-a, a), s.y = n.y - s.height * s.scale * .5 + w.MathUtil.rand(-a, a), this.__times[i] = w.Context.time, this._adjustPos(s), s.show(), TweenLite.delayedCall(1, function() {
          s.hide()
        })
      }, t.prototype.showSkill = function(t, e) {
        void 0 === e && (e = !1), this._showText(t.name, t.nameEn, e)
      }, t.prototype.showText = function(t, e, i) {
        void 0 === e && (e = null), void 0 === i && (i = !1), this._showText(t, e, i)
      }, t.prototype._showText = function(t, e, i) {
        void 0 === e && (e = null), void 0 === i && (i = !1), this._resize();
        var n, s = !this._core.config.japanese,
          a = t;
        s && e && (a = e), (n = i ? this._txSkillBoss : this._txSkill).changeTextSpacing(n.option.letterSpacing, s);
        var o = a.length,
          h = 12;
        for (s && (h += 6); o < h && (a += " ", !(h <= ++o));) a = " " + a, o++;
        n.text = a, n.y = 20, w.Context.isMobile && (n.y = 10), n.x = .5 * (w.Context.stw - n.width * n.scale), n.show(), TweenLite.delayedCall(1, function() {
          n.hide()
        })
      }, t.prototype._adjustPos = function(t) {
        var e = w.Context.stw,
          i = w.Context.sth;
        t.x - 10 <= 0 ? t.x = 10 : e < t.x + t.width * t.scale + 10 && (t.x = e - t.width * t.scale - 10), t.y - 10 <= 0 ? t.y = 10 : i < t.y + t.height * t.scale + 10 && (t.y = i - t.height * t.scale - 10);
        var n = this._core.pixi.battle.status.tx,
          s = t.x <= n.x + n.width + 10,
          a = n.y <= t.y + t.height + 10;
        s && a && (t.y = n.y - t.height - 10)
      }, t.prototype._resize = function() {
        var t, e = w.Context.stw,
          i = w.Context.sth;
        t = Math.min(.8 * e / this._skillW, .12 * i / this._skillH, 1), this._txSkill.scale = this._txSkillBoss.scale = t, 0 <= this._now && (t = Math.min(e / 480 * .6 + .4, 1), this._txs[this._now].scale = t)
      }, t.prototype._getText = function() {
        var t = 32;
        w.Context.isMobile || (t = 45);
        var e = new w.UIText(this._parent).init((new w.UITextInitOption).setText(t, 16777215, 1).setSplit(!0, !0, !0).setMultiline(!1).setShadow(0, 3));
        return e.setDisplayOption(new w.UIDisplayOption(.3, 0, w.UIDisplayType.TX_PARA_UP, .05), null, new w.UIDisplayOption(.1, 0, w.UIDisplayType.TX_PARA, .02)), e
      }, t.prototype._getTextSkill = function(t) {
        void 0 === t && (t = !1);
        var e = 0,
          i = 16777215;
        t && (e = 16777215, i = 3355443);
        var n = 32;
        w.Context.isMobile || (n = 45);
        var s = (new w.UITextInitOption).setBg(!0, i, .8, 6).setText(n, e, 0).setSplit(!0, !0, !1).setMultiline(!1),
          a = new w.UIDisplayOption(.2, 0, w.UIDisplayType.ALPHA),
          o = new w.UIDisplayOption(.2, 0, w.UIDisplayType.ALPHA),
          h = new w.UIDisplayOption(.4, 0, w.UIDisplayType.BG_SLIDE_H),
          r = new w.UIDisplayOption(.4, 0, w.UIDisplayType.BG_SLIDE_H),
          c = new w.UIText(this._parent).init(s);
        return c.setDisplayOption(a, h, o, r), c
      }, t.prototype._init = function() {
        this._txs = [], this._len = 4;
        for (var t = 0; t < this._len; t++) {
          var e = this._getText();
          this._txs[t] = e
        }
        this._now = -1, this._txSkill = this._getTextSkill(!1), this._txSkillBoss = this._getTextSkill(!0);
        var i = "";
        for (t = 0; t < this.MAX_LEN; t++) i += " ";
        this._txSkill.text = i, this._skillW = this._txSkill.width, this._skillH = this._txSkill.height
      }, t
    }(),
    r = function() {
      function t(t) {
        this._poolSp = 0, this._stateImgs = [], this._core = t, this._parent = new PIXI.Container, this._core.pixi.stage.addChild(this._parent);
        var e = 24;
        w.Context.isMobile || (e = 32), this._tx = new w.UIText(this._parent), this._tx.init((new w.UITextInitOption).setText(e, 16777215, 0, 2).setSplit(!0, !0, !1).setMultiline(!1)), this._tx.setDisplayOption(new w.UIDisplayOption(.1, 0, w.UIDisplayType.TX_PARA, .01), null, new w.UIDisplayOption(.1, 0, w.UIDisplayType.TX_PARA, .005)), this._gage = new PIXI.Graphics, this._parent.addChild(this._gage), this._margin = 10, w.Context.isMobile || (this._margin = 20)
      }
      return t.prototype.show = function() {
        this._parent.visible = !0, this._poolSp = 0, this._updateText(), this._updateGage(0), this._tx.show(), this.updateState()
      }, t.prototype.hide = function() {
        this._parent.visible = !1
      }, t.prototype.resize = function() {
        var t = w.Context.stw,
          e = w.Context.sth,
          i = this._tx.width,
          n = this._tx.height,
          s = Math.max(220, .4 * t),
          a = .3 * e,
          o = Math.min(1, s / i, a / n);
        this._tx.scale = o;
        var h = this._margin;
        this._tx.x = h, this._tx.y = e - n * o - h - h, this._gage.x = h, this._gage.y = e - h, this._gage.scale.set(o, o);
        var r = this._stateImgs.length,
          c = 1;
        w.Context.isMobile || (c = 1.3);
        for (var _ = 24 * o * c, l = 12 * o * c, p = 0; p < r; p++) {
          var d = this._stateImgs[p];
          d.scale = _ / d.width, d.x = h + (_ + l) * p, d.y = this._tx.y - (_ + l)
        }
      }, t.prototype.compGage = function() {
        this._gage.alpha = 0, TweenLite.to(this._gage, .2, {
          alpha: 1,
          ease: Power0.easeNone
        })
      }, t.prototype.updateGage = function(t) {
        void 0 === t && (t = 0), this._updateGage(t)
      }, t.prototype.addHP = function(t, e) {
        if (void 0 === e && (e = !0), t = Math.floor(t), e) {
          var i = this._core.pixi.battle.display;
          0 < t ? i.showNumber(t, o.TYPE_RECOVER, o.TARGET_NYAN) : i.showNumber(-t, o.TYPE_DAMAGE, o.TARGET_NYAN)
        }
        var n, s = this,
          a = this._core.game.status;
        return n = 0 < t ? Math.min(a.HP + t, a.MAX_HP) : Math.max(a.HP + t, 0), a.HP = n, t < 0 && this._core.three.nyanco.actionDamage(), TweenLite.to(a, 1, {
          _HP: n,
          ease: Power0.easeNone,
          onUpdate: function() {
            s._updateTextHP()
          }
        }), n
      }, t.prototype.addMP = function(t, e) {
        if (void 0 === e && (e = !0), t = Math.floor(t), e) {
          var i = this._core.pixi.battle.display;
          0 < t ? i.showNumber(t, o.TYPE_MP_RECOVER, o.TARGET_NYAN) : i.showNumber(-t, o.TYPE_MP_DAMAGE, o.TARGET_NYAN)
        }
        var n, s = this,
          a = this._core.game.status;
        return n = 0 < t ? Math.min(a.MP + t, a.MAX_MP) : Math.max(a.MP + t, 0), a.MP = n, TweenLite.to(a, .4, {
          _MP: n,
          ease: Power0.easeNone,
          onUpdate: function() {
            s._updateTextMP()
          }
        }), 0
      }, t.prototype.addSP = function(t, e) {
        if (void 0 === e && (e = !0), t = Math.floor(t), e) {
          var i = this._core.pixi.battle.display;
          0 < t && i.showNumber(t, o.TYPE_SPECIAL, o.TARGET_NYAN)
        }
        var n, s = this._core.game.status;
        return n = 0 < t ? Math.min(s.SP + t, s.MAX_SP) : Math.max(s.SP + t, 0), s.SP = n, this._updateText(), 0
      }, t.prototype.addState = function(t) {
        for (var e = this._core.game.status, i = e.states.length, n = 0; n < i; n++) {
          var s = e.states[n];
          if (s.id == t.id && s.type == t.type) return void(e.states[n] = t)
        }
        e.states.push(t), this.updateState()
      }, t.prototype.updateState = function() {
        for (var t = this._core.game.status, e = t.states.length, i = 0; i < e; i++) {
          var n, s = t.states[i];
          switch (s.type) {
            case y.SKILL:
              s.id == w.XSkillId.POWER && (n = w.TexturePixiId.ST_POWER), s.id == w.XSkillId.MOFU_HEAT && (n = w.TexturePixiId.ST_HEAT);
              break;
            case y.SPECIAL:
              n = w.TexturePixiId.ST_FULL;
              break;
            case y._BOSS:
              n = w.TexturePixiId.ST_VANISH
          }
          this._stateImgs[i] || (this._stateImgs[i] = new w.UIImage(this._parent));
          var a = this._stateImgs[i];
          a.init(this._core.loadData[n]), a.visible = !0
        }
        for (e = this._stateImgs.length; i < e; i++) this._stateImgs[i].visible = !1;
        this.resize()
      }, t.prototype.poolSP = function(t, e) {
        if (void 0 === e && (e = !1), this._poolSp += t, e && 1 <= this._poolSp) {
          var i = Math.floor(this._poolSp);
          this._poolSp -= i, this.addSP(i, !0)
        }
      }, t.prototype._updateGage = function(t) {
        void 0 === t && (t = 0);
        var e = this._gage;
        e.clear().beginFill(16764108);
        var i = this._tx.width;
        e.drawRect(0, -2, 2, 4), e.drawRect(i - 2, -2, 2, 4), e.drawRect(0, -1, i * t, 2)
      }, t.prototype._updateText = function() {
        var t = this._core.game.status;
        t._HP = Math.floor(t._HP), t._MP = Math.floor(t._MP);
        var e = "";
        e += "HP: " + w.StringUtil.keta(t._HP, 4) + " / " + t.MAX_HP + "\n", e += "MP: " + w.StringUtil.keta(t._MP, 4) + " /  " + t.MAX_MP + "\n", e += "SP: " + w.StringUtil.keta(t.SP, 4) + " /   " + w.StringUtil.keta(t.MAX_SP, 2), this._tx.text = e
      }, t.prototype._updateTextHP = function() {
        var t = this._core.game.status;
        t._HP = Math.floor(t._HP);
        for (var e = w.StringUtil.keta(t._HP.toString(), 4), i = 0; i < 4; i++) {
          var n = this._tx.__txs[4 + i];
          n.text = e.charAt(i), n.x = n.__x + .5 * (n.__cw - n.width)
        }
      }, t.prototype._updateTextMP = function() {
        var t = this._core.game.status;
        t._MP = Math.floor(t._MP);
        for (var e = w.StringUtil.keta(t._MP.toString(), 3), i = 0; i < 3; i++) {
          var n = this._tx.__txs[20 + i];
          n.text = e.charAt(i), n.x = n.__x + .5 * (n.__cw - n.width)
        }
      }, Object.defineProperty(t.prototype, "tx", {
        get: function() {
          return this._tx
        },
        enumerable: !0,
        configurable: !0
      }), t
    }(),
    _ = function() {
      function t(t) {
        this._gh = 4, this._offVec = new THREE.Vector3(0, -10, 0), this._core = t, this._gage = new PIXI.Graphics, this._core.pixi.stage.addChild(this._gage), this._gage.visible = !1, this._margin = 15, this._gw = 80, w.Context.isMobile || (this._margin = 30, this._gw = 120)
      }
      return t.prototype.show = function() {
        this._gage.visible = !0, this._draw()
      }, t.prototype.hide = function() {
        this._gage.visible = !1
      }, t.prototype.addHP = function(t, e) {
        if (void 0 === e && (e = !0), t = Math.floor(t), e) {
          var i = this._core.pixi.battle.display;
          0 < t ? i.showNumber(t, o.TYPE_RECOVER, o.TARGET_BOSS) : i.showNumber(-t, o.TYPE_DAMAGE, o.TARGET_BOSS)
        }
        var n, s = this._core.game.statusBoss;
        return n = 0 < t ? Math.min(s.HP + t, s.MAX_HP) : Math.max(s.HP + t, 0), s.HP = n, t < 0 && this._core.three.boss.actionDamage(), this._draw(), n
      }, t.prototype.addMP = function(t, e) {
        if (void 0 === e && (e = !0), t = Math.floor(t), e) {
          var i = this._core.pixi.battle.display;
          0 < t ? i.showNumber(t, o.TYPE_MP_RECOVER, o.TARGET_BOSS) : i.showNumber(-t, o.TYPE_MP_DAMAGE, o.TARGET_BOSS)
        }
        var n, s = this._core.game.statusBoss;
        return n = 0 < t ? Math.min(s.MP + t, s.MAX_MP) : Math.max(s.MP + t, 0), s.MP = n
      }, t.prototype.addState = function(t) {
        this._core.game.statusBoss.states.push(t)
      }, t.prototype.resize = function() {
        var t = w.Context.stw,
          e = (w.Context.sth, this._gage),
          i = 1;
        .3 * t < this._gw && (i = .3 * t / this._gw), this._scale = i, e.scale.set(i, i), this.updatePos()
      }, t.prototype.updatePos = function() {
        var t = w.Context.stw,
          e = w.Context.sth,
          i = this._gage,
          n = this._margin,
          s = this._scale,
          a = this._core.three.boss.get2D(this._offVec);
        i.x = a.x, i.y = a.y, t < i.x + this._gw * s + n && (i.x = t - n - this._gw * s), e < i.y + this._gh * s + n && (i.y = e - n - this._gh * s), i.y < .2 * e && (i.y -= 100)
      }, t.prototype._draw = function() {
        var t = this._gw,
          e = this._gh,
          i = this._gage;
        i.clear(), i.beginFill(16777215, .3), i.drawRect(0, 0, t, e), i.beginFill(16777215, 1), i.drawRect(0, 0, t * this._core.game.statusBoss.getHPRate(), e)
      }, t
    }(),
    l = function() {
      function t(t) {
        this.__height = 500, this.STATE_DEFAULT = 0, this.STATE_SKILL = 1, this.STATE_SPECIAL = 2, this._starting = !1, this._counts = [], this._turn = 0, this._core = t, this._parent = new PIXI.Container, this._core.pixi.stage.addChild(this._parent), this._inited = !1
      }
      return t.prototype.show = function() {
        this._turn++, w.Context.se.play(w.SoundId.TURN), this._core.game.status.addTurn(), this._core.game.status.isGurad = !1, this._starting = !1, this._core.three.nyanco.chainAnimation(w.DataId.VMD_IDLE, 1), this._showDefault()
      }, t.prototype.hide = function() {}, t.prototype.resize = function() {
        var t = w.Context.stw,
          e = w.Context.sth,
          i = this._margin,
          n = this._cw + 2 * i,
          s = Math.min(1, t / n, e / (this.__height + i));
        this._parent.scale.set(s, s)
      }, t.prototype.init = function() {
        this._init()
      }, t.prototype._init = function() {
        this._margin = 20, this._inited || (this._commands = [], this._cmdDescs = []);
        var t = this,
          e = [function() {
            t._click(0)
          }, function() {
            t._click(1)
          }, function() {
            t._click(2)
          }, function() {
            t._click(3)
          }],
          i = !this._core.config.japanese,
          n = ["たたかう", "スキル　", "ひっさつ", "ぼうぎょ"];
        i && (n = ["攻 击 ", "能 力  ", "特 殊 攻 击", "防 御  "]);
        var s = this._getSkillTexts(),
          a = this._getSpecialTexts(),
          o = [n, s[0], a[0]],
          h = [null, s[1], a[1]],
          r = 30,
          c = 14;
        w.Context.isMobile || (r = 40, c = 18);
        for (var _ = 0; _ < 3; _++) {
          this._inited || (this._commands[_] = [], this._cmdDescs[_] = []);
          for (var l = o[_].length, p = 0; p < l; p++) {
            var d;
            if (this._commands[_][p] ? d = this._commands[_][p] : (d = this._getText(e[p], r), this._commands[_][p] = d), d.changeTextSpacing(0, i), d.x = this._margin, d.text = o[_][p], 0 != p || this._inited || d.addEventListener(w.DisplayEvent.HIDE_COMPLETE, function() {
                t._hideComplete()
              }), 0 < _) {
              var u;
              this._cmdDescs[_][p] ? u = this._cmdDescs[_][p] : (u = this._getText(null, c, -1), this._cmdDescs[_][p] = u);
              var f = -1;
              i && (f = 0), u.changeTextSpacing(f, i), u.x = this._margin, u.text = h[_][p]
            }
          }
        }
        this._counts[y.ATTACK] = 0, this._counts[y.SKILL] = 0, this._counts[y.SPECIAL] = 0, this._counts[y.GUARD] = 0, this._cw = this._commands[1][0].width, this._ch = this._commands[1][0].height, this._dh = this._cmdDescs[1][0].height, this._inited || (this._cmdBack = this._getText(function() {
          t._clickBack()
        }, r), this._cmdBack.text = " ← ", this._cmdBack.x = this._cmdBack.y = this._margin), this._inited = !0
      }, t.prototype._getText = function(t, e, i, n, s) {
        void 0 === e && (e = 30), void 0 === i && (i = 0), void 0 === n && (n = 0), void 0 === s && (s = 16777215);
        var a = (new w.UITextInitOption).setText(e, n, i).setSplit(!0, !0).setMultiline(!1),
          o = new w.UIDisplayOption(.3, 0, w.UIDisplayType.ALPHA),
          h = new w.UIDisplayOption(.3, 0, w.UIDisplayType.ALPHA),
          r = null,
          c = null;
        0 <= s && (a.setBg(!0, s, 1, 6), r = new w.UIDisplayOption(.4, 0, w.UIDisplayType.BG_SLIDE), c = new w.UIDisplayOption(.4, 0, w.UIDisplayType.BG_SLIDE));
        var _ = new w.UIText(this._parent).init(a);
        return _.setDisplayOption(o, r, h, c), null != t && _.initButton(t), _
      }, t.prototype._getSkillTexts = function() {
        for (var t = this._core.config.japanese, e = [], i = [], n = this._core.game.status, s = n.SKILS.length, a = 0; a < s; a++) {
          var o = this._core.game.skillList[n.SKILS[a]];
          t ? (e[a] = o.dispName, i[a] = o.desc) : (e[a] = o.dispNameEn, i[a] = o.descEn)
        }
        return [e, i]
      }, t.prototype._getSpecialTexts = function() {
        for (var t = this._core.config.japanese, e = [], i = [], n = this._core.game.status, s = n.SPECIALS.length, a = 0; a < s; a++) {
          var o = this._core.game.skillSpecialList[n.SPECIALS[a]];
          t ? (e[a] = o.dispName, i[a] = o.desc) : (e[a] = o.dispNameEn, i[a] = o.descEn)
        }
        return [e, i]
      }, t.prototype._showDefault = function() {
        this._state = this.STATE_DEFAULT, this.__showCommands(this._state)
      }, t.prototype._showSkill = function() {
        this._state = this.STATE_SKILL;
        for (var t = [], e = this._core.game.status, i = e.SKILS.length, n = 0; n < i; n++) {
          var s = this._core.game.skillList[e.SKILS[n]];
          t[n] = s.mp <= e.MP
        }
        this.__showBack(), this.__showCommands(this._state, this._ch + this._margin, t)
      }, t.prototype._showSpecial = function() {
        this._state = this.STATE_SPECIAL;
        for (var t = [], e = this._core.game.status, i = e.SPECIALS.length, n = 0; n < i; n++) {
          var s = this._core.game.skillSpecialList[e.SPECIALS[n]];
          t[n] = s.sp <= e.SP
        }
        this.__showBack(), this.__showCommands(this._state, this._ch + this._margin, t)
      }, t.prototype.__showBack = function() {
        this._cmdBack.show()
      }, t.prototype.__showCommands = function(t, e, i) {
        void 0 === e && (e = 0);
        for (var n = this._commands[t], s = this._cmdDescs[t], a = n.length, o = this._margin, h = this._ch + o, r = 0; r < a; r++) {
          var c, _ = n[r];
          if (_.y = o + h * r + e, _.show(), this.__height = _.y + this._ch, c = !i || i[r], s && 0 < s.length) {
            _.y += (this._dh - 5) * r;
            var l = s[r];
            l.y = _.y + this._ch - 5, l.show(), this.__height = l.y + this._dh, this._buttonChangeActive(l, c)
          }
          this._buttonChangeActive(_, c)
        }
        this.resize()
      }, t.prototype._buttonChangeActive = function(t, e) {
        var i;
        void 0 === e && (e = !0), e ? (t.buttonActive(), i = 0) : (t.buttonDisactive(), i = 16742263), t.changeTextColor(i)
      }, t.prototype._hideComplete = function() {
        var t = this;
        TweenLite.delayedCall(.05, function() {
          t.__hideComplete()
        })
      }, t.prototype.__hideComplete = function() {
        var t = this._cnum;
        switch (this._starting = !1, this._state) {
          case this.STATE_DEFAULT:
            t == y.ATTACK ? this._startAction(t) : t == y.SKILL ? this._showSkill() : t == y.SPECIAL ? this._showSpecial() : t == y.GUARD && this._startAction(t);
            break;
          case this.STATE_SKILL:
            if (-1 == t) this._showDefault();
            else {
              var e = this._core.game.skillList[this._core.game.status.SKILS[t]];
              this._startAction(y.SKILL, e)
            }
            break;
          case this.STATE_SPECIAL:
            if (-1 == t) this._showDefault();
            else {
              var i = this._core.game.skillSpecialList[this._core.game.status.SPECIALS[t]];
              this._startAction(y.SPECIAL, i)
            }
        }
      }, t.prototype._startAction = function(t, e) {
        var i = new d(t),
          n = this._core.pixi.battle.qte,
          s = 0;
        t == y.ATTACK && (s = .15), t == y.GUARD && (s = .15);
        var a = this._core.three.battle,
          o = this,
          h = function() {
            o._reupdate(.1, s)
          },
          r = null;
        switch (t) {
          case y.ATTACK:
            this._core.game.paradigm ? n.setSpeed(w.MathUtil.rand(1.8, 2.6), !1) : n.setSpeed(2.2, !1), this._core.pixi.battle.status.poolSP(c.ATTACK), r = function() {
              a.nyanco.startAttack(i, h)
            };
            break;
          case y.SKILL:
            this._core.game.paradigm ? this._turn % 2 == 0 ? n.setSpeed(w.MathUtil.rand(2.4, 3), !1) : n.setSpeed(w.MathUtil.rand(.03, .09), !0) : n.setSpeed(2.4, !1), this._core.pixi.battle.status.poolSP(c.SKILL), i.skill = e, r = function() {
              a.nyanco.startSkill(i, h)
            };
            break;
          case y.SPECIAL:
            this._core.game.paradigm ? this._turn % 2 == 0 ? n.setSpeed(w.MathUtil.rand(2.4, 3), !1) : n.setSpeed(w.MathUtil.rand(.03, .09), !0) : n.setSpeed(2.4, !1), this._core.pixi.battle.status.poolSP(c.SPECIAL), i.skillSp = e, r = function() {
              a.nyanco.startSpecial(i, h)
            };
            break;
          case y.GUARD:
            this._core.pixi.battle.status.poolSP(c.GUARD), a.nyanco.startGuard(i, h)
        }
        this._counts[t]++, c.COUNTS[t] <= this._counts[t] && (this._core.pixi.battle.status.poolSP(1), this._counts[t] = 0), r && n.show(r)
      }, t.prototype._reupdate = function(t, e) {
        void 0 === t && (t = 0), void 0 === e && (e = 0);
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._core.game.status.resetGage(e), i._core.main.playScene(w.SceneId.BATTLE_UPDATE)
        })
      }, t.prototype._click = function(t) {
        this._starting || (this._starting = !0, this._cnum = t, this._hide(), w.Context.se.play(w.SoundId.CLICK))
      }, t.prototype._clickBack = function() {
        this._starting || (this._starting = !0, this._cnum = -1, this._hide(), w.Context.se.play(w.SoundId.CLICK))
      }, t.prototype._hide = function() {
        for (var t = this._state, e = this._commands[t].length, i = 0; i < e; i++) this._commands[t][i].hide(), 0 < t && this._cmdDescs[t][i].hide();
        this._cmdBack.hide()
      }, t
    }(),
    p = function() {
      function t(t) {
        this._isUltranova = !1, this._ultraNovaCount = 0, this._core = t
      }
      return t.prototype.init = function() {
        this._isUltranova = !1, this._preId = this._preId2 = this._preId3 = -1
      }, t.prototype.start = function() {
        this._core.game.statusBoss.addTurn(), this._startSkill()
      }, t.prototype._startSkill = function() {
        var t = this._core.three.battle,
          e = this,
          i = function() {
            e._reupdate(.1, 0)
          };
        if (this._isUltranova)
          if (this._ultraNovaCount--, 0 < this._ultraNovaCount) this._core.pixi.battle.display.showText(this._ultraNovaCount + "", null, !0), TweenLite.delayedCall(.5, i);
          else {
            var n = this._core.game.skillEnemyList[w.XBossSkillId.ULTRANOVA];
            t.boss.startSkill(n, i), this._isUltranova = !1
          }
        else {
          n = this._getSkill(this._preId);
          switch (this._core.game.statusBoss.MP < n.mp && (n = this._core.game.skillEnemyList[w.XBossSkillId.SHOOT]), n.count++, this._preId3 = this._preId2, this._preId2 = this._preId, this._preId = n.id, n.id) {
            case w.XBossSkillId.ULTRANOVA:
              this._isUltranova = !0, this._ultraNovaCount = 3, this._core.pixi.battle.display.showText("オーバードライブ抑制", "Overdrive Suppression", !0);
              TweenLite.delayedCall(1.4, function() {
                e._core.pixi.battle.display.showText(e._ultraNovaCount + "", null, !0)
              }), TweenLite.delayedCall(1.9, i);
              var s = new w.StatusStateData(-1, -1).init(3, 0, -.12, 0, -.12, .22, -.12);
              return void this._core.pixi.battle.statusBoss.addState(s)
          }
          t.boss.startSkill(n, i)
        }
      }, t.prototype._getSkill = function(t, e, i) {
        void 0 === t && (t = -1), void 0 === e && (e = -1), void 0 === i && (i = -1);
        for (var n = this._core.game.skillEnemyList, s = n.length, a = this._core.game.statusBoss.getHPRate(), o = this._core.game.statusBoss.turn, h = [], r = [], c = 0, _ = 0; _ < s; _++) {
          var l = n[_];
          if (l.id != t) {
            var p = l.getRate(a, o);
            p <= 0 || (l.id == e && (p *= .3), l.id == i && (p *= .6), c += p, h.push(l), r.push(c))
          }
        }
        var d = c * Math.random();
        s = r.length;
        for (_ = 0; _ < s; _++)
          if (d <= r[_]) return h[_];
        return n[0]
      }, t.prototype._reupdate = function(t, e) {
        void 0 === t && (t = 0), void 0 === e && (e = 0);
        var i = this;
        TweenLite.delayedCall(t, function() {
          i._core.game.statusBoss.resetGage(e), i._core.main.playScene(w.SceneId.BATTLE_UPDATE)
        })
      }, t
    }();
  (i = y = w.ActionType || (w.ActionType = {}))[i.ATTACK = 0] = "ATTACK", i[i.SKILL = 1] = "SKILL", i[i.SPECIAL = 2] = "SPECIAL", i[i.GUARD = 3] = "GUARD", i[i._BOSS = 4] = "_BOSS";
  var d = function(t) {
    this.type = t
  };
  w.ActionData = d
}(nnf || (nnf = {})),
function(h) {
  var r, t, e = function(t) {
    function e() {
      return null !== t && t.apply(this, arguments) || this
    }
    return __extends(e, t), e.prototype.getPixiTexName = function(t) {
      return "tex" + t
    }, e.prototype.getVmdName = function(t) {
      return "vmd" + t
    }, e
  }(Object);
  h.LoadData = e, (t = r = h.DataId || (h.DataId = {}))[t.PMD_NYNACO = 0] = "PMD_NYNACO", t[t.PMD_CRYSTAL = 1] = "PMD_CRYSTAL", t[t.VMD_IDLE = 2] = "VMD_IDLE", t[t.VMD_WALK = 3] = "VMD_WALK", t[t.VMD_RUN = 4] = "VMD_RUN", t[t.VMD_ATTACK = 5] = "VMD_ATTACK", t[t.VMD_GUARD = 6] = "VMD_GUARD", t[t.VMD_DOWN = 7] = "VMD_DOWN", t[t.VMD_SKILL = 8] = "VMD_SKILL", t[t.VMD_SPECIAL = 9] = "VMD_SPECIAL", t[t.BGM_MAP = 10] = "BGM_MAP", t[t.BGM_BATTLE = 11] = "BGM_BATTLE";
  var o = function() {
    function t() {}
    return t.MAP_FLOOR = "MapFloor.png", t.MAP_PYRAMID = "MapPyramid.png", t.BOSSES = ["Boss_0.png", "Boss_1.png", "Boss_2.png", "Boss_3.png", "Boss_4.png"], t.SKY = "Sky.png", t.SKY_BOTTOM = "SkyBottom.png", t.CIRCLE_SKILL = "CircleSkill.png", t.CIRCLE_SPECIAL = "CircleSpecial.png", t.TRAIL = "Trail.png", t.GRAD = "Grad.png", t.CYLINDER_LIN = "GradLine.png", t.CYLINDER_WAT = "GradWater.png", t.CLOUD = "Cloud.png", t.CLOUD_ICE = "CloudIce.png", t.TAIL = "Tail.png", t.FL_CIRCLE = "FlCircle.png", t.FL_CIRCLE2 = "FlCircle2.png", t.FL_CIRCLETX = "FlCircleTx.png", t.FL_TOGE = "FlToge.png", t.MK_DOT = "MkDot.png", t.MK_MARU = "MkMaru.png", t.MK_WAVE = "MkWave.png", t.PT_KIRA = "PtKira.png", t.PT_BALL = "PtBall.png", t.PT_PLUS = "PtPlus.png", t.PT_ARROW = "PtArrow.png", t.NYANCO = "Nyanco.png", t
  }();
  h.TextureId = o;
  var i = function() {
    function t() {}
    return t.BT_STATUS = "BtStatus.png", t.NYANCO_WIN = "MikuWin.png", t.NYANCO_LOSE = "MikuLose.png", t.ST_POWER = "StPower.png", t.ST_HEAT = "StHeat.png", t.ST_FULL = "StFull.png", t.ST_VANISH = "StVanish.png", t
  }();
  h.TexturePixiId = i;
  var n = function() {
    function t() {}
    return t.CLICK = "click.mp3", t.CLICK_STATUS = "click.mp3", t.TURN = "turn.mp3", t.QTE0 = "qte0.mp3", t.QTE1 = "qte1.mp3", t.BOSS_SHOW = "boss_show.mp3", t.BATTLE = "battle.mp3", t.BOSS_FLASH = "boss_flash.mp3", t.BOSS_DEATH = "boss_death.mp3", t.MAGICK = "magick.mp3", t.ATTACK = "attack.mp3", t.HEAL = "heal.mp3", t.HEALUP = "healup.mp3", t.POWERUP = "powerup.mp3", t.DRAIN = "drain.mp3", t.DRAINUP = "drainup.mp3", t.BOMB_THROW = "bomb_throw.mp3", t.BOMB_EXP = "bomb_exp.mp3", t.VOLTEX_EXP = "voltex_exp.mp3", t.VOLTEX_IN = "voltex_in.mp3", t.APPLE = "apple.mp3", t.TAIL = "tail.mp3", t.TAIL_HIT = "tail_hit.mp3", t.METEOR_IN = "meteor_in.mp3", t.METEOR_HIT = "meteor_hit.mp3", t.CRYSIS_IN = "crysis_in.mp3", t.FULLPOWER1 = "fullpower1.mp3", t.FULLPOWER2 = "fullpower2.mp3", t.ULTIMA_IN = "ultima_in.mp3", t.ULTIMA_EXP = "ultima_exp.mp3", t.NYALTIMA = "nyaltima.mp3", t.MUGIWARA = "mugiwara.mp3", t.SHOOT = "shoot.mp3", t.FLAME = "flame.mp3", t.ICE = "ice.mp3", t.THUNDER = "thunder.mp3", t.FLARESTAR = "flarestar.mp3", t.HELLBOUND = "hellbound.mp3", t.VANISHING = "vanishing.mp3", t.ULTRANOVA = "ultranova.mp3", t.PARADIGM = "paradigm.mp3", t.PHANTOM = "phantom.mp3", t.MEGAFLARE = "megaflare_in.mp3", t
  }();
  h.SoundId = n;
  var s = function() {
    function e() {}
    return e.getIds1 = function() {
      return [r.VMD_IDLE, r.VMD_WALK, r.VMD_RUN]
    }, e.getIds2 = function() {
      return [r.VMD_ATTACK, r.VMD_GUARD, r.VMD_DOWN, r.VMD_SKILL, r.VMD_SPECIAL]
    }, e.getName = function(t) {
      switch (t) {
        case r.VMD_IDLE:
          return e.IDLE;
        case r.VMD_WALK:
          return e.WALK;
        case r.VMD_RUN:
          return e.RUN;
        case r.VMD_ATTACK:
          return e.ATTACK;
        case r.VMD_GUARD:
          return e.GUARD;
        case r.VMD_DOWN:
          return e.DOWN;
        case r.VMD_SKILL:
          return e.SKILL;
        case r.VMD_SPECIAL:
          return e.SPECIAL
      }
      return ""
    }, e.IDLE = "nnf_idle.vmd", e.WALK = "nnf_walk.vmd", e.RUN = "nnf_run.vmd", e.ATTACK = "nnf_attack.vmd", e.GUARD = "nnf_guard.vmd", e.DOWN = "nnf_down.vmd", e.SKILL = "nnf_skill.vmd", e.SPECIAL = "nnf_special.vmd", e
  }();
  h.VmdId = s;
  var a = function(a) {
    function t(t) {
      var e = a.call(this, t) || this,
        i = h.Context._server;
      e.add(new f(i + "data/model/pmd/tex.json", t, !0, !0)), e.add(new f(i + "img/three/tex.json", t, !0)), e.add(new f(i + "img/pixi/tex.json", t, !1));
      var n = "data/model/pmd/crystal.pmd",
        s = "data/model/pmd/cubic_miku.pmd";
      return 0 <= navigator.userAgent.indexOf("Firefox") && (n = n.split("pmd/").join("pmd_ff/"), s = s.split("pmd/").join("pmd_ff/")), e.add(new d(i + n, "data/model/pmd/", t, r.PMD_CRYSTAL)), e.add(new d(i + s, "data/model/pmd/", t, r.PMD_NYNACO)), e.add(new u(i + "data/model/vmd/vmd1.zip", t)), e
    }
    return __extends(t, a), t
  }(h.SequentialCommand);
  h.InitLoadCommand = a;
  var c = function(n) {
    function t(t) {
      var e = n.call(this, t) || this,
        i = h.Context._server;
      return e.add(new p(i + "data/sound/dungeon.mp3", t, r.BGM_MAP, !1, .0015)), aidn.util.webaudio && e.add(new f(i + "data/sound/1/sound.json", t)), e
    }
    return __extends(t, n), t
  }(h.SequentialCommand);
  h.InitAudioLoadCommand = c;
  var _ = function(n) {
    function t(t) {
      var e = n.call(this, t) || this,
        i = h.Context._server;
      return e.add(new u(i + "data/model/vmd/vmd2.zip", t)), e.add(new f(i + "img/three_battle/tex.json", t, !0)), e
    }
    return __extends(t, n), t
  }(h.SequentialCommand);
  h.BattleLoadCommand = _;
  var l = function(n) {
    function t(t) {
      var e = n.call(this, t) || this,
        i = h.Context._server;
      return e.add(new p(i + "data/sound/boss.mp3", t, r.BGM_BATTLE, !1, .0015)), aidn.util.webaudio && e.add(new f(i + "data/sound/2/sound.json", t)), e
    }
    return __extends(t, n), t
  }(h.SequentialCommand);
  h.BattleAudioLoadCommand = l;
  var p = function(o) {
    function t(t, e, i, n, s) {
      void 0 === n && (n = !1), void 0 === s && (s = -1);
      var a = o.call(this, e, i) || this;
      return a._url = t, a._isplay = n, a._trimvol = s, a
    }
    return __extends(t, o), t.prototype.execute = function() {
      var t = function() {
          e._complete()
        },
        e = this;
      this._id == r.BGM_BATTLE && null != h.Context._a ? this._audio = h.Context._a : this._audio = new aidn.AutoAudio(null), this._isplay ? (this._audio.load([this._url], null, this._trimvol), this._audio.play(0, !1, t, 0, 0)) : this._audio.load([this._url], t, this._trimvol)
    }, t.prototype._complete = function() {
      this._isplay && this._audio.stop(), this._setData(this._audio), this._dispatchComplete()
    }, t
  }(h.CommandBase);
  h.AudioLoadCommand = p;
  var d = function(a) {
    function t(t, e, i, n) {
      var s = a.call(this, i, n) || this;
      return s._pmdUrl = t, s._texDirUrl = e, s
    }
    return __extends(t, a), t.prototype.execute = function() {
      var e = this,
        t = new THREE.MMDLoader;
      t.setDefaultTexturePath(this._texDirUrl), t.loadModel(this._pmdUrl, function(t) {
        e._complete(t)
      }, function(t) {
        e._progress(t)
      })
    }, t.prototype._progress = function(t) {
      if (t.lengthComputable) {
        var e = t.loaded / t.total;
        this._dispatchProgress(e)
      }
    }, t.prototype._complete = function(t) {
      var e = t;
      this._setData(e), this._dispatchComplete()
    }, t
  }(h.CommandBase);
  h.ThreePmdLoadCommand = d;
  var u = function(s) {
    function t(t, e, i) {
      var n = s.call(this, e) || this;
      return n._keys = [], n._url = t, n._pmdId = 0 <= i ? n._pmdId = i : r.PMD_NYNACO, n
    }
    return __extends(t, s), t.prototype.execute = function() {
      var i = this;
      JSZipUtils.getBinaryContent(this._url, function(t, e) {
        i._zipComplete(t, e)
      })
    }, t.prototype._zipComplete = function(t, e) {
      var i = this;
      JSZip.loadAsync(e).then(function(t) {
        i._binayComplete(t)
      })
    }, t.prototype._binayComplete = function(t) {
      this._zip = t;
      var e = 0;
      for (var i in t.files) this._keys[e++] = i;
      this._now = -1, this._len = e, this._next()
    }, t.prototype._next = function() {
      if (this._now++, this._now < this._len) {
        this._dispatchProgress(this._now / this._len);
        var e = this,
          i = this._keys[this._now];
        this._zip.file(i).async("arraybuffer").then(function(t) {
          e._arrayComplete(t, i)
        })
      } else this._dispatchComplete()
    }, t.prototype._arrayComplete = function(t, e) {
      var i = this,
        n = new THREE.MMDLoader;
      if (0 < e.lastIndexOf(".vmd")) {
        var s = n.parseVmd(t);
        this._loadData[e] = s, n.pourVmdIntoModel(this._loadData[this._pmdId], s, e)
      }
      TweenLite.delayedCall(.01, function() {
        i._next()
      })
    }, t
  }(h.CommandBase);
  h.ZipLoadCommand = u;
  var f = function(a) {
    function t(t, e, i, n) {
      void 0 === i && (i = !0), void 0 === n && (n = !1);
      var s = a.call(this, e) || this;
      return s._keys = [], s._jsonRate = .3, s._url = t, s._isThree = i, s._global = n, s
    }
    return __extends(t, a), t.prototype.execute = function() {
      var e = this,
        t = {
          method: "GET",
          url: this._url,
          dataType: "json",
          success: function(t) {
            e._complete(t)
          },
          xhr: function() {
            var t = $.ajaxSettings.xhr();
            return t.onprogress = function(t) {
              e._dispatchProgress(e._jsonRate * (t.loaded / t.total))
            }, t
          }
        };
      $.ajax(t)
    }, t.prototype._complete = function(t) {
      this._data = t;
      var e = 0;
      for (var i in t) this._keys[e++] = i;
      this._now = -1, this._len = e, this._next()
    }, t.prototype._next = function() {
      if (this._now++, this._now < this._len) {
        this._dispatchProgress(this._jsonRate + (1 - this._jsonRate) * (this._now / this._len));
        var e = this,
          i = this._keys[this._now],
          t = this._data[i];
        if (0 < i.lastIndexOf(".mp3")) {
          var n = new aidn.WebAudio;
          (this._loadData[i] = n).load(t, function() {
            e._next()
          })
        } else {
          var s, a = new Image;
          s = this._isThree ? function() {
            var t = new THREE.Texture(a);
            t.needsUpdate = !0, i == o.CLOUD_ICE && (t.minFilter = THREE.NearestFilter, t.magFilter = THREE.NearestFilter), e._loadData[i] = t, e._global && (h.Context._obj[i] = t), TweenLite.delayedCall(.01, function() {
              e._next()
            })
          } : function() {
            var t = new PIXI.Texture(new PIXI.BaseTexture(a));
            PIXI.Texture.addTextureToCache(t, i), e._loadData[i] = t, e._global && (h.Context._obj[i] = t), TweenLite.delayedCall(.01, function() {
              e._next()
            })
          }, a.onload = s, a.src = t
        }
      } else this._dispatchComplete()
    }, t
  }(h.CommandBase);
  h.JsonBase64LoadCommand = f
}(nnf || (nnf = {}));