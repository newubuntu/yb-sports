function localeLib(e) {
  return window[e + boot.getLocale()] ? ns_gen5_util.Singleton.getInstance(window[e + boot.getLocale()]) : ns_gen5_util.Singleton.getInstance(window[e + "Default"])
}

function appLib(e) {
  var t = window["ns_" + e.toLowerCase().replace("app", "_app")];
  return t && t[e] && ns_gen5_util.Singleton.getInstance(t[e])
}
var ns_betslipcorelib_util, ns_betslipcorelib_data, ns_betslipcorelib_constants, ns_betslipcorelib_calcs_enum, ns_betslipcorelib_calcs, ns_betslipcorelib_calcs_multiples, ns_betslipcorelib_model, ns_betslipcorelib_model_betbreakdown, ns_betslipcorelib_document, SITE_ROOT_PATH = "sports";
! function(e) {
  var t = function() {
    function e() {}
    return e.DispatchBetAddedEvents = function(e) {
      for (var t = 0, i = e.length; i > t; t++) this.DispatchBetAddedEvent(e[t])
    }, e.DispatchBetRemovedEvents = function(e) {
      for (var t = 0, i = e.length; i > t; t++) this.DispatchBetRemovedEvent(e[t])
    }, e.DispatchBetAddedEvent = function(e) {
      var t, i = new ns_betslip.BetSlipEvent(e);
      i.selected = 1, Locator.inplayEvents.dispatchEvent(i), t = new ns_betslip.BetSlipEvent(ns_betslip.BetSlipEvent.PARTICIPANT_ADDED_TO_BETSLIP), t.data = {
        Id: e
      }, Locator.inplayEvents.dispatchEvent(t)
    }, e.DispatchBetRemovedEvent = function(e) {
      var t, i = new ns_betslip.BetSlipEvent(e);
      i.selected = 0, Locator.inplayEvents.dispatchEvent(i), t = new ns_betslip.BetSlipEvent(ns_betslip.BetSlipEvent.PARTICIPANT_REMOVED_FROM_BETSLIP), t.data = {
        Id: e
      }, Locator.inplayEvents.dispatchEvent(t)
    }, e
  }();
  e.BetslipEvents = t
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t;
  ! function(e) {
    e.CurrentState = "cs", e.SlipType = "st", e.SlipResult = "sr", e.ShortfallAmount = "sf", e.QuickDepositAllowed = "qd", e.BetReference = "br", e.AccountNumber = "ac", e.TotalStake = "ts", e.TotalBetCreditStake = "tc", e.TotalFreeBetTokenStake = "tf", e.TotalUserStake = "tu", e.TotalToReturn = "re", e.BetObjects = "bt", e.BetBuilderObjects = "bb", e.CastObjects = "ci", e.MultipleOptions = "mo", e.BetslipTypes = "bs", e.DefaultMultiple = "dm", e.ReferrralCode = "rc", e.ReferrralTime = "rt", e.ReferrralReference = "rr", e.ReferralAmount = "ra", e.ReferralPlaceAmount = "rp", e.LiveStreaming = "ls", e.LiveAlerts = "la", e.MultiplesRestricted = "mr", e.MessageId = "mi", e.MessageValues = "mv", e.InPlayItemExists = "ir", e.BetGuid = "bg", e.ExchangeRate = "er", e.ExchangeRateUS = "eu", e.SessionExpired = "se", e.TokenExpired = "tx", e.EquallyDivided = "cp", e.TempReceiptReference = "tr", e.OfferBadges = "ob", e.EnhancedPrices = "ep", e.TeaserOptions = "to", e.TeaserID = "ti", e.PlaceBetDisabled = "pd", e.AccumulatorType = "at", e.QuickCode = "qc", e.AAMSResponse = "ar", e.TeaserCardId = "c2", e.UsersRemainingMonthlyStakeLimit = "rl", e.CardGroupId = "cg"
  }(t = e.BetDocumentAttribute || (e.BetDocumentAttribute = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t = function() {
    function e() {
      this.addToStandardSlip = !1, this.swipeDeleteBetKeys = [], this.animationsEnabled = !1
    }
    return e.UserPreferencesGUID = "BetslipPreferences", e
  }();
  e.BetslipPreferences = t
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.BetCallSlip = -1] = "BetCallSlip", e[e.None = 0] = "None", e[e.Standard = 1] = "Standard", e[e.BankerBetSlip = 2] = "BankerBetSlip", e[e.IFBetSlip = 3] = "IFBetSlip", e[e.ReverseIFBetSlip = 4] = "ReverseIFBetSlip", e[e.FixedTeaserBetSlip = 5] = "FixedTeaserBetSlip", e[e.ParlayTeaserCardSlip = 6] = "ParlayTeaserCardSlip", e[e.NumbersSlip = 7] = "NumbersSlip", e[e.UKToteBetslip = 8] = "UKToteBetslip", e[e.USToteBetslip = 9] = "USToteBetslip", e[e.eToteBetslip = 10] = "eToteBetslip", e[e.ColossusBetslip = 11] = "ColossusBetslip", e[e.USParlayTeaser = 12] = "USParlayTeaser", e[e.USTeaserCardSlip = 13] = "USTeaserCardSlip"
  }(t = e.SlipType || (e.SlipType = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.sessionLocked = -2] = "sessionLocked", e[e.generalError = -1] = "generalError", e[e.success = 0] = "success", e[e.invalidCombination = 1] = "invalidCombination", e[e.multiplesRestriction = 2] = "multiplesRestriction", e[e.baseballHandicapContingency = 3] = "baseballHandicapContingency", e[e.iceHockeyHandicapContingency = 4] = "iceHockeyHandicapContingency", e[e.otherHandicapContingency1 = 5] = "otherHandicapContingency1", e[e.otherHandicapContingency2 = 6] = "otherHandicapContingency2", e[e.incompatibleSelection = 7] = "incompatibleSelection", e[e.notLoggedIn = 8] = "notLoggedIn", e[e.noStakeProvided = 9] = "noStakeProvided", e[e.insufficientFunds = 10] = "insufficientFunds", e[e.stakeAboveMaximum = 11] = "stakeAboveMaximum", e[e.stakeBelowMinimum = 12] = "stakeBelowMinimum", e[e.lineItemsNoStakeProvided = 13] = "lineItemsNoStakeProvided", e[e.opportunityChanged = 14] = "opportunityChanged", e[e.failed = 15] = "failed", e[e.duplicateSelection = 19] = "duplicateSelection", e[e.toteTechnicalIssues = 22] = "toteTechnicalIssues", e[e.referralRequired = 24] = "referralRequired", e[e.referralInProgress = 25] = "referralInProgress", e[e.referralDeclined = 26] = "referralDeclined", e[e.freeBetNotQualified = 28] = "freeBetNotQualified", e[e.lineAboveBetLimits = 29] = "lineAboveBetLimits", e[e.oddsBelowMinimum = 34] = "oddsBelowMinimum", e[e.multipleOddsBelowMinimum = 35] = "multipleOddsBelowMinimum", e[e.lineItemsBelowMinimumShortOddsStake = 36] = "lineItemsBelowMinimumShortOddsStake", e[e.timeRestrictionError = 39] = "timeRestrictionError", e[e.blocked = 47] = "blocked", e[e.freeBetNoLongerValid = 57] = "freeBetNoLongerValid", e[e.userRestrictionOnGaming = 64] = "userRestrictionOnGaming", e[e.geoComplyFailed = 70] = "geoComplyFailed", e[e.lifetimeDepositAcknowledgementRequired = 71] = "lifetimeDepositAcknowledgementRequired", e[e.lineItemBelowMinStakeMaxReturns = 75] = "lineItemBelowMinStakeMaxReturns", e[e.splitBet = 68] = "splitBet", e[e.userDailyStakeLimitExceeded = 69] = "userDailyStakeLimitExceeded", e[e.betCreationFailed = 9e3] = "betCreationFailed", e[e.invalidUSToteSingles = 976] = "invalidUSToteSingles", e[e.invalidUSToteCasts = 977] = "invalidUSToteCasts", e[e.invalidEToteSingles = 978] = "invalidEToteSingles", e[e.invalidEToteCasts = 979] = "invalidEToteCasts", e[e.minStakeItalyRacingPools = 988] = "minStakeItalyRacingPools", e[e.minStakeItalyRacing = 989] = "minStakeItalyRacing", e[e.minStakeItalyVirtuals = 990] = "minStakeItalyVirtuals", e[e.minStakeItalyExotic = 991] = "minStakeItalyExotic", e[e.minStakeItalyPSQFV4 = 992] = "minStakeItalyPSQFV4", e[e.minStakeItaly = 993] = "minStakeItaly", e[e.minStakeNormal = 994] = "minStakeNormal", e[e.minStakeTote = 995] = "minStakeTote", e[e.invalidJackpotStake = 996] = "invalidJackpotStake", e[e.invalidToteStake = 997] = "invalidToteStake", e[e.invalidSuper7UnitStake = 998] = "invalidSuper7UnitStake", e[e.invalidTotePerUnitStake = 999] = "invalidTotePerUnitStake", e[e.invalidColossusStake = 1e3] = "invalidColossusStake", e[e.invalidXpressBetStake = 1001] = "invalidXpressBetStake"
  }(t = e.BetSlipResult || (e.BetSlipResult = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.slipStandard = 1] = "slipStandard", e[e.slipBanker = 2] = "slipBanker", e[e.slipIF = 3] = "slipIF", e[e.slipReverseIF = 4] = "slipReverseIF", e[e.slipFixedTeaser = 5] = "slipFixedTeaser"
  }(t = e.BetSlipTypes || (e.BetSlipTypes = {}))
}(ns_betslipcorelib_calcs_enum || (ns_betslipcorelib_calcs_enum = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.RETURNS = 0] = "RETURNS", e[e.WINNINGS = 1] = "WINNINGS"
  }(t = e.OfferAccumulatorTypeEnum || (e.OfferAccumulatorTypeEnum = {}))
}(ns_betslipcorelib_calcs_enum || (ns_betslipcorelib_calcs_enum = {})),
function(e) {
  var t = ns_betcalculationslib_calculations.StakeCalculations,
    i = ns_betcalculationslib_rounding.RoundingHelper,
    s = ns_gen5_util.MathUtil,
    a = ns_betcalculationslib_calculations_returns.CalculateReturnValue,
    n = ns_betcalculationslib_formatter.FormatMultipleOdds,
    o = ns_betcalculationslib_calculations_returns.MaxReturn,
    r = ns_betcalculationslib_tax.TaxCalculations,
    l = ns_betslipcorelib_calcs_enum.BetSlipTypes,
    c = ns_gen5_util.CurrencyFormatter,
    u = ns_betcalculationslib_calculations_eachway.GetAusBetEachWayBetCount,
    p = function() {
      function e() {}
      return e.CalculateStakeAndReturnsValues = function(t) {
        var a, r, c, u;
        if (t.betslipType == l.slipIF || t.betslipType == l.slipReverseIF) return void this.CalculateIfBetStakeAndReturnsValues(t);
        for (a = t.freeBetAmount, r = 0, c = t.betItems; r < c.length; r++) u = c[r], u.calculateBetCount && (u.betCount = ns_betcalculationslib_calculations_eachway.GetAusBetEachWayBetCount.GetBetCount(u.combinations, t.eachWaySelections)), u.calculateAccumulatedOdds && (u.accumulatedOdds = n.Format(u.odds, ns_gen5_util.OddsType.FRACTIONAL)), e.CalculateStakeValues(a, u), u.freeBetTokenSelected || (a -= s.StringToNumber(i.RoundUp(u.betItemFreeStake)), a -= s.StringToNumber(i.RoundUp(u.betItemBetCreditStake)), a = s.StringToNumber(i.RoundUp(a)));
        this.MaxReturnValue || (this.MaxReturnValue = o.GetMaxReturn()), e.CalculateReturns(t), e.CalculateTotalStakeValues(t), e.CalculateTotalReturnValues(t)
      }, e.CalculateIfBetStakeAndReturnsValues = function(t) {
        var i, s, a;
        for (i = 0, s = t.betItems; i < s.length; i++) a = s[i], a.calculateBetCount && (a.betCount = ns_betcalculationslib_calculations_eachway.GetAusBetEachWayBetCount.GetBetCount(a.combinations, t.eachWaySelections)), a.calculateAccumulatedOdds && (a.accumulatedOdds = n.Format(a.odds, ns_gen5_util.OddsType.FRACTIONAL)), t.betslipType == l.slipReverseIF && a.stake && (a.stake = 2 * a.stake), e.CalculateStakeValues(0, a);
        this.MaxReturnValue || (this.MaxReturnValue = o.GetMaxReturn()), e.CalculateIfBetWinnings(t), e.CalculateIfBetTotalReturns(t)
      }, e.CalculateStakeValues = function(e, s) {
        var a, n, o;
        s.betItemFreeStake = 0, s.betItemBetCreditStake = 0, s.betItemBetCreditStakeDisplay = "", s.stake > 0 && (a = localeLib("BetslipCoreLib"), n = s.ewSelected && a.returnBetCount(s.type) ? 2 * s.betCount : s.betCount, o = +i.RoundUp(s.stake * n), s.totalStake = o, s.freeBetTokenSelected ? s.betItemFreeStake = s.stake : e > 0 && e >= o ? (s.betItemBetCreditStake = o, s.betItemActualStake = "", s.betItemConstructFreeStake = i.RoundUp(o)) : e > 0 && (n > 1 && (e = t.CalculateUnitStake(e, n), e *= n, 0 === e && (e = NaN)), s.betItemBetCreditStake = e, s.betItemActualStake = i.RoundUp(o - e), s.betItemConstructFreeStake = i.RoundUp(e)), s.freeBetTokenSelected ? s.betItemFreeStake = +i.RoundUp(s.betItemFreeStake) : s.betItemBetCreditStake > 0 && (s.betItemBetCreditStakeDisplay = i.RoundUp(s.betItemBetCreditStake)))
      }, e.CalculateReturns = function(e) {
        var t, s, n, o, r, l, p;
        for (t = 0, s = e.betItems; t < s.length; t++) n = s[t], "multiple" == n.type && e.calculateMultipleReturnValue ? n.combinations ? 0 == n.stake ? n.betItemReturns = 0 : -1 !== n.odds.indexOf("") || -1 !== n.odds.indexOf("0") || -1 !== n.odds.indexOf("0/0") ? n.betItemReturns = 0 : (o = NaN, e.eachWaySelections && 0 != e.eachWaySelections.length && n.ewSelected ? e.equallyDivided ? o = ns_betcalculationslib_calculations_eachway.CalculateEquallyDividedEachWayReturns.Calculate(n.stake.toString(), n.odds, n.combinations, e.eachWaySelections, n.betCount) : e.eachWaySelections.length > 0 && (p = localeLib("BetslipCoreLib"), o = p.itemToReturn(n.odds, e.eachWaySelections, n.stake.toString(), n.combinations)) : (r = n.bonus, l = +c.UnformatCurrencyValue(n.bonusNoTax) || 0, n.betItemBetCreditStake >= n.stake && (r = "0", l = 0), o = a.Calculate(n.stake.toString(), n.odds, n.betCount, u.GetDistinctCombination(n.combinations), n.betItemBetCreditStake, r, l), (n.bonus && "0" != n.bonus || n.bonusNoTax && "0" != n.bonusNoTax) && (n.returnsCapped = a.CalculateGetReturnsCapped(n))), isNaN(o) || (o = +i.RoundDown(o - n.betItemBetCreditStake)), n.betItemReturnsValue = o) : n.betItemReturns = 0 : n.ausEWSelected || n.ewSelected || 1 != n.betCount ? (p = localeLib("BetslipCoreLib"), n.betItemReturnsValue = p.getEachWayReturn(n)) : (o = a.Calculate(n.stake.toString(), n.odds, 1, [
          ["1"]
        ], n.betItemFreeStake + n.betItemBetCreditStake), n.betItemReturnsValue = isNaN(o) ? NaN : +i.RoundUp(o - n.betItemFreeStake - n.betItemBetCreditStake)), n.betItemReturnsValue > this.MaxReturnValue ? (n.betItemReturns = this.MaxReturnValue + n.totalStake, n.ausEWSelected && (n.betItemReturnsValue = n.betItemReturns)) : n.betItemReturns = n.betItemReturnsValue
      }, e.CalculateIfBetWinnings = function(e) {
        var t, i, s, n;
        for (t = 0, i = e.betItems; t < i.length; t++) s = i[t], n = a.CalculateIfBetWinnings(s.stake.toString(), s.odds, 1, [
          ["1"]
        ]), s.betItemReturnsValue = isNaN(n) ? NaN : n, s.betItemReturnsValue > this.MaxReturnValue ? s.betItemReturns = this.MaxReturnValue : s.betItemReturns = s.betItemReturnsValue
      }, e.CalculateTotalStakeValues = function(e) {
        var t, s, a, n, o, r, l, c, u, p = 0,
          d = 0,
          b = 0;
        for (t = 0, s = e.betItems; t < s.length; t++) a = s[t], a.stake && (n = localeLib("BetslipCoreLib"), p += +i.RoundUp(a.stake * (a.ewSelected && n.returnCountForActualStake(a.type) ? 2 * a.betCount : a.betCount)), d += +i.RoundUp(a.betItemFreeStake * (a.ewSelected && n.returnCountForActualStake(a.type) ? 2 * a.betCount : a.betCount)), b += a.betItemBetCreditStake);
        o = p > 0 ? i.RoundUp(p) : "", r = d > 0 ? i.RoundUp(d) : "", l = e.freeBetAmount > 0 ? i.RoundUp(b) : "", c = p - d - b, u = c > 0 ? i.RoundUp(p - d - b) : "", e.totalStake = o, e.totalFreeBetStake = r, e.totalBetCreditStake = l, e.totalUserStake = u
      }, e.CalculateTotalReturnValues = function(t) {
        var a, n, o, r = 0;
        for (a = 0, n = t.betItems; a < n.length; a++)
          if (o = n[a], isNaN(+o.betItemReturnsValue)) {
            if (!e.ShowTotalReturnsWithSP) {
              r = 0;
              break
            }
          } else r += o.betItemReturnsValue;
        t.totalReturns = s.StringToNumber(i.RoundUp(r))
      }, e.CalculateIfBetTotalReturns = function(e) {
        var t, a, n, o = 0;
        for (t = 0; t < e.betItems.length; t++) {
          if (a = e.betItems[t], isNaN(+a.betItemReturnsValue)) {
            o = 0;
            break
          }
          o += a.betItemReturnsValue
        }
        n = e.betItems[0].totalStake, o = r.ApplyTaxTotalIfBetWinnings(o, n), o += o > 0 ? n : 0, e.totalReturns = s.StringToNumber(i.Round(o))
      }, e.GetFormattedStake = function(e) {
        var t, i, s, a;
        return "" === e || "." === e || "," == e ? t = "0" + Locator.user.currencyDecimalSeparator + "00" : -1 === e.indexOf(Locator.user.currencyDecimalSeparator) ? e + Locator.user.currencyDecimalSeparator + "00" : (i = e, s = i.split(Locator.user.currencyDecimalSeparator), "" === s[0] && (i = "0" + i), a = i.indexOf(Locator.user.currencyDecimalSeparator), a == i.length - 2 ? i += "0" : a == i.length - 1 && (i += "00"), i)
      }, e.GetBonusValue = function(e) {
        var t = e.stake,
          i = e.odds,
          s = e.combinations,
          a = e.bonusPercentage,
          n = e.accumulatorType,
          o = e.max,
          r = localeLib("BetslipCoreLib");
        return r.getBonusValue(t, i, s, a, n, o)
      }, e.GetBonusValueNoTax = function(e) {
        var t = e.stake,
          i = e.odds,
          s = e.combinations,
          a = e.bonusPercentage,
          n = e.accumulatorType,
          o = e.max,
          r = localeLib("BetslipCoreLib");
        return r.getBonusValueNoTax(t, i, s, a, n, o)
      }, e.ShowTotalReturnsWithSP = !1, e
    }();
  e.BetCalculations = p
}(ns_betslipcorelib_calcs || (ns_betslipcorelib_calcs = {})),
function(e) {
  var t = function() {
    function e() {}
    return e.GetDefaultCombinations = function(e) {
      var t, i = [],
        s = [];
      for (t = 1; e >= t; t++) s.push(t.toString());
      return i.push(s), 0 === i.length && i.push(["1"]), i
    }, e
  }();
  e.MultiplesCombinations = t
}(ns_betslipcorelib_calcs_multiples || (ns_betslipcorelib_calcs_multiples = {})),
function(e) {
  var t;
  ! function(e) {
    e.OtherMobileBrowser = "OtherMobileBrowser", e.iOSMobileApp = "iOSMobileApp", e.iOSMobileBrowser = "iOSMobileBrowser", e.iOSDesktopBrowser = "iOSDesktopBrowser", e.iOSTabletApp = "iOSTabletApp", e.AndroidDesktopBrowser = "AndroidDesktopBrowser", e.AndroidMobileApp = "AndroidMobileApp", e.AndroidMobileBrowser = "AndroidMobileBrowser", e.AndroidTabletApp = "AndroidTabletApp"
  }(t = e.DeviceType || (e.DeviceType = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e.NormalItems = "ns", e.Multiples = "ms", e.CastItems = "cs", e.BetBuilder = "bb", e.BetslipType = "bt", e.UsebetCredits = "uc"
  }(t = e.BetStringType || (e.BetStringType = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e.Separator = "#", e.FoSeparator = "x", e.Pipe = "|", e.ParticipantType = "pt=", e.Odds = "o=", e.FixtureId = "f=", e.FixtureParticipantId = "fp=", e.SelectionOrder = "so=", e.ClassificationId = "c=", e.LineHandicap = "ln=", e.MediaType = "mt=", e.ToteCombination = "atc=", e.Topic = "TP=", e.OddsTypeOverride = "oto=", e.BuySellHandicapIncrement = "Inc=", e.BuySellOdds = "BOdds=", e.PhoneOnlyMarket = "pom=Y", e.UnitStake = "ust=", e.TotalStake = "st=", e.OddsHash = "sa=", e.TotalReturns = "tr=", e.OddsLineChange = "olc=", e.EachWay = "ew=", e.NoReserves = "nr=", e.AutoVoid = "av=", e.MultipleId = "id=", e.BetCount = "bc=", e.SelectedPitcher = "bbfp=", e.SPOdds = "sp=", e.BetCreditStake = "fb=", e.FreeBetAmount = "fbv=", e.FreeBetToken = "ft=", e.StakeLimit = "sl=", e.BetBuilderSeparator = "^", e.BetBuilderList = "il=", e.SportType = "spt=", e.CastMask = "cm=", e.CastType = "ct=", e.CastSeperator = "~", e.ToteType = "tt=", e.ToteMeetingId = "tmi=", e.ToteMeetingNumber = "tmn=", e.C2 = "c2=", e.GBPUnitStake = "gust=", e.GBPTotalStake = "gst=", e.USDUnitStake = "gust=", e.USDTotalStake = "gst=", e.PlayerId = "pid=", e.MatchId = "mid=", e.ApplyTolerence = "at=Y", e.PlaceParticipantId = "pp=", e.PlaceOdds = "po=", e.ItalianBetType = "it=", e.Protocol = "pr=", e.Banker = "bk=", e.IfAction = "ac="
  }(t = e.BetStringProperty || (e.BetStringProperty = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.NONE = 0] = "NONE", e[e.FRACTIONAL = 1] = "FRACTIONAL", e[e.DECIMAL = 2] = "DECIMAL", e[e.ASIAN = 3] = "ASIAN"
  }(t = e.OddsTypeOverride || (e.OddsTypeOverride = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.NotSpecified = 0] = "NotSpecified", e[e.NewlyQualified = 1] = "NewlyQualified", e[e.AmountIncreased = 2] = "AmountIncreased"
  }(t = e.FreeBetQualificationStatus || (e.FreeBetQualificationStatus = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.Ok = 0] = "Ok", e[e.BetNotSupported = 1] = "BetNotSupported", e[e.ClearSlipRequired = 2] = "ClearSlipRequired"
  }(t = e.AddBetResult || (e.AddBetResult = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e.AusRacing = "A", e.AusRacingCast = "O", e.Racing = "N", e.UkToteRacing = "T", e.ForeignPoolsExotic = "J", e.EToteRacing = "E", e.USToteRacing = "R", e.Colossus = "L"
  }(t = e.CastSportType || (e.CastSportType = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.AddBet = 1] = "AddBet", e[e.RemoveBet = 2] = "RemoveBet", e[e.Refresh = 3] = "Refresh"
  }(t = e.ApiAction || (e.ApiAction = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t = ns_betslipcorelib_constants.CastSportType,
    i = function() {
      function i() {}
      return i.IsCastModel = function(e) {
        var t = !1,
          i = e.toUpperCase();
        return (-1 == i.indexOf("PT=M") && -1 == i.indexOf("PT=N") && -1 == i.indexOf("PT=P") && -1 == i.indexOf("PT=S") && -1 == i.indexOf("PT=A") || e.indexOf("~") > -1) && (t = !0), t
      }, i.getBetCastModel = function(t) {
        var i, s, a, n = t.split(";"),
          o = [];
        for (i = 0, s = n; i < s.length; i++) a = s[i], a.length > 0 && o.push(new e.RacingCastBetslipModel(a));
        return o
      }, i.getToteType = function(e, i) {
        if (e.substring(0, 1) === t.Colossus) return "6";
        var s = "";
        switch (e) {
          case "TWC":
          case "TES":
          case "TEC":
          case "TTS":
          case "TTC":
          case "TEB":
          case "TTB":
          case "TPP":
          case "TJP":
          case "T6P":
          case "TUP":
          case "T7P":
          case "TDW":
          case "TDL":
          case "TDE":
          case "TDH":
            s = "1";
            break;
          case "TWC_US":
          case "TES_US":
          case "TEC_US":
          case "TTS_US":
          case "TTC_US":
          case "TEB_US":
          case "TTB_US":
          case "TPP_US":
          case "TJP_US":
          case "T6P_US":
          case "TUP_US":
          case "T7P_US":
          case "TDW_US":
          case "TDL_US":
          case "TDE_US":
          case "TDH_US":
            s = "3";
            break;
          case "AQC":
          case "AQS":
          case "AES":
          case "AEC":
          case "ATS":
          case "ATC":
          case "ASS":
          case "ASC":
            s = "1";
            break;
          case "EES":
          case "ETS":
          case "EEC":
          case "ETC":
          case "EDW":
          case "EDL":
          case "EDE":
            s = "2";
            break;
          case "A2P":
          case "A3P":
          case "A4P":
            s = "5";
            break;
          case "RES":
          case "REC":
          case "RTS":
          case "RTC":
          case "RSS":
          case "RSC":
          case "RQC":
            s = "3";
            break;
          case "JDL":
          case "JDW":
          case "JDH":
          case "J2C":
          case "JEC":
          case "JES":
          case "J3C":
          case "JTS":
          case "JTC":
          case "J4C":
          case "JSC":
          case "JSS":
            s = "4"
        }
        return s
      }, i.getLegCount = function(e) {
        var t = 0;
        switch (e) {
          case "R2P":
          case "A2P":
            t = 2;
            break;
          case "R3P":
          case "A3P":
            t = 3;
            break;
          case "R4P":
          case "TUP":
          case "A4P":
            t = 4;
            break;
          case "R5P":
            t = 5;
            break;
          case "TPP":
          case "TJP":
          case "T6P":
          case "R6P":
            t = 6;
            break;
          case "T7P":
            t = 7;
            break;
          case "R9P":
            t = 9;
            break;
          case "LPP":
          case "L6P":
          case "LJP":
            t = 6;
            break;
          case "LUP":
            t = 6;
            break;
          case "L7P":
            t = 7
        }
        return t
      }, i
    }();
  e.RacingBetslipModel = i
}(ns_betslipcorelib_model || (ns_betslipcorelib_model = {})),
function(e) {
  var t = ns_gen5_util.MathUtil,
    i = ns_betslipcorelib_constants.BetStringType,
    s = function(s) {
      function a(e) {
        var t = s.call(this) || this;
        return t._australianForecastPrefix = "oe", t._australianTricastPrefix = "ot", t.id = "", t.fixid = "", t.betStringType = i.CastItems, t._legind = 0, t._fpind = 1, t._pottypeind = 2, t._totemiind = 3, t._totemnind = 4, t._toteracenind = 5, t._toterunind = 6, t._totetypeind = 7, t.multiLeg = "P", t.straightCastBetCount = 0, t._betString = e, t.constructString = e, t._betString.indexOf("~") > -1 ? t.buildCastbetModel() : t.buildTotebetModel(), t
      }
      return __extends(a, s), a.prototype.getValueList = function() {
        return this.valuelist
      }, a.prototype.buildTotebetModel = function() {
        var t = this.parseConstruct(),
          i = t.pt;
        2 == i.length ? i = "JD" + i : i.length < 3 && (i = "TD" + i), this.stype = i.slice(0, 1), this.cmask = i.slice(1, 2), this.ctype = i.slice(2, 3), this.fixid = t.f, this.ttype = e.RacingBetslipModel.getToteType(i, t.c), this.valuelist = [], this.id = t.id, this.mediaType = t.mt, t.wp && t.pp ? this.valuelist.push([t.fp + "," + t.wp + "," + t.pp]) : this.valuelist.push([t.fp])
      }, a.prototype.parseConstruct = function() {
        var e, t, i = this._betString.split("#"),
          s = {};
        for (e = 0; e < i.length; e++) i[e].length > 0 && (t = i[e].split("="), s[t[0]] = t[1]);
        return s
      }, a.prototype.buildCastbetModel = function() {
        var i, s, a, n, o, r, l, c, u, p, d, b, h, f, m, S = this._betString.split("~");
        if (this.stype = this._betString.toUpperCase().slice(0, 1), this.cmask = this._betString.toUpperCase().slice(1, 2), this.ctype = this._betString.toUpperCase().slice(2, 3), this.valuelist = [], i = this._betString.toUpperCase().slice(0, 3), this.ttype = e.RacingBetslipModel.getToteType(i), this.mediaType = "", this.ctype == this.multiLeg) {
          for (s = [], a = 0, n = S.length; n > a; a++) {
            if (o = S[a], r = void 0, l = 0, 0 == a) {
              for (l = e.RacingBetslipModel.getLegCount(o.slice(0, 3)), o = o.slice(3), c = 0; l > c; c++) this.valuelist.push([]);
              r = o.split(","), s.push({
                fixtureId: r[9],
                count: 1
              }), this.c2ID = t.StringToNumber(r[4]), this.totemi = t.StringToNumber(r[5]), this.totemn = t.StringToNumber(r[0])
            } else {
              for (r = o.split(","), u = r[9], u = u.replace(";", ""), p = void 0, d = 0, b = s; d < b.length; d++)
                if (h = b[d], h.fixtureId === u) {
                  p = h;
                  break
                } p ? p.count++ : s.push({
                fixtureId: u,
                count: 1
              })
            }
            this.valuelist[t.StringToNumber(r[7]) - 1].push(r[6] + ":" + r[1] + ":" + r[2] + ":" + r[3])
          }
          for (f = 0, m = s; f < m.length; f++) h = m[f], this.fixid += h.fixtureId + "X" + h.count + ",";
          this.fixid = this.fixid.slice(0, this.fixid.length - 1), this.ctype = "S"
        } else
          for (this.fixid = S[0].slice(3), this.partType = "CB", a = 1, n = S.length; n > a; a++) this.valuelist.push(S[a].split(",")), this.id += 0 == this.id.length ? S[a] : "," + S[a]
      }, a.prototype.modelToBetString = function() {
        var e, t, s = this.getCastCode(),
          n = -1,
          o = "CB";
        switch (a.ForeignPoolsCodesLookup[s] ? (o = "TB", this.betStringType = i.NormalItems, n = 1) : a.ForeignExoticCodesLookup[s] ? (o = "CB", n = 2) : a.PotBetCastMasks.indexOf(this.cmask) > -1 && (o = "TB", n = 0), e = "pt=" + o + "#spt=" + this.stype + "#cm=" + this.cmask + "#ct=" + this.ctype + "#", e += null != this.c2ID ? "c2=" + this.c2ID + "#" : "f=" + this.fixid + "#", this.classificationID && (e += "c=" + this.classificationID + "#"), n) {
          case 1:
            e = this.buildForeignPoolsBetConstructs(e);
            break;
          case 2:
            e = this.buildForeignExoticBetConstructs(e);
            break;
          case 0:
            t = this.buildPotBetConstructs(e), e = t.join("||") + "||";
            break;
          default:
            e = this.buildCastBetConstructs(e)
        }
        return e
      }, a.prototype.buildPotBetConstructs = function(e) {
        var t, i, s, a, n;
        for (e += "tmn=" + this.totemn + "#tmi=" + this.totemi + "#c2=" + this.c2ID + "#", this.fixid && (e += "f=" + this.fixid + "#"), t = "", i = this.getValueList(), s = 0, a = i.length; a > s; s++) {
          for (n = 0; n < i[s].length; n++) t += i[s][n], n != i[s].length - 1 && (t += "-");
          s != a - 1 && (t += ",")
        }
        return e += "fp=" + t + "#", [e]
      }, a.prototype.buildCastBetConstructs = function(e) {
        var t, i, s, a = this.getValueList(),
          n = "|mt=" + this.mediaType + "#";
        for (this.toteCombination && (n += "atc=" + this.toteCombination + "#"), t = "fp=", i = 0, s = a.length; s > i; i++) a[i] && (t += a[i].join(","), i != s && a[i + 1] && (t += "~"));
        return e += "" + t + n
      }, a.prototype.buildForeignPoolsBetConstructs = function(e) {
        var t, i, s, a = this.getValueList(),
          n = "|mt=" + this.mediaType + "#";
        for (this.toteCombination && (n += "atc=" + this.toteCombination + "#"), t = "o=0/0#fp=", i = 0, s = a.length; s > i; i++) a[i] && (t += a[i].join(","));
        return e += "" + t + n
      }, a.prototype.buildForeignExoticBetConstructs = function(e) {
        var t, i, s, a, n, o, r = [],
          l = "|mt=" + this.mediaType + "#";
        if (this.toteCombination && (l += "atc=" + this.toteCombination + "#"), t = this.getValueList(), i = "fp=", "C" == this.ctype) {
          for (s = 0, a = t[0].length; a > s; s++) i += "" + t[0][s] + (s == a - 1 ? "" : ",");
          r.push("" + e + i + "#")
        } else
          for (n = this.getBetCombinations("", t), s = 0, a = n.length; a > s; s++) r.push("" + e + i + n[s] + "#" + l);
        return o = r.join("||") + "||"
      }, a.prototype.getBetCombinations = function(e, t) {
        var i, s, a, n = [],
          o = t[0];
        for (i = 0, s = o.length; s > i; i++) - 1 == e.indexOf(o[i]) && (a = e + ("" == e ? "" : ",") + o[i], t.length > 1 && t[1] ? n = n.concat(this.getBetCombinations(a, t.slice(1))) : n.push(a));
        return n
      }, a.prototype.key = function() {
        var e, t, i, s = "";
        for (e = 0, t = this.valuelist.length; t > e; e++) i = this.valuelist[e].join(","), s += i, e != t - 1 && (s += "~");
        return s
      }, a.PotBetCastMasks = ["4", "3", "2"], a.ForeignExoticCodesLookup = {
        JES: !0,
        J2C: !0,
        JEC: !0,
        J3C: !0,
        JTS: !0,
        JTC: !0,
        J4C: !0,
        JSS: !0,
        JSC: !0
      }, a.ForeignPoolsCodesLookup = {
        JDL: !0,
        JDW: !0,
        JDH: !0
      }, a
    }(ns_betslip.BetItem);
  e.RacingCastBetslipModel = s
}(ns_betslipcorelib_model || (ns_betslipcorelib_model = {})),
function(e) {
  var t = function() {
    function e(e) {
      this.selected = !1, this.initialSet = !0, this.classificationId = e.cl + "", this.fixtureId = e.fi, this.fixtureDescription = e.fd, e.ak && (this.alertKey = e.ak), e.t1 && (this.team1Id = e.t1), e.t2 && (this.team2Id = e.t2), e.ls && (this.selected = e.ls)
    }
    return e.prototype.setSelected = function() {
      this.headerdelegate && this.headerdelegate.addToSelectionCount(), this.initialSet = !1, this.uidelegate && this.uidelegate.setSelected(), this.selected = !0
    }, e.prototype.deselect = function() {
      this.initialSet ? this.initialSet = !1 : this.headerdelegate && this.headerdelegate.subtractFromSelectionCount(), this.uidelegate && this.uidelegate.deselect(), this.selected = !1
    }, e.prototype.getState = function() {
      return {
        cl: ns_gen5_util.MathUtil.StringToNumber(this.classificationId),
        fi: this.fixtureId,
        fd: this.fixtureDescription,
        ak: this.alertKey,
        t1: this.team1Id,
        t2: this.team2Id,
        ls: this.selected
      }
    }, e
  }();
  e.LiveAlertsFixture = t
}(ns_betslipcorelib_model || (ns_betslipcorelib_model = {})),
function(e) {
  var t = function() {
    function e() {
      this.changes = {}, Locator.validationManager.queueForValidation(this)
    }
    return e.prototype.validateNow = function(e) {
      this.propertiesInvalidated && (this.propertiesInvalidated = !1, this.commitProperties(), this.changes = {}), 0 != e && (this.validationState = 0)
    }, e.prototype.invalidateItems = function(e) {
      this.itemsInvalidated = !0, this.refreshSlipAction = e, this.invalidateProperties(null)
    }, e.prototype.invalidateProperties = function(e) {
      this.propertiesInvalidated = !0;
      for (var t in e) e[t] && (this.changes[t] = !0);
      1 != this.validationState && Locator.validationManager.queueForValidation(this)
    }, e
  }();
  e.ValidationModel = t
}(ns_betslipcorelib_model || (ns_betslipcorelib_model = {})),
function(e) {
  var t = function(e) {
    function t() {
      var i = e.call(this) || this;
      return t.AppModule ? i.document = t.AppModule.createNewBetslipDocument() : i.document = new ns_betslipcorelib_document.Document, i
    }
    return __extends(t, e), t.prototype.commitProperties = function() {}, t
  }(e.ValidationModel);
  e.SlipModel = t
}(ns_betslipcorelib_model || (ns_betslipcorelib_model = {})),
function(e) {
  var t = function() {
    function e(e, t) {
      this.winParts = e, this.placeParts = t
    }
    return e.prototype.hasPlaceParts = function() {
      return this.placeParts && this.placeParts.length > 0
    }, e
  }();
  e.BetBreakdownData = t
}(ns_betslipcorelib_model_betbreakdown || (ns_betslipcorelib_model_betbreakdown = {})),
function(e) {
  var t = function() {
    function e(e) {
      this.odds = e.od, this.selections = e.se, this.stake = e.st, this.returnValue = e.re
    }
    return e
  }();
  e.BetBreakdownItem = t
}(ns_betslipcorelib_model_betbreakdown || (ns_betslipcorelib_model_betbreakdown = {})),
function(e) {
  var t;
  ! function(e) {
    e.FixtureParticipantID = "pi", e.FixtureId = "fi", e.FixtureDescription = "fd", e.ToteDescription = "td", e.BetSlipDisplay = "bd", e.AdditionalDisplay = "ad", e.Handicap = "ha", e.DisplayHandicap = "hd", e.HandicapChanged = "hc", e.MarketDescription = "md", e.PlaceRatio = "po", e.PlaceCount = "pc", e.Odds = "od", e.Topic = "tp", e.ToteData = "td", e.ToteLegNumber = "ln", e.ToteRaceNumber = "rn", e.WinParticipantId = "wp", e.PlaceParticipantId = "pp", e.PlaceParticipantOdds = "po", e.SplitIndex = "ix", e.GroupDescription = "gh", e.TeaserBuySell = "tc", e.TeaserCardId = "c2", e.ChangeCard = "cc", e.BetBuilder = "bb"
  }(t = e.ParticipantAttribute || (e.ParticipantAttribute = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t = ns_betslip.BetItem,
    i = function() {
      function e() {}
      return e.ParseBetStringToBetItem = function(i) {
        var s, a, n, o, r, l = new t;
        for (l.constructString = i, i = i.replace("il=", ""), s = i.split("#"), a = 0, n = s.length; n > a; a++) o = s[a], r = o.split("="), 2 == r.length && (l = e.ProcessPart(r, l));
        return l
      }, e.ProcessPart = function(e, t) {
        var i, s = e[0];
        if (s) switch (i = e[1], s.toLowerCase()) {
          case "pt":
            t.partType = i;
            break;
          case "o":
            t.odds = i;
            break;
          case "f":
            t.fixtureID = i;
            break;
          case "fp":
            t.participantID = i;
            break;
          case "c":
            t.classificationID = i;
            break;
          case "ln":
            t.handicap = i;
            break;
          case "inc":
            t.baseHandicap = i;
            break;
          case "bodds":
            t.baseOdds = i;
            break;
          case "mt":
            t.betsource = i;
            break;
          case "oto":
            t.oddsTypeOverride = +i;
            break;
          case "id":
            t.uid = i;
            break;
          case "pid":
            t.playerID = i;
            break;
          case "mid":
            t.matchId = i;
            break;
          case "atc":
            t.toteCombination = i;
            break;
          case "spt":
            t.stype = i;
            break;
          case "cm":
            t.cmask = i;
            break;
          case "ct":
            t.ctype = i;
            break;
          case "tp":
            i && (t.subscribe = !0)
        }
        return t
      }, e
    }();
  e.BetStringParser = i
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t = ns_betslipcorelib_constants.BetStringType,
    i = ns_betslipcorelib_data.SlipType,
    s = ns_gen5_util.CookieManager,
    a = function() {
      function e() {}
      return e.RegisterStateDelegate = function(e) {
        this.SaveBetstringDelegates.push(e)
      }, e.Save = function(t, i, s, a) {
        var n, o;
        if (e.Normals = t, e.Casts = i, e.Multiples = s, e.AdditionalData = a, n = "bt=" + this.GetBetslipType(), a && (n += "&" + a), t && (n += "&ns=" + t), i && (n += "&cs=" + i), s && (n += "&ms=" + s), window.safeSessionStorage.setItem("betstring", n), this.SaveBetstringDelegates.length > 0)
          for (o = 0; o < this.SaveBetstringDelegates.length; o++) this.SaveBetstringDelegates[o]()
      }, e.GetNormalString = function() {
        return e.Normals
      }, e.GetCastString = function() {
        return e.Casts
      }, e.GetMultipleString = function() {
        return e.Multiples
      }, e.GetAdditionalData = function() {
        return e.AdditionalData
      }, e.UpdateBetslipType = function(t) {
        e.BetSlipType = t, e.Save(e.Normals, e.Casts, e.Multiples, e.AdditionalData)
      }, e.GetBetslipType = function() {
        return e.BetSlipType || i.Standard
      }, e.HasBetCallBet = function() {
        return !!(e.Normals && e.Normals.indexOf("pom=Y") > -1)
      }, e.AddPushBetId = function(t) {
        var i = window.safeSessionStorage.getItem(e.PushBetPopupStatus) || "";
        i && -1 !== i.split("|").indexOf(t) || window.safeSessionStorage.setItem(e.PushBetPopupStatus, i + t + "|")
      }, e.GetPushBetId = function(t) {
        var i = window.safeSessionStorage.getItem(e.PushBetPopupStatus) || "";
        return i ? (i.split("|"), i.indexOf(t) > -1) : !1
      }, e.DeletePushBetId = function(t) {
        var i, s, a = window.safeSessionStorage.getItem(e.PushBetPopupStatus) || "";
        a && (i = a.split("|"), s = i.indexOf(t), s > -1 && (i.splice(s, 1), window.safeSessionStorage.setItem(e.PushBetPopupStatus, i.join("|"))))
      }, e.SaveUseBetCredits = function(e) {
        window.safeSessionStorage.setItem(t.UsebetCredits, e)
      }, e.GetUseBetCredits = function() {
        return !!window.safeSessionStorage.getItem(t.UsebetCredits)
      }, e.GetNormalsCount = function() {
        return this.GetCount(e.Normals)
      }, e.GetCastCount = function() {
        return this.GetCount(e.Casts)
      }, e.GetBetCount = function() {
        return this.GetNormalsCount() + this.GetCastCount()
      }, e.GetItems = function(e) {
        return e && "" != e ? e.indexOf("||") > -1 ? e.split("||") : [e] : []
      }, e.GetCount = function(e) {
        return e && "||" != e && e ? (e = e.replace("||||", "||"), e.indexOf("||") > -1 ? e.split("||").length - 1 : 1) : 0
      }, e.SetQuickBetActive = function() {
        e.QuickBetActive = !0
      }, e.SetQuickBetInactive = function() {
        e.QuickBetActive = !1
      }, e.GetQuickBetActive = function() {
        return e.QuickBetActive
      }, e.Clear = function() {
        window.safeSessionStorage.setItem("betstring", ""), e.Normals = null, e.Multiples = null, e.Casts = null, e.AdditionalData = null
      }, e.Restore = function() {
        var t, i, a, n, o, r = window.safeSessionStorage.getItem("betstring"),
          l = s.GetCookieValue("bs");
        if (l && l.indexOf("pt=") > -1 && l.indexOf("o=") > -1 && l.indexOf("f=") > -1 && l.indexOf("fp=") > -1 && (r = l, window.safeSessionStorage.setItem("betstring", "bs=&" + r), s.SetCookieValue("bs", "", "")), e.Normals = "", e.Multiples = "", e.Casts = "", e.AdditionalData = "", r)
          for (t = r.split("&"), i = 0, a = t; i < a.length; i++) switch (n = a[i], o = n.split("="), o[0]) {
            case "bt":
              e.BetSlipType = +o[1];
              break;
            case "ns":
              e.Normals = n.replace("ns=", "");
              break;
            case "ms":
              e.Multiples = n.replace("ms=", "");
              break;
            case "cs":
              e.Casts = n.replace("cs=", "");
              break;
            default:
              n && (e.AdditionalData += "&" + n)
          }
      }, e.GetCastKeys = function() {
        var t, i, s, a, n, o = [],
          r = e.Casts.split("||"),
          l = function(e) {
            var t, i, s, a = "";
            for (t = 0, i = e.length; i > t; t++) s = e[t], s.indexOf("fp=") > -1 && (a = s.split("=")[1]);
            return a
          };
        for (t = 0, i = r.length; i > t; t++) s = r[t], s && (a = "", n = s.split("#"), a = l(n), a && o.push(a));
        return o
      }, e.GetKeys = function() {
        var t, i, s, a, n, o, r, l, c;
        for (e.Restore(), t = [], i = e.Normals.split("||"), s = function(e) {
            var t, i, s, a = "",
              n = "",
              o = "";
            for (t = 0, i = e.length; i > t; t++) s = e[t], s.indexOf("f=") > -1 ? n = s.split("=")[1] : s.indexOf("fp=") > -1 && (o = s.split("=")[1]);
            return n && o && (a = n + "-" + o), a
          }, a = function(e) {
            var t, i, s, a = "",
              n = "",
              o = "";
            for (t = 0, i = e.length; i > t; t++) s = e[t], s.indexOf("pid=") > -1 ? n = s.split("=")[1] : s.indexOf("mid=") > -1 && (o = s.split("=")[1]);
            return n && o && (a = n + ":" + o), a
          }, n = 0, o = i.length; o > n; n++) r = i[n], r && (l = "", c = r.split("#"),
          l = r.toLowerCase().indexOf("pt=s") > -1 ? a(c) : s(c), l && t.push(l));
        return t
      }, e.PushBetPopupStatus = "italyPushBetPopupStatus", e.SaveBetstringDelegates = [], e
    }();
  e.StorageHelper = a, a.Restore()
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t = function() {
    function e() {}
    return e.CalculateCombinations = function(e, t) {
      var i, s, a, n = [],
        o = t[0];
      for (i = 0, s = o.length; s > i; i++) - 1 == e.indexOf(o[i]) && (a = e + ("" == e ? "" : ",") + o[i], t.length > 1 && t[1] ? n = n.concat(this.CalculateCombinations(a, t.slice(1))) : n.push(a));
      return n
    }, e.CombinationsValid = function(e, t) {
      return !(e > this.MAXIMUM_COMBINATIONS_PERMITTED || t > this.MAXIMUM_BETSTRING_LENGTH)
    }, e.MAXIMUM_COMBINATIONS_PERMITTED = 4096, e.MAXIMUM_BETSTRING_LENGTH = 1500, e
  }();
  e.BetCombinations = t
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t;
  ! function(e) {
    e.NormalBet = "N", e.EachwayBet = "EW", e.EwexBet = "EX", e.NoReservesBet = "NR", e.PitcherBet = "PB", e.ScorecastBet = "S", e.CastBet = "CB", e.AutoVoidBet = "AV", e.BetBuilder = "BB", e.ForeignPoolsBet = "FP", e.ForeignExoticBet = "FE", e.ToteBet = "T", e.MultiLegBet = "ML", e.ExoticBet = "E", e.ItalianExoticBet = "IE", e.AusToteBet = "A", e.ItalyRacingBet = "A", e.AusMultiLegBet = "AM", e.AusExoticBet = "AE", e.AusRacingBet = "AR", e.BetCallBet = "BC", e.None = ""
  }(t = e.BetTypeLookupKey || (e.BetTypeLookupKey = {}))
}(ns_betslipcorelib_constants || (ns_betslipcorelib_constants = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.InProgress = -10] = "InProgress", e[e.None = 0] = "None", e[e.Betslip = 1] = "Betslip", e[e.BetslipError = 2] = "BetslipError", e[e.BetReceipt = 3] = "BetReceipt", e[e.BetConfirm = 4] = "BetConfirm", e[e.BetPolling = 5] = "BetPolling", e[e.BetMax = 6] = "BetMax", e[e.BetReferral = 7] = "BetReferral", e[e.CallToPlace = 8] = "CallToPlace", e[e.ItalyBetAccepted = 9] = "ItalyBetAccepted", e[e.ItalyBetRejected = 10] = "ItalyBetRejected", e[e.BetReferralPolling = 11] = "BetReferralPolling", e[e.TempReceiptPolling = 12] = "TempReceiptPolling"
  }(t = e.SlipCurrentState || (e.SlipCurrentState = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t = ns_gen5_util.OddsConverter,
    i = ns_gen5_util.OddsType,
    s = ns_betslipcorelib_constants.OddsTypeOverride,
    a = function() {
      function e() {}
      return e.FormatOdds = function(a, n, o) {
        var r, l = o == s.ASIAN,
          c = o == s.FRACTIONAL;
        return "0/0" === a || "" === a || "0/1" === a ? n : Locator.user.oddsTypeId == i.AMERICANFRACTIONAL && c ? a : Locator.user.oddsTypeId == i.DECIMAL || l || o == i.DECIMAL ? (r = e.DefaultDecimalPlaces, l && (r = e.DefaultAsianDecimalPlaces), t.ConvertOddsDecimal(a, r)) : Locator.user.oddsTypeId == i.AMERICAN || Locator.user.oddsTypeId == i.AMERICANFRACTIONAL ? t.ConvertOddsUS(a) : a
      }, e.DefaultDecimalPlaces = 2, e.DefaultAsianDecimalPlaces = 3, e
    }();
  e.OddsFormatter = a
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t = function() {
    function e() {}
    return e.GetOrdinalIndicator = function(e) {
      var t = e + "";
      switch (Locator.user.languageId + "") {
        case "1":
          if ("11" == t.slice(-2) || "12" == t.slice(-2) || "13" == t.slice(-2)) t += "th";
          else switch (t.slice(-1)) {
            case "1":
              t += "st";
              break;
            case "2":
              t += "nd";
              break;
            case "3":
              t += "rd";
              break;
            default:
              t += "th"
          }
          break;
        case "8":
          t += "1" != t.slice(-1) && "2" != t.slice(-1) || "11" == t.slice(-2) || "12" == t.slice(-2) ? ":e" : ":a"
      }
      return t
    }, e
  }();
  e.OrdinalUtil = t
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t;
  ! function(e) {
    e.BetTypeId = "bt", e.PartType = "pf", e.BetBuilderIndicator = "bb", e.BetReference = "br", e.SlipResult = "sr", e.PlaceBetResult = "pr", e.ItalyADMReference = "ar", e.Stake = "st", e.ValidStakes = "vs", e.TotalStake = "ts", e.EachWayAvailable = "ea", e.EachWayTerms = "et", e.EachWayPlaceDivider = "ed", e.EachWay = "ew", e.EwexAvailable = "ex", e.EWEX = "ee", e.MaximumStake = "ms", e.ReferralAmount = "ra", e.ReferralPlaceAmount = "rp", e.ReferralAmountApproved = "aa", e.ReferralAmountRejected = "rr", e.ToReturn = "re", e.RecalculatedStake = "rs", e.BetCreditStake = "bc", e.FreeBetToken = "ft", e.FreeBetAmount = "fb", e.FreeBetTokenSelected = "fs", e.Odds = "od", e.DisplayOdds = "do", e.FixtureID = "fi", e.FixtureDescription = "fd", e.IfBetDescription = "id", e.PitcherDescription = "pd", e.Participants = "pt", e.IfBetAction = "ac", e.BaseballPitcher = "bp", e.SelectedPitcher = "sp", e.AusBetTypes = "ab", e.Suspended = "su", e.Classification = "cl", e.SeconaryClassification = "cs", e.OddsHash = "sa", e.TopicId = "tp", e.OddsChanged = "oc", e.ForceEachWay = "fe", e.OfferSPOdds = "os", e.SPOddsSelected = "ss", e.MediaType = "mt", e.NoReserves = "nr", e.NoReservesAvailable = "na", e.MultiplesRestricted = "mr", e.AutoVoid = "av", e.AutoVoidAvailable = "va", e.OddsTypeOverride = "oo", e.FreeBetQualifiedAmount = "fa", e.FreeBetQualifiedStatus = "fq", e.CastType = "ct", e.CastMask = "cm", e.SportType = "sk", e.MarketDescription = "md", e.CastBetCount = "cc", e.ToteMeetingId = "ti", e.ToteMeetingNumber = "tn", e.ToteLegId = "li", e.PlayerId = "pi", e.MatchId = "mi", e.TempReceiptReference = "tr", e.TempReceiptStatus = "te", e.PushStatus = "ps", e.ApplyTolerence = "at", e.AusToteOfferId = "ao", e.AusDropdownAvailable = "dd", e.AusRacingBetType = "rt", e.AusCombination = "ac", e.QuickCode = "qc", e.ItalianBetType = "it", e.Protocol = "pr", e.SplitIndex = "ix", e.Excluded = "xc", e.OfferBadges = "ob", e.EnhancedPrices = "ep", e.BankerSelected = "bk", e.ExcludeFromReceipt = "er", e.MinimumStake = "mn", e.PennyWagering = "pw", e.MultiMin = "mm", e.StakeMultiple = "sm", e.ItalyComplementarePlaceOdds = "eo", e.ItalyComplementarePlaceParticipant = "ic", e.IsBetCall = "ib", e.LeagueCode = "lc"
  }(t = e.BetAttribute || (e.BetAttribute = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t;
  ! function(e) {
    e.BetTypeId = "bt", e.Stake = "st", e.TotalStake = "ts", e.BetCount = "bc", e.MaximumStake = "ms", e.ReferralAmount = "ra", e.ReferralAmountApproved = "aa", e.ReferralAmountRejected = "rr", e.ReferralPlaceAmount = "rp", e.ToReturn = "re", e.RecalculatedStake = "rs", e.Odds = "od", e.BetSlipDisplay = "bd", e.EachWay = "ew", e.EachWayAvailable = "ea", e.BetCreditStake = "fb", e.SlipResult = "sr", e.CastBet = "cb", e.TempReceiptReference = "tr", e.BetReference = "br", e.SplitIndex = "ix", e.ItalianBetType = "it", e.TeaserPayout = "tp", e.AccumulatorPercentage = "ap", e.MaxBonus = "ma"
  }(t = e.MultipleAttribute || (e.MultipleAttribute = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t = ns_betslipcorelib_data.MultipleAttribute,
    i = function() {
      function e() {
        this.data = {}
      }
      return e.prototype.setDelegate = function(e) {
        this.modelDelegate = e
      }, e.Key = function(e) {
        var i = e[t.SplitIndex] ? "-" + e[t.SplitIndex] : "";
        return "" + e[t.BetTypeId] + i
      }, e.prototype.key = function() {
        return e.Key(this.data)
      }, e.prototype.update = function(e) {
        var t, i, s = {};
        for (t in this.data) i = t, e[i] && e[i] === this.data[i] || (s[i] = !0);
        for (t in e) i = t, s[i] || this.data && e[i] === this.data[i] || (s[i] = !0);
        this.data = e, this.modelDelegate.multipleUpdated(s)
      }, e.prototype.merge = function(e) {
        var t, i, s = {};
        for (t in e) i = t, this.data && e[i] === this.data[i] || (s[i] = !0, this.data[i] = e[i]);
        this.modelDelegate.multipleUpdated(s)
      }, e.prototype.remove = function() {
        this.modelDelegate.multipleRemoved()
      }, e.prototype.get = function(e) {
        return this.data[e]
      }, e.prototype.set = function(e, t) {
        var i = this;
        this.changes || (Locator.validationManager.callLater(function() {
          i.modelDelegate.multipleUpdated(i.changes), i.changes = null
        }), this.changes = {}), this.changes[e] = !0, this.data[e] = t
      }, e
    }();
  e.MultipleOption = i
}(ns_betslipcorelib_document || (ns_betslipcorelib_document = {})),
function(e) {
  var t = ns_betslipcorelib_data.BetAttribute,
    i = ns_betslipcorelib_data.ParticipantAttribute,
    s = ns_betslipcorelib_constants.CastSportType,
    a = function() {
      function a(e) {
        this.documentDelegate = e, this.data = {}, this.participants = []
      }
      return a.prototype.setDelegate = function(e) {
        this.delegate = e
      }, a.Key = function(e) {
        var s, n, o, r, l;
        if (e[t.CastMask]) return a.IsMultiLegBetKeyRequired(e[t.SportType], e[t.CastMask], e[t.CastType]) ? a.MultiLegBetKey(e) : (s = a.CastBetKey(e), e[t.SplitIndex] && (s += "-" + e[t.SplitIndex]), s);
        if (e[t.PlayerId]) return e[t.FixtureID] + "-" + e[t.PlayerId] + ":" + e[t.MatchId];
        if (n = "" + (e[t.FixtureID] || ""), !e[t.Participants]) return n;
        for (n += "-", o = 0, r = e[t.Participants]; o < r.length; o++) l = r[o], n += l[i.FixtureParticipantID], l[i.WinParticipantId] && (n += "" + l[i.WinParticipantId] + l[i.PlaceParticipantId]);
        return e[t.SplitIndex] && (n += "-" + e[t.SplitIndex]), e[t.LeagueCode] && (n = e[t.LeagueCode] + "-" + n), n
      }, a.IsMultiLegBetKeyRequired = function(e, t, i) {
        return e === s.Colossus ? "P" === i : a.PotBetCastMasks.indexOf(t) > -1 && a.PotBetSportTypes.indexOf(e) > -1
      }, a.CastBetKey = function(e) {
        var s, a, n, o = e[t.FixtureID] + "-",
          r = e[t.Participants];
        for (s = 0, a = r; s < a.length; s++) n = a[s], o += n[i.FixtureParticipantID];
        return o += e[t.CastMask], o += e[t.CastType]
      }, a.MultiLegBetKey = function(e) {
        var s, a, n, o, r, l, c, u = "";
        for (s = 0, a = e[t.Participants]; s < a.length; s++)
          for (n = a[s], o = n[i.ToteData].split("|"), r = 0, l = o; r < l.length; r++) c = l[r], u += c.split("#")[2];
        return u
      }, a.prototype.key = function() {
        return a.Key(this.data)
      }, a.prototype.update = function(i) {
        var s, a, n, o, r, l, c, u, p, d, b, h, f, m, S = {};
        for (s in i) a = s, this.data && i[a] === this.data[a] || (S[a] = !0);
        if (n = {}, o = [], this.participants.length)
          for (r = 0, l = this.participants; r < l.length; r++) c = l[r], n[c.key()] = c;
        for (u = 0, p = i[t.Participants]; u < p.length; u++) d = p[u], b = e.Participant.Key(d), h = n[b], h ? (h.update(d), o.push(b)) : (f = new e.Participant(this), this.delegate.participantInserted(f), f.update(d), this.participants.splice(u, 0, f));
        for (u = o.length - 1; u >= 0; u--) b = o[u], m = n[b], m && delete n[b];
        for (u = this.participants.length - 1; u >= 0; u--) c = this.participants[u], n[c.key()] && this.participants.splice(u, 1);
        this.data = i, this.delegate.betUpdated(S)
      }, a.prototype.merge = function(e) {
        var i, s, a, n, o = {};
        for (i in e)
          if (s = i, s == t.Participants)
            for (a = 0, n = e[t.Participants]; a < n.length; a++) this.participants[a].merge(n[a]);
          else this.data && e[s] === this.data[s] || (o[s] = !0, this.data[s] = e[s]);
        this.delegate.betUpdated(o)
      }, a.prototype.getDataKeys = function() {
        var e, t = {};
        for (e in this.data) t[e] = !0;
        return t
      }, a.prototype.remove = function() {
        this.delegate.betRemoved()
      }, a.prototype.participantKeyUpdated = function() {
        this.documentDelegate.betKeyUpdated(this)
      }, a.prototype.get = function(e) {
        return this.data[e]
      }, a.prototype.set = function(e, i) {
        var s = this;
        this.changes || (Locator.validationManager.callLater(function() {
          s.delegate.betUpdated(s.changes), s.changes = null
        }), this.changes = {}), e == t.FixtureID && this.documentDelegate.betKeyUpdated(this), this.changes[e] = !0, this.data[e] = i
      }, a.PotBetCastMasks = ["P", "U", "J", "2", "3", "4", "6", "9"], a.PotBetSportTypes = [s.UkToteRacing, s.AusRacing, s.USToteRacing], a
    }();
  e.Bet = a
}(ns_betslipcorelib_document || (ns_betslipcorelib_document = {})),
function(e) {
  var t = e.BetAttribute,
    i = ns_betslipcorelib_document.Bet,
    s = ns_betslipcorelib_constants.BetTypeLookupKey,
    a = function() {
      function e(e) {
        this.betTypeLookupKey = s.None, this.castCode = "", this.addToNormals = !1, this.key = i.Key(e), this.betTypeId = e[t.BetTypeId], this.scorecastBet = "S" == e[t.PartType], this.normalBet = "N" == e[t.PartType], this.partType = e[t.PartType], this.betBuilderIndicator = e[t.BetBuilderIndicator], this.eachWayAvailable = e[t.EachWayAvailable], this.ewexAvailable = e[t.EwexAvailable], this.baseballPitcher = e[t.BaseballPitcher], this.noReserves = e[t.NoReservesAvailable], this.autoVoid = e[t.AutoVoidAvailable], this.castMask = e[t.CastMask], this.castType = e[t.CastType], this.sportType = e[t.SportType], this.ausDropdownAvailable = e[t.AusDropdownAvailable], this.isBetCallBet = e[t.QuickCode] && "" != e[t.QuickCode] || e[t.IsBetCall], this.isBetCallBet ? (this.betTypeLookupKey = s.BetCallBet, this.addToNormals = !0) : this.scorecastBet ? (this.betTypeLookupKey = s.ScorecastBet, this.addToNormals = !0) : this.betBuilderIndicator ? (this.betTypeLookupKey = s.BetBuilder, this.addToNormals = !0) : this.ausDropdownAvailable ? (this.betTypeLookupKey = s.AusRacingBet, this.addToNormals = !0) : !this.eachWayAvailable || this.noReserves || this.autoVoid ? this.ewexAvailable ? (this.betTypeLookupKey = s.EwexBet, this.addToNormals = !0) : this.baseballPitcher ? (this.betTypeLookupKey = s.PitcherBet, this.addToNormals = !0) : this.noReserves ? (this.betTypeLookupKey = s.NoReservesBet, this.addToNormals = !0) : this.autoVoid ? (this.betTypeLookupKey = s.AutoVoidBet, this.addToNormals = !0) : "J" == this.sportType && "D" == this.castMask ? (this.betTypeLookupKey = s.ForeignPoolsBet, this.addToNormals = !0) : "A" == this.partType ? (this.betTypeLookupKey = s.AusToteBet, this.addToNormals = !0) : this.normalBet && (this.betTypeLookupKey = s.NormalBet, this.addToNormals = !0) : (this.betTypeLookupKey = s.EachwayBet, this.addToNormals = !0), this.sportType && (this.castCode = "" + this.sportType + this.castMask + this.castType)
      }
      return e
    }();
  e.BetInfo = a
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {})),
function(e) {
  var t = ns_betslipcorelib_data.MultipleAttribute,
    i = ns_betslipcorelib_data.BetDocumentAttribute,
    s = e.MultipleOption,
    a = ns_betslipcorelib_data.BetInfo,
    n = function() {
      function n() {
        this.data = {}, this.bets = {}, this.castBets = {}, this.multiples = {}, this.disposing = !1
      }
      return n.prototype.setDelegate = function(e) {
        this.delegate = e
      }, n.prototype.betKeyUpdated = function(e) {
        var t, i, s;
        for (t in this.bets)
          if (this.bets[t] == e) return i = t, s = e.key(), delete this.bets[i], void(this.bets[s] = e);
        for (t in this.castBets)
          if (this.castBets[t] == e) return i = t, s = e.key(), delete this.castBets[i], void(this.castBets[s] = e)
      }, n.prototype.update = function(n) {
        var o, r, l, c, u, p, d, b, h, f, m, S, B, g, _, T, y, C, I, v = {};
        for (o in n) r = o, this.data && JSON.stringify(n[r]) === JSON.stringify(this.data[r]) || (v[r] = !0);
        if (i.SessionExpired in v) return void this.delegate.documentUpdated(v);
        l = {};
        for (c in this.bets) u = this.bets[c], u.key() && (l[u.key()] = u);
        if (n[i.BetObjects])
          for (p = 0, d = n[i.BetObjects]; p < d.length; p++)
            if (b = d[p], c = e.Bet.Key(b), u = l[c]) delete l[c], u.update(b);
            else {
              if (h = new e.Bet(this), f = new a(b), this.bets[c] = h, !this.delegate.documentBetInserted(h, f)) return;
              h.update(b)
            } m = {};
        for (c in this.castBets) u = this.castBets[c], u.key() && (m[u.key()] = u);
        if (n[i.CastObjects])
          for (p = 0, d = n[i.CastObjects]; p < d.length; p++)
            if (b = d[p], c = e.Bet.Key(b), u = m[c]) delete m[c], u.update(b);
            else {
              if (h = new e.Bet(this), f = new a(b), this.castBets[c] = h, !this.delegate.documentBetInserted(h, f)) return;
              h.update(b)
            } S = n[i.DefaultMultiple], S ? (this.defaultMultiple || (B = this.defaultMultiple = new s, this.delegate.documentDefaultMultipleInserted(B, S[t.CastBet])), this.defaultMultiple.update(S)) : this.defaultMultiple && (this.defaultMultiple.remove(), this.defaultMultiple = null), g = {};
        for (c in this.multiples) c && (g[c] = this.multiples[c]);
        if (_ = n[i.MultipleOptions])
          for (T = !1, p = 0; p < _.length; p++) y = _[p], c = s.Key(y), C = g[c], C && T && (C.update(y), delete g[c], C = null, this.multiples[c].remove(), delete this.multiples[c]), C ? (C.update(y), delete g[c]) : (I = new s, this.multiples[c] = I, this.delegate.documentMultipleInserted(I, y[t.CastBet]), I.update(y), T || (T = !0));
        for (c in l) this.bets[c].remove(), delete this.bets[c];
        for (c in g) this.multiples[c].remove(), delete this.multiples[c];
        for (c in m) this.castBets[c].remove(), delete this.castBets[c];
        this.data = n, this.delegate.documentUpdated(v)
      }, n.prototype.merge = function(t) {
        var a, n, o, r, l, c, u, p, d, b, h, f, m, S, B;
        for (a in t)
          if (a == i.LiveAlerts) this.delegate.liveAlertsDataReceived(t[a]);
          else if (a == i.BetObjects)
          for (n = 0, o = t[i.BetObjects]; n < o.length; n++)
            if (r = e.Bet.Key(o[n]), l = this.bets[r]) l.merge(o[n]);
            else {
              c = [], u = [];
              for (p in this.bets) c.push(p);
              for (d in o) u.push(d);
              b = JSON.stringify({
                MissingKey: r,
                NewBetCount: o.length,
                ClientBets: c,
                ServerBets: u
              }), ErrorReporter.Trace(this, "Descrepancy in bets within local storage compared to Bets.WebAPI response", b)
            }
        else if (a == i.MultipleOptions)
          for (n = 0, h = t[i.MultipleOptions]; n < h.length; n++) f = s.Key(h[n]), this.defaultMultiple && this.defaultMultiple.key() == f ? this.defaultMultiple.merge(h[n]) : (m = this.multiples[f], m && m.merge(h[n]));
        else if (a == i.DefaultMultiple) this.defaultMultiple.merge(t[a]);
        else if (a == i.CastObjects)
          for (n = 0, o = t[i.CastObjects]; n < o.length; n++) S = e.Bet.Key(o[n]), this.castBets[S].merge(o[n]);
        else B = a, this.set(B, t[B])
      }, n.prototype.getDataKeys = function() {
        var e, t = {};
        for (e in this.data) t[e] = !0;
        return t
      }, n.prototype.removeBet = function(e) {
        this.bets[e] ? (this.bets[e].remove(), delete this.bets[e]) : this.castBets[e] && (this.castBets[e].remove(), delete this.castBets[e])
      }, n.prototype.removeMultiple = function(e) {
        this.multiples[e] && (this.multiples[e].remove(), delete this.multiples[e])
      }, n.prototype.clear = function() {
        this.disposing = !0, this.update({})
      }, n.prototype.get = function(e) {
        return this.data[e]
      }, n.prototype.set = function(e, t) {
        var i = this;
        this.changes || (Locator.validationManager.callLater(function() {
          i.delegate.documentUpdated(i.changes), i.changes = null
        }), this.changes = {}), this.changes[e] = !0, this.data[e] = t
      }, n
    }();
  e.Document = n
}(ns_betslipcorelib_document || (ns_betslipcorelib_document = {})),
function(e) {
  var t = ns_betslipcorelib_data.ParticipantAttribute,
    i = function() {
      function e(e) {
        this.betDelegate = e, this.data = {}
      }
      return e.Key = function(e) {
        return t.PlaceRatio in e && t.FixtureParticipantID in e && t.BetSlipDisplay in e ? e[t.PlaceRatio] + "#" + e[t.FixtureParticipantID] + e[t.BetSlipDisplay] : t.BetBuilder in e && t.FixtureParticipantID in e && t.MarketDescription in e ? "BB#" + e[t.FixtureParticipantID] + "#" + e[t.FixtureId] : t.FixtureParticipantID in e && t.BetSlipDisplay in e ? "" + e[t.FixtureParticipantID] + e[t.BetSlipDisplay] : e[t.FixtureId] + ""
      }, e.prototype.key = function() {
        return e.Key(this.data)
      }, e.prototype.setDelegate = function(e) {
        this.delegate = e
      }, e.prototype.update = function(e) {
        var t, i, s = {};
        for (t in e) i = t, this.data && e[i] === this.data[i] || (s[i] = !0);
        this.data = e, this.delegate.participantUpdated(s)
      }, e.prototype.merge = function(e) {
        var t, i, s = {};
        for (t in e) i = t, this.data && e[i] === this.data[i] || (s[i] = !0, this.data[i] = e[i]);
        this.delegate.participantUpdated(s)
      }, e.prototype.getDataKeys = function() {
        var e, t = {};
        for (e in this.data) t[e] = !0;
        return t
      }, e.prototype.get = function(e) {
        return this.data[e]
      }, e.prototype.set = function(e, i) {
        var s = this;
        this.changes || (Locator.validationManager.callLater(function() {
          s.delegate.participantUpdated(s.changes), s.changes = null
        }), this.changes = {}), this.changes[e] = !0, this.data[e] = i, e != t.FixtureParticipantID && e != t.ToteData || this.betDelegate.participantKeyUpdated()
      }, e
    }();
  e.Participant = i
}(ns_betslipcorelib_document || (ns_betslipcorelib_document = {})),
function(e) {
  var t = function() {
    function e(e) {
      this.queueSize = 0, this.queueItemsComplete = 0, this.timeOutValue = e ? e : 3e3
    }
    return e.prototype.add = function() {
      this.queueSize++
    }, e.prototype.done = function() {
      this.queueItemsComplete++
    }, e.prototype.flush = function() {
      this.queueSize = 0, this.queueItemsComplete = 0
    }, e.prototype.wait = function(e) {
      var t = this;
      return Locator.validationManager.callNewContext(function() {
        return t.queueSize == t.queueItemsComplete ? (clearTimeout(t.timeout), t.queueSize = 0, t.queueItemsComplete = 0, e()) : void t.wait(e)
      }), 0 == this.queueSize ? e() : void(this.timeout = setTimeout(function() {
        t.queueSize > t.queueItemsComplete || (t.queueSize = 0, t.queueItemsComplete = 0)
      }, this.timeOutValue))
    }, e
  }();
  e.WaitGroup = t
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t = e.StorageHelper,
    i = ns_webconsolelib_util.Browser,
    s = ns_weblib_util.WebsiteConfig,
    a = ns_gen5_net.NSTLoader,
    n = ns_webconsolelib_util.SessionBetPreferences,
    o = ns_sitepreferenceslib_util.UserPreferences,
    r = ns_gen5_util.Date365,
    l = ns_gen5_util_logging.CounterLogger,
    c = function() {
      function e() {}
      return e.Abort = function(t) {
        e.CurrentLoader && (e.CurrentLoader.completeHandler = null, e.CurrentLoader.errorHandler = null, e.CurrentLoader = null, t && t())
      }, e.SuppressRasCall = function() {
        this.SuppressRas = !0
      }, e.AddBet = function(e) {
        this.MakeApiReqiest("addbet", e)
      }, e.RemoveBet = function(e) {
        this.MakeApiReqiest("removebet", e)
      }, e.RefreshSlip = function(e) {
        this.MakeApiReqiest("refreshslip", e)
      }, e.MakeApiReqiest = function(i, s) {
        var n, o;
        e.CurrentLoader && (e.CurrentLoader.completeHandler = null, e.CurrentLoader.errorHandler = null), n = e.CurrentLoader = new a, o = "", s.normals && (o += "&ns=" + encodeURIComponent(s.normals)), s.multiples && (o += "&ms=" + encodeURIComponent(s.multiples)), s.casts && (o += "&cs=" + s.casts), s.additionalData && (o += "&" + s.additionalData), o += "&betsource=" + this.GetBetSource(), o += "&bs=" + t.GetBetslipType(), t.GetQuickBetActive() && 1 == t.GetBetCount() && (o += "&qb=1"), e.SuppressRas || (o += "&cr=1"), e.SuppressRas = !1, n.completeHandler = function(t) {
          s.completeHandler(JSON.parse(t)), e.CurrentLoader = null
        }, n.errorHandler = function(t) {
          0 !== t && (e.CurrentLoader = null, s.errorHandler && s.errorHandler())
        }, this.Load(n, this.GetApiRoot() + "/" + i, {
          method: "POST",
          data: o,
          contentType: "application/x-www-form-urlencoded"
        })
      }, e.GetBetSource = function() {
        var t = appLib("BetslipCoreLibApp");
        return t ? this.BetSource = t.getBetSource() : s.IS_INSTANT_BET ? this.BetSource = "MobileInstantBet" : (i.addMouseModeDelegate(e.MouseModeDelegate), this.BetSource = e.MouseMode ? "FlashInPLay" : i.getDeviceStylePrefix() == i.TABLET_DEVICE_PREFIX ? "Lite" : "MobileHiEnd", i.removeMouseModeDelegate(e.MouseModeDelegate)), this.BetSource
      }, e.Load = function(e, t, i) {
        e.load(t, i)
      }, e.GetApiRoot = function() {
        var e = ns_weblib_util.WebsiteConfig.BETS_WEBAPI_LOCATION;
        return e || (e = "/BetsWebAPI"), e
      }, e.UpdateSession = function() {
        var e, t;
        !o.AdditionalPreferences(n).betPlaced && o.AdditionalPreferences(n).timeStamp && (o.AdditionalPreferences(n).betPlaced = !0, e = this.CalculateSessionBetPlaceDiff(r.Now()), isNaN(e) || (t = e > this.FIVE_MINUTES ? "session_bet_time_long" : "session_bet_time_short", l.QueueAdd(t, (e / 1e3).toFixed(2))))
      }, e.CalculateSessionBetPlaceDiff = function(e) {
        var t = o.AdditionalPreferences(n).timeStamp,
          i = e.toUnix(),
          s = i - t;
        return s > this.ONE_WEEK ? (ErrorReporter.Trace(this, "Session time to first bet out of tolerance. Session Timestamp: " + t + ", Bet timestamp: " + i), NaN) : 0 > s ? NaN : s
      }, e.FIVE_MINUTES = 3e5, e.ONE_WEEK = 6048e5, e.BetSource = null, e.SuppressRas = !1, e.MouseModeDelegate = {
        mouseModeEnabled: function() {
          e.MouseMode = !0
        },
        mouseModeDisabled: function() {
          e.MouseMode = !1
        }
      }, e
    }();
  e.BetsWebApi = c
}(ns_betslipcorelib_util || (ns_betslipcorelib_util = {})),
function(e) {
  var t;
  ! function(e) {
    e[e.NONE = 0] = "NONE", e[e.ACCUMULATOR_OFFER = 1] = "ACCUMULATOR_OFFER", e[e.BORE_DRAW_OFFER = 2] = "BORE_DRAW_OFFER", e[e.EARLY_PAYOUT_OFFER = 3] = "EARLY_PAYOUT_OFFER", e[e.SPECIAL_OFFER = 4] = "SPECIAL_OFFER"
  }(t = e.OfferTypeEnum || (e.OfferTypeEnum = {}))
}(ns_betslipcorelib_data || (ns_betslipcorelib_data = {}));
