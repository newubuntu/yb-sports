function appLib(e) {
  var t = window["ns_" + e.toLowerCase().replace("app", "_app")];
  return t && t[e] && ns_gen5_util.Singleton.getInstance(t[e])
}
var ns_betslipstandardlib_model_ewex, ns_betslipstandardlib_model_pitcher, ns_betslipstandardlib_util, ns_betslipstandardlib_model, ns_betslipstandardlib_model_bet, ns_betslipstandardlib_model_participant, ns_betslipstandardlib_model_multiple, ns_betslipstandardlib_validators, ns_betslipstandardlib_model_slip, SITE_ROOT_PATH = "sports";
! function(e) {
  var t;
  ! function(e) {
    e[e.MainMarket = 1] = "MainMarket", e[e.EnhancedPlace = 2] = "EnhancedPlace", e[e.Ewex = 3] = "Ewex"
  }(t = e.EwexOptionType || (e.EwexOptionType = {}))
}(ns_betslipstandardlib_model_ewex || (ns_betslipstandardlib_model_ewex = {})),
function(e) {
  var t = function() {
    function e(e) {
      this.enhancedMarket = !1, this.mainMarket = !1, this.isSelected = !1, this.fixtureId = e.fi, this.fixtureParticipantId = e.pi, this.placeCount = e.pc, e.em ? this.enhancedMarket = !0 : e.mm && (this.mainMarket = !0), e.os && (this.offerSPOdds = !0), e.fe && (this.forceEachWay = !0), e.ee && (this.ewex = !0), this.odds = e.od, this.topic = "BS" + this.fixtureId + "-" + this.fixtureParticipantId
    }
    return e.prototype.getOdds = function() {
      return this.odds
    }, e.prototype.setOdds = function(e) {
      this.odds = e
    }, e.prototype.getTopic = function() {
      return this.topic
    }, e
  }();
  e.EwexOption = t
}(ns_betslipstandardlib_model_ewex || (ns_betslipstandardlib_model_ewex = {})),
function(e) {
  var t = function() {
    function e(e) {
      this.betslipDisplay = e.bd, this.description = e.pd, this.handicap = e.hp, this.pitcherId = e.pi
    }
    return e
  }();
  e.PitcherOption = t
}(ns_betslipstandardlib_model_pitcher || (ns_betslipstandardlib_model_pitcher = {})),
function(e) {
  var t = ns_gen5_util.InfoReporter,
    i = ns_gen5_util.InfoReporterGroups,
    s = ns_betslipcorelib_constants.BetSlipResult,
    a = ns_betslipcorelib_data.BetDocumentAttribute,
    n = ns_betslipcorelib_data.SlipCurrentState,
    r = ns_betslipcorelib_util.StorageHelper,
    o = ns_betslipcorelib_util.BetsWebApi,
    l = ns_betslipstandardlib_model_ewex.EwexOption,
    d = ns_betslipstandardlib_model_pitcher.PitcherOption,
    p = ns_betslipcorelib_model_betbreakdown.BetBreakdownItem,
    h = ns_betslipcorelib_model_betbreakdown.BetBreakdownData,
    u = ns_gen5_net.NSTLoader,
    c = function(e) {
      function o() {
        return null !== e && e.apply(this, arguments) || this
      }
      return __extends(o, e),
      o.PlaceBet = function(e) {
        var s = new u,
          a = "";
        e.normals && (a += "&ns=" + e.normals), e.multiples && (a += "&ms=" + e.multiples), e.casts && (a += "&cs=" + e.casts), a += "&betsource=" + this.GetBetSource(), a += "&tagType=WindowsDesktopBrowser", a += "&bs=" + r.GetBetslipType(), s.completeHandler = function(t) {
          var i = JSON.parse(t);
          e.completeHandler(i)
        },
        s.errorHandler = function(s) {
          t.Trace(i.BET_SLIP_ENTRY, "Error code: " + s), e.errorHandler()
        },
        r.GetQuickBetActive() && (a += "&qb=1"),
        this.Load(s, this.GetApiRoot() + "/placebet?betGuid=" + e.betGuid, {
          method: "POST",
          data: a,
          contentType: "application/x-www-form-urlencoded"
        })
      },
      o.ReferBet = function(e) {
        var t, i, o, l, d, p, h, c = this;
        e.set(a.CurrentState, n.BetReferralPolling), t = new u, t.completeHandler = function(t) {
          var i, r = JSON.parse(t);
          return r ? (i = r[a.SlipResult], i != s.referralInProgress ? void e.merge(r) : void c.PollReferredBet(e, r[a.ReferrralReference])) : (ErrorReporter.Trace("ReferBetHelper", "Error parsing response data for referral code " + p), e.set(a.SlipResult, s.failed), void e.set(a.CurrentState, n.BetslipError))
        }, t.errorHandler = function(t) {
          ErrorReporter.Trace("ReferBetHelper", "Error code " + t + " when requesting referral reference " + p), e.set(a.SlipResult, s.failed), e.set(a.CurrentState, n.BetslipError)
        }, i = r.GetNormalString(), o = r.GetMultipleString(), l = r.GetCastString(), d = "", i && (d += "ns=" + i), l && (d += "&cs=" + l), o && (d += "&ms=" + o), d += "&betsource=" + this.GetBetSource(), d += "&bs=" + r.GetBetslipType(), p = e.get(a.ReferrralCode), h = e.get(a.ReferrralTime), this.Load(t, this.GetApiRoot() + "/referbet?rc=" + p + "&rt=" + h + "&betGuid=" + e.get(a.BetGuid), {
          method: "POST",
          data: d,
          contentType: "application/x-www-form-urlencoded"
        })
      },
      o.PollReferredBet = function(e, t) {
        var i, n, o = this,
          l = r.GetNormalString(),
          d = r.GetCastString(),
          p = r.GetMultipleString(),
          h = "";
        l && (h += "ns=" + l), d && (h += "cs=" + d), p && (h += "&ms=" + p), h += "&betsource=" + this.GetBetSource(), h += "&bs=" + r.GetBetslipType(), i = new u, i.completeHandler = function(t) {
          var i, r = JSON.parse(t);
          if (r) switch (i = r[a.SlipResult]) {
            case s.referralInProgress:
              setTimeout(function() {
                n()
              }, 2e3);
              break;
            default:
              e.merge(r)
          }
        }, i.errorHandler = function() {}, (n = function() {
          o.Load(i, o.GetApiRoot() + "/pollreferredbet?rr=" + t, {
            method: "POST",
            data: h,
            contentType: "application/x-www-form-urlencoded"
          })
        })()
      },
      o.GetEWEXOptions = function(e, s, a) {
        var n = [],
          r = new u,
          o = "fi=" + e + "&pi=" + s;
        r.completeHandler = function(e) {
          var t, i, r, o, d = JSON.parse(e).ex;
          if (d) {
            for (t = 0, i = d; t < i.length; t++) r = i[t], o = new l(r), +o.fixtureParticipantId === s && (o.isSelected = !0), n.push(o);
            a(n)
          }
        }, r.errorHandler = function(e) {
          t.Trace(i.BET_SLIP_ENTRY, "Error code: " + e), a(null)
        }, this.Load(r, this.GetApiRoot() + "/ewexparticipants?" + o, {
          method: "POST",
          data: o,
          contentType: "application/x-www-form-urlencoded"
        })
      },
      o.GetPitcherOptions = function(e, s, a) {
        var n = [],
          r = new u,
          o = "fi=" + e + "&pi=" + s;
        r.completeHandler = function(e) {
          var t, i, s, r = JSON.parse(e).pa;
          if (r) {
            for (t = 0, i = r; t < i.length; t++) s = i[t], n.push(new d(s));
            a(n)
          }
        }, r.errorHandler = function(e) {
          t.Trace(i.BET_SLIP_ENTRY, "Error code: " + e)
        }, this.Load(r, this.GetApiRoot() + "/pitcherdetails?" + o, {
          method: "POST",
          data: o,
          contentType: "application/x-www-form-urlencoded"
        })
      },
      o.GetBreakdown = function(e, t, i, s) {
        var a, n = [],
          o = [],
          l = new u;
        l.completeHandler = function(e) {
          var t, i, a, r, l, d, u, c, g = JSON.parse(e);
          if (g) {
            if (t = g.wb)
              for (i = 0, a = t; i < a.length; i++) r = a[i], n.push(new p(r));
            if (l = g.pb)
              for (d = 0, u = l; d < u.length; d++) r = u[d], o.push(new p(r));
            c = new h(n, o), s(c)
          }
        }, l.errorHandler = function(e) {
          s(null)
        }, a = "ns=" + r.GetNormalString(), a += "&cs" + r.GetCastString(), a += "&ms=" + r.GetMultipleString(), this.Load(l, this.GetApiRoot() + "/betbreakdown?bt=" + e + "&st=" + t + "&ew=" + (i ? "1" : "0"), {
          method: "POST",
          data: a,
          contentType: "application/x-www-form-urlencoded"
        })
      },
      o.GetCastBetBreakdown = function(e, t, i, s) {
        var a, n = [],
          r = new u;
        r.completeHandler = function(e) {
          var t, i, a, r, o, l = JSON.parse(e);
          if (l) {
            if (t = l.wb)
              for (i = 0, a = t; i < a.length; i++) r = a[i], n.push(new p(r));
            o = new h(n), s(o)
          }
        }, r.errorHandler = function(e) {
          s(null)
        }, a = "cs=" + t, this.Load(r, this.GetApiRoot() + "/betbreakdown?cc=" + e + "&st=" + i, {
          method: "POST",
          data: a,
          contentType: "application/x-www-form-urlencoded"
        })
      }, o
    }(o);
  e.APIHelper = c
}(ns_betslipstandardlib_util || (ns_betslipstandardlib_util = {})),
function(e) {
  var t = function() {
    function e() {}
    return e.SaveStateForReceipt = function(e) {
      var t = appLib("BetslipStandardLibApp");
      t && t.saveStateForReceipt(e)
    }, e
  }();
  e.ServerPreferencesUtil = t
}(ns_betslipstandardlib_util || (ns_betslipstandardlib_util = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.Normal = 0] = "Normal", e[e.BetBuilder = 22] = "BetBuilder"
  }(t = e.BetType || (e.BetType = {}))
}(ns_betslipstandardlib_model || (ns_betslipstandardlib_model = {})),
function(e) {}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_constants.BetStringProperty,
    a = ns_betslipcorelib_model.ValidationModel,
    n = ns_gen5_util.MathUtil,
    r = ns_gen5_util.Delegate,
    o = ns_betslipcorelib_constants.BetSlipResult,
    l = ns_betslipcorelib_constants.OddsTypeOverride,
    d = ns_betcalculationslib_util.OddsFormatter,
    p = ns_betcalculationslib_rounding.RoundingHelper,
    h = ns_betcalculationslib_util.MinimumStakes,
    u = ns_betslipcorelib_constants.FreeBetQualificationStatus,
    c = ns_betslipcorelib_constants.BetTypeLookupKey,
    g = ns_gen5_util.PromotionalFilter,
    b = ns_sitepreferenceslib_util.UserPreferences,
    f = ns_betslipcorelib_util.BetslipPreferences,
    S = ns_betslipcorelib_data.BetDocumentAttribute,
    m = function(e) {
      function a(t, i) {
        var s = e.call(this) || this;
        return s.slipdelegate = i, s.betTypeLookupKey = c.NormalBet, s.bet = t, s
      }
      return __extends(a, e), a.prototype.commitProperties = function() {
        var e, s, a, o, l, d, h, u, c, m, y, B, v, _ = b.AdditionalPreferences(f);
        if (!this.changes[t.TopicId] || this.bet.get(t.BetReference) || _.data && _.data[S.BetReference] || (this.betslipTopic = this.bet.get(t.TopicId).split("x")[0], this.betslipStem && this.betslipStem.data.IT !== this.betslipTopic && (this.betslipStem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.betslipStem.data.IT, ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT), this.betslipStem = null), this.betslipTopic && !this.betslipStem && Locator.subscriptionManager.sharedSubscribe(this.betslipTopic, new r(this, this.subscriptionHandler), ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT)), (this.changes[t.Odds] || this.changes[t.SPOddsSelected]) && (e = this.bet.get(t.OddsChanged) && !this.bet.get(t.SPOddsSelected), s = this.bet.get(t.OfferSPOdds), this.setOddsChanged(this.bet.get(t.Odds), e, this.bet.get(t.SPOddsSelected), s, this.getOddsTypeOverride()), e ? this.slipdelegate.normalBetOddsHandicapSuspensionChanged() : this.slipdelegate.normalBetInvalidateStakes(), this.slipdelegate.normalBetInvalidateHeaderOdds()), this.changes[t.FreeBetTokenSelected] && (a = this.bet.get(t.FreeBetTokenSelected), a ? this.uidelegate.disableStakeBox() : this.uidelegate.enableStakeBox(), this.slipdelegate.normalBetDisableFreeBetTokens(this, this.bet.get(t.FreeBetTokenSelected))), this.changes[t.FreeBetQualifiedStatus] && this.uidelegate.freeBetQualificationChanged(this.bet.get(t.FreeBetQualifiedStatus), this.bet.get(t.FreeBetQualifiedAmount)), this.changes[t.Stake] && (o = this.bet.get(t.Stake), this.uidelegate.stakeChanged(null != o ? o.toString() : ""), this.slipdelegate.normalBetInvalidateStakes()), this.changes[t.MultiplesRestricted] && (l = this.bet.get(t.MultiplesRestricted), this.uidelegate.multiplesRestrictionChanged(l)), this.changes[t.OfferBadges] && this.uidelegate.displayMiniOfferBadges(), this.changes[t.FixtureDescription] && this.uidelegate.fixtureDescriptionChanged(this.bet.get(t.FixtureDescription)), this.changes[i.MarketDescription]) {
          if (d = this.participant.get(i.MarketDescription), !g.IsExcludedFromPromotion("2") && (h = this.bet.get(t.OfferBadges), h && h.length > 0))
            for (u = 0, c = h; u < c.length; u++)
              if (m = c[u], "EP" == m.oc) {
                d = d.split(" – ")[0].split(" - ")[0];
                break
              } this.uidelegate.marketDescriptionChanged(d)
        }
        this.changes[i.BetSlipDisplay] && this.uidelegate.betSlipDisplayChanged(this.participant.get(i.BetSlipDisplay)), this.changes[i.Handicap] && (y = this.participant.get(i.HandicapChanged), this.uidelegate.handicapChanged(this.participant.get(i.DisplayHandicap), y), y ? this.slipdelegate.normalBetOddsHandicapSuspensionChanged() : this.slipdelegate.normalBetInvalidateStakes()), this.changes[t.FreeBetAmount] && (this.uidelegate.showFreebetCheckbox(this.bet.get(t.FreeBetAmount), this.bet.get(t.FreeBetTokenSelected)), this.freeBetTokenStakeInvalidated = !0), this.changes[t.ToReturn] && (this.uidelegate.returnValueChanged(this.bet.get(t.ToReturn)), this.uidelegate.totalStakeChanged(this.bet.get(t.TotalStake))), this.changes[t.Suspended] && (this.bet.get(t.Suspended) ? this.uidelegate.suspend() : this.uidelegate.unsuspend(), this.slipdelegate.normalBetOddsHandicapSuspensionChanged()), this.changes[t.Excluded] && (this.disablePush(), this.slipdelegate.normalBetOddsHandicapSuspensionChanged()), this.changes[t.SlipResult] && this.uidelegate.slipResultChanged(this.bet.get(t.SlipResult)), this.changes[t.ReferralAmount] && (B = this.bet.get(t.ReferralAmount), v = this.bet.get(t.ReferralPlaceAmount) || 0, this.uidelegate.referralAmountChanged(B, v)), this.changes[t.ReferralAmountApproved] && (B = this.bet.get(t.ReferralAmountApproved), B > 0 && this.uidelegate.referralApproved()), this.changes[t.ReferralAmountRejected] && this.uidelegate.referralDeclined(this.bet.get(t.ReferralAmountRejected), this.bet.get(t.Stake)), this.changes[t.BetReference] && this.uidelegate.betReferenceChanged(this.bet.get(t.BetReference)), this.freeBetTokenStakeInvalidated && (this.bet.get(t.FreeBetTokenSelected) && (this.bet.get(t.EachWay) ? this.bet.set(t.Stake, n.StringToNumber(p.RoundUp(+this.bet.get(t.FreeBetAmount) / 2))) : this.bet.set(t.Stake, +this.bet.get(t.FreeBetAmount))), this.freeBetTokenStakeInvalidated = !1)
      }, a.prototype.serialise = function() {
        var e, a, n, r, o, l, d, p, h, u, c, g, b, f, S, m, y, B, v, _ = "";
        return _ += s.ParticipantType + "N" + s.Separator, _ += "" + s.Odds + this.bet.get(t.Odds) + s.Separator, _ += "" + s.FixtureId + this.bet.get(t.FixtureID) + s.Separator, _ += "" + s.FixtureParticipantId + this.participant.get(i.FixtureParticipantID) + s.Separator, _ += "" + s.SelectionOrder + s.Separator, e = this.bet.get(t.SeconaryClassification) ? this.bet.get(t.SeconaryClassification) : this.bet.get(t.Classification), _ += "" + s.ClassificationId + e + s.Separator, a = this.bet.get(t.OddsHash), a && (_ += "" + s.OddsHash + a + s.Separator), n = this.participant.get(i.Handicap), n && (_ += "" + s.LineHandicap + n + s.Separator), _ += "" + s.MediaType + this.bet.get(t.MediaType) + s.Separator, this.bet.get(t.SelectedPitcher) && (_ += "" + s.SelectedPitcher + this.bet.get(t.SelectedPitcher) + s.Separator), (this.bet.get(t.QuickCode) || this.bet.get(t.IsBetCall)) && (_ += "" + s.PhoneOnlyMarket + s.Separator), r = this.bet.get(t.OddsTypeOverride), r && (_ += "" + s.OddsTypeOverride + r + s.Separator), _ += "" + s.Pipe, o = this.bet.get(t.ApplyTolerence), o && (_ += "" + s.ApplyTolerence + s.Separator), l = this.bet.get(t.TopicId), l && (_ += "" + s.Topic + l + s.Separator), d = this.bet.get(t.Stake), d && (p = d.toFixed(2), _ += "" + s.UnitStake + p + s.Separator, _ += "" + s.TotalStake + p + s.Separator), h = this.bet.get(t.MaximumStake), (h || 0 == h) && (_ += "" + s.StakeLimit + h + s.Separator), u = this.bet.get(t.NoReserves), u && (_ += s.NoReserves + "1" + s.Separator), c = this.bet.get(t.AutoVoid), c && (_ += s.AutoVoid + "1" + s.Separator), g = this.bet.get(t.EachWay), g && (_ += s.EachWay + "1" + s.Separator), b = this.bet.get(t.ToReturn), b && (_ += "" + s.TotalReturns + b.toFixed(2) + s.Separator), f = this.bet.get(t.SPOddsSelected), f && (_ += s.SPOdds + "1" + s.Separator), this.bet.get(t.OddsChanged) ? S = this.participant.get(i.HandicapChanged) ? "3" : "1" : this.participant.get(i.HandicapChanged) && (S = "2"), S && (_ += "" + s.OddsLineChange + S + s.Separator), m = this.bet.get(t.BetCreditStake), m && (_ += "" + s.BetCreditStake + m + s.Separator), y = this.bet.get(t.FreeBetTokenSelected), y && (B = this.bet.get(t.FreeBetToken), B && (_ += "" + s.FreeBetToken + B + s.Separator), v = this.bet.get(t.FreeBetAmount), v && (_ += "" + s.FreeBetAmount + v + s.Separator)), _ += _.lastIndexOf("|") == _.length - 1 ? "|" : "||"
      }, a.prototype.setOddsChanged = function(e, t, i, s, a) {
        this.uidelegate.oddsChanged(e, t, i, s, a)
      }, a.prototype.subscriptionHandler = function(e) {
        var s, a;
        this.betslipStem = Locator.treeLookup.getReference(this.betslipTopic), this.betslipStem && (this.betslipStem.addDelegate(this), s = {}, a = this.betslipStem.data, this.bet.get(t.Odds) != a.OD && (s.OD = a.OD), this.bet.get(t.OddsHash) != a.SA && (s.SA = a.SA), this.participant.get(i.Handicap) != a.HA && a.HA && (s.HA = a.HA, s.HD = a.HD), !!this.bet.get(t.Suspended) != ("1" == a.SU) && (s.SU = a.SU), this.stemUpdateHandler(this.betslipStem, s))
      }, a.prototype.stemUpdateHandler = function(e, s) {
        this.bet.get(t.Excluded) || ("SU" in s && this.bet.set(t.Suspended, "1" == s.SU), "SA" in s && this.bet.set(t.OddsHash, s.SA), "OD" in s && (this.bet.set(t.Odds, s.OD), this.bet.get(t.SPOddsSelected) || this.bet.set(t.OddsChanged, !0), this.slipdelegate.normalBetInvalidateStakes()), "HA" in s && (this.participant.get(i.Handicap) && this.participant.set(i.HandicapChanged, !0), this.participant.set(i.Handicap, s.HA), this.participant.set(i.DisplayHandicap, s.HD)))
      }, a.prototype.stemInsertHandler = function(e, t) {}, a.prototype.stemDeleteHandler = function(e) {
        this.bet.set(t.Suspended, !0)
      }, a.prototype.betUpdated = function(e) {
        this.invalidateProperties(e)
      }, a.prototype.participantInserted = function(e) {
        this.participant = e, e.setDelegate(this)
      }, a.prototype.participantUpdated = function(e) {
        this.invalidateProperties(e)
      }, a.prototype.betRemoved = function() {
        this.uidelegate.betRemoved(), this.betslipStem && (this.betslipStem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.betslipTopic, ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT))
      }, a.prototype.key = function() {
        return this.bet.get(t.FixtureID) + "-" + this.participant.get(i.FixtureParticipantID)
      }, a.prototype.isKey = function(e) {
        return e == this.key()
      }, a.prototype.removeBet = function() {
        this.slipdelegate.normalBetRemoveBet(this)
      }, a.prototype.getDisplayOdds = function() {
        return this.bet.get(t.DisplayOdds) || this.bet.get(t.Odds)
      }, a.prototype.getOddsTypeOverride = function() {
        var e, i, s = this.bet.get(t.OddsTypeOverride),
          a = this.bet.get(t.TopicId);
        return a && a.indexOf("x") > -1 && (e = a.split("x"), s = e.length > 1 ? +e[1] : s, i = e.length > 2 ? +e[2] : null, s == l.DECIMAL && 3 == i && (s = l.ASIAN)), s || l.NONE
      }, a.prototype.getOfferBadges = function() {
        var e = this.bet.get(t.OfferBadges);
        return e ? e : []
      }, a.prototype.getEnhancedPrices = function() {
        var e = this.bet.get(t.EnhancedPrices);
        return e ? e : ""
      }, a.prototype.stakeEntered = function(e) {
        var i = "" !== e ? n.StringToNumber(e) : null;
        this.bet.set(t.Stake, i), this.slipdelegate.normalBetInvalidateStakes()
      }, a.prototype.resetFreeBetState = function() {
        this.bet.get(t.FreeBetQualifiedStatus) && (this.bet.set(t.FreeBetQualifiedStatus, u.NotSpecified), this.bet.set(t.FreeBetQualifiedAmount, 0))
      }, a.prototype.updateReturnValue = function(e) {
        this.bet.set(t.ToReturn, e)
      }, a.prototype.updateTotalStake = function(e) {
        this.bet.set(t.TotalStake, e)
      }, a.prototype.updateBetCreditsStake = function(e, i) {
        this.bet.set(t.BetCreditStake, e), this.uidelegate.betCreditsStakeChanged(e, i)
      }, a.prototype.invalidateFreeBetTokenStake = function() {
        this.freeBetTokenStakeInvalidated || (this.freeBetTokenStakeInvalidated = !0, this.invalidateProperties({}))
      }, a.prototype.freeBetTokenChecked = function() {
        this.bet.set(t.FreeBetTokenSelected, !0), this.invalidateFreeBetTokenStake()
      }, a.prototype.freeBetTokenUnchecked = function() {
        this.bet.set(t.FreeBetTokenSelected, !1), this.bet.set(t.Stake, 0)
      }, a.prototype.disableFreeBetToken = function() {
        this.uidelegate.disableFreeBet()
      }, a.prototype.enableFreeBetToken = function() {
        this.uidelegate.enableFreeBet()
      }, a.prototype.getFreeBetToken = function() {
        return this.bet.get(t.FreeBetToken)
      }, a.prototype.updateMinStakeInput = function() {
        var e = this.bet.get(t.RecalculatedStake) || h.GetMinimumUnitStake();
        this.bet.set(t.RecalculatedStake, e), this.bet.set(t.SlipResult, o.stakeBelowMinimum), this.slipdelegate.normalBetHandleMinStakeInput()
      }, a.prototype.acceptChanges = function() {
        return this.bet.get(t.RecalculatedStake) > 0 && this.bet.get(t.Stake) > 0 && this.bet.get(t.RecalculatedStake) > this.bet.get(t.Stake) && this.stakeEntered(this.bet.get(t.RecalculatedStake) + ""), this.bet.get(t.SlipResult) == o.stakeAboveMaximum && (this.uidelegate && this.uidelegate.stakeChanged(this.bet.get(t.MaximumStake) + ""), this.stakeEntered(this.bet.get(t.MaximumStake) + "")), this.bet.get(t.Suspended) ? void(this.uidelegate && this.uidelegate.deleteBet()) : (this.bet.set(t.OddsChanged, !1), this.participant.set(i.HandicapChanged, !1), void(this.uidelegate && this.uidelegate.changesAccepted()))
      }, a.prototype.oddsDropdownLabelSpOddsSelected = function() {
        this.bet.set(t.SPOddsSelected, !0), this.bet.set(t.OddsChanged, !1), this.slipdelegate.normalBetInvalidateStakes()
      }, a.prototype.oddsDropdownLabelSpOddsDeselected = function() {
        this.bet.set(t.SPOddsSelected, !1), this.bet.set(t.OddsChanged, !1), this.slipdelegate.normalBetInvalidateStakes()
      }, a.prototype.oddsDropdownAvailable = function() {
        return !(!this.bet.get(t.OfferSPOdds) || "0/0" == this.bet.get(t.Odds))
      }, a.prototype.setDelegate = function(e) {
        var t, i, s, a;
        if (this.uidelegate = e, this.bet.key()) {
          t = {}, i = this.bet.getDataKeys();
          for (s in i) t[s] = !0;
          a = this.participant.getDataKeys();
          for (s in a) t[s] = !0;
          this.invalidateProperties(t)
        }
      }, a.prototype.disablePush = function() {
        this.betslipStem && (this.betslipStem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.betslipTopic, ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT), this.betslipStem = null)
      }, a.prototype.enablePush = function() {
        this.betslipTopic && !this.betslipStem && Locator.subscriptionManager.sharedSubscribe(this.betslipTopic, new r(this, this.subscriptionHandler), ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT)
      }, a.prototype.reuseSelection = function() {
        this.bet.set(t.Stake, null), this.resetFreeBetState(), this.slipdelegate.normalBetInvalidateStakes()
      }, a.prototype.setReferralFullyDeclined = function() {
        var e = this.bet.get(t.Stake);
        this.uidelegate.referralDeclined(e, e)
      }, a.prototype.wasReferred = function() {
        return this.bet.get(t.SlipResult) == o.stakeAboveMaximum || this.bet.get(t.SlipResult) == o.referralRequired
      }, a.prototype.getRejectedReferralPlacedAmount = function() {
        return this.bet.get(t.ReferralPlaceAmount) > 0 && (this.bet.get(t.ReferralAmountRejected) > 0 || 0 == this.bet.get(t.ReferralPlaceAmount)) ? this.bet.get(t.ToReturn) : 0
      }, a.prototype.clearReferralAmount = function() {
        this.bet.get(t.ReferralAmount) && this.bet.set(t.ReferralAmount, 0)
      }, a.prototype.toFreeBetItem = function() {
        var e = this.bet.get(t.Stake),
          i = !!this.bet.get(t.EachWay),
          s = this.getOddsArray(),
          a = this.bet.get(t.EachWayPlaceDivider),
          n = a ? d.GetFractionalPlaceOdds(s[0], a) + "" : "";
        return {
          betTypeId: this.bet.get(t.BetTypeId) + "",
          type: "single",
          stake: e ? e : 0,
          ewSelected: i,
          freeBetTokenSelected: !!this.bet.get(t.FreeBetTokenSelected),
          odds: s,
          bonus: "0",
          betCount: 1,
          combinations: [
            ["1"]
          ],
          betItemBetCreditStake: 0,
          betItemConstructFreeStake: "",
          betItemActualStake: "",
          betItemFreeStake: 0,
          betItemBetCreditStakeDisplay: "",
          betItemReturns: 0,
          betItemReturnsValue: 0,
          ausEWSelected: !1,
          placeOdds: n
        }
      }, a.prototype.dispose = function() {
        this.betslipStem && (this.betslipStem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.betslipTopic, ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT), this.betslipStem = null)
      }, a.prototype.getOpportunityChangedDetails = function() {
        return {
          oddsChanged: this.bet ? !!this.bet.get(t.OddsChanged) : !0,
          handicapChanged: this.participant ? !!this.participant.get(i.HandicapChanged) : !0,
          availabilityChanged: this.bet ? !!this.bet.get(t.Suspended) : !0
        }
      }, a.prototype.shouldExcludeFromReceipt = function() {
        return 1 == this.bet.get(t.ExcludeFromReceipt)
      }, a.prototype.getMinStake = function() {
        return this.bet.get(t.RecalculatedStake)
      }, a.prototype.getMaxStake = function() {
        return this.bet.get(t.MaximumStake)
      }, a.prototype.getReferralPlaceAmount = function() {
        return this.bet.get(t.ReferralPlaceAmount)
      }, a.prototype.getBetCount = function() {
        return this.bet.get(t.EachWay) ? 2 : 1
      }, a.prototype.getReferralAmount = function() {
        return this.bet.get(t.ReferralAmount)
      }, a.prototype.getOddsBelowMinimum = function() {
        return this.bet.get(t.SlipResult) == o.oddsBelowMinimum
      }, a.prototype.getOddsArray = function() {
        return "SP" == this.bet.get(t.Odds) || this.bet.get(t.SPOddsSelected) ? ["0/0"] : [this.bet.get(t.Odds)]
      }, a
    }(a);
  e.NormalBet = m
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = e.NormalBet,
    i = ns_betslipcorelib_data.BetAttribute,
    s = ns_betslipcorelib_constants.BetTypeLookupKey,
    a = function(e) {
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        return t.betTypeLookupKey = s.EachwayBet, t
      }
      return __extends(t, e), t.prototype.commitProperties = function() {
        e.prototype.commitProperties.call(this), this.changes[i.EachWayAvailable] && this.uidelegate.ewAvailableChanged(this.bet.get(i.EachWayAvailable), !!this.bet.get(i.EachWay)), this.changes[i.EachWayTerms] && this.uidelegate.eachWayTermsChanged(this.bet.get(i.EachWayTerms)), this.changes[i.EachWay] && this.slipdelegate.normalBetInvalidateStakes()
      }, t.prototype.eachwayChecked = function() {
        this.bet.get(i.EachWayAvailable) && this.bet.set(i.EachWay, !0), this.bet.get(i.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, t.prototype.eachwayUnchecked = function() {
        this.bet.get(i.EachWayAvailable) && this.bet.set(i.EachWay, !1), this.bet.get(i.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, t
    }(t);
  e.EachwayBet = a
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = e.NormalBet,
    i = ns_betslipcorelib_data.BetAttribute,
    s = ns_betslipstandardlib_model_ewex.EwexOptionType,
    a = ns_betslipstandardlib_util.APIHelper,
    n = ns_betslipcorelib_data.ParticipantAttribute,
    r = ns_betslipcorelib_constants.BetTypeLookupKey,
    o = function(e) {
      function t(t, i) {
        var s = e.call(this, t, i) || this;
        return s.slipdelegate = i, s.isEwexType = !1, s.betTypeLookupKey = r.EwexBet, s
      }
      return __extends(t, e), t.prototype.commitProperties = function() {
        e.prototype.commitProperties.call(this), this.changes[i.EwexAvailable] && this.uidelegate.ewAvailableChanged(this.bet.get(i.EwexAvailable), !!this.bet.get(i.EachWay)), this.changes[i.EachWayTerms] && this.uidelegate.eachWayTermsChanged(this.bet.get(i.EachWayTerms)), this.changes[i.EachWay] && this.slipdelegate.normalBetInvalidateStakes(), this.changes[i.EWEX] && this.bet.get(i.EWEX) && (this.isEwexType = !0, this.slipdelegate.ewexBetInvalidateItems(this.isEwexType)), this.changes[i.ForceEachWay] && this.bet.get(i.ForceEachWay) && this.uidelegate.forceEachWay()
      }, t.prototype.eachwayChecked = function() {
        this.bet.get(i.EwexAvailable) && this.bet.set(i.EachWay, !0), this.bet.get(i.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, t.prototype.eachwayUnchecked = function() {
        this.bet.get(i.EwexAvailable) && this.bet.set(i.EachWay, !1), this.bet.get(i.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, t.prototype.getEwexOptions = function(e) {
        var t, s, r = this;
        this.ewexOptions ? e(this.ewexOptions) : (t = this.bet.get(i.FixtureID), s = this.participant.get(n.FixtureParticipantID), a.GetEWEXOptions(t, s, function(t) {
          r.ewexOptions = t, e(t)
        }))
      }, t.prototype.ewexSelectionChanged = function(e) {
        var t, a, r, o, l;
        if (!e.isSelected) {
          for (t = 0, a = this.ewexOptions; t < a.length; t++) r = a[t], r.isSelected = !1;
          e.isSelected = !0, o = this.key(), this.participant.set(n.FixtureParticipantID, +e.fixtureParticipantId), this.bet.set(i.FixtureID, +e.fixtureId), this.bet.set(i.Odds, e.getOdds()), this.bet.set(i.TopicId, e.getTopic()), this.bet.set(i.OfferSPOdds, e.offerSPOdds), l = s.Ewex, (e.mainMarket || e.enhancedMarket) && (l = e.mainMarket ? s.MainMarket : s.EnhancedPlace), e.ewex && (l = s.Ewex), e.offerSPOdds || this.bet.set(i.SPOddsSelected, !1), this.isEwexType = l == s.Ewex, this.slipdelegate.ewexBetInvalidateItems(this.isEwexType), this.uidelegate.ewexSelectionChanged(e.placeCount, e.getOdds(), l, o)
        }
      }, t.prototype.isOnSlip = function(e) {
        return this.slipdelegate.ewexBetIsOnSlip(e.fixtureId, e.fixtureParticipantId)
      }, t.prototype.isEwexItem = function() {
        return this.isEwexType
      }, t.prototype.removeBet = function() {
        e.prototype.removeBet.call(this), this.slipdelegate.ewexBetInvalidateItems(!1)
      }, t
    }(t);
  e.EwexBet = o
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = e.NormalBet,
    s = ns_betslipstandardlib_util.APIHelper,
    a = ns_betslipcorelib_constants.BetTypeLookupKey,
    n = function(e) {
      function i() {
        var t = null !== e && e.apply(this, arguments) || this;
        return t.betTypeLookupKey = a.PitcherBet, t
      }
      return __extends(i, e), i.prototype.commitProperties = function() {
        e.prototype.commitProperties.call(this), (this.changes[t.BaseballPitcher] || this.changes[t.PitcherDescription]) && this.uidelegate.pitcherChanged(this.bet.get(t.PitcherDescription), this.bet.get(t.SelectedPitcher)), this.changes[t.SelectedPitcher] && this.slipdelegate.normalBetInvalidateStakes()
      }, i.prototype.getPitcherActions = function(e) {
        var i = this;
        this.pitcherOptions ? e(this.pitcherOptions) : s.GetPitcherOptions(this.bet.get(t.FixtureID), this.bet.get(t.SelectedPitcher), function(t) {
          i.pitcherOptions = t, e(t)
        })
      }, i.prototype.setPitcherSelection = function(e, i) {
        this.bet.get(t.SelectedPitcher) && (this.bet.set(t.SelectedPitcher, +e), this.bet.set(t.PitcherDescription, i))
      }, i
    }(i);
  e.PitcherBet = n
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_constants.BetTypeLookupKey,
    a = function(e) {
      function a() {
        var t = null !== e && e.apply(this, arguments) || this;
        return t.betTypeLookupKey = s.NoReservesBet, t
      }
      return __extends(a, e), a.prototype.commitProperties = function() {
        e.prototype.commitProperties.call(this), this.changes[t.EachWayAvailable] && this.uidelegate.ewAvailableChanged(this.bet.get(t.EachWayAvailable), !!this.bet.get(t.EachWay)), this.changes[t.EachWayTerms] && this.uidelegate.eachWayTermsChanged(this.bet.get(t.EachWayTerms)), this.changes[t.EachWay] && this.slipdelegate.normalBetInvalidateStakes(), this.changes[t.NoReservesAvailable] && this.uidelegate.noReservesAvailableChanged(this.bet.get(t.NoReservesAvailable), !!this.bet.get(t.NoReserves)), this.changes[t.NoReserves] && (this.slipdelegate.normalBetInvalidateStakes(), this.bet.get(t.NoReserves) && this.participant.get(i.AdditionalDisplay) ? this.uidelegate.betSlipDisplayChanged(this.participant.get(i.AdditionalDisplay)) : this.uidelegate.betSlipDisplayChanged(this.participant.get(i.BetSlipDisplay)))
      }, a.prototype.eachwayChecked = function() {
        this.bet.get(t.EachWayAvailable) && this.bet.set(t.EachWay, !0), this.bet.get(t.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, a.prototype.eachwayUnchecked = function() {
        this.bet.get(t.EachWayAvailable) && this.bet.set(t.EachWay, !1), this.bet.get(t.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, a.prototype.noReservesChecked = function() {
        this.bet.get(t.NoReservesAvailable) && this.bet.set(t.NoReserves, !0)
      }, a.prototype.noReservesUnchecked = function() {
        this.bet.get(t.NoReservesAvailable) && this.bet.set(t.NoReserves, !1)
      }, a
    }(e.NormalBet);
  e.NoReservesBet = a
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_constants.BetTypeLookupKey,
    a = function(e) {
      function a(t, i) {
        var a = e.call(this, t, i) || this;
        return a.slipdelegate = i, a.betTypeLookupKey = s.AutoVoidBet, a.autoVoidSelected = !1, a
      }
      return __extends(a, e), a.prototype.commitProperties = function() {
        e.prototype.commitProperties.call(this), this.changes[t.EachWayAvailable] && this.uidelegate.ewAvailableChanged(this.bet.get(t.EachWayAvailable), !!this.bet.get(t.EachWay)), this.changes[t.EachWayTerms] && this.uidelegate.eachWayTermsChanged(this.bet.get(t.EachWayTerms)), this.changes[t.EachWay] && this.slipdelegate.normalBetInvalidateStakes(), this.changes[t.AutoVoidAvailable] && (this.autoVoidSelected = !!this.bet.get(t.AutoVoid), this.uidelegate.autoVoidAvailableChanged(this.bet.get(t.AutoVoidAvailable), this.autoVoidSelected), this.slipdelegate.autoVoidBetInvalidateSelection(this.autoVoidSelected)), this.changes[t.AutoVoid] && (this.autoVoidSelected = this.bet.get(t.AutoVoid), this.slipdelegate.normalBetInvalidateStakes(), this.autoVoidSelected && this.participant.get(i.AdditionalDisplay) ? this.uidelegate.betSlipDisplayChanged(this.participant.get(i.AdditionalDisplay)) : this.uidelegate.betSlipDisplayChanged(this.participant.get(i.BetSlipDisplay)), this.slipdelegate.autoVoidBetInvalidateSelection(this.autoVoidSelected))
      }, a.prototype.eachwayChecked = function() {
        this.bet.get(t.EachWayAvailable) && this.bet.set(t.EachWay, !0), this.bet.get(t.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, a.prototype.eachwayUnchecked = function() {
        this.bet.get(t.EachWayAvailable) && this.bet.set(t.EachWay, !1), this.bet.get(t.FreeBetTokenSelected) && this.invalidateFreeBetTokenStake()
      }, a.prototype.autoVoidChecked = function() {
        this.bet.get(t.AutoVoidAvailable) && this.bet.set(t.AutoVoid, !0)
      }, a.prototype.autoVoidUnchecked = function() {
        this.bet.get(t.AutoVoidAvailable) && this.bet.set(t.AutoVoid, !1)
      }, a.prototype.isAutoVoidSelected = function() {
        return this.autoVoidSelected
      }, a.prototype.removeBet = function() {
        e.prototype.removeBet.call(this), this.autoVoidSelected && this.slipdelegate.autoVoidBetInvalidateSelection(!1)
      }, a
    }(e.NormalBet);
  e.AutoVoidBet = a
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_constants.BetStringProperty,
    a = ns_betslipcorelib_constants.BetTypeLookupKey,
    n = function(e) {
      function n() {
        var t = null !== e && e.apply(this, arguments) || this;
        return t.betTypeLookupKey = a.ScorecastBet, t
      }
      return __extends(n, e), n.prototype.serialise = function() {
        var e, a, n, r, o, l, d, p, h, u, c, g, b, f = "";
        return f += s.ParticipantType + "S" + s.Separator, f += "" + s.Odds + this.bet.get(t.Odds) + s.Separator, f += "" + s.FixtureId + this.bet.get(t.FixtureID) + s.Separator, f += "" + s.FixtureParticipantId + this.participant.get(i.FixtureParticipantID) + s.Separator, f += "" + s.SelectionOrder + s.Separator, f += "" + s.ClassificationId + this.bet.get(t.Classification) + s.Separator, f += "" + s.PlayerId + this.bet.get(t.PlayerId) + s.Separator, f += "" + s.MatchId + this.bet.get(t.MatchId) + s.Separator, f += "" + s.MultipleId + this.bet.get(t.FixtureID) + "-" + this.bet.get(t.PlayerId) + ":" + this.bet.get(t.MatchId) + s.Separator, e = this.bet.get(t.OddsHash), e && (f += "" + s.OddsHash + e + s.Separator), a = this.participant.get(i.Handicap), a && (f += "" + s.LineHandicap + a + s.Separator), f += "" + s.MediaType + this.bet.get(t.MediaType) + s.Separator,
          this.bet.get(t.SelectedPitcher) && (f += "" + s.SelectedPitcher + this.bet.get(t.SelectedPitcher) + s.Separator), n = this.bet.get(t.OddsTypeOverride), n && (f += "" + s.OddsTypeOverride + n + s.Separator), f += "" + s.Pipe, r = this.bet.get(t.TopicId), r && (f += "" + s.Topic + r + s.Separator), o = this.bet.get(t.Stake), o && (l = o.toFixed(2), f += "" + s.UnitStake + l + s.Separator, f += "" + s.TotalStake + l + s.Separator), d = this.bet.get(t.MaximumStake), (d || 0 == d) && (f += "" + s.StakeLimit + d + s.Separator), p = this.bet.get(t.ToReturn), p && (f += "" + s.TotalReturns + p.toFixed(2) + s.Separator), this.bet.get(t.OddsChanged) ? h = this.participant.get(i.HandicapChanged) ? "3" : "1" : this.participant.get(i.HandicapChanged) && (h = "2"), h && (f += "" + s.OddsLineChange + h + s.Separator), u = this.bet.get(t.BetCreditStake), u && (f += "" + s.BetCreditStake + u + s.Separator), c = this.bet.get(t.FreeBetTokenSelected), c && (g = this.bet.get(t.FreeBetToken), g && (f += "" + s.FreeBetToken + g + s.Separator), b = this.bet.get(t.FreeBetAmount), b && (f += "" + s.FreeBetAmount + b + s.Separator)), f += f.lastIndexOf("|") == f.length - 1 ? "|" : "||"
      }, n.prototype.key = function() {
        return this.bet.get(t.PlayerId) + ":" + this.bet.get(t.MatchId)
      }, n
    }(e.NormalBet);
  e.ScorecastBet = n
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_constants.BetStringProperty,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_model.ValidationModel,
    a = ns_gen5_data.SubscriptionManagerFlags,
    n = ns_gen5_util.Delegate,
    r = function(e) {
      function s(t, i) {
        var s = e.call(this) || this;
        return s.delegate_subscriptionHandler = null, s.stem = null, s.pushDisabled = !1, s.participant = t, s.model = i, s
      }
      return __extends(s, e), s.prototype.commitProperties = function() {
        if (this.changes[i.Topic] && (this.participantTopic = this.participant.get(i.Topic), this.stem && this.stem.data.IT !== this.participantTopic && (this.stem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.stem.data.IT, ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT), this.stem = null), !this.participantTopic || this.stem || this.pushDisabled || (this.delegate_subscriptionHandler || (this.delegate_subscriptionHandler = new n(this, this.subscriptionHandler)), Locator.subscriptionManager.sharedSubscribe(this.participantTopic, this.delegate_subscriptionHandler, a.BATCH | ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT))), this.changes[i.BetSlipDisplay] && this.uidelegate.betslipDisplayChanged(this.participant.get(i.BetSlipDisplay)), this.changes[i.MarketDescription] && this.uidelegate.marketDescriptionChanged(this.participant.get(i.MarketDescription)), this.changes[i.HandicapChanged] && !this.handicapChanged) {
          if (!this.participant.get(i.HandicapChanged)) return;
          this.model.handicapChanged(), this.uidelegate.betslipDisplayHandicapChanged(this.participant.get(i.BetSlipDisplay), !0), this.handicapChanged = !0
        }
      }, s.prototype.subscriptionHandler = function(e) {
        this.stem = Locator.treeLookup.getReference(e.type), this.stem ? this.stem.addDelegate(this) : this.model.participantSuspended()
      }, s.prototype.stemUpdateHandler = function(e, t) {
        var s, a;
        "SU" in t && this.model.participantSuspended(), s = "OD" in t, a = "HA" in t && t.HA !== this.participant.get(i.Handicap), a ? this.model.handicapChangedFromPush() : s && this.model.participantOddsChanged()
      }, s.prototype.stemDeleteHandler = function() {
        this.model.participantSuspended(), this.dispose()
      }, s.prototype.changesAccepted = function() {
        this.handicapChanged && (this.handicapChanged = !1, this.uidelegate.betslipDisplayHandicapChanged(this.participant.get(i.BetSlipDisplay), !1), this.participant.set(i.HandicapChanged, !1))
      }, s.prototype.stemInsertHandler = function(e, t) {}, s.prototype.disablePush = function() {
        this.stem && (this.stem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.participantTopic, ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT), this.stem = null), this.pushDisabled = !0
      }, s.prototype.enablePush = function() {
        this.participantTopic && !this.stem && (this.delegate_subscriptionHandler || (this.delegate_subscriptionHandler = new n(this, this.subscriptionHandler)), Locator.subscriptionManager.sharedSubscribe(this.participantTopic, this.delegate_subscriptionHandler, a.BATCH | ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT)), this.pushDisabled = !1
      }, s.prototype.dispose = function() {
        this.stem && (this.stem.removeDelegate(this), Locator.subscriptionManager.sharedUnsubscribe(this.stem.data.IT, a.BATCH | ns_gen5_data.SubscriptionManagerFlags.GLOBAL_CONTEXT), this.stem = null)
      }, s.prototype.participantUpdated = function(e) {
        this.invalidateProperties(e)
      }, s.prototype.setUIDelegate = function(e) {
        var t, i, s;
        if (this.uidelegate = e, this.participant.key()) {
          t = {}, i = this.participant.getDataKeys();
          for (s in i) t[s] = !0;
          this.invalidateProperties(t)
        }
      }, s.prototype.get = function(e) {
        return this.participant.get(e)
      }, s.prototype.getDataKeys = function() {
        return this.participant.getDataKeys()
      }, s.prototype.serialise = function() {
        var e, s, a = "";
        return a += t.ParticipantType + "N" + t.Separator, a += "" + t.Odds + this.participant.get(i.Odds) + t.Separator, a += "" + t.FixtureParticipantId + this.participant.get(i.FixtureParticipantID) + t.Separator, e = this.participant.get(i.Topic), e && (a += "" + t.Topic + e + t.Separator), s = this.participant.get(i.Handicap), s && (a += "" + t.LineHandicap + s + t.Separator), a += "" + t.FixtureId + this.participant.get(i.FixtureId) + t.Separator
      }, s
    }(s);
  e.BetBuilderParticipant = r
}(ns_betslipstandardlib_model_participant || (ns_betslipstandardlib_model_participant = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_constants.BetStringProperty,
    a = ns_betslipcorelib_model.ValidationModel,
    n = ns_gen5_util.MathUtil,
    r = ns_betslipstandardlib_model_participant.BetBuilderParticipant,
    o = ns_betcalculationslib_util.MinimumStakes,
    l = ns_betslipcorelib_constants.BetSlipResult,
    d = ns_betcalculationslib_util.OddsFormatter,
    p = ns_betslipcorelib_constants.FreeBetQualificationStatus,
    h = ns_gen5_net.Loader,
    u = ns_gen5_data.DataUtil,
    c = ns_betslipcorelib_constants.BetTypeLookupKey,
    g = function(e) {
      function a(t, i) {
        var s = e.call(this) || this;
        return s.slipdelegate = i, s.betTypeLookupKey = c.BetBuilder, s.participants = [], s.bet = t, s
      }
      return __extends(a, e), a.prototype.commitProperties = function() {
        var e, s, a, n, r, o, l, d;
        if (this.changes[t.DisplayOdds] && (e = this.bet.get(t.OddsChanged), this.uidelegate.oddsChanged(this.bet.get(t.DisplayOdds), e), e ? this.slipdelegate.normalBetOddsHandicapSuspensionChanged() : this.slipdelegate.normalBetInvalidateStakes(), this.slipdelegate.normalBetInvalidateHeaderOdds()), this.changes[t.FreeBetTokenSelected] && (s = this.bet.get(t.FreeBetTokenSelected), s ? this.uidelegate.disableStakeBox() : this.uidelegate.enableStakeBox(), this.slipdelegate.normalBetDisableFreeBetTokens(this, this.bet.get(t.FreeBetTokenSelected))), this.changes[t.Stake] && (a = this.bet.get(t.Stake), this.uidelegate.stakeChanged(null != a ? a.toString() : ""), this.slipdelegate.normalBetInvalidateStakes()), this.changes[t.FixtureDescription] && this.uidelegate.fixtureDescriptionChanged(this.bet.get(t.FixtureDescription)), this.changes[i.BetSlipDisplay])
          for (n = 0, r = this.participants; n < r.length; n++) o = r[n], this.uidelegate.betSlipDisplayChanged(o.get(i.BetSlipDisplay));
        this.changes[t.FreeBetAmount] && this.uidelegate.showFreebetCheckbox(this.bet.get(t.FreeBetAmount), this.bet.get(t.FreeBetTokenSelected)), this.changes[t.FreeBetQualifiedStatus] && this.uidelegate.freeBetQualificationChanged(this.bet.get(t.FreeBetQualifiedStatus), this.bet.get(t.FreeBetQualifiedAmount)), this.changes[t.ToReturn] && (this.uidelegate.returnValueChanged(this.bet.get(t.ToReturn)), this.uidelegate.totalStakeChanged(this.bet.get(t.TotalStake))), this.changes[t.Suspended] && (this.bet.get(t.Suspended) ? this.uidelegate.suspend() : this.uidelegate.unsuspend(), this.slipdelegate.normalBetOddsHandicapSuspensionChanged()), this.changes[t.SlipResult] && this.uidelegate.slipResultChanged(this.bet.get(t.SlipResult)), this.changes[t.ReferralAmountApproved] && (l = this.bet.get(t.ReferralAmountApproved), l > 0 && this.uidelegate.referralApproved()), this.changes[t.ReferralAmountRejected] && this.uidelegate.referralDeclined(this.bet.get(t.ReferralAmountRejected), this.bet.get(t.Stake)), this.changes[t.BetReference] && this.uidelegate.betReferenceChanged(this.bet.get(t.BetReference)), this.changes[t.MultiplesRestricted] && (d = this.bet.get(t.MultiplesRestricted), this.uidelegate.multiplesRestrictionChanged(d))
      }, a.prototype.serialise = function() {
        var e, i, a, n, r, o, l, d, p, h, u, c, g = "";
        for (g += s.BetBuilderList, e = 0, i = this.participants; e < i.length; e++) a = i[e], g += a.serialise(), this.participants[this.participants.length - 1] !== a && (g += s.BetBuilderSeparator);
        return g += s.Pipe, g += "" + s.Odds + this.bet.get(t.Odds) + s.Separator, g += "" + s.ClassificationId + this.bet.get(t.Classification) + s.Separator, g += "" + s.FixtureId + this.bet.get(t.FixtureID) + s.Separator, n = this.bet.get(t.OddsHash), n && (g += "" + s.OddsHash + n + s.Separator), r = this.bet.get(t.Stake), r && (o = r.toFixed(2), g += "" + s.UnitStake + o + s.Separator, g += "" + s.TotalStake + o + s.Separator), l = this.bet.get(t.MaximumStake), (l || 0 == l) && (g += "" + s.StakeLimit + l + s.Separator), d = this.bet.get(t.ToReturn), d && (g += "" + s.TotalReturns + d.toFixed(2) + s.Separator), p = this.bet.get(t.BetCreditStake), p && (g += "" + s.BetCreditStake + p + s.Separator), h = this.bet.get(t.FreeBetTokenSelected), h && (u = this.bet.get(t.FreeBetToken), u && (g += "" + s.FreeBetToken + u + s.Separator), c = this.bet.get(t.FreeBetAmount), c && (g += "" + s.FreeBetAmount + c + s.Separator)), this.bet.get(t.OddsChanged) && (g += s.OddsLineChange + "1" + s.Separator), g += g.lastIndexOf("|") == g.length - 1 ? "|" : "||"
      }, a.prototype.betUpdated = function(e) {
        this.invalidateProperties(e)
      }, a.prototype.participantInserted = function(e) {
        var t = new r(e, this);
        this.participants.push(t), e.setDelegate(t), this.uidelegate.participantInserted(t)
      }, a.prototype.betRemoved = function() {
        this.uidelegate.betRemoved()
      }, a.prototype.getDisplayOdds = function() {
        return this.bet.get(t.DisplayOdds) || this.bet.get(t.Odds)
      }, a.prototype.getOddsTypeOverride = function() {
        return this.bet.get(t.OddsTypeOverride)
      }, a.prototype.key = function() {
        var e, s, a, n = "" + this.bet.get(t.FixtureID);
        for (e = 0, s = this.participants; e < s.length; e++) a = s[e], n += "-" + a.get(i.FixtureParticipantID);
        return n
      }, a.prototype.isKey = function(e) {
        return e == this.key()
      }, a.prototype.removeBet = function() {
        this.slipdelegate.betBuilderRemoveBet(this)
      }, a.prototype.stakeEntered = function(e) {
        var i = "" !== e ? n.StringToNumber(e) : null;
        this.bet.set(t.Stake, i), this.slipdelegate.normalBetInvalidateStakes()
      }, a.prototype.reuseSelection = function() {
        this.bet.set(t.Stake, null), this.resetFreeBetState(), this.slipdelegate.normalBetInvalidateStakes()
      }, a.prototype.resetFreeBetState = function() {
        this.bet.get(t.FreeBetQualifiedStatus) && (this.bet.set(t.FreeBetQualifiedStatus, p.NotSpecified), this.bet.set(t.FreeBetQualifiedAmount, 0))
      }, a.prototype.updateMinStakeInput = function() {
        var e = o.GetMinimumUnitStake();
        this.bet.set(t.RecalculatedStake, e), this.bet.set(t.SlipResult, l.stakeBelowMinimum), this.slipdelegate.normalBetHandleMinStakeInput()
      }, a.prototype.updateReturnValue = function(e) {
        this.bet.set(t.ToReturn, e)
      }, a.prototype.updateTotalStake = function(e) {
        this.bet.set(t.TotalStake, e)
      }, a.prototype.updateBetCreditsStake = function(e, i) {
        this.bet.set(t.BetCreditStake, e), this.uidelegate.betCreditsStakeChanged(e, i)
      }, a.prototype.freeBetTokenChecked = function() {
        this.bet.set(t.FreeBetTokenSelected, !0), this.bet.set(t.Stake, +this.bet.get(t.FreeBetAmount))
      }, a.prototype.freeBetTokenUnchecked = function() {
        this.bet.set(t.FreeBetTokenSelected, !1), this.bet.set(t.Stake, 0)
      }, a.prototype.disableFreeBetToken = function() {
        this.uidelegate.disableFreeBet()
      }, a.prototype.enableFreeBetToken = function() {
        this.uidelegate.enableFreeBet()
      }, a.prototype.getFreeBetToken = function() {
        return this.bet.get(t.FreeBetToken)
      }, a.prototype.handicapChangedFromPush = function() {
        var e, t = this;
        this.priceCalcTimer && (clearTimeout(this.priceCalcTimer), this.priceCalcTimer = null), this.refreshSlipTimer || (this.uidelegate.requestingBetBuilderPrice(!0), e = Math.floor(5e3 * Math.random()), this.refreshSlipTimer = setTimeout(function() {
          t.slipdelegate.normalBetRefreshSlip(function() {
            t.refreshSlipTimer = null
          })
        }, e))
      }, a.prototype.handicapChanged = function() {
        this.slipdelegate.normalBetOddsHandicapSuspensionChanged()
      }, a.prototype.acceptChanges = function() {
        var e, i, s, a;
        if (this.bet.get(t.RecalculatedStake) > 0 && this.bet.get(t.Stake) > 0 && this.bet.get(t.RecalculatedStake) > this.bet.get(t.Stake) && this.stakeEntered(this.bet.get(t.RecalculatedStake) + ""), this.bet.get(t.SlipResult) == l.stakeAboveMaximum && (e = this.bet.get(t.MaximumStake) || 0, this.uidelegate && this.uidelegate.stakeChanged(e + ""), this.stakeEntered(e + "")), this.bet.get(t.Suspended)) return void(this.uidelegate && this.uidelegate.deleteBet());
        for (this.bet.set(t.OddsChanged, !1), this.uidelegate.changesAccepted(), i = 0, s = this.participants; i < s.length; i++) a = s[i], a.changesAccepted()
      }, a.prototype.setDelegate = function(e) {
        var t, i, s, a = this;
        if (this.uidelegate = e, this.bet.key()) {
          t = {}, i = this.bet.getDataKeys();
          for (s in i) t[s] = !0;
          this.invalidateProperties(t), Locator.validationManager.callNewContext(function() {
            var e, t, i;
            for (e = 0, t = a.participants; e < t.length; e++) i = t[e], a.uidelegate.participantInserted(i)
          })
        }
      }, a.prototype.disablePush = function() {
        var e, t, i;
        for (e = 0, t = this.participants; e < t.length; e++) i = t[e], i.disablePush();
        this.pushDisabled = !0
      }, a.prototype.enablePush = function() {
        var e, t, i;
        for (e = 0, t = this.participants; e < t.length; e++) i = t[e], i.enablePush();
        this.pushDisabled = !1
      }, a.prototype.toFreeBetItem = function() {
        var e = this.bet.get(t.Stake),
          i = this.getOddsArray(),
          s = this.bet.get(t.EachWayPlaceDivider),
          a = s ? d.GetFractionalPlaceOdds(i[0], s) + "" : "";
        return {
          betTypeId: this.bet.get(t.BetTypeId) + "",
          type: "single",
          stake: e ? e : 0,
          bonus: "0",
          ewSelected: !1,
          freeBetTokenSelected: !!this.bet.get(t.FreeBetTokenSelected),
          odds: this.getOddsArray(),
          betCount: 1,
          combinations: [
            ["1"]
          ],
          betItemBetCreditStake: 0,
          betItemConstructFreeStake: "",
          betItemActualStake: "",
          betItemFreeStake: 0,
          betItemBetCreditStakeDisplay: "",
          betItemReturns: 0,
          betItemReturnsValue: 0,
          ausEWSelected: !1,
          placeOdds: a
        }
      }, a.prototype.getOpportunityChangedDetails = function() {
        var e, s, a, n = !1;
        for (e = 0, s = this.participants; e < s.length; e++)
          if (a = s[e], a.get(i.HandicapChanged)) {
            n = !0;
            break
          } return {
          oddsChanged: !!this.bet.get(t.OddsChanged),
          handicapChanged: n,
          availabilityChanged: !!this.bet.get(t.Suspended)
        }
      }, a.prototype.shouldExcludeFromReceipt = function() {
        return 1 == this.bet.get(t.ExcludeFromReceipt)
      }, a.prototype.getOddsArray = function() {
        return "SP" == this.bet.get(t.Odds) || this.bet.get(t.Suspended) ? ["0/0"] : [this.bet.get(t.Odds)]
      }, a.prototype.getMinStake = function() {
        return this.bet.get(t.RecalculatedStake)
      }, a.prototype.getMaxStake = function() {
        return this.bet.get(t.MaximumStake)
      }, a.prototype.getReferralAmount = function() {
        return this.bet.get(t.ReferralAmount)
      }, a.prototype.participantSuspended = function() {
        var e, i, s;
        for (this.bet.set(t.Suspended, !0), e = 0, i = this.participants; e < i.length; e++) s = i[e], s.dispose()
      }, a.prototype.participantOddsChanged = function() {
        var e, i = this;
        this.bet.get(t.Suspended) || this.priceCalcTimer || this.refreshSlipTimer || (this.uidelegate.requestingBetBuilderPrice(!0), e = Math.floor(5e3 * Math.random()), this.priceCalcTimer = setTimeout(function() {
          i.requestPrice()
        }, e))
      }, a.prototype.requestPrice = function() {
        var e, s, a, n, r = this,
          o = "c=" + this.bet.get(t.Classification) + "&f=" + this.bet.get(t.FixtureID) + "&l=" + Locator.user.languageId + "&p=",
          l = "",
          d = "bbprice";
        for (e = 0, s = this.participants; e < s.length; e++) a = s[e], l.length && (l += "|"), l += a.get(i.FixtureParticipantID);
        o += encodeURIComponent(l), n = new h, n.completeHandler = function(e) {
          var i, s;
          return r.priceCalcTimer = null, r.bet.get(t.Suspended) || r.pushDisabled ? void 0 : (u.ParseMessage(e, d), (i = Locator.treeLookup.getReference(d)) ? void(r.bet.get(t.DisplayOdds) !== i.data.OD && (s = i.data.PO || i.data.OD, r.bet.set(t.Odds, s), r.bet.set(t.DisplayOdds, i.data.OD), r.bet.set(t.OddsChanged, !0), r.uidelegate.requestingBetBuilderPrice(!1))) : (r.uidelegate.requestingBetBuilderPrice(!1), void r.bet.set(t.Suspended, !0)))
        }, n.errorHandler = function() {
          r.priceCalcTimer = null, r.bet.get(t.Suspended) || (r.uidelegate.requestingBetBuilderPrice(!1), r.bet.set(t.Suspended, !0))
        }, n.load("/betbuilder/priceip", {
          data: o,
          method: h.POST,
          contentType: "application/x-www-form-urlencoded"
        })
      }, a.prototype.getOddsBelowMinimum = function() {
        return this.bet.get(t.SlipResult) == l.oddsBelowMinimum
      }, a.prototype.setReferralFullyDeclined = function() {}, a.prototype.wasReferred = function() {
        return !1
      }, a.prototype.getRejectedReferralPlacedAmount = function() {
        return this.bet.get(t.ReferralPlaceAmount) > 0 && (this.bet.get(t.ReferralAmountRejected) > 0 || 0 == this.bet.get(t.ReferralPlaceAmount)) ? this.bet.get(t.ToReturn) : 0
      }, a.prototype.dispose = function() {
        this.priceCalcTimer && (clearTimeout(this.priceCalcTimer), this.priceCalcTimer = null), this.refreshSlipTimer && (clearTimeout(this.refreshSlipTimer), this.refreshSlipTimer = null)
      }, a.prototype.clearReferralAmount = function() {}, a
    }(a);
  e.BetBuilder = g
}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {}(ns_betslipstandardlib_model_bet || (ns_betslipstandardlib_model_bet = {})),
function(e) {
  var t = ns_betslipcorelib_data.MultipleAttribute,
    i = ns_betslipcorelib_model.ValidationModel,
    s = ns_betslipcorelib_calcs_multiples.MultiplesCombinations,
    a = ns_gen5_util.MathUtil,
    n = ns_betslipstandardlib_util.APIHelper,
    r = ns_betslipcorelib_constants.BetStringProperty,
    o = ns_betslipcorelib_constants.BetSlipResult,
    l = ns_gen5_util.CurrencyFormatter,
    d = ns_betslipcorelib_calcs.BetCalculations,
    p = function(e) {
      function i(t, i) {
        var s = e.call(this) || this;
        return s.bet = t, s.slipdelegate = i, s
      }
      return __extends(i, e), i.prototype.setUIDelegate = function(e) {
        this.uidelegate = e
      }, i.prototype.getOdds = function() {
        return this.bet.get(t.Odds)
      }, i.prototype.getSlipResult = function() {
        return this.bet.get(t.SlipResult)
      }, i.prototype.getStake = function() {
        return this.bet.get(t.Stake)
      }, i.prototype.getMaxStake = function() {
        return this.bet.get(t.MaximumStake)
      }, i.prototype.getReferralAmount = function() {
        return this.bet.get(t.ReferralAmount)
      }, i.prototype.getReferralAmountApproved = function() {
        return this.bet.get(t.ReferralAmountApproved)
      }, i.prototype.getReferralAmountRejected = function() {
        return this.bet.get(t.ReferralAmountRejected)
      }, i.prototype.getReferralPlaceAmount = function() {
        return this.bet.get(t.ReferralPlaceAmount)
      }, i.prototype.getBetCount = function() {
        return this.bet.get(t.BetCount)
      }, i.prototype.getTotalStake = function() {
        return this.bet.get(t.TotalStake)
      }, i.prototype.getBetCountForDefaultMultiple = function() {
        return this.bet.get(t.EachWay) ? 2 * this.bet.get(t.BetCount) : this.bet.get(t.BetCount)
      }, i.prototype.key = function() {
        return this.bet.get(t.BetTypeId)
      }, i.prototype.supportsBetBreakdown = function() {
        return this.bet.get(t.BetTypeId) > -1 && 0 == !!this.bet.get(t.CastBet)
      }, i.prototype.getBetBreakdown = function(e) {
        var i = this,
          s = this.bet.get(t.BetTypeId),
          a = this.bet.get(t.Stake),
          r = this.bet.get(t.EachWay);
        n.GetBreakdown(s, a ? a : 0, r, function(s) {
          e(i.bet.get(t.BetSlipDisplay), s)
        })
      }, i.prototype.acceptChanges = function() {
        this.bet.get(t.RecalculatedStake) > 0 && this.bet.get(t.Stake) > 0 && this.bet.get(t.RecalculatedStake) > this.bet.get(t.Stake) && (this.uidelegate && this.uidelegate.stakeChanged(this.bet.get(t.RecalculatedStake) + ""), this.stakeEntered(this.bet.get(t.RecalculatedStake) + "")), this.bet.get(t.SlipResult) == o.stakeAboveMaximum && (this.uidelegate && this.uidelegate.stakeChanged(this.bet.get(t.MaximumStake) + ""), this.stakeEntered(this.bet.get(t.MaximumStake) + "")), this.uidelegate && this.uidelegate.changesAccepted()
      }, i.prototype.toFreeBetItem = function() {
        var e, a, n, r;
        return this.bet.get(t.BetTypeId) == i.SINGLES_MULTIPLE_ID ? null : (e = this.bet.get(t.BetTypeId), a = this.bet.get(t.BetCount), n = 1 == a && e != i.FORECAST_DOUBLE && e != i.FORECAST_TREBLE, r = this.bet.get(t.Stake), {
          betTypeId: e + "",
          type: "multiple",
          stake: r ? r : 0,
          ewSelected: this.bet.get(t.EachWay),
          freeBetTokenSelected: !1,
          betCount: a,
          bonus: "0",
          combinations: n ? s.GetDefaultCombinations(this.slipdelegate.multipleGetBetCount()) : [],
          betItemBetCreditStake: 0,
          betItemConstructFreeStake: "",
          betItemActualStake: "",
          betItemFreeStake: 0,
          betItemBetCreditStakeDisplay: "",
          betItemReturns: 0,
          betItemReturnsValue: 0,
          ausEWSelected: !1,
          calculateAccumulatedOdds: n,
          odds: []
        })
      }, i.prototype.commitProperties = function() {
        var e, i, a, n, r, o, p, h, u, c;
        t.BetTypeId in this.changes && this.uidelegate && this.uidelegate.betTypeChanged(this.bet.get(t.BetTypeId)), t.BetSlipDisplay in this.changes && this.uidelegate && this.uidelegate.titleUpdated(this.bet.get(t.BetSlipDisplay)), t.BetCount in this.changes && this.uidelegate && this.uidelegate.betCountUpdated(this.bet.get(t.BetCount)), t.Odds in this.changes && this.uidelegate && this.uidelegate.oddsUpdated(this.bet.get(t.Odds)), t.ToReturn in this.changes && this.uidelegate && this.uidelegate.returnValueChanged(this.bet.get(t.ToReturn)), (t.EachWayAvailable in this.changes || t.EachWay in this.changes) && this.uidelegate && this.uidelegate.ewAvailableChanged(this.bet.get(t.EachWayAvailable), !!this.bet.get(t.EachWay)), t.Stake in this.changes && (e = this.bet.get(t.Stake), this.uidelegate && this.uidelegate.stakeChanged(null != e ? e.toString() : ""), this.slipdelegate.multipleInvalidateStakes()), t.BetCreditStake in this.changes && this.uidelegate && this.uidelegate.betCreditsStakeChanged(this.bet.get(t.BetCreditStake), this.actualStake), (t.AccumulatorPercentage in this.changes || t.Stake in this.changes || t.BetCreditStake in this.changes) && (e = this.bet.get(t.Stake) || 0, i = this.bet.get(t.AccumulatorPercentage) || 0, a = this.slipdelegate.multipleGetAccumulatorType(), n = +this.bet.get(t.BetCreditStake) || 0, r = this.slipdelegate.multipleGetOddsArray(), n && n >= e ? this.uidelegate.accumulatorPercentageChanged(0, "") : (o = s.GetDefaultCombinations(this.slipdelegate.multipleGetBetCount()), p = +this.bet.get(t.MaxBonus) || 1e5, e = n ? e - n : e, h = d.GetBonusValueNoTax({
          stake: e,
          odds: r,
          combinations: o,
          bonusPercentage: i,
          accumulatorType: a,
          max: p
        }), this.uidelegate.accumulatorPercentageChanged(this.bet.get(t.AccumulatorPercentage), l.ApplyCurrencySymbol(l.ApplyDelimiterAndGroupSeparator(h))))), t.TotalStake in this.changes && this.uidelegate && this.uidelegate.totalStakeChanged(this.bet.get(t.TotalStake)), t.EachWay in this.changes && this.uidelegate && this.slipdelegate.multipleInvalidateMultiples(), this.changes[t.ReferralAmount] && (u = this.bet.get(t.ReferralAmount) || 0, c = this.bet.get(t.ReferralPlaceAmount) || 0, this.uidelegate && this.uidelegate.referralAmountChanged(u, c)), this.changes[t.ReferralAmountApproved] && (u = this.bet.get(t.ReferralAmountApproved), u > 0 && this.uidelegate && this.uidelegate.referralApproved()), this.changes[t.ReferralAmountRejected] && this.uidelegate && this.uidelegate.referralDeclined(this.bet.get(t.ReferralAmountRejected), this.bet.get(t.Stake)), this.changes[t.BetReference] && this.uidelegate && this.uidelegate.betReferenceChanged(this.bet.get(t.BetReference)), this.changes[t.SlipResult] && this.uidelegate && this.uidelegate.slipResultChanged(this.bet.get(t.SlipResult)), t.BetTypeId in this.changes && this.uidelegate && this.uidelegate.betTypeChanged(this.bet.get(t.BetTypeId))
      }, i.prototype.setReferralFullyDeclined = function() {
        var e = this.bet.get(t.Stake);
        this.uidelegate.referralDeclined(e, e)
      }, i.prototype.wasReferred = function() {
        return this.bet.get(t.SlipResult) == o.stakeAboveMaximum
      }, i.prototype.getRejectedReferralPlacedAmount = function() {
        return this.bet.get(t.ReferralPlaceAmount) > 0 && (this.bet.get(t.ReferralAmountRejected) > 0 || 0 == this.bet.get(t.ReferralPlaceAmount)) ? this.bet.get(t.ToReturn) : 0
      }, i.prototype.clearReferralAmount = function() {
        this.bet.get(t.ReferralAmount) && this.bet.set(t.ReferralAmount, 0)
      }, i.prototype.isCastMultiple = function() {
        return this.bet.get(t.CastBet)
      }, i.prototype.serialise = function() {
        var e, i, s, a = "";
        return a += "" + r.MultipleId + this.bet.get(t.BetTypeId) + r.Separator, a += "" + r.BetCount + this.bet.get(t.BetCount) + r.Separator, e = this.bet.get(t.Stake), e && (a += "" + r.UnitStake + e + r.Separator, a += "" + r.TotalStake + e + r.Separator), i = this.bet.get(t.BetCreditStake), i && (a += "" + r.BetCreditStake + i + r.Separator), s = this.bet.get(t.MaximumStake), (s || 0 == s) && (a += "" + r.StakeLimit + s + r.Separator), this.bet.get(t.EachWay) && (a += "" + r.Pipe + r.EachWay + (this.bet.get(t.EachWay) ? "1" : "0") + r.Separator), a += "||"
      }, i.prototype.stakeEntered = function(e) {
        var s = "" !== e ? a.StringToNumber(e) : null;
        this.bet.get(t.BetTypeId) == i.SINGLES_MULTIPLE_ID ? isNaN(+e) || 0 >= +e ? this.slipdelegate.multipleUpdateSingleStakes("") : this.slipdelegate.multipleUpdateSingleStakes(e) : (this.bet.set(t.Stake, s), this.slipdelegate.multipleInvalidateStakes())
      }, i.prototype.reuseSelection = function() {
        this.bet.get(t.BetTypeId) == i.SINGLES_MULTIPLE_ID ? this.uidelegate.stakeChanged("") : (this.bet.set(t.Stake, null), this.slipdelegate.multipleInvalidateStakes())
      }, i.prototype.clearStake = function() {
        this.bet.set(t.Stake, null)
      }, i.prototype.eachwayChecked = function() {
        this.bet.get(t.EachWayAvailable) && (this.bet.set(t.EachWay, !0), this.invalidateProperties((e = {}, e[t.EachWay] = !0, e))), this.slipdelegate.multipleInvalidateStakes();
        var e
      }, i.prototype.eachwayUnchecked = function() {
        this.bet.get(t.EachWayAvailable) && (this.bet.set(t.EachWay, !1), this.invalidateProperties((e = {}, e[t.EachWay] = !0, e))), this.slipdelegate.multipleInvalidateStakes();
        var e
      }, i.prototype.multipleUpdated = function(e) {
        this.invalidateProperties(e)
      }, i.prototype.multipleRemoved = function() {
        this.uidelegate.multipleRemoved(), this.slipdelegate.multipleRemoveMultiple(this)
      }, i.prototype.updateReturnValue = function(e) {
        var i, s = this.bet.get(t.ToReturn);
        e != s && (this.bet.set(t.ToReturn, e), this.invalidateProperties((i = {}, i[t.ToReturn] = !0, i)))
      }, i.prototype.updateTotalStake = function(e) {
        this.bet.set(t.TotalStake, e), this.invalidateProperties((i = {}, i[t.TotalStake] = !0, i));
        var i
      }, i.prototype.updateStraightAccumulatorOdds = function(e) {
        this.bet.set(t.Odds, e)
      }, i.prototype.updateBetCreditsStake = function(e, i) {
        this.bet.set(t.BetCreditStake, e), this.actualStake = i
      }, i.prototype.updateBetCount = function(e) {
        this.bet.set(t.BetCount, e || 1)
      }, i.prototype.updateBonusInfo = function(e, t) {
        this.uidelegate.accumulatorPercentageChanged(e, t)
      }, i.prototype.showFreebetCheckbox = function(e, t) {}, i.FORECAST_DOUBLE = 54, i.FORECAST_TREBLE = 55, i.SINGLES_MULTIPLE_ID = -1, i
    }(i);
  e.Multiple = p
}(ns_betslipstandardlib_model_multiple || (ns_betslipstandardlib_model_multiple = {})),
function(e) {
  var t = ns_betslipcorelib_util.StorageHelper,
    i = ns_betslipcorelib_model.RacingCastBetslipModel,
    s = ns_gen5_events.Event365,
    a = ns_betslipstandardlib_model_bet.BetBuilder,
    n = ns_betslipcorelib_util.BetCombinations,
    r = function() {
      function e() {}
      return e.ItemCanBeAddedToSlip = function(i, n) {
        var r, o, l, d;
        if ("A" == i.stype && "P" == i.ctype) {
          if (this.IsDuplicateOrInvalidAusPotBet(i, n)) return !1
        } else if (this.IsDuplicateBet(i, n)) return i.constructString.indexOf("il=") > -1 ? Locator.participantEvents.dispatchEvent(new s("bb_duplicate")) : n.duplicateBetAdded(), !1;
        if (!(t.GetBetCount() < e.MAXIMUM_BET_COUNT)) return n.maxBetsAdded(), !1;
        if (i.constructString.indexOf("il=") > -1) {
          for (r = 0, o = 0, l = n.bets; o < l.length; o++) d = l[o], d instanceof a && r++;
          if (r >= e.MAXIMUM_BET_BUILDER_COUNT) return Locator.participantEvents.dispatchEvent(new s("bb_maxExceeded")), !1
        }
        return !0
      }, e.IsIncompatibleBetItem = function(e) {
        return !t.GetBetCount(), e instanceof i ? e.isTote : !1
      }, e.IsDuplicateBet = function(e, s) {
        var a, n, r, o, l;
        if (0 == t.GetBetCount()) return !1;
        if (e instanceof i) return this.IsDuplicateCastBet(e, s);
        if (e.constructString.indexOf("il=") > -1) return this.IsDuplicateBetBuilder(e, s);
        for (a = 0, n = s.bets; a < n.length; a++)
          if (r = n[a], r.key() == e.key()) return !0;
        for (o = 0, l = s.pendingBets; o < l.length; o++)
          if (r = l[o], r.key() == e.key()) return !0;
        return !1
      }, e.IsDuplicateBetBuilder = function(e, t) {
        var i, s, a, n = function(e) {
            var t, i, s, a = e.key().split("-"),
              n = [];
            for (t = 0, i = a; t < i.length; t++) s = i[t], s != a[0] && n.push(s);
            return n.sort().join()
          },
          r = function() {
            var t, i, s, a = e.constructString.split("#"),
              n = [];
            for (t = 0, i = a; t < i.length; t++) s = i[t], s.indexOf("fp=") > -1 && n.push(s.split("=")[1]);
            return n.sort().join()
          },
          o = r();
        for (i = 0, s = t.bets; i < s.length; i++)
          if (a = s[i], o == n(a)) return !0;
        return !1
      }, e.IsDuplicateCastBet = function(e, t) {
        var i, s, a, n, r, o, l, d, p, h, u = e.fixid + "-",
          c = e.getValueList();
        for (i = 0, s = c; i < s.length; i++) {
          for (a = s[i], n = "", r = 0, o = a; r < o.length; r++) l = o[r], n += l;
          u += n
        }
        for (u += e.cmask, u += e.ctype, d = 0, p = t.castBets; d < p.length; d++)
          if (h = p[d], h.key() == u) return !0;
        return !1
      }, e.IsDuplicateOrInvalidAusPotBet = function(e, s) {
        var a, r, o, l, d, p, h, u, c, g, b, f, S, m, y = new i(e.constructString),
          B = y.getValueList(),
          v = B.concat.apply([], B),
          _ = [];
        for (a = 0, r = v; a < r.length; a++) o = r[a], _.push(o.split(":")[0]);
        for (l = function(e) {
            return e.sort().join("~") === _.sort().join("~")
          }, d = 0, p = s.castBets; d < p.length; d++)
          if (h = p[d], u = h.key().split("~"), l(u)) return !0;
        return c = y.modelToBetString(), g = n.CalculateCombinations("", B), b = t.GetNormalString(), f = t.GetCastString(), S = t.GetMultipleString(), m = (b ? b.length : 0) + (f ? f.length : 0) + (S ? S.length : 0) + c.length, n.CombinationsValid(g.length, m) ? !1 : (s.maxBetsAdded(), !0)
      }, e.MAXIMUM_BET_COUNT = 20, e.MAXIMUM_BET_BUILDER_COUNT = 4, e
    }();
  e.AddBetValidator = r
}(ns_betslipstandardlib_validators || (ns_betslipstandardlib_validators = {})),
function(e) {
  var t = ns_gen5_util.MathUtil,
    i = function() {
      function e() {}
      return e.BetCreditsAvailable = function(e, t, i) {
        var s = this.IsEmptyStake(e),
          a = this.IsEmptyStake(t),
          n = this.IsEmptyStake(i);
        return !(!s && !a && n)
      }, e.IsEmptyStake = function(e) {
        return t.StringToNumber(e) > 0
      }, e
    }();
  e.FreeBetValidator = i
}(ns_betslipstandardlib_validators || (ns_betslipstandardlib_validators = {})),
function(e) {
  var t, i = ns_betslipstandardlib_model_bet.AutoVoidBet,
    s = ns_betslipcorelib_model.SlipModel,
    a = ns_gen5_util.PromotionalFilter,
    n = ns_betslipcorelib_data.BetDocumentAttribute,
    r = ns_betslipstandardlib_model_bet.NormalBet,
    o = ns_betslipstandardlib_model_bet.EachwayBet,
    l = ns_betslipstandardlib_model_bet.EwexBet,
    d = ns_betslipstandardlib_model_bet.NoReservesBet,
    p = ns_betslipstandardlib_model_bet.PitcherBet,
    h = ns_betslipstandardlib_model_bet.BetBuilder,
    u = ns_betslipstandardlib_model_bet.ScorecastBet,
    c = ns_betslipstandardlib_model_multiple.Multiple,
    g = ns_betslipcorelib_calcs_enum.BetSlipTypes,
    b = ns_betslipcorelib_calcs.BetCalculations,
    f = ns_betslipcorelib_constants.BetSlipResult,
    S = ns_betslipcorelib_data.SlipCurrentState,
    m = ns_gen5_util.Delegate,
    y = ns_gen5_events.BalanceModelEvent,
    B = ns_betslipcorelib_model.LiveAlertsFixture,
    v = ns_betslipstandardlib_util.APIHelper,
    _ = ns_betslipcorelib_util.StorageHelper,
    k = ns_betslipstandardlib_validators.AddBetValidator,
    C = ns_betslipcorelib_model.RacingCastBetslipModel,
    T = ns_betslipstandardlib_validators.FreeBetValidator,
    R = ns_betslipcorelib_constants.BetTypeLookupKey,
    A = ns_betslipcorelib_util.WaitGroup,
    I = ns_betslipcorelib_util.BetStringParser,
    O = ns_betslipcorelib_util.BetslipEvents,
    P = ns_betslipcorelib_constants.BetStringType,
    M = ns_webconsolelib_util.WebConsoleGlobals,
    E = ns_betslipcorelib_constants.ApiAction,
    D = ns_webconsolelib_util.WebPageUtils,
    x = ns_betslipcorelib_calcs_multiples.MultiplesCombinations,
    L = ns_betslipcorelib_constants.OddsTypeOverride,
    w = ns_gen5_util_logging.CounterLogger,
    F = ns_gen5_util.Date365,
    H = function(e) {
      function s() {
        var t, i, s, a = e.call(this) || this;
        for (a.betKeyLookup = {}, a.bets = [], a.pendingBets = [], a.multiples = [], a.multipleType = c, a.castBets = [], a.betCalculationsLookup = {}, a.disposed = !1, a.ewexInvalidated = !1, a.autoVoidInvalidated = !1, a.ewexMultiplesSuspended = !1, a.autoVoidOnSlip = !1, a.waitGroup = new A, a.refreshSlipInProgress = !1, a.betString = _.GetNormalString(), a.multiplesString = _.GetMultipleString(), a.castString = _.GetCastString(), a.document.setDelegate(a), a.balanceUpdateDelegate = new m(a, a.balanceUpdateHandler), Locator.user.getBalance().addEventListener(y.BALANCEMODEL_UPDATE_EVENT, a.balanceUpdateDelegate), t = _.GetKeys(), i = 0, s = t.length; s > i; i++) a.betKeyLookup[t[i]] || (a.betKeyLookup[t[i]] = !0);
        return Locator.validationManager.callNewContext(function() {
          O.DispatchBetAddedEvents(t)
        }), a
      }
      return __extends(s, e), s.InstallNormalBetType = function(e, t) {
        s.BetPartTypeLookup[e] = t
      }, s.InstallCastBetType = function(e, t) {
        s.BetCastCodeLookup[e] = t
      }, s.prototype.balanceUpdateHandler = function() {
        this.document.get(n.CurrentState) != S.Betslip || this.disposed || this.invalidateStakes()
      }, s.prototype.getCurrentState = function() {
        return this.document.get(n.CurrentState)
      }, s.prototype.refresh = function() {
        this.disposed = !1, this.betString = _.GetNormalString(), this.multiplesString = _.GetMultipleString(), this.castString = _.GetCastString(), this.ensureModelAvailability(), this.invalidateItems(E.Refresh)
      }, s.prototype.refreshSlipTypes = function() {
        var e = this.document.get(n.BetslipTypes);
        e && this.uidelegate.betslipTypesChanged(e, this.document.get(n.SlipType))
      }, s.prototype.setDelegate = function(e) {
        var t, i, s, a, n, r, o, l = !!this.uidelegate;
        if (this.uidelegate = e, l && !this.disposed) {
          for (t = 0, i = this.bets; t < i.length; t++) s = i[t], this.createAndInsertNormalBet(s);
          for (a = 0, n = this.castBets; a < n.length; a++) s = n[a], this.createAndInsertCastBet(s);
          r = {};
          for (o in this.document.getDataKeys()) r[o] = !0;
          this.ewexMultiplesSuspended && this.ewexBetInvalidateItems(!this.ewexMultiplesSuspended), this.autoVoidOnSlip && this.autoVoidBetInvalidateSelection(!this.autoVoidOnSlip), this.invalidateHeaderOdds(), this.invalidateProperties(r)
        }
      }, s.prototype.commitProperties = function() {
        var e, t, i, s, a, r, o, l, d, p, h, u, c, g, b, m, y;
        if (this.itemsInvalidated) return this.itemsInvalidated = !1, void this.refreshSlip(null);
        if (this.changes[n.SessionExpired] && D.Reload(), this.changes[n.TokenExpired] && (w.QueueCounter("nst_timestamp_2", 1), w.ForceCounterFlush(), Locator.validationManager.callNewContext(function() {
            D.Reload()
          })), (this.changes[n.BetObjects] || this.changes[n.CastObjects] || this.changes[n.MultipleOptions]) && (this.stakesInvalidated = !0), this.stakesInvalidated && (this.stakesInvalidated = !1, this.handleStakeChange()), this.multiplesInvalidated && (this.multiplesInvalidated = !1, this.multiplesString = this.serialiseMultiples(), this.saveToStorage()), this.ewexInvalidated && (this.ewexInvalidated = !1, this.handleEwexChanges()), this.autoVoidInvalidated && (this.autoVoidInvalidated = !1, this.handleAutoVoidChanges()), this.headerOddsInvalidated && (this.headerOddsInvalidated = !1, this.multiples.length > 0 && this.defaultMultiple && !this.ewexMultiplesSuspended ? (this.uidelegate.updateHeaderOdds(this.defaultMultiple.getOdds(), this.getOddsTypeOverride()), this.document.get(n.DefaultMultiple) && this.document.get(n.DefaultMultiple).ap ? this.uidelegate.updateHeaderBonus(this.document.get(n.DefaultMultiple).ap) : this.uidelegate.updateHeaderBonus(0)) : 0 == this.multiples.length && 1 == this.bets.length ? (this.uidelegate.updateHeaderBonus(0), this.uidelegate.updateHeaderOdds(this.bets[0].getDisplayOdds(), this.bets[0].getOddsTypeOverride())) : (this.uidelegate.updateHeaderBonus(0), this.uidelegate.updateHeaderOdds(""))), n.InPlayItemExists in this.changes && this.handleInPlayStatusChanged(), this.changes[n.MultiplesRestricted] && (e = this.document.get(n.MultiplesRestricted), this.uidelegate.multiplesRestrictionChanged(e, this.document.get(n.SlipResult))), this.changes[n.SlipResult] || this.changes[n.CurrentState]) {
          if (t = !1, i = this.document.get(n.SlipResult), s = this.document.get(n.CurrentState), this.uidelegate.slipResultChanged(i, s), s == S.BetslipError && !this.document.get(n.MessageId)) return void this.dispose();
          if (s == S.BetReferralPolling && this.disablePush(), s == S.BetReceipt) {
            if (v.UpdateSession(), a = F.Now(), a.setHours(a.getHours() + 24), M.BetTime = a, this.document.get(n.MultiplesRestricted) && this.uidelegate.multiplesRestrictionChanged(!1, this.document.get(n.SlipResult)), this.document.get(n.ReferrralCode)) {
              for (r = 0, o = this.bets; r < o.length; r++) l = o[r], l.wasReferred() && (l.setReferralFullyDeclined(), t = !0);
              for (this.defaultMultiple && this.defaultMultiple.wasReferred() && this.defaultMultiple.setReferralFullyDeclined(), d = 0, p = this.multiples; d < p.length; d++) h = p[d], h.wasReferred() && h.setReferralFullyDeclined()
            }
            u = this.document.get(n.UsersRemainingMonthlyStakeLimit), u && this.uidelegate.showRemainingLimit(u), c = this.document.get(n.BetReference), c && (this.uidelegate.setBetReference(c), g = Locator.user.getBalance(), g.refreshBalance()), this.disablePush()
          } else s == S.InProgress || s == S.BetConfirm ? this.disablePush() : this.previousSlipState != S.InProgress && this.previousSlipState != S.BetReceipt && this.previousSlipState != S.BetConfirm || this.enablePush();
          i == f.opportunityChanged && (this.serialise(), this.saveToStorage()), t && this.uidelegate.slipResultChanged(f.referralDeclined, S.BetReceipt), this.previousSlipState = s
        }
        this.changes[n.BetslipTypes] && this.refreshSlipTypes(), this.changes[n.ReferrralCode] && this.handleReferral(), this.changes[n.TotalStake] && this.uidelegate.updateTotalStake(this.document.get(n.TotalStake)), this.changes[n.TotalToReturn] && (b = this.document.get(n.TotalToReturn), this.uidelegate.multiplesInvalidated(), this.uidelegate.returnAmountUpdated(b)), this.changes[n.ShortfallAmount] && (m = this.document.get(n.ShortfallAmount), m && this.uidelegate.showQuickDeposit(this.document.get(n.ShortfallAmount), this.document.get(n.QuickDepositAllowed))), this.changes[n.LiveStreaming] && this.uidelegate.showQualifiedStreams(this.document.get(n.LiveStreaming)), this.changes[n.MessageId] && (y = this.document.get(n.MessageValues), this.uidelegate.messageChanged(this.document.get(n.MessageId), y ? y : "")), this.changes[n.BetObjects] && this.uidelegate.displayOfferBadges(), this.refreshSlipInProgress = !1
      }, s.prototype.restoreBetString = function() {
        var e = this;
        this.disposed = !1, this.serialise(), this.saveToStorage(), this.uidelegate.updateBetCount(_.GetBetCount()), Locator.validationManager.callNewContext(function() {
          e.defaultMultiple && e.uidelegate.updateHeaderOdds(e.defaultMultiple.getOdds())
        }), O.DispatchBetAddedEvents(_.GetKeys())
      }, s.prototype.serialise = function() {
        this.disposed || (this.betString = this.serialiseSingles(), this.multiplesString = this.serialiseMultiples(), this.castString = this.serialiseCasts())
      }, s.prototype.saveToStorage = function() {
        this.disposed || _.Save(this.betString, this.castString, this.multiplesString)
      }, s.prototype.serialiseSingles = function() {
        var e, t, i, s, a, n, r, o = "";
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], s = i.serialise(), -1 === o.indexOf(s) && (o += s);
        for (a = 0, n = this.pendingBets; a < n.length; a++) i = n[a], r = i.constructString, -1 === o.indexOf(r) && (o += r + "||");
        return o
      }, s.prototype.serialiseMultiples = function() {
        var e, t, i, s = "";
        for (this.defaultMultiple && (s += this.defaultMultiple.serialise()), e = 0, t = this.multiples; e < t.length; e++) i = t[e], s += i.serialise();
        return s
      }, s.prototype.serialiseCasts = function() {
        var e, t, i, s = "";
        for (e = 0, t = this.castBets; e < t.length; e++) i = t[e], s += i.serialise();
        return s
      }, s.prototype.multipleGetOddsArray = function() {
        return this.getSingleOddsArray()
      }, s.prototype.getOddsTypeOverride = function() {
        var e, t, i, s, a, n = (a = {}, a[L.NONE] = 0, a),
          r = L.NONE;
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], s = 0, i.getOddsTypeOverride && (s = i.getOddsTypeOverride()), n[s] = n[s] ? n[s] + 1 : 1, (n[s] > n[r] || r == L.NONE && n[s] >= n[r]) && (r = s);
        return r
      }, s.prototype.maxBetsAdded = function() {
        this.uidelegate.maximumBetsAdded()
      }, s.prototype.duplicateBetAdded = function() {
        this.uidelegate.duplicateBetAdded()
      }, s.prototype.handleInPlayStatusChanged = function() {
        this.uidelegate.inPlayStatusChanged(this.document.get(n.InPlayItemExists))
      }, s.prototype.addItem = function(e) {
        var t, i;
        k.ItemCanBeAddedToSlip(e, this) && (ns_betslipcorelib_util.BetsWebApi.SuppressRasCall(), this.ensureModelAvailable(e), this.disposed = !1, t = e.key(), e instanceof C ? this.sendBetAddedEvent(e.id) : t && (this.sendBetAddedEvent(t), this.betKeyLookup[t] = !0), "A" != e.stype && "J" != e.stype || (e = new C(e.constructString)), e instanceof C ? (i = this.convertRacingCastModelToBetString(e), e.betStringType === P.NormalItems ? this.betString ? this.betString += i + "||" : this.betString = i + "||" : this.castString ? this.castString += i + "||" : this.castString = i + "||") : (this.betString ? this.betString += e.constructString + "||" : this.betString = e.constructString + "||", this.pendingBets.push(e)), this.saveToStorage(), this.uidelegate.betAddedSuccessfully(), this.uidelegate.updateBetCount(_.GetBetCount()), this.invalidateItems(E.AddBet))
      }, s.prototype.convertRacingCastModelToBetString = function(e) {
        return e.modelToBetString()
      }, s.prototype.addCastBetToNormals = function(e) {
        return !1
      }, s.prototype.loadPlugin = function(e) {
        var t = this;
        this.waitGroup.add(), this.uidelegate.loadPlugin(e, function() {
          t.waitGroup.done()
        })
      }, s.prototype.ensureModelAvailability = function() {
        var e, t, i, s, a = _.GetNormalString(),
          n = a ? a.split("||") : [],
          r = _.GetCastString(),
          o = r ? r.split("||") : [],
          l = n.concat(o);
        for (e = 0, t = l; e < t.length; e++) i = t[e], s = I.ParseBetStringToBetItem(i), this.ensureModelAvailable(s)
      }, s.prototype.ensureModelAvailable = function(e) {
        var t = this,
          i = e.getCastCode(),
          a = function(e) {
            t.loadPlugin(e)
          };
        if (i) {
          if (s.BetCastCodeLookup[i]) return;
          return void a(i)
        }
        e.partType && !s.BetPartTypeLookup[e.partType] && a(e.partType)
      }, s.prototype.getSingleOddsArray = function() {
        var e, t, i, s, a = [];
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], s = i.toFreeBetItem(), a = a.concat(s.odds);
        return a
      }, s.prototype.removeItem = function(e) {
        var t, i, a, n, r, o, l = e.key();
        for (this.sendBetRemovedEvent(l), this.betKeyLookup[l] && delete this.betKeyLookup[l], t = !1, i = 0, a = this.bets; i < a.length; i++)
          if (n = a[i], n.key() == l) {
            this.normalBetRemoveBet(n), t = !0;
            break
          } if (!t)
          for (r = 0; r < this.pendingBets.length; r++)
            if (this.pendingBets[r].constructString === e.constructString) {
              this.pendingBets.splice(r, 1);
              break
            } this.betString = this.serialiseSingles(), this.saveToStorage(), o = _.GetBetCount(), this.uidelegate.updateBetCount(o), o || (s.MultiLegLock = !1), this.invalidateItems(E.RemoveBet)
      }, s.prototype.removeAllItems = function() {
        this.clearCouponHighlighting(), this.betString = "", this.multiplesString = "", this.castString = "", this.bets = [], this.multiples = [], this.castBets = [], this.ewexMultiplesSuspended = !1, this.document.clear(), _.Clear(), v.Abort()
      }, s.prototype.invalidateItems = function(t) {
        this.itemsInvalidated || (v.Abort(), e.prototype.invalidateItems.call(this, t))
      }, s.prototype.invalidateHeaderOdds = function() {
        this.headerOddsInvalidated || (this.headerOddsInvalidated = !0, this.invalidateProperties(null))
      }, s.prototype.normalBetInvalidateHeaderOdds = function() {
        this.invalidateHeaderOdds()
      }, s.prototype.castBetInvalidateHeaderOdds = function() {
        this.invalidateHeaderOdds()
      }, s.prototype.placeBetButtonValidateAndPlaceBet = function() {
        this.validateAndPlaceBet()
      }, s.prototype.normalBetRefreshSlip = function(e) {
        this.refreshSlipAction = E.Refresh, this.refreshSlip(e)
      }, s.prototype.validateAndPlaceBet = function(e) {
        this.validateBet() && this.placeBet(e)
      }, s.prototype.validateBet = function() {
        return this.refreshSlipInProgress ? !1 : Locator.user.isLoggedIn ? !this.betString && !this.castString || "ns=" == this.betString || !this.bets.length && !this.castBets.length ? !1 : this.document.get(n.TotalStake) && 0 !== this.document.get(n.TotalStake) ? !0 : (this.uidelegate.slipResultChanged(f.noStakeProvided, this.document.get(n.CurrentState)), !1) : (this.uidelegate.slipResultChanged(f.notLoggedIn, this.document.get(n.CurrentState)), !1)
      }, s.prototype.handleReferral = function() {
        this.uidelegate.handleReferral(this.document.get(n.ReferralPlaceAmount), this.document.get(n.ReferralAmount))
      }, s.prototype.referBet = function() {
        v.ReferBet(this.document)
      }, s.prototype.getReferralPlaceAmount = function() {
        return this.document.get(n.ReferralPlaceAmount)
      }, s.prototype.getReferralAmount = function() {
        return this.document.get(n.ReferralAmount)
      }, s.prototype.getTotalStake = function() {
        return this.document.get(n.TotalStake)
      }, s.prototype.getReferralTotalUserStake = function() {
        return this.document.get(n.BetReference) && this.document.get(n.BetReference).length > 0 && this.document.get(n.ReferrralCode) && this.document.get(n.ReferrralCode).length > 0 ? this.document.get(n.TotalUserStake) : 0
      }, s.prototype.getReferralTotalReturns = function() {
        var e, t, i, s, a, r, o = 0;
        if (this.document.get(n.BetReference) && this.document.get(n.BetReference).length > 0 && this.document.get(n.ReferrralCode) && this.document.get(n.ReferrralCode).length > 0) {
          for (e = 0, t = this.bets; e < t.length; e++) i = t[e], o += i.getRejectedReferralPlacedAmount();
          for (this.defaultMultiple && (o += this.defaultMultiple.getRejectedReferralPlacedAmount()), s = 0, a = this.multiples; s < a.length; s++) r = a[s], o += r.getRejectedReferralPlacedAmount();
          return o
        }
        return 0
      }, s.prototype.invalidateMultiples = function() {
        this.multiplesInvalidated || (this.multiplesInvalidated = !0, this.invalidateProperties(null))
      }, s.prototype.setBetCreditMode = function(e) {
        e ? (_.SaveUseBetCredits("1"), this.betCreditsHasChanged = !0) : _.SaveUseBetCredits(""), this.stakesInvalidated = !0, this.invalidateProperties(null)
      }, s.prototype.enablePush = function() {
        var e, t, i;
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], i.enablePush()
      }, s.prototype.disablePush = function() {
        var e, t, i;
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], i.disablePush()
      }, s.prototype.cancelBetReferral = function() {
        this.refreshSlip(null)
      }, s.prototype.clearQuickDesposit = function() {
        this.document.set(n.ShortfallAmount, 0)
      }, s.prototype.checkBetKeySelectionState = function(e) {
        return !!this.betKeyLookup[e]
      }, s.prototype.ewexSelectionChanged = function(e, t) {
        this.sendBetRemovedEvent(e), this.sendBetAddedEvent(t), delete this.betKeyLookup[e], this.betKeyLookup[t] = !0
      }, s.prototype.handleEwexChanges = function() {
        var e, t, i, s, a, n;
        for (e = 0, t = this.bets; e < t.length; e++)
          if (i = t[e], i instanceof l && i.isEwexItem()) {
            for (this.uidelegate.suspendMultiples(), this.defaultMultiple && this.defaultMultiple.clearStake(), s = 0, a = this.multiples; s < a.length; s++) n = a[s], n.clearStake();
            return this.invalidateMultiples(), void(this.ewexMultiplesSuspended = !0)
          } this.uidelegate.unsuspendMultiples(), this.ewexMultiplesSuspended = !1
      }, s.prototype.handleAutoVoidChanges = function() {
        var e, t, s;
        for (e = 0, t = this.bets; e < t.length; e++)
          if (s = t[e], s instanceof i && s.isAutoVoidSelected()) return void(this.autoVoidOnSlip || (this.uidelegate.displayAutoVoidMessage(), this.autoVoidOnSlip = !0));
        this.uidelegate.hideAutoVoidMessage(), this.autoVoidOnSlip = !1
      }, s.prototype.ewexBetInvalidateItems = function(e) {
        this.ewexInvalidated || e == this.ewexMultiplesSuspended || (this.ewexInvalidated = !0, this.invalidateProperties(null))
      }, s.prototype.autoVoidBetInvalidateSelection = function(e) {
        this.autoVoidInvalidated || e == this.autoVoidOnSlip || (this.autoVoidInvalidated = !0, this.invalidateProperties(null))
      }, s.prototype.getMultiplesRestricted = function() {
        return this.document.get(n.MultiplesRestricted)
      }, s.prototype.normalBetRemoveBet = function(e) {
        if (-1 !== this.bets.indexOf(e)) {
          this.bets.splice(this.bets.indexOf(e), 1);
          var t = e.key();
          this.sendBetRemovedEvent(t), this.betKeyLookup[t] && delete this.betKeyLookup[t], this.document.removeBet(t), this.betString = this.serialiseSingles(), this.saveToStorage(), this.invalidateItems(E.RemoveBet), this.invalidateHeaderOdds()
        }
      }, s.prototype.normalBetOddsHandicapSuspensionChanged = function() {
        this.oddsHandicapSuspensionChanged()
      }, s.prototype.normalBetDisableFreeBetTokens = function(e, t) {
        this.disableFreeBetTokens(e, t)
      }, s.prototype.normalBetInvalidateStakes = function() {
        this.invalidateStakes()
      }, s.prototype.normalBetHandleMinStakeInput = function() {
        this.handleMinStakeInput()
      }, s.prototype.castBetRemoveBet = function(e) {
        this.castBets.splice(this.castBets.indexOf(e), 1), this.castString = this.serialiseCasts(), this.saveToStorage(), this.invalidateItems(E.RemoveBet), this.invalidateStakes()
      }, s.prototype.castBetInvalidateStakes = function() {
        this.invalidateStakes()
      }, s.prototype.castBetParticipantsChanged = function() {
        this.serialise(), this.saveToStorage()
      }, s.prototype.castBetOddsHandicapSuspensionChanged = function() {
        this.oddsHandicapSuspensionChanged()
      }, s.prototype.castBetDisableFreeBetTokens = function(e, t) {
        this.disableFreeBetTokens(e, t)
      }, s.prototype.getPendingCount = function() {
        return this.pendingBets.length
      }, s.prototype.castBetHandleMinStakeInput = function() {
        this.handleMinStakeInput()
      }, s.prototype.betBuilderRemoveBet = function(e) {
        this.bets.splice(this.bets.indexOf(e), 1), this.betString = this.serialiseSingles(), this.saveToStorage(), this.invalidateItems(E.Refresh), this.invalidateStakes()
      }, s.prototype.multipleInvalidateStakes = function() {
        this.invalidateStakes()
      }, s.prototype.multipleGetAccumulatorType = function() {
        return this.document.get(n.AccumulatorType)
      }, s.prototype.multipleGetBetCount = function() {
        return this.getBetCount()
      }, s.prototype.multipleInvalidateMultiples = function() {
        this.invalidateMultiples()
      }, s.prototype.multipleUpdateSingleStakes = function(e) {
        var t, i, s;
        for (t = 0, i = this.bets; t < i.length; t++) s = i[t], s.stakeEntered(e)
      }, s.prototype.multipleRemoveMultiple = function(e) {
        var t = this.multiples.indexOf(e);
        t > -1 ? this.multiples.splice(t, 1) : this.defaultMultiple == e && (this.defaultMultiple = null), this.invalidateHeaderOdds(), this.invalidateMultiples()
      }, s.prototype.getBetCount = function() {
        return this.bets && this.bets.length > 0 ? this.bets.length : 0
      }, s.prototype.updateBetslipType = function(e) {
        var t, i, s, a = this.document.get(n.SlipType);
        if (a != e) {
          for (t = 0, i = this.bets; t < i.length; t++) s = i[t], s.stakeEntered("");
          _.UpdateBetslipType(e)
        }
      }, s.prototype.ewexBetIsOnSlip = function(e, t) {
        return this.betKeyLookup[e + "-" + t]
      }, s.prototype.onBeforeDocumentRestore = function(e, t, i) {
        var a, n, r, o, l, d, p, h, u, c, g = this,
          b = [];
        for (a = 0, n = e; a < n.length; a++) r = n[a], s.BetPartTypeLookup[r.betTypeLookupKey] || b.push(r.partType);
        for (o = 0, l = t; o < l.length; o++) d = l[o], s.BetCastCodeLookup[d.castCode] || b.push(d.castCode);
        if (!b.length) return void i();
        for (p = function() {
            g.waitGroup.done()
          }, h = 0, u = b; h < u.length; h++) c = u[h], this.waitGroup.add(), this.uidelegate.loadPlugin(c, p);
        this.waitGroup.wait(function() {
          i()
        })
      }, s.prototype.documentUpdated = function(e) {
        this.invalidateProperties(e)
      }, s.prototype.documentBetInserted = function(e, t) {
        var i = this.createBetModel(e, t);
        return i ? (e.setDelegate(i), t.addToNormals ? (this.bets.push(i), this.betKeyLookup[t.key] = !0, this.createAndInsertNormalBet(i)) : (this.castBets.push(i), this.createAndInsertCastBet(i)), s.MultiLegLockCastCodeLookup[t.castCode] && (s.MultiLegLock = !0), this.invalidateHeaderOdds(), !0) : (this.abort(), !1)
      }, s.prototype.createAndInsertNormalBet = function(e) {
        var t = this.uidelegate.createNormalBetInstance(e);
        e.setDelegate(t), this.uidelegate.insertNormalBet(t)
      }, s.prototype.createAndInsertCastBet = function(e) {
        var t = this.uidelegate.createCastBetInstance(e);
        e.setDelegate(t), this.uidelegate.insertCastBet(t)
      }, s.prototype.documentDefaultMultipleInserted = function(e, t) {
        var i = this.defaultMultiple = new this.multipleType(e, this),
          s = this.uidelegate.getDefaultMultipleInstance(i);
        s.isCast = t, s.model = i, i.setUIDelegate(s), e.setDelegate(i), this.invalidateHeaderOdds(), this.uidelegate.insertDefaultMultiple(s), this.autoVoidOnSlip && this.uidelegate.displayAutoVoidMessage()
      }, s.prototype.documentMultipleInserted = function(e, t) {
        var i = new this.multipleType(e, this),
          s = this.uidelegate.createMultipleInstance(i);
        s.isCast = t, s.model = i, i.setUIDelegate(s), e.setDelegate(i), this.multiples.push(i), this.uidelegate.insertMultiple(s)
      }, s.prototype.liveAlertsDataReceived = function(e) {
        var t, i, s, a, n;
        if (e) {
          for (t = [], i = 0, s = e; i < s.length; i++) a = s[i], n = new B(a), t.push(n);
          this.uidelegate.liveAlertsReceived(t)
        }
      }, s.prototype.acceptButtonAcceptChanges = function() {
        this.acceptChanges()
      }, s.prototype.acceptChanges = function() {
        var e, t, i, s, a, n, r, o;
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], i.acceptChanges();
        for (s = 0, a = this.castBets; s < a.length; s++) i = a[s], i.acceptChanges();
        for (this.defaultMultiple && this.defaultMultiple.acceptChanges(), n = 0, r = this.multiples; n < r.length; n++) o = r[n], o.acceptChanges();
        this.betString = this.serialiseSingles(), this.saveToStorage(), this.uidelegate.slipResultChanged(f.success, S.Betslip)
      }, s.prototype.reuseSelections = function(e) {
        this.resetStakes(), this.refreshSlip(e)
      }, s.prototype.resetStakes = function() {
        var e, t, i, s, a, n, r, o;
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], i.reuseSelection();
        for (s = 0, a = this.castBets; s < a.length; s++) i = a[s], i.reuseSelection();
        for (this.defaultMultiple && this.defaultMultiple.reuseSelection(), n = 0, r = this.multiples; n < r.length; n++) o = r[n], o.reuseSelection();
        this.invalidateStakes(), this.serialise(), this.saveToStorage()
      }, s.prototype.createBetModel = function(e, t) {
        var i = t.castCode ? s.BetCastCodeLookup[t.castCode] : s.BetPartTypeLookup[t.betTypeLookupKey];
        return !i && t.castCode && (i = s.BetPartTypeLookup[t.castCode]), i ? new i(e, this) : null
      }, s.prototype.refreshSlip = function(e) {
        var t, i, s, a, r = this;
        return this.betString || this.castString ? (this.refreshSlipInProgress = !0, t = this.betString, i = this.multiplesString, s = this.castString, a = {
          normals: t,
          casts: s,
          multiples: i,
          completeHandler: function(t) {
            r.waitGroup.wait(function() {
              r.document.update(t), r.pendingBets.length = 0
            }), e && e()
          },
          errorHandler: function() {
            r.document.set(n.SlipResult, f.failed)
          }
        }, this.refreshSlipAction == E.AddBet ? void v.AddBet(a) : this.refreshSlipAction == E.RemoveBet ? void v.RemoveBet(a) : void v.RefreshSlip(a)) : (this.clearCouponHighlighting(), void this.dispose())
      }, s.prototype.placeBet = function(e) {
        var t, i = this;
        this.document.set(n.CurrentState, S.InProgress), this.document.set(n.SlipResult, f.success), t = {
          normals: this.betString,
          casts: this.castString,
          multiples: this.multiplesString,
          completeHandler: function(t) {
            t[n.ReferrralCode] ? (i.document.merge(t), i.serialise(), i.saveToStorage()) : t[n.BetReference] ? i.document.merge(t) : (i.invalidateStakes(), i.document.merge(t)), e && e(t[n.SlipResult])
          },
          errorHandler: function() {
            i.uidelegate.slipResultChanged(f.failed, S.BetslipError), e && e(f.failed)
          },
          betGuid: this.document.get(n.BetGuid)
        }, v.PlaceBet(t)
      }, s.prototype.handleStakeChange = function() {
        var e, t, i, s, a, r, o, l, d, p, h, u, c, g, S, m = this.bets.length + this.castBets.length;
        if (0 != m) {
          if (e = "0.00", t = 0, i = "", s = "", a = "", m) {
            for (r = this.toFreeBetslip(), b.CalculateStakeAndReturnsValues(r), o = !1, l = 0, d = r.betItems; l < d.length; l++)
              if (p = d[l], p.returnsCapped) {
                o = !0;
                break
              } o ? this.hideAccaBonus() : this.document.get(n.DefaultMultiple) && this.document.get(n.DefaultMultiple).ap && this.uidelegate.updateHeaderBonus(this.document.get(n.DefaultMultiple).ap), e = r.totalStake, t = r.totalReturns, i = r.totalBetCreditStake, s = r.totalUserStake, a = r.totalFreeBetStake, this.document.set(n.TotalStake, +e), this.document.get(n.MultiplesRestricted) && this.defaultMultiple && this.defaultMultiple.getStake() > 0 && (t = 0);
            for (h in this.betCalculationsLookup) u = this.betCalculationsLookup[h], u && (c = u[0], g = u[1], g.updateBetCreditsStake(c.betItemBetCreditStakeDisplay, c.betItemActualStake), g.updateTotalStake(c.totalStake), "multiple" != c.type || "multiple" == c.type && !this.document.get(n.MultiplesRestricted) ? g.updateReturnValue(c.betItemReturnsValue) : (g.updateReturnValue(0), t = 0), c.calculateAccumulatedOdds && g.updateStraightAccumulatorOdds && (S = c.accumulatedOdds, S && !this.document.get(n.MultiplesRestricted) || (S = ""), g.updateStraightAccumulatorOdds(S)), c.calculateBetCount && g.updateBetCount && g.updateBetCount(c.betCount));
            this.document.set(n.TotalToReturn, t)
          }
          this.uidelegate.updateBetCreditsStake(i, s, a), T.BetCreditsAvailable(i, s, a) ? this.uidelegate.enableBetCredits() : this.uidelegate.disableBetCredits(), this.document.get(n.SlipResult) == f.noStakeProvided && this.uidelegate.slipResultChanged(f.success, this.document.get(n.CurrentState)), this.serialise(), this.saveToStorage(), this.betCreditsHasChanged && (this.betCreditsHasChanged = !1, this.handleStakeChange())
        }
      }, s.prototype.hideAccaBonus = function() {
        var e = this;
        Locator.validationManager.callNewContext(function() {
          Locator.validationManager.callPostValidation(function() {
            e.defaultMultiple.updateBonusInfo(0, ""), e.uidelegate.hideAccaBonus(), e.uidelegate.updateHeaderBonus(0)
          })
        })
      }, s.prototype.clearCouponHighlighting = function() {
        for (var e in this.betKeyLookup) this.sendBetRemovedEvent(e), delete this.betKeyLookup[e]
      }, s.prototype.abort = function() {
        var e = this.document.get(n.CurrentState);
        this.uidelegate.slipResultChanged(f.betCreationFailed, e), this.dispose(), this.clearCouponHighlighting()
      }, s.prototype.dispose = function() {
        if (!this.disposed) {
          this.disposed = !0, this.document.clear(), this.bets = [], this.multiples = [], this.castBets = [], this.defaultMultiple = null, s.MultiLegLock = !1, this.betCalculationsLookup = {}, this.betString = "", this.castString = "", this.multiplesString = "", this.previousSlipState = null, this.ewexMultiplesSuspended = !1;
          var e = Locator.user.getBalance();
          e.hasEventListenerWithDelegate(y.BALANCEMODEL_UPDATE_EVENT, this.balanceUpdateDelegate) && (e.removeEventListener(y.BALANCEMODEL_UPDATE_EVENT, this.balanceUpdateDelegate), this.balanceUpdateDelegate = null), this.refreshSlipInProgress = !1
        }
      }, s.prototype.clearKeys = function() {
        this.betKeyLookup = {}
      }, s.prototype.toFreeBetslip = function() {
        var e, t, i, s, r, o, l, d, p, h, u, c, f, S, m, y, B, v, k, C, T, R, A, I, O;
        for (this.betCalculationsLookup = {}, e = [], t = [], i = [], s = 0, r = this.bets; s < r.length; s++) o = r[s], l = o.toFreeBetItem(), i = i.concat(l.odds), e.push(l), this.betCalculationsLookup[o.key()] = [l, o], l.placeOdds && (t.push([e.length.toString()]), t[t.length - 1].push(l.placeOdds));
        for (this.defaultMultiple && (d = this.defaultMultiple.toFreeBetItem(), p = "0", h = "0", this.document.get(n.DefaultMultiple) && !a.IsExcludedFromPromotion("2") && (u = this.document.get(n.DefaultMultiple).st ? this.document.get(n.DefaultMultiple).st : 0, c = this.document.get(n.DefaultMultiple).ap ? this.document.get(n.DefaultMultiple).ap : 0, u && c && (f = this.document.get(n.DefaultMultiple).ma ? this.document.get(n.DefaultMultiple).ma : 1e5, S = this.getSingleOddsArray(), m = _.GetUseBetCredits() && this.document.get(n.DefaultMultiple).fb ? +this.document.get(n.DefaultMultiple).fb : 0, u = m ? u - m : u, y = this.document.get(n.AccumulatorType), B = x.GetDefaultCombinations(this.getBetCount()), p = b.GetBonusValue({
            stake: u,
            odds: S,
            combinations: B,
            bonusPercentage: c,
            accumulatorType: y,
            max: f
          }), h = b.GetBonusValueNoTax({
            stake: u,
            odds: S,
            combinations: B,
            bonusPercentage: c,
            accumulatorType: y,
            max: f
          }))), d.bonus = p, d.bonusNoTax = h, d.odds = i, e.push(d), this.betCalculationsLookup[this.defaultMultiple.key()] = [d, this.defaultMultiple]), v = 0, k = this.multiples; v < k.length; v++) C = k[v], T = C.toFreeBetItem(), T && (T.odds = i, e.push(T), this.betCalculationsLookup[C.key()] = [T, C]);
        for (R = 0, A = this.castBets; R < A.length; R++) I = A[R], O = I.toFreeBetItem(), O && (e.push(O), this.betCalculationsLookup[I.key()] = [O, I]);
        return {
          freeBetAmount: _.GetUseBetCredits() ? +Locator.user.getBalance().bonusBalance : 0,
          betslipType: g.slipStandard,
          betItems: e,
          calculateMultipleReturnValue: !0,
          eachWaySelections: t,
          equallyDivided: !1,
          totalBetCreditStake: "",
          totalFreeBetStake: "",
          totalUserStake: "",
          totalReturns: 0,
          totalStake: "0"
        }
      }, s.prototype.getOpportunityChangedDetails = function() {
        var e, t, i, s, a, n, r, o = {
          count: 0,
          oddsChanged: !1,
          handicapChanged: !1,
          availabilityChanged: !1
        };
        for (e = 0, t = this.bets; e < t.length; e++) i = t[e], s = i.getOpportunityChangedDetails(), o.oddsChanged = o.oddsChanged || s.oddsChanged, o.handicapChanged = o.handicapChanged || s.handicapChanged, o.availabilityChanged = o.availabilityChanged || s.availabilityChanged, (s.oddsChanged || s.handicapChanged || s.availabilityChanged) && o.count++;
        for (a = 0, n = this.castBets; a < n.length; a++) r = n[a], s = r.getOpportunityChangedDetails(), o.oddsChanged = o.oddsChanged || s.oddsChanged, o.handicapChanged = o.handicapChanged || s.handicapChanged, o.availabilityChanged = o.availabilityChanged || s.availabilityChanged, (s.oddsChanged || s.handicapChanged || s.availabilityChanged) && o.count++;
        return o
      }, s.prototype.sendBetAddedEvent = function(e) {
        var t, i = new ns_betslip.BetSlipEvent(e);
        i.selected = 1, Locator.inplayEvents.dispatchEvent(i), t = new ns_betslip.BetSlipEvent(ns_betslip.BetSlipEvent.PARTICIPANT_ADDED_TO_BETSLIP), t.data = {
          Id: e
        }, Locator.inplayEvents.dispatchEvent(t)
      }, s.prototype.sendBetRemovedEvent = function(e) {
        var t, i = new ns_betslip.BetSlipEvent(e);
        i.selected = 0, Locator.inplayEvents.dispatchEvent(i), t = new ns_betslip.BetSlipEvent(ns_betslip.BetSlipEvent.PARTICIPANT_REMOVED_FROM_BETSLIP), t.data = {
          Id: e
        }, Locator.inplayEvents.dispatchEvent(t)
      }, s.IsBetSupported = function(e) {
        return e.stype ? s.SportTypesWhiteList.indexOf(e.stype) > -1 : e.partType ? s.PartTypesWhiteList.indexOf(e.partType) > -1 : !1
      }, s.IsBetCompatible = function(e) {
        if (0 == _.GetBetCount()) return !0;
        var t = e.getCastCode();
        return s.MultiLegLock || s.MultiLegLockCastCodeLookup[t] ? !(!s.MultiLegLock || !s.MultiLegLockCastCodeLookup[t]) : !0
      }, s.IsQuickbetSupported = function(e) {
        return !(e instanceof C || e.getCastCode())
      }, s.prototype.oddsHandicapSuspensionChanged = function() {
        var e = this.getOpportunityChangedDetails();
        e.count > 0 ? this.document.set(n.SlipResult, f.opportunityChanged) : this.document.set(n.SlipResult, f.success)
      }, s.prototype.disableFreeBetTokens = function(e, t) {
        var i, s, a, n = this.bets.concat(this.castBets);
        for (i = 0, s = n; i < s.length; i++) a = s[i], e != a && e.getFreeBetToken() === a.getFreeBetToken() && (t ? a.disableFreeBetToken() : a.enableFreeBetToken())
      }, s.prototype.invalidateStakes = function() {
        this.stakesInvalidated || (this.stakesInvalidated = !0, this.invalidateProperties(null))
      }, s.prototype.handleMinStakeInput = function() {
        this.document.set(n.SlipResult, f.stakeBelowMinimum)
      }, s.prototype.getDocumentDataViaKey = function(e) {
        return this.document.get(e)
      }, s.PartTypesWhiteList = ["N", "S", "A"], s.SportTypesWhiteList = ["A", "O", "N", "J"], s.BetPartTypeLookup = (t = {}, t[R.NormalBet] = r, t[R.EachwayBet] = o, t[R.EwexBet] = l, t[R.NoReservesBet] = d, t[R.PitcherBet] = p, t[R.ScorecastBet] = u, t[R.AutoVoidBet] = i, t[R.BetBuilder] = h, t), s.BetCastCodeLookup = {}, s.MultiLegLock = !1, s.MultiLegLockCastCodeLookup = {
        T6P: !0,
        T6S: !0,
        A2P: !0,
        A3P: !0,
        A4P: !0,
        A2S: !0,
        A3S: !0,
        A4S: !0,
        R2P: !0,
        R3P: !0,
        R4P: !0,
        R6P: !0
      }, s
    }(s);
  e.StandardSlip = H
}(ns_betslipstandardlib_model_slip || (ns_betslipstandardlib_model_slip = {}));
