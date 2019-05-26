"use strict";
const Version = (new Date).getTime(),
    Role = ["Member"];
let app = angular.module("Lottery", ["angular.filter", 
 "ui.router", 
 "ui.bootstrap",
 "ngSanitize", 
 "datatables", 
 "datatables.bootstrap", 
 "socialbase.sweetAlert"]);
app.config(["$stateProvider", "$urlRouterProvider", function(t, e) {
    let n = {
            name: "dashboard",
            url: "/",
            templateUrl: "../assets/templates/member/dashboard.html?v=" + Version,
            controller: "DashboardCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        r = {
            name: "lottery",
            url: "/lottery",
            templateUrl: "../assets/templates/member/lottery.html?v=" + Version,
            controller: "LotteryCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        o = {
            name: "lottery.betting",
            url: "/:group/{lottery_id:int}",
            templateUrl: "../assets/templates/member/betting-form.html?v=" + Version,
            controller: "BettingCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }],
                LotteryInfo: ["APIService", "$q", "$stateParams", function(t, e, n) {
                    var r = e.defer();
                    return t.getLottery(n.lottery_id).then(function(t) {
                        r.resolve(t)
                    }), r.promise
                }]
            }
        },
        i = {
            name: "transaction",
            url: "/transaction",
            templateUrl: "../assets/templates/member/transaction.html?v=" + Version,
            controller: "TransactionCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        u = {
            name: "ticket",
            url: "/ticket/{ticket_id:int}",
            templateUrl: "../assets/templates/member/ticket.html?v=" + Version,
            controller: "TicketCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        a = {
            name: "result",
            url: "/result",
            templateUrl: "../assets/templates/member/result.html?v=" + Version,
            controller: "ResultCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        l = {
            name: "credit",
            url: "/credit",
            templateUrl: "../assets/templates/member/credit.html?v=" + Version,
            controller: "CreditCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        s = {
            name: "profile",
            url: "/profile",
            templateUrl: "../assets/templates/auth/profile.html?v=" + Version,
            controller: "ProfileCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(t, e) {
                    var n = e.defer();
                    return t.canAccess(Role).then(function(t) {
                        n.resolve(t)
                    }), n.promise
                }]
            }
        },
        nnn = {
            name: "report",
            url: "/report",
            templateUrl: "../assets/templates/member/history.html?v=" + Version,
            controller: "ReportHistoryCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        ff = {
            name: "report.history",
            url: "/history",
            templateUrl: "../assets/templates/member/history.html?v=" + Version,
            controller: "ReportHistoryCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        };
    t.state(n).state(ff).state(nnn).state(r).state(o).state(i).state(u).state(a).state(l).state(s), e.otherwise(function(t) {
        t.get("$state").go("dashboard")
    })
}]), 

app.directive("balance", ["AuthService", "MemberService", function(t, e) {
    return {
        restrict: "A",
        link: function(n, r, o) {
            n.$watch(function() {
                return e.reloadBalance
            }, function(t, r) {
                e.reloadBalance && n.reload()
            }), 
            n.reload = function() {
                n.is_loading = !0, t.currentLogin().then(function(t) {
                    n.is_loading = !1, 
                    n.balance_amount = t.profile.balance, 
                    n.credit_amount = t.profile.credit, 
                    e.Balance = t.profile.balance, 
                    e.reloadBalance = !1
                })
            }, 
            n.reload(), 
            n.reloadBalance = function() {
                e.reloadBalance = !0
            }
        }
    }
}]), 

app.directive("ngEnter", function() {
    return function(t, e, n) {
        e.bind("keydown keypress", function(t) {
            if (13 === (t.keyCode || t.which)) try {
                e[0].attributes["ng-model"].textContent, e[0].value;
                let r = e.parents("form").find("input").filter(function(t, e) {
                        return 0 == e.disabled && null != e.attributes["ng-enter"] && "" == e.value && "ticket-name" != e.id
                    }),
                    o = r.eq(r.index(e) + 1);
                "input_number.number" == n.ngModel && "" == e[0].value ? t.preventDefault() : ("input_number.top.amount" != n.ngModel && "input_number.front.amount" != n.ngModel && "input_number.bottom.amount" != n.ngModel && "input_number.tode.amount" != n.ngModel || "" != e[0].value) && o.length && (t.preventDefault(), o.focus())
            } catch (e) {
                t.preventDefault(), console.log("Focus error: " + e)
            }
        })
    }
}), 

app.factory("MemberService", ["$window", "$q", "$http", "$filter", function(t, e, n, r) {
    return this.reloadBalance = !1, 
    this.Balance = 0, 
    this.saveTicket = function(t) {
        let r = e.defer();
        return n.post("../api/ticket", t).then(function(t) {
           
            r.resolve(t.data)
        }),
        r.promise
    }, this.cancelNumber = function(t) {
        let r = e.defer(); 
        return n.post("../api/ticket/number/" + t + "/cancel", {
            number_id: t
        }).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.cancelNumbers = function(t, r) {
        let o = e.defer();
        return n.post("../api/lottery/" + t + "/numbers/cancel", {
            numbers: r
        }).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.cancelTicket = function(t) {
        let r = e.defer();
        return n.post("../api/ticket/" + t + "/cancel", {
            ticket_id: t
        }).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getCredits = function(t) {
        let o = e.defer(),
            i = {
                from: r("date")(t.from, "yyyy-MM-dd"),
                to: r("date")(t.to, "yyyy-MM-dd")
            };
        return n.get("../api/credits?" + $.param(i)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this
}]), 


app.controller("ReportHistoryCtrl", ["$window", "$scope", "$q", "APIService", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "LotteryService", "DateService", "$filter", function(e, t, r, n, o, i, a, s, l, c) {
    console.log("report history controller"), t.dtInstance = [];
    let u = new Date;
    t.date_range = "today", t.selected_month = "0", t.filters = {
        group: "",
        from: new Date(u.getFullYear(), u.getMonth(), u.getDate()),
        to: new Date(u.getFullYear(), u.getMonth(), u.getDate())
    }, t.lottery_type = s.lottery_type, t.report_month = [];
    for (let e = 0; e < 12; e++) t.report_month.push({
        n: e,
        name: l.ThaiMonth(new Date(u.getFullYear(), u.getMonth() - e, u.getDate()))
    });
    t.calTotal = function(e) {
        t.total = {
            receive: 0,
            commission: 0,
            win: 0,
            diff_win: 0,
            summary: 0,
            member: {
                betting: 0,
                win: 0,
                discount: 0,
                sum: 0
            },
            admin: {
                receive: 0,
                commission: 0,
                win: 0,
                sum: 0
            }
        }, angular.forEach(t.Summaries, function(e) {
            t.total.receive += +e.receive, t.total.commission += +e.commission, t.total.win += +e.win, t.total.diff_win += +e.diff_win, t.total.summary += e.receive + e.commission + e.win + e.diff_win, t.total.member.betting += e.member.betting, t.total.member.win += e.member.win, t.total.member.discount += e.member.discount, t.total.member.sum += e.member.betting + e.member.win + e.member.discount, t.total.admin.receive += e.admin.receive, t.total.admin.win += e.admin.win, t.total.admin.commission += e.admin.commission, t.total.admin.sum += e.admin.receive + e.admin.commission + e.admin.win
        })
    }, t.reloadReport = function() {
        n.getReports("win-lose", {
            group: t.filters.group,
            from: c("date")(t.filters.from, "yyyy-MM-dd"),
            to: c("date")(t.filters.to, "yyyy-MM-dd")
        }).then(function(e) {
            t.Summaries = e.summaries, t.calTotal()
        })
    }, t.reloadReport(), t.DateOption = {
        formatDay: "dd",
        formatMonth: "MM",
        formatYear: "yyyy"
    }, t.isOpenDatePopup = !1, t.toggleOpenDatePopup = function() {
        t.isOpenDatePopup = !0
    }, t.isCloseDatePopup = !1, t.toggleCloseDatePopup = function() {
        t.isCloseDatePopup = !0
    }, t.searchReport = function() {
        switch (t.date_range) {
            case "today":
                ! function() {
                    let e = new Date;
                    t.filters.from = new Date(e.getFullYear(), e.getMonth(), e.getDate()), t.filters.to = new Date(e.getFullYear(), e.getMonth(), e.getDate())
                }();
                break;
            case "yesterday":
                ! function() {
                    let e = new Date;
                    t.filters.from = new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1), t.filters.to = new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1)
                }();
                break;
            case "this-week":
                ! function() {
                    let e = new Date,
                        r = e.getDay();
                    t.filters.from = 0 == r ? new Date(e.getFullYear(), e.getMonth(), e.getDate() - 6) : new Date(e.getFullYear(), e.getMonth(), e.getDate() - r + 1), t.filters.to = new Date(e.getFullYear(), e.getMonth(), e.getDate())
                }();
                break;
            case "last-week":
                ! function() {
                    let e = new Date((new Date).getTime() - 6048e5),
                        r = e.getDay(),
                        n = e.getDate() - r + (0 === r ? -6 : 1);
                    t.filters.from = new Date(e.setDate(n)), t.filters.to = new Date(e.setDate(n + 6))
                }();
                break;
            case "month":
                t.filters.from = new Date(u.getFullYear(), u.getMonth() - +t.selected_month, 1), t.filters.to = new Date(u.getFullYear(), u.getMonth() - +t.selected_month + 1, 0)
        }
        t.reloadReport()
    }
}]),


app.controller("ReportOnprocessCtrl", ["$window", "$scope", "$q", "APIService", "CanAccess", function(e, t, r, n, o) {
    console.log("report onprocess controller"), 
    t.memberRole = o.role, 
    t.filter = {
        group: ""
    },

    // n.getLastLottery().then(function(e) {
    //     t.Lotteries = e.lotteries,
    //     t.Opens = e.opens, 
    //     console.log(t.Lotteries); 
    // }), 
    
    t.reloadReport = function() {
        n.getReports("onprocess", t.filter).then(function(e) {
            t.Lotteries = e.lotteries, 
            t.Opens = e.opens, 
            //console.log(e),
            t.calTotal()
        })
    }, 
    
    t.reloadReport(), 
    
    t.calTotal = function() {
        t.total = {
            member_bet: 0,
            member_discount: 0,
            member_total: 0,
            agent_receive: 0,
            agent_commission: 0,
            agent_total: 0,
            master_receive: 0,
            master_commission: 0,
            master_total: 0,
            senior_receive: 0,
            senior_commission: 0,
            senior_total: 0,
            admin_receive: 0,
            admin_commission: 0,
            admin_total: 0
        }, angular.forEach(t.Lotteries, function(e, r) {
            "" != t.filter.group && t.filter.group != e.lottery_type || (t.total.member_bet += +e.report.member.bet, t.total.member_discount += +e.report.member.discount, t.total.member_total += +e.report.member.total, t.total.agent_receive += +e.report.agent.receive, t.total.agent_commission += +e.report.agent.commission, t.total.agent_total += +e.report.agent.total, t.total.master_receive += +e.report.master.receive, t.total.master_commission += +e.report.master.commission, t.total.master_total += +e.report.master.total, t.total.senior_receive += +e.report.senior.receive, t.total.senior_commission += +e.report.senior.commission, t.total.senior_total += +e.report.senior.total, t.total.admin_receive += +e.report.admin.receive, t.total.admin_commission += +e.report.admin.commission, t.total.admin_total += +e.report.admin.total)
        })
    }
}]),

app.controller("BettingCtrl", ["$window", "$scope", "AuthService", "MemberService", "APIService", "LotteryService", "DateService", "TicketService", "$q", "$interval", "LotteryInfo", "$state", "$stateParams", "SweetAlert", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", "$timeout", 
            function(t,           e,          n,        r,             o,               i,            u,                a,             l,               s,    c, m, d, f, p, h, b, _, w) {

    console.log("betting controller", c), 
    e.dtInstance = [], 
    e.select_ticket_id = "0", 
    e.Lottery = c.lottery, 
    e.Promotion = c.promotion, 
    e.cacheIndex = null, 

    angular.isUndefined(e.Lottery) ? m.go("lottery") : e.ticket = {
        ticket_id: "0",
        lottery_id: e.Lottery.lottery_id,
        name: "",
        numbers: [],
        use_credit: 0,
        discount: 0,
        total_amount: 0
    }, 
    
    e.Balance = 0, 
    
    e.reloadCredit = function() {
        n.currentLogin().then(function(t) {
            //console.log(e);

            e.MemberCredit = t.profile.credit, 
            e.Balance = t.profile.balance, 
            e.Credit = {
                use: 0,
                discount: 0,
                balance: t.profile.credit + t.profile.balance
            }
        })
    }, 
    
    e.reloadCredit(), 
    
    e.number = function(t) {
        0 != t.charCode && 13 != t.charCode && (t.charCode > 57 || t.charCode < 48) && t.preventDefault()
    }, 
    
    e.set_focus = function(t) {
        angular.element(t).focus()
    }, 
    
    e.set_focus("#ticket-name"), 

    e.auto_focus = function() {
        w(function() {
            let t = angular.element("#ticket-form").find("input").filter(function(t, e) {
                return 0 == e.disabled && null != e.attributes["ng-enter"] && "" == e.value && "ticket-name" != e.id
            });
            t.length > 0 ? t[0].focus() : (e.addNumber("", !1, "", "", "", ""), e.auto_focus())
        }, 100)
    }, 
    
    e.isAvailableOptionGroup = function(t) {
        return "top" == t ? e.Lottery.open_options.find(function(t) {
            return "run_top" == t || "two_number_top" == t || "three_number_top" == t
        }) : "front" == t ? e.Lottery.open_options.find(function(t) {
            return "three_number_front" == t
        }) : "bottom" == t ? e.Lottery.open_options.find(function(t) {
            return "run_bottom" == t || "two_number_bottom" == t || "three_number_bottom" == t
        }) : "tode" == t && e.Lottery.open_options.find(function(t) {
            return "two_number_tode" == t || "three_number_tode" == t
        })
    }, 
    
    e.isAvailableOption = function(t) {
        return e.Lottery.open_options.find(function(e) {
            return e == t
        })
    }, 
    
    //  on press - (minus) for invert number and suffle number
    e.key_number = function(t, n, r) {
        0 != t.charCode && (45 == t.charCode ? (confirm("ต้องการกลับเลข?") && (e.shuffleNumber(r), e.auto_focus()), t.preventDefault()) : 13 == t.charCode ? (e.addNumber("", !1, "", "", "", ""), t.preventDefault()) : 47 == t.charCode ? (null == e.cacheIndex ? e.cacheIndex = n : e.cacheIndex = null, t.preventDefault()) : 42 == t.charCode ? t.preventDefault() : 13 != t.charCode && (t.charCode > 57 || t.charCode < 48) && t.preventDefault())
    }, 
    
    e.key_amount = function(t, n, r, o) {
        0 != t.charCode && (45 == t.charCode ? (confirm("ต้องการกลับเลข?") && (e.shuffleNumber(o), e.auto_focus()), t.preventDefault()) : 13 == t.charCode ? ("" == o[r].amount ? e.Numbers[n][r].amount = "0" : e.addNumber("", !1, "", "", "", ""), t.preventDefault()) : 47 == t.charCode ? (null == e.cacheIndex ? e.cacheIndex = n : e.cacheIndex = null, t.preventDefault()) : 42 == t.charCode ? (e.copyAmount(r, o[r].amount, !1), e.auto_focus(), t.preventDefault()) : 13 != t.charCode && (t.charCode > 57 || t.charCode < 48) && t.preventDefault())
    }, 
    
    e.check_number = function(t, n, r) {
        "" != r.number && null != e.cacheIndex && (e.isAvailable("top", r.number) && (e.Numbers[n].top.amount = e.Numbers[e.cacheIndex].top.amount), e.isAvailable("front", r.number) && (e.Numbers[n].front.amount = e.Numbers[e.cacheIndex].front.amount), e.isAvailable("bottom", r.number) && (e.Numbers[n].bottom.amount = e.Numbers[e.cacheIndex].bottom.amount), e.isAvailable("tode", r.number) && (e.Numbers[n].tode.amount = e.Numbers[e.cacheIndex].tode.amount), e.auto_focus())
    }, 
    
    e.copyAmounts = function(t) {
        let n = e.Numbers.find(function(e) {
            return "" != e[t].amount
        });
        angular.isDefined(n) && e.copyAmount(t, n[t].amount, !0), e.auto_focus()
    },
    
    e.copyAmount = function(t, n, r) {
        e.Numbers = e.Numbers.map(function(o) {
            return e.isAvailable(t, o.number) && (1 == r ? o[t].amount = n : "" == o[t].amount && (o[t].amount = n)), o
        })
    }, 
    
    e.shuffleNumbers = function() {
        let t = e.Numbers.filter(function(t) {
            return "" != t.number && !t.is_shuffle && 2 == t.number.length
        });
        angular.forEach(t, function(t) {
            e.shuffleNumber(t)
        }), e.auto_focus()
    }, 
    
    e.shuffleNumber = function(t) {
        if (0 == t) return;
        if (!t.number || t.is_shuffle) return;
        let n, r = e.Numbers.findIndex(function(e) {
            return e == t
        });
        e.Numbers[r].is_shuffle = !0, 3 == t.number.length ? n = i.shuffleThreeNumber(t.number) : 2 == t.number.length ? n = i.shuffleTwoNumber(t.number) : 1 == t.number.length && (n = i.shuffleOneNumber(t.number), e.Numbers[r].number = t.number + t.number + "", null != e.cacheIndex && (e.Numbers[r].top.amount = e.Numbers[e.cacheIndex].top.amount, e.Numbers[r].bottom.amount = e.Numbers[e.cacheIndex].bottom.amount)), angular.forEach(n, function(t) {
            if (e.Numbers[r].number != t) {
                let n = "",
                    r = "",
                    o = "",
                    i = "";
                null != e.cacheIndex && (e.isAvailable("top", t) && (n = e.Numbers[e.cacheIndex].top.amount), e.isAvailable("front", t) && (r = e.Numbers[e.cacheIndex].front.amount), e.isAvailable("bottom", t) && (o = e.Numbers[e.cacheIndex].bottom.amount), e.isAvailable("tode", t) && (i = e.Numbers[e.cacheIndex].tode.amount)), e.addShuffle(t, n, r, o, i)
            } else null != e.cacheIndex && (e.isAvailable("top", e.Numbers[r].number) && (e.Numbers[r].top.amount = e.Numbers[e.cacheIndex].top.amount), e.isAvailable("front", e.Numbers[r].number) && (e.Numbers[r].front.amount = e.Numbers[e.cacheIndex].front.amount), e.isAvailable("bottom", e.Numbers[r].number) && (e.Numbers[r].bottom.amount = e.Numbers[e.cacheIndex].bottom.amount), e.isAvailable("tode", e.Numbers[r].number) && (e.Numbers[r].tode.amount = e.Numbers[e.cacheIndex].tode.amount))
        }), e.Numbers.findIndex(function(t) {
            return "" == t.number
        }) < 0 && e.addNumber("", !1, "", "", "", "")
    }, 
    
    
    e.addShuffle = function(t, n, r, o, i) {
        let u = e.Numbers.findIndex(function(t) {
            return "" == t.number
        });
        u < 0 ? e.addNumber(t, !0, n, r, o, i) : (e.Numbers[u].number = t, e.Numbers[u].is_shuffle = !0, e.Numbers[u].top.amount = n, e.Numbers[u].front.amount = r, e.Numbers[u].bottom.amount = o, e.Numbers[u].tode.amount = i)
    }, 
    
    
    e.isAvailable = function(t, n) {
        if (!n) return !1;
        if (n = n.replace("-", ""), "top" == t) {
            if (1 == n.length) return e.Lottery.open_options.find(function(t) {
                return "run_top" == t
            });
            if (2 == n.length) return e.Lottery.open_options.find(function(t) {
                return "two_number_top" == t
            });
            if (3 == n.length) return e.Lottery.open_options.find(function(t) {
                return "three_number_top" == t
            })
        } else if ("front" == t) {
            if (3 == n.length) return e.Lottery.open_options.find(function(t) {
                return "three_number_front" == t
            })
        } else if ("bottom" == t) {
            if (1 == n.length) return e.Lottery.open_options.find(function(t) {
                return "run_bottom" == t
            });
            if (2 == n.length) return e.Lottery.open_options.find(function(t) {
                return "two_number_bottom" == t
            });
            if (3 == n.length) return e.Lottery.open_options.find(function(t) {
                return "three_number_bottom" == t
            })
        } else if ("tode" == t) {
            if (2 == n.length) return e.Lottery.open_options.find(function(t) {
                return "two_number_tode" == t
            });
            if (3 == n.length) return e.Lottery.open_options.find(function(t) {
                return "three_number_tode" == t
            })
        }
        return !1
    },
    
    e.onTicket = function() {
        if (+e.ticket.ticket_id > 0) {
            let t = e.TicketNumbers.find(function(t) {
                return +e.ticket.ticket_id == t.ticket_id
            });
            e.ticket.name = t.ticket_name
        } else e.ticket.name = "";
        e.set_focus("#ticket-name")
    },
    
    e.saveTicket = function() {
        e.Credit.use > 0 && f.swal({
            title: "ยืนยันส่งโพย!",
            showCancelButton: !0,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = l.defer();
                return r.saveTicket(e.ticket).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            if ("success" == t.value.result) { 
                e.reloadCredit(), 
                e.clearNumber(), 
                r.reloadBalance = !0, 
                e.dtInstance.rerender();
            } else if ("invalid" == t.value.result) {
                let n = '<table class="table table-bordered table-hover" style="font-size: 14px;">\n\t                        \t<thead>\n\t                        \t\t<tr>\n\t                        \t\t\t<th class="text-center">ประเภท</th>\n\t                        \t\t\t<th class="text-center">หมายเลข</th>\n\t                        \t\t\t<th>รายละเอียด</th>\n\t                        \t\t</tr>\n\t                        \t</thead>\n\t                        \t<tbody>';
                angular.forEach(t.value.invalid_numbers, function(t, e) {
                    n += '<tr>\n\t\t\t<td class="text-center">' + i.typeName(t.type) + '</td>\n\t\t\t<td class="text-center">' + t.number + '</td>\n\t\t\t<td class="text-left">' + t.text + "</td>\n\t\t</tr>"
                }), n += "</tbody></table>", swal({
                    title: "ไม่สามารถส่งโพยได้!",
                    type: "error",
                    html: n
                }).then(function(t) {}), o.getLottery(d.lottery_id).then(function(t) {
                    e.Lottery = t.lottery
                })
            } else swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                r.reloadBalance = !0
            })
        })
    }, 
    
    e.addNumbers = function() {
        for (let t = 1; t <= 10; t++) e.addNumber("", !1, "", "", "", "")
    }, 
    
    e.addNumber = function(t, n, r, o, i, u) {
        e.Numbers.push({
            number: t,
            is_shuffle: n,
            top: {
                amount: r,
                discount: 0,
                pay: 0,
                return: 0
            },
            front: {
                amount: o,
                discount: 0,
                pay: 0,
                return: 0
            },
            bottom: {
                amount: i,
                discount: 0,
                pay: 0,
                return: 0
            },
            tode: {
                amount: u,
                discount: 0,
                pay: 0,
                return: 0
            }
        })
    }, 
    
    e.clearNumber = function() {
        e.ticket.name = "", e.Numbers = [], e.cacheIndex = null, e.addNumbers(), e.set_focus("#ticket-name")
    }, 
    
    e.clearNumber(), e.hasCloseNumbers = function() {
        return !!e.Lottery.options.three_number_top || (!!e.Lottery.options.three_number_tode || (!!e.Lottery.options.two_number_top || (!!e.Lottery.options.two_number_bottom || (!!e.Lottery.options.two_number_tode || (!!e.Lottery.options.run_top || !!e.Lottery.options.run_bottom)))))
    }, 
    
    e.number_format = function(t, e) {
        return _("number")(t, e)
    }, 
    
    e.selectTicket = function() {
        e.dtInstance.rerender()
    }, 
    
    e.cancelNumber = function(t) {
        let n = e.loadNumbers.find(function(e) {
            return e.t_number_id == t
        });
        a.can_cancel(e.Lottery.close_date_format, n.created_at, n.t_status) && f.swal({
            title: "ยกเลิก?",
            text: "ต้องการยกเลิกแทงหมายเลขนี้ใช่หรือไม่",
            showCancelButton: !0,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่ใช่",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = l.defer();
                return r.cancelNumber(n.t_number_id).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            "success" == t.value.result ? (e.reloadCredit(), r.reloadBalance = !0, e.dtInstance.rerender()) : swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                r.reloadBalance = !0, e.dtInstance.rerender()
            })
        })
    }, 
    
    e.calTicket = function() {
        if (angular.isDefined(e.Credit)) {
            let t = 0,
                n = 0,
                r = 0,
                o = e.Promotion;
            e.ticket.numbers = [], 
            angular.forEach(e.Numbers, function(t, n) {
                t.number && (1 == t.number.length ? (+t.top.amount > 0 && e.isAvailableOption("run_top") && e.ticket.numbers.push({
                    type: "run_top",
                    number: t.number,
                    amount: +t.top.amount,
                    discount: parseFloat(+t.top.amount * o.run_top.discount / 100).toFixed(2),
                    pay: o.run_top.pay,
                    return: +t.top.amount * o.run_top.pay
                }), 
                
                +t.bottom.amount > 0 && e.isAvailableOption("run_bottom") && e.ticket.numbers.push({
                    type: "run_bottom",
                    number: t.number,
                    amount: +t.bottom.amount,
                    discount: parseFloat(+t.bottom.amount * o.run_bottom.discount / 100).toFixed(2),
                    pay: o.run_bottom.pay,
                    return: +t.bottom.amount * o.run_bottom.pay
                })) : 2 == t.number.length ? (+t.top.amount > 0 && e.isAvailableOption("two_number_top") && e.ticket.numbers.push({
                    type: "two_number_top",
                    number: t.number,
                    amount: +t.top.amount,
                    discount: parseFloat(+t.top.amount * o.two_number_top.discount / 100).toFixed(2),
                    pay: o.two_number_top.pay,
                    return: +t.top.amount * o.two_number_top.pay
                }),
                
                +t.bottom.amount > 0 && e.isAvailableOption("two_number_bottom") && e.ticket.numbers.push({
                    type: "two_number_bottom",
                    number: t.number,
                    amount: +t.bottom.amount,
                    discount: parseFloat(+t.bottom.amount * o.two_number_bottom.discount / 100).toFixed(2),
                    pay: o.two_number_bottom.pay,
                    return: +t.bottom.amount * o.two_number_bottom.pay
                }), 
                
                +t.tode.amount > 0 && e.isAvailableOption("two_number_tode") && e.ticket.numbers.push({
                    type: "two_number_tode",
                    number: t.number,
                    amount: +t.tode.amount,
                    discount: parseFloat(+t.tode.amount * o.two_number_tode.discount / 100).toFixed(2),
                    pay: o.two_number_tode.pay,
                    return: +t.tode.amount * o.two_number_tode.pay

                })) : 3 == t.number.length && (t.top.amount > 0 && e.isAvailableOption("three_number_top") && e.ticket.numbers.push({
                    type: "three_number_top",
                    number: t.number,
                    amount: +t.top.amount,
                    discount: parseFloat(+t.top.amount * o.three_number_top.discount / 100).toFixed(2),
                    pay: o.three_number_top.pay,
                    return: +t.top.amount * o.three_number_top.pay
                }), 
                
                t.tode.amount > 0 && e.isAvailableOption("three_number_tode") && e.ticket.numbers.push({
                    type: "three_number_tode",
                    number: t.number,
                    amount: +t.tode.amount,
                    discount: parseFloat(+t.tode.amount * o.three_number_tode.discount / 100).toFixed(2),
                    pay: o.three_number_tode.pay,
                    return: +t.tode.amount * o.three_number_tode.pay
                }), 
                
                t.front.amount > 0 && e.isAvailableOption("three_number_front") && e.ticket.numbers.push({
                    type: "three_number_front",
                    number: t.number,
                    amount: +t.front.amount,
                    discount: parseFloat(+t.front.amount * o.three_number_front.discount / 100).toFixed(2),
                    pay: o.three_number_front.pay,
                    return: +t.front.amount * o.three_number_front.pay
                }), 
                
                t.bottom.amount > 0 && e.isAvailableOption("three_number_bottom") && e.ticket.numbers.push({
                    type: "three_number_bottom",
                    number: t.number,
                    amount: +t.bottom.amount,
                    discount: parseFloat(+t.bottom.amount * o.three_number_bottom.discount / 100).toFixed(2),
                    pay: o.three_number_bottom.pay,
                    return: +t.bottom.amount * o.three_number_bottom.pay
                })))
            }), 
            
            angular.forEach(e.ticket.numbers, function(e, o) {
                t += +e.amount, r += +e.discount, n += +e.amount - +e.discount
            }), 
            
            e.Credit.use = t, e.Credit.discount = r, e.Credit.balance = e.MemberCredit + e.Balance - n, e.ticket.total_amount = n
        }
    }, 
    
    e.dtOptions = h.fromFnPromise(function() {
        var t = l.defer();
        return o.getNumbers(e.Lottery.lottery_id, e.select_ticket_id).then(function(n) {
            e.Summary = n.summary, e.loadNumbers = n.numbers, e.TicketNumbers = n.tickets, t.resolve(n.numbers)
        }), t.promise
    }).withDOM("<'row'<'col-md-12'>><'table-responsive't><'col-md-12'i><'col-md-12 text-center'p>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
        pagination: {
            classes: {
                ul: "pagination pagination-md"
            }
        }
    }).withLanguage({
        sSearch: "ค้นหา: ",
        sEmptyTable: "ไม่มีข้อมูล",
        infoEmpty: "",
        info: "แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ"
    }).withOption("lengthChange", !1).withOption("createdRow", function(t, n, r) {
        p(angular.element(t).contents())(e)
    }).withOption("autoWidth", !1).withOption("ordering", !1).withOption("responsive", !0), e.dtColumns = [b.newColumn(null).renderWith(function(t, e, n, r) {
        return a.status(t.t_status, t.created_at)
    }).withTitle("สถานะ"), b.newColumn(null).renderWith(function(t, e, n, r) {
        return u.ThaiDatetime(t.created_at)
    }).withTitle("เวลาเล่น"), b.newColumn(null).renderWith(function(t, e, n, r) {
        return i.typeName(t.t_type)
    }).withTitle("ประเภท"), b.newColumn("t_number").withTitle("หมายเลข").withClass("text-center"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(Math.abs(+t.t_amount), 2)
    }).withTitle("จำนวน").withClass("text-right"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(Math.abs(+t.t_discount), 2)
    }).withTitle("ส่วนลด").withClass("text-right"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(Math.abs(+t.t_credit), 2)
    }).withTitle("เครดิตที่ใช้").withClass("text-right"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return a.can_cancel(e.Lottery.close_date_format, t.created_at, t.t_status) ? '<i class="fa fa-square-o" ng-click="toggleSelected(' + t.t_number_id + ")\" ng-class=\"{'fa-check-square-o': isSelected(" + t.t_number_id + "), 'fa-square-o': !isSelected(" + t.t_number_id + ')}"></i>' : ""
    }).withTitle("เลือก").withClass("text-center"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return a.can_cancel(e.Lottery.close_date_format, t.created_at, t.t_status) ? '<button class="btn btn-warning btn-xs" ng-click="cancelNumber(' + t.t_number_id + ')"><i class="fa fa-times" aria-hidden="true"></i></button>' : ""
    }).withTitle("ลบ").withClass("text-right")], e.bulkcancel = [], e.cancel_ids = [], e.toggleSelected = function(t) {
        e.isSelected(t) ? e.cancel_ids = e.cancel_ids.filter(function(e) {
            return +e != +t
        }) : e.cancel_ids.push(t)
    }, 
    
    e.isSelected = function(t) {
        return e.cancel_ids.find(function(e) {
            return +e == +t
        })
    }, 
    
    e.SelectedAll = function() {
        e.cancel_ids.length > 0 ? e.cancel_ids = [] : angular.forEach(e.loadNumbers, function(t) {
            a.can_cancel(e.Lottery.close_date_format, t.created_at, t.t_status) && e.cancel_ids.push(t.t_number_id)
        })
    }, 
    
    e.CancelSelected = function() {
        0 != e.cancel_ids.length && f.swal({
            title: "ยกเลิก?",
            text: "ต้องการยกเลิกหมายเลขที่เลือกใช่หรือไม่",
            showCancelButton: !0,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่ใช่",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = l.defer();
                return r.cancelNumbers(e.Lottery.lottery_id, e.cancel_ids).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            console.log(t), "success" == t.value.result ? (e.reloadCredit(), r.reloadBalance = !0, e.dtInstance.rerender()) : swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                r.reloadBalance = !0, e.dtInstance.rerender()
            })
        })
    }, 
    
    e.$watch("Numbers", function(t, n) {
        e.calTicket()
    }, !0)
}]), 


app.controller("CreditCtrl", ["$scope", "MemberService", "APIService", "DateService", "CreditService", "$q", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", function(t, e, n, r, o, i, u, a, l, s) {
    
    console.log("credit controller"), t.dtInstance = [];
    
    let c = new Date;
    
    t.filters = {
        from: new Date(c.getFullYear(), c.getMonth(), c.getDate() - 7),
        to: new Date(c.getFullYear(), c.getMonth(), c.getDate())
    }, 

    t.isFromDatePopup = !1, t.toggleFromDatePopup = function() {
        t.isFromDatePopup = !0
    },

    t.FromDateOptions = {
        formatDay: "dd",
        formatMonth: "MM",
        formatYear: "yyyy"
    },

    t.isToDatePopup = !1, t.toggleToDatePopup = function() {
        t.isToDatePopup = !0
    },
    
    t.ToDateOptions = {
        formatDay: "dd",
        formatMonth: "MM",
        formatYear: "yyyy"
    }, 
    
    t.number_format = function(t) {
        return s("number")(t)
    }, 
    
    t.dtOptions = a.fromFnPromise(function() {
        var n = i.defer();
        return e.getCredits(t.filters).then(function(t) {
            n.resolve(t.credits)
        }), n.promise
    }).withDOM("<'row'<'col-md-12'>><'table-responsive't><'row'<'col-md-12'i><'col-md-12 text-center'p>>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
        pagination: {
            classes: {
                ul: "pagination pagination-md"
            }
        }
    }).withLanguage({
        sSearch: "ค้นหา: ",
        sEmptyTable: "ไม่มีข้อมูล",
        infoEmpty: "",
        info: "แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ"
    }).withOption("lengthChange", !1).withOption("createdRow", function(e, n, r) {
        u(angular.element(e).contents())(t)
    }).withOption("autoWidth", !1).withOption("order", [0, "desc"]).withOption("responsive", !0), t.dtColumns = [l.newColumn("credit_id").withTitle("เลขที่"), l.newColumn(null).renderWith(function(t, e, n, o) {
        return r.ThaiDatetime(t.created_at)
    }).withTitle("วันที่"), l.newColumn(null).renderWith(function(t, e, n, r) {
        return o.creditType(t.credit_type)
    }).withTitle("ประเภท"), l.newColumn("credit_amount").withTitle("จำนวน").withClass("number-color text-right"), l.newColumn("credit_balance").withTitle("คงเหลือ").withClass("number-color text-right"), l.newColumn("action_by_name").withTitle("โดย").withClass("text-center"), l.newColumn(null).renderWith(function(t, e, n, r) {
        return t.credit_note || "-"
    }).withTitle("รายละเอียด")], t.showCredit = function() {
        t.dtInstance.rerender()
    }
}]), 

app.controller("DashboardCtrl", ["$window", "$scope", "MemberService", "APIService", "$q", function(t, e, n, r, o) {
    console.log("dashboard controller")
}]), 

app.controller("LotteryCtrl", ["$window", "$scope", "MemberService", "APIService", "$interval", function(t, e, n, r, o) {
    console.log("lottery controller"), r.getLastLottery().then(function(t) {
        e.Lotteries = t.lotteries
    })
}]), 

app.controller("LotteryLaoCtrl", ["$window", "$scope", "MemberService", "APIService", "$q", "$stateParams", function(t, e, n, r, o, i) {
    console.log("Lao lottery controller"), e.LotteryID = i.lottery_id, e.reloadPromotions = function() {
        r.getPromotions("lao-lottery").then(function(t) {
            e.Promotions = t.promotions
        })
    }, e.reloadPromotions()
}]),

app.controller("ResultCtrl", ["$window", "$scope", "MemberService", "APIService", "$q", "LotteryService", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", "$uibModal", function(t, e, n, r, o, i, u, a, l, s, c) {
    console.log("result controller"), 
    e.filter = "%", 
    e.dtInstance = [], 
    
    //t.LottoTypes = i.lottery_type,
    e.LottoTypes = i.lottery_types,

    // do call first load
    r.getResults("").then(function(n) {
        e.LotteriesFirst = n.lotteries
    })
    //console.log(e);

    e.dtOptions = a.fromFnPromise(function() {
        let t = o.defer();
        return r.getResults(e.filter).then(function(n) {
            e.Lotteries = n.lotteries, t.resolve(n.lotteries)
        }), t.promise
    }).withDOM("<'table-responsive't><'row'<'col-md-12 text-center'i><'col-md-12 text-center'p>>").withBootstrap().withDisplayLength(50).withBootstrapOptions({
        pagination: {
            classes: {
                ul: "pagination pagination-md"
            }
        }
    }).withLanguage({
        sSearch: "ค้นหา: ",
        sEmptyTable: "ไม่มีข้อมูล",
        infoEmpty: "",
        info: "แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ"
    }).withOption("lengthChange", !1).withOption("createdRow", function(t, n, r) {
        u(angular.element(t).contents())(e)
    }).withOption("autoWidth", !1).withOption("responsive", !0), e.dtColumns = [l.newColumn(null).renderWith(function(t, e, n, r) {
        return i.lotteryName(t.type)
    }).withTitle("หวย"), l.newColumn("name").withTitle("งวดวันที่"), l.newColumn(null).renderWith(function(t, e, n, r) {
        if (t.results) return t.results.three_number_top;
        return "-"
    }).withTitle("3 ตัวบน"), l.newColumn(null).renderWith(function(t, e, n, r) {
        if (t.results) return t.results.two_number_top;
        return "-"
    }).withTitle("2 ตัวบน"), l.newColumn(null).renderWith(function(t, e, n, r) {
        if (t.results) return t.results.two_number_bottom;
        return "-"
    }).withTitle("2 ตัวล่าง"), l.newColumn(null).renderWith(function(t, e, n, r) {
        if (t.results) return '<button class="btn btn-info btn-xs" ng-click="viewOther(' + t.lottery_id + ')"><i class="fa fa-plus" aria-hidden="true"></i> เพิ่มเติม</button>';
        return "-"
    }).withTitle("ผลเพิ่มเติม")], 

    e.lotteryFilter = function() {
        e.dtInstance.rerender()
    },
    
    e.viewOther = function(t) {
        let n = e.Lotteries.find(function(e) {
                return e.lottery_id == t
            }),
            r = angular.element("#modal-box");
        c.open({
            animation: !0,
            ariaLabelledBy: "modal-title",
            ariaDescribedBy: "modal-body",
            templateUrl: "other-result.html",
            appendTo: r,
            controller: "OtherResultsModalCtrl",
            resolve: {
                Lottery: n
            }
        })
    }
}]), app.controller("OtherResultsModalCtrl", ["$scope", "$uibModalInstance", "LotteryService", "Lottery", function(t, e, n, r) {
    console.log("other results modal controller"), t.Lottery = r, t.ModalTitle = "ผล" + n.lotteryName(r.type), t.closeModal = function() {
        e.close("close")
    }, t.three_number_tode = function() {
        return r.results.three_number_tode.join(", ")
    }, t.two_number_tode = function() {
        return r.results.two_number_tode.join(", ")
    }, t.run_top = function() {
        return r.results.run_top.join(", ")
    }, t.run_bottom = function() {
        return r.results.run_bottom.join(", ")
    }
}]), 

app.controller("TicketCtrl", ["$window", "$scope", "MemberService", "APIService", "$q", "$state", "$stateParams", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", "LotteryService", "DateService", "TicketService", function(t, e, n, r, o, i, u, a, l, s, c, m, d, f) {
    console.log("ticket controller"), 
    e.number_format = function(t) {
        return c("number")(t, 2)
    }, 
    e.dtOptions = l.fromFnPromise(function() {
        var t = o.defer();
        return r.getTicket(u.ticket_id).then(function(n) {
            "success" == n.result ? (e.Ticket = n.ticket, e.Result = n.number_results, e.Lottery = {
                type: m.lotteryName(e.Ticket.lottery_type),
                date: d.ThaiDate(e.Ticket.lottery_date)
            }, t.resolve(n.ticket.numbers)) : i.go("transaction")
        }), t.promise
    }).withDOM("<'row'<'col-md-12'>><'table-responsive't><'col-md-12 text-center'i><'col-md-12 text-center'p>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
        pagination: {
            classes: {
                ul: "pagination pagination-md"
            }
        }
    }).withLanguage({
        sSearch: "ค้นหา: ",
        sEmptyTable: "ไม่มีข้อมูล",
        infoEmpty: "",
        info: "แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ"
    }).withOption("lengthChange", !1).withOption("createdRow", function(t, n, r) {
        a(angular.element(t).contents())(e)
    }).withOption("autoWidth", !1).withOption("ordering", !1).withOption("responsive", !0), e.dtColumns = [s.newColumn(null).renderWith(function(t, e, n, r) {
        return r.row + 1
    }).withTitle("ลำดับ"), s.newColumn(null).renderWith(function(t, e, n, r) {
        return m.typeName(t.t_type)
    }).withTitle("ประเภท"), s.newColumn("t_number").withTitle("หมายเลข").withClass("text-center"), s.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.t_amount * -1)
    }).withTitle("จำนวนเครดิต").withClass("text-right"), s.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.t_discount )
    }).withTitle("ส่วนลด").withClass("text-right"), s.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.t_credit * -1)
    }).withTitle("เครดิตที่ใช้จริง").withClass("text-right"), s.newColumn("t_pay").withTitle("ราคาจ่าย").withClass("text-right"), s.newColumn(null).renderWith(function(t, n, r, o) {
        if (e.Result) {
            return m.numberResult(t.t_type, e.Result);}
        else{
            return "-"
        }
    }).withTitle("เลขที่ออก").withClass("text-center"), s.newColumn(null).renderWith(function(t, n, r, o) {
        if ("Lose" == t.t_status || "Win" == t.t_status) return e.number_format(t.t_result);
        return "-"
    }).withTitle("ผลชนะ").withClass("text-right"), s.newColumn(null).renderWith(function(t, e, n, r) {
        return f.status(t.t_status, t.created_at)
    }).withTitle("สถานะ").withClass("text-right")]
}]), app.controller("TicketLaoCtrl", ["$window", "$scope", "AuthService", "MemberService", "APIService", "LotteryService", "DateService", "TicketService", "$q", "$interval", "LotteryInfo", "$state", "$stateParams", "SweetAlert", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", "$timeout", function(t, e, n, r, o, i, u, a, l, s, c, m, d, f, p, h, b, _, w) {
    console.log("ticket controller"), e.dtInstance = [], e.select_ticket_id = "0", e.Lottery = c[0].lottery, e.Promotion = c[1].promotion, e.cacheIndex = null, angular.isUndefined(e.Lottery) ? m.go("lottery") : "lao-lottery" != e.Lottery.type || "lao-lottery" != e.Promotion.lottery_type || "off" == e.Promotion.promotion_status ? m.go("lottery") : e.ticket = {
        ticket_id: "0",
        lottery_id: e.Lottery.lottery_id,
        name: "",
        promotion_id: e.Promotion.promotion_id,
        numbers: [],
        use_credit: 0,
        discount: 0,
        total_amount: 0
    }, e.Balance = 0, e.reloadCredit = function() {
        n.currentLogin().then(function(t) {
            e.Balance = t.profile.balance, e.Credit = {
                use: 0,
                discount: 0,
                balance: t.profile.balance
            }
        })
    }, e.reloadCredit();
    let y = s(function() {
        let t = moment(e.Lottery.close_date_format),
            n = moment(new Date),
            r = t.diff(n);
        if (r > 0) {
            let t = moment.duration(r);
            e.Countdown = Math.floor(t.asHours()) + moment.utc(r).format(" : mm : ss")
        } else e.Lottery.status.user_status = "close", e.Countdown = "ปิดรับแทง", s.cancel(y)
    }, 1e3);
    e.quickInput = "", e.QuickNumber = function(t) {
        if (13 == t.charCode) {
            if (console.log("enter..."), "" != e.quickInput && e.quickInput.indexOf("=") >= 0) {
                let t = e.quickInput.split("="),
                    n = t[0],
                    r = "",
                    o = [];
                if (t[1].indexOf("/") >= 0) {
                    let e = t[1].split("/");
                    r = e[0].split("*"), 3 == n.length ? o = i.shuffleThreeNumber(n) : 2 == n.length ? o = i.shuffleTwoNumber(n) : 1 == n.length && (o = i.shuffleOneNumber(n))
                } else r = t[1].split("*"), o.push(n);
                angular.forEach(o, function(t) {
                    3 == t.length ? e.addShuffle(t, r[0], "", r[1]) : e.addShuffle(t, r[0], r[1], "")
                })
            }
            e.quickInput = "", t.preventDefault()
        } else 61 == t.charCode ? (console.log(e.quickInput), (0 == e.quickInput.length || e.quickInput.indexOf("=") > 0) && t.preventDefault()) : 42 == t.charCode || 47 == t.charCode || (t.charCode > 57 || t.charCode < 48 ? (console.log("not number", t.charCode), t.preventDefault()) : 3 == e.quickInput.length && e.quickInput.indexOf("=") < 0 && t.preventDefault())
    }, e.number = function(t) {
        0 != t.charCode && 13 != t.charCode && (t.charCode > 57 || t.charCode < 48) && t.preventDefault()
    }, e.set_focus = function(t) {
        angular.element(t).focus()
    }, e.set_focus("#ticket-name"), e.auto_focus = function() {
        w(function() {
            let t = angular.element("#ticket-form").find("input").filter(function(t, e) {
                return 0 == e.disabled && null != e.attributes["ng-enter"] && "" == e.value && "ticket-name" != e.id
            });
            t.length > 0 ? t[0].focus() : (e.addNumber("", !1, "", "", ""), e.auto_focus())
        }, 100)
    }, e.key_number = function(t, n, r) {
        0 != t.charCode && (45 == t.charCode ? (confirm("ต้องการกลับเลข?") && (e.shuffleNumber(r), e.auto_focus()), t.preventDefault()) : 13 == t.charCode ? (e.addNumber("", !1, "", "", ""), t.preventDefault()) : 47 == t.charCode ? (null == e.cacheIndex ? e.cacheIndex = n : e.cacheIndex = null, t.preventDefault()) : 42 == t.charCode ? t.preventDefault() : 13 != t.charCode && (t.charCode > 57 || t.charCode < 48) && t.preventDefault())
    }, e.key_amount = function(t, n, r, o) {
        0 != t.charCode && (45 == t.charCode ? (confirm("ต้องการกลับเลข?") && (e.shuffleNumber(o), e.auto_focus()), t.preventDefault()) : 13 == t.charCode ? ("" == o[r].amount ? e.Numbers[n][r].amount = "0" : e.addNumber("", !1, "", "", ""), t.preventDefault()) : 47 == t.charCode ? (null == e.cacheIndex ? e.cacheIndex = n : e.cacheIndex = null, t.preventDefault()) : 42 == t.charCode ? (e.copyAmount(r, o[r].amount, !1), e.auto_focus(), t.preventDefault()) : 13 != t.charCode && (t.charCode > 57 || t.charCode < 48) && t.preventDefault())
    }, e.check_number = function(t, n, r) {
        "" != r.number && null != e.cacheIndex && (e.isAvailable("top", r.number) && (e.Numbers[n].top.amount = e.Numbers[e.cacheIndex].top.amount), e.isAvailable("bottom", r.number) && (e.Numbers[n].bottom.amount = e.Numbers[e.cacheIndex].bottom.amount), e.isAvailable("tode", r.number) && (e.Numbers[n].tode.amount = e.Numbers[e.cacheIndex].tode.amount), e.auto_focus())
    }, e.copyAmounts = function(t) {
        let n = e.Numbers.find(function(e) {
            return "" != e[t].amount
        });
        angular.isDefined(n) && e.copyAmount(t, n[t].amount, !0), e.auto_focus()
    }, e.copyAmount = function(t, n, r) {
        e.Numbers = e.Numbers.map(function(o) {
            return e.isAvailable(t, o.number) && (1 == r ? o[t].amount = n : "" == o[t].amount && (o[t].amount = n)), o
        })
    }, e.shuffleNumbers = function() {
        let t = e.Numbers.filter(function(t) {
            return "" != t.number && !t.is_shuffle && 2 == t.number.length
        });
        angular.forEach(t, function(t) {
            e.shuffleNumber(t)
        }), e.auto_focus()
    }, e.shuffleNumber = function(t) {
        if (0 == t) return;
        if (!t.number || t.is_shuffle) return;
        let n, r = e.Numbers.findIndex(function(e) {
            return e == t
        });
        e.Numbers[r].is_shuffle = !0, 3 == t.number.length ? n = i.shuffleThreeNumber(t.number) : 2 == t.number.length ? n = i.shuffleTwoNumber(t.number) : 1 == t.number.length && (n = i.shuffleOneNumber(t.number), e.Numbers[r].number = t.number + t.number + "", null != e.cacheIndex && (e.Numbers[r].top.amount = e.Numbers[e.cacheIndex].top.amount, e.Numbers[r].bottom.amount = e.Numbers[e.cacheIndex].bottom.amount)), angular.forEach(n, function(t) {
            if (e.Numbers[r].number != t) {
                let n = "",
                    r = "",
                    o = "";
                null != e.cacheIndex && (e.isAvailable("top", t) && (n = e.Numbers[e.cacheIndex].top.amount), e.isAvailable("bottom", t) && (r = e.Numbers[e.cacheIndex].bottom.amount), e.isAvailable("tode", t) && (o = e.Numbers[e.cacheIndex].tode.amount)), e.addShuffle(t, n, r, o)
            } else null != e.cacheIndex && (e.isAvailable("top", e.Numbers[r].number) && (e.Numbers[r].top.amount = e.Numbers[e.cacheIndex].top.amount), e.isAvailable("bottom", e.Numbers[r].number) && (e.Numbers[r].bottom.amount = e.Numbers[e.cacheIndex].bottom.amount), e.isAvailable("tode", e.Numbers[r].number) && (e.Numbers[r].tode.amount = e.Numbers[e.cacheIndex].tode.amount))
        }), e.Numbers.findIndex(function(t) {
            return "" == t.number
        }) < 0 && e.addNumber("", !1, "", "", "")
    }, e.addShuffle = function(t, n, r, o) {
        let i = e.Numbers.findIndex(function(t) {
            return "" == t.number
        });
        i < 0 ? e.addNumber(t, !0, n, r, o) : (e.Numbers[i].number = t, e.Numbers[i].is_shuffle = !0, e.Numbers[i].top.amount = n, e.Numbers[i].bottom.amount = r, e.Numbers[i].tode.amount = o)
    }, e.isAvailable = function(t, e) {
        return !!e && (e = e.replace("-", ""), "top" == t || ("bottom" == t ? e.length <= 2 : "tode" == t && 3 == e.length))
    }, e.onTicket = function() {
        if (+e.ticket.ticket_id > 0) {
            let t = e.TicketNumbers.find(function(t) {
                return +e.ticket.ticket_id == t.ticket_id
            });
            e.ticket.name = t.ticket_name
        } else e.ticket.name = "";
        e.set_focus("#ticket-name")
    }, 
    e.saveTicket = function() {
        e.Credit.use > 0 && f.swal({
            title: "ยืนยันส่งโพย!",
            showCancelButton: !0,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = l.defer();
                return r.saveTicket(e.ticket).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            "success" == t.value.result ? (e.reloadCredit(), e.clearNumber(), r.reloadBalance = !0, e.dtInstance.rerender()) : swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                r.reloadBalance = !0
            })
        })
    }, e.addNumbers = function() {
        for (let t = 1; t <= 10; t++) e.addNumber("", !1, "", "", "")
    }, e.addNumber = function(t, n, r, o, i) {
        e.Numbers.push({
            number: t,
            is_shuffle: n,
            top: {
                amount: r,
                discount: 0,
                pay: 0,
                return: 0
            },
            bottom: {
                amount: o,
                discount: 0,
                pay: 0,
                return: 0
            },
            tode: {
                amount: i,
                discount: 0,
                pay: 0,
                return: 0
            }
        })
    }, e.clearNumber = function() {
        e.ticket.name = "", e.Numbers = [], e.cacheIndex = null, e.addNumbers(), e.set_focus("#ticket-name")
    }, e.clearNumber(), e.hasCloseNumbers = function() {
        return !!e.Lottery.options.three_number_top || (!!e.Lottery.options.three_number_tode || (!!e.Lottery.options.two_number_top || (!!e.Lottery.options.two_number_bottom || (!!e.Lottery.options.two_number_tode || (!!e.Lottery.options.run_top || !!e.Lottery.options.run_bottom)))))
    }, e.number_format = function(t) {
        return _("number")(t)
    }, e.selectTicket = function() {
        e.dtInstance.rerender()
    }, e.cancelNumber = function(t) {
        let n = e.loadNumbers.find(function(e) {
            return e.t_number_id == t
        });
        a.can_cancel(e.Lottery.close_date_format, n.created_at, n.t_status) && f.swal({
            title: "ยกเลิก?",
            text: "ต้องการยกเลิกแทงหมายเลขนี้ใช่หรือไม่",
            showCancelButton: !0,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่ใช่",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = l.defer();
                return r.cancelNumber(n.t_number_id).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            "success" == t.value.result ? (e.reloadCredit(), r.reloadBalance = !0, e.dtInstance.rerender()) : swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                r.reloadBalance = !0, e.dtInstance.rerender()
            })
        })
    }, e.calTicket = function() {
        if (angular.isDefined(e.Credit)) {
            let t = 0,
                n = 0,
                r = 0,
                o = e.Promotion.promotion_info;
            e.ticket.numbers = [], angular.forEach(e.Numbers, function(t, n) {
                t.number && (1 == t.number.length ? (+t.top.amount > 0 && e.ticket.numbers.push({
                    type: "run_top",
                    number: t.number,
                    amount: +t.top.amount,
                    discount: Math.floor(+t.top.amount * o.run_top.discount / 100),
                    pay: o.run_top.pay,
                    return: +t.top.amount * o.run_top.pay
                }), +t.bottom.amount > 0 && e.ticket.numbers.push({
                    type: "run_bottom",
                    number: t.number,
                    amount: +t.bottom.amount,
                    discount: Math.floor(+t.bottom.amount * o.run_bottom.discount / 100),
                    pay: o.run_bottom.pay,
                    return: +t.bottom.amount * o.run_bottom.pay
                })) : 2 == t.number.length ? (+t.top.amount > 0 && e.ticket.numbers.push({
                    type: "two_number_top",
                    number: t.number,
                    amount: +t.top.amount,
                    discount: Math.floor(+t.top.amount * o.two_number_top.discount / 100),
                    pay: o.two_number_top.pay,
                    return: +t.top.amount * o.two_number_top.pay
                }), +t.bottom.amount > 0 && e.ticket.numbers.push({
                    type: "two_number_bottom",
                    number: t.number,
                    amount: +t.bottom.amount,
                    discount: Math.floor(+t.bottom.amount * o.two_number_bottom.discount / 100),
                    pay: o.two_number_bottom.pay,
                    return: +t.bottom.amount * o.two_number_bottom.pay
                }), +t.tode.amount > 0 && e.ticket.numbers.push({
                    type: "two_number_tode",
                    number: t.number,
                    amount: +t.tode.amount,
                    discount: Math.floor(+t.tode.amount * o.two_number_tode.discount / 100),
                    pay: o.two_number_tode.pay,
                    return: +t.tode.amount * o.two_number_tode.pay
                })) : 3 == t.number.length && (t.top.amount > 0 && e.ticket.numbers.push({
                    type: "three_number_top",
                    number: t.number,
                    amount: +t.top.amount,
                    discount: Math.floor(+t.top.amount * o.three_number_top.discount / 100),
                    pay: o.three_number_top.pay,
                    return: +t.top.amount * o.three_number_top.pay
                }), t.tode.amount > 0 && e.ticket.numbers.push({
                    type: "three_number_tode",
                    number: t.number,
                    amount: +t.tode.amount,
                    discount: Math.floor(+t.tode.amount * o.three_number_tode.discount / 100),
                    pay: o.three_number_tode.pay,
                    return: +t.tode.amount * o.three_number_tode.pay
                })))
            }), angular.forEach(e.ticket.numbers, function(e, o) {
                t += e.amount, r += e.discount, n += e.amount - e.discount
            }), e.Credit.use = t, e.Credit.discount = r, e.Credit.balance = e.Balance - n, e.ticket.total_amount = n
        }
    }, e.dtOptions = h.fromFnPromise(function() {
        var t = l.defer();
        return o.getNumbers(e.Lottery.lottery_id, e.select_ticket_id).then(function(n) {
            e.Summary = n.summary, e.loadNumbers = n.numbers, e.TicketNumbers = n.tickets, t.resolve(n.numbers)
        }), t.promise
    }).withDOM("<'row'<'col-md-12'>><'table-responsive't><'col-md-12'i><'col-md-12 text-center'p>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
        pagination: {
            classes: {
                ul: "pagination pagination-md"
            }
        }
    }).withLanguage({
        sSearch: "ค้นหา: ",
        sEmptyTable: "ไม่มีข้อมูล",
        infoEmpty: "",
        info: "แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ"
    }).withOption("lengthChange", !1).withOption("createdRow", function(t, n, r) {
        p(angular.element(t).contents())(e)
    }).withOption("autoWidth", !1).withOption("ordering", !1).withOption("responsive", !0), e.dtColumns = [b.newColumn(null).renderWith(function(t, e, n, r) {
        return a.status(t.t_status, t.created_at)
    }).withTitle("สถานะ"), b.newColumn(null).renderWith(function(t, e, n, r) {
        return u.ThaiDatetime(t.created_at)
    }).withTitle("เวลาเล่น"), b.newColumn("promotion_name").withTitle("โปร"), b.newColumn(null).renderWith(function(t, e, n, r) {
        return i.typeName(t.t_type)
    }).withTitle("ประเภท"), b.newColumn("t_number").withTitle("หมายเลข"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.t_amount)
    }).withTitle("จำนวน"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.t_discount)
    }).withTitle("ส่วนลด"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.t_credit)
    }).withTitle("เครดิตที่ใช้"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return a.can_cancel(e.Lottery.close_date_format, t.created_at, t.t_status) ? '<i class="fa fa-square-o" ng-click="toggleSelected(' + t.t_number_id + ")\" ng-class=\"{'fa-check-square-o': isSelected(" + t.t_number_id + "), 'fa-square-o': !isSelected(" + t.t_number_id + ')}"></i>' : ""
    }).withTitle("เลือก"), b.newColumn(null).renderWith(function(t, n, r, o) {
        return a.can_cancel(e.Lottery.close_date_format, t.created_at, t.t_status) ? '<button class="btn btn-warning btn-xs" ng-click="cancelNumber(' + t.t_number_id + ')"><i class="fa fa-times" aria-hidden="true"></i></button>' : ""
    }).withTitle("ลบ")], e.bulkcancel = [], e.cancel_ids = [], e.toggleSelected = function(t) {
        e.isSelected(t) ? e.cancel_ids = e.cancel_ids.filter(function(e) {
            return +e != +t
        }) : e.cancel_ids.push(t)
    }, e.isSelected = function(t) {
        return e.cancel_ids.find(function(e) {
            return +e == +t
        })
    }, e.SelectedAll = function() {
        e.cancel_ids.length > 0 ? e.cancel_ids = [] : angular.forEach(e.loadNumbers, function(t) {
            a.can_cancel(e.Lottery.close_date_format, t.created_at, t.t_status) && e.cancel_ids.push(t.t_number_id)
        })
    }, e.CancelSelected = function() {
        0 != e.cancel_ids.length && f.swal({
            title: "ยกเลิก?",
            text: "ต้องการยกเลิกหมายเลขที่เลือกใช่หรือไม่",
            showCancelButton: !0,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่ใช่",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = l.defer();
                return r.cancelNumbers(e.Lottery.lottery_id, e.cancel_ids).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            console.log(t), "success" == t.value.result ? (e.reloadCredit(), r.reloadBalance = !0, e.dtInstance.rerender()) : swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                r.reloadBalance = !0, e.dtInstance.rerender()
            })
        })
    }, e.$watch("Numbers", function(t, n) {
        e.calTicket()
    }, !0)
}]),


app.controller("TransactionCtrl", ["$window", "$scope", "MemberService", "APIService", "LotteryService", "DateService", "TicketService", "$q", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", "$state", "SweetAlert", function(t, e, n, r, o, i, u, a, l, s, c, m, d, f) {
    console.log("transaction controller"), 
    e.activeTab = "recent", 
    e.dtInstance = [];
    

    e.total_credit = 0;
    e.total_discount_credit = 0;
    e.net_total_credit = 0;
    e.total_win_credit = 0;
    e.net_total_win_lose_credit = 0;

    let p = new Date;
    e.current_date = p.getDate() + "/" + (p.getMonth()+1) + "/" + (p.getFullYear()+543);
    e.LottoTypes =o.lottery_types;
    e.filters = {
        from: new Date(p.getFullYear(), p.getMonth(), p.getDate() - 1),
        to: new Date(p.getFullYear(), p.getMonth(), p.getDate() ),
        lotto_type:"",
        lotto_type2:""
    }, 
    e.isFromDatePopup = !1, e.toggleFromDatePopup = function() {
        e.isFromDatePopup = !0
    }, 
    e.FromDateOptions = {
        formatDay: "dd",
        formatMonth: "MM",
        formatYear: "yyyy"
    }, e.isToDatePopup = !1, e.toggleToDatePopup = function() {
        e.isToDatePopup = !0
    }, e.ToDateOptions = {
        formatDay: "dd",
        formatMonth: "MM",
        formatYear: "yyyy"
    }, e.number_format = function(t) {
        return m("number")(t, 2)
    }, e.dtOptions = s.fromFnPromise(function() {
        let t = a.defer();
        return r.getTickets(e.activeTab, e.filters).then(function(n) {
            
            
            e.total_credit = n.summary.total_credit;
            e.total_discount_credit = n.summary.total_discount_credit;
            e.net_total_credit = n.summary.net_total_credit;
            e.total_win_credit = n.summary.total_win_credit;

            e.net_total_win_lose_credit = ((n.summary.total_credit+n.summary.total_discount_credit)+n.summary.total_win_credit);

            e.Tickets = n.tickets, t.resolve(n.tickets)
        }), t.promise
    }).withDOM("<'row'<'col-md-12'>><'table-responsive't><'row'<'col-md-12'i><'col-md-12 text-center'p>>").withBootstrap().withDisplayLength(50).withBootstrapOptions({
        pagination: {
            classes: {
                ul: "pagination pagination-md"
            }
        }
    }).withLanguage({
        sSearch: "ค้นหา: ",
        sEmptyTable: "ไม่มีข้อมูล",
        infoEmpty: "",
        info: "แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_ รายการ"
    }).withOption("lengthChange", !1).withOption("createdRow", function(t, n, r) {
        l(angular.element(t).contents())(e)
    }).withOption("autoWidth", !1).withOption("order", [0, "asc"]).withOption("responsive", !0), e.dtColumns = [c.newColumn("ticket_id").withTitle("เลขที่"), c.newColumn(null).renderWith(function(t, e, n, r) {
        return u.status(t.status, t.created_at)
    }).withTitle("สถานะ"), c.newColumn(null).renderWith(function(t, e, n, r) {
        return o.lotteryName(t.lottery_type)
    }).withTitle("หวย"), c.newColumn(null).renderWith(function(t, e, n, r) {
        return i.ThaiDate(t.lottery_date)
    }).withTitle("งวด"), c.newColumn(null).renderWith(function(t, e, n, r) {
        return i.ThaiDatetime(t.created_at)
    }).withTitle("วันที่"), c.newColumn("ticket_name").withTitle("ชื่อโพย"), c.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.total_amount)
    }).withTitle("จำนวน").withClass("text-right"), c.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.total_discount)
    }).withTitle("ส่วนลด").withClass("text-right"), c.newColumn(null).renderWith(function(t, n, r, o) {
        return e.number_format(t.total_credit)
    }).withTitle("เครดิต").withClass("text-right"), c.newColumn(null).renderWith(function(t, n, r, o) {
        return "Win" == t.status || "Lose" == t.status ? e.number_format(t.result_amount) : "-"
    }).withTitle("ผลชนะ").withClass("text-right"), c.newColumn(null).renderWith(function(t, e, n, r) {
        return '<button class="btn btn-info btn-xs" ng-click="viewTicket(' + t.ticket_id + ')"><i class="fa fa-search" aria-hidden="true"></i> ดูโพย</button>'
    }).withTitle("ดูโพย").withClass("text-right"), c.newColumn(null).renderWith(function(t, e, n, r) {
        return u.can_cancel(t.close_date, t.created_at, t.status) ? '<button class="btn btn-danger btn-xs" ng-click="cancelTicket(' + t.ticket_id + ')"><i class="fa fa-times" aria-hidden="true"></i> ยกเลิก</button>' : ""
    }).withTitle("คืนโพย").withClass("text-right")], 
    e.cancelTicket = function(t) {
        let r = e.Tickets.find(function(e) {
            return e.ticket_id == t
        });
        u.can_cancel(r.close_date, r.created_at, r.status) && f.swal({
            title: "คืนโพย!",
            text: "ต้องการคืนโพย เลขที่ #" + r.ticket_id + " ใช่หรือไม่",
            showCancelButton: !0,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่ใช่",
            confirmButtonClass: "btn btn-primary btn-alert-box",
            cancelButtonClass: "btn btn-warning btn-alert-box",
            showLoaderOnConfirm: !0,
            preConfirm: function() {
                var t = a.defer();
                return n.cancelTicket(r.ticket_id).then(function(e) {
                    t.resolve(e)
                }), t.promise
            }
        }).then(function(t) {
            "success" == t.value.result ? (n.reloadBalance = !0, e.dtInstance.rerender()) : swal({
                title: t.value.title,
                text: t.value.errorText,
                type: "error"
            }).then(function(t) {
                n.reloadBalance = !0, e.dtInstance.rerender()
            })
        })
    }, 
    
    e.viewTicket = function(t) {
        console.log(t), d.go("ticket", {
            ticket_id: t
        })
    }, 
    
    e.showTicket = function() {
        e.dtInstance.rerender()
    }, 

    e.lotteryFilter = function() {
        e.dtInstance.rerender()
    }, 
    
    e.toggleTab = function(t) {
        e.total_credit = 0;
        e.total_discount_credit = 0;
        e.net_total_credit = 0;
        e.net_total_win_lose_credit = 0;

        e.activeTab = t;
        if(e.filters.lotto_type == ""){ }else{
            e.dtInstance.rerender()
        }
    }
}]), app.directive("betCountdown", ["$interval", function(t) {
    return {
        restrict: "A",
        link: function(e, n, r) {
            let o, i, u, a, l, s = t(function() {
                o = moment(r.betCountdown), i = moment(new Date), (u = o.diff(i)) > 0 ? (a = moment.duration(u), l = Math.floor(a.asHours()) + moment.utc(u).format(" : mm : ss"), n[0].innerHTML = '<span class="alert-success">' + l + "</span>") : (n[0].innerHTML = '<span class="alert-danger">ปิดรับแทง</span>', t.cancel(s))
            }, 1e3)
        }
    }
}]), 

app.directive("countDown", ["$interval", function(t) {
    return {
        restrict: "A",
        link: function(e, n, r) {
            let o, i, u, a, l, s = t(function() {
                let sv_time = r.countDown.split("|")[1];
                let close_time = r.countDown.split("|")[0];
                //console.log(sv_time);
                //console.log(close_time);

                o = moment(close_time), 
                i = moment(sv_time), 
                (u = o.diff(i)) > 0 ? (a = moment.duration(u), l = Math.floor(a.asHours()) + moment.utc(u).format(" : mm : ss"), n[0].textContent = l) : (n[0].textContent = "ปิดรับแทง", t.cancel(s))

                //console.log(n[0].textContent)
               
            }, 1e3)
        }
    }
}]), app.directive("inputNumber", function() {
    return function(t, e, n) {
        e.bind("keypress", function(t) {
            let e = t.keyCode || t.which;
            0 != e && 46 != e && (e > 57 || e < 48) && t.preventDefault()
        })
    }
}), app.directive("loading", ["$http", function(t) {
    return {
        restrict: "A",
        link: function(e, n, r) {
            e.isLoading = function() {
                return t.pendingRequests.length > 0
            }, e.$watch(e.isLoading, function(t) {
                t ? n.show() : n.hide()
            })
        }
    }
}]), app.directive("ngLimitNumber", ["$interval", function(t) {
    return {
        restrict: "A",
        link: function(t, e, n) {
            e.bind("blur", function(r) {
                let o, i, u = n.ngLimitNumber.split(",");
                2 == u.length ? (o = +u[0], i = +u[1]) : (o = 0, i = +u[0]), +e[0].value > i ? swal({
                    title: "ผิดพลาด! ค่าไม่ถูกต้อง",
                    text: "สูงสุด " + i,
                    type: "warning"
                }).then(function() {
                    e[0].focus(), t.$apply()
                }) : +e[0].value < o && swal({
                    title: "ผิดพลาด! ค่าไม่ถูกต้อง",
                    text: "ต่ำสุด " + o,
                    type: "warning"
                }).then(function() {
                    e[0].focus(), t.$apply()
                })
            })
        }
    }
}]), app.directive("numberColor", ["$interval", "$filter", function(t, e) {
    return {
        restrict: "A",
        scope: {
            number: "@numberColor"
        },
        link: function(t, n, r) {
            function o(t) {
                t > 0 ? (n[0].style.color = "green", n[0].textContent = e("number")(t, 2)) : t < 0 ? (n[0].style.color = "red", n[0].textContent = e("number")(t, 2)) : (t || (n[0].textContent = "-"), n[0].style.color = "#333")
            }
            o(+t.number), t.$watch("number", function(t) {
                o(+t)
            })
        }
    }
}]), app.directive("numberColor", ["$interval", "$filter", function(t, e) {
    return {
        restrict: "C",
        link: function(t, n, r) {
            ! function(t) {
                t > 0 ? (n[0].style.color = "green", n[0].textContent = e("number")(t, 2)) : t < 0 && (n[0].style.color = "red", n[0].textContent = e("number")(t, 2))
            }(+n[0].textContent)
        }
    }
}]), app.directive("numberFormat", ["$interval", "$filter", function(t, e) {
    return {
        restrict: "C",
        link: function(t, n, r) {
            let o = +n[0].textContent;
            n[0].textContent = e("number")(o, 2)
        }
    }
}]), app.filter("absNumber", ["$filter", function(t) {
    return function(e, n) {
        return t("number")(Math.abs(+e), n)
    }
}]), app.filter("lotteryDate", ["DateService", function(t) {
    return function(e) {
        return t.ThaiDate(e)
    }
}]), app.filter("lotteryGroup", ["LotteryService", function(t) {
    return function(e) {
        return t.lottery_type[e]
    }
}]), app.filter("lotteryOptionName", ["LotteryService", function(t) {
    return function(e) {
        return t.typeName(e)
    }
}]), app.filter("ShortDate", ["DateService", function(t) {
    return function(e) {
        return t.ShortDate(e)
    }
}]), app.controller("MenuCtrl", ["$window", "$scope", "$q", "AuthService", "$state", function(t, e, n, r, o) {
    console.log("menu controller"), r.currentLogin().then(function(t) {
        "success" == t.result && (e.Profile = t.profile)
    }), e.is_state = function(t) {
        return o.is(t)
    }, e.logout = function() {
        r.Logout().then(function(e) {
            t.location.href = "../"
        })
    }
}]), app.controller("ProfileCtrl", ["$window", "$scope", "$q", "AuthService", function(t, e, n, r) {
    console.log("profile controller"), e.ProfileAlert = "", e.PasswordAlert = "", e.password = {
        old: "",
        new: "",
        confirm: ""
    }, e.formError = {
        old: !1,
        new: !1,
        confirm: !1
    }, e.defaultErrorText = function() {
        e.formErrorText = {
            old: "กรุณากรอก รหัสผ่านเดิม",
            new: "กรุณากรอก รหัสผ่านใหม่",
            confirm: "กรุณา ยืนยันรหัสผ่านใหม่"
        }
    }, r.profile().then(function(t) {
        e.Profile = t.profile
    }), e.SaveProfile = function() {
        r.saveProfile(e.Profile).then(function(t) {
            "success" == t.result ? e.ProfileAlert = '<div class="alert alert-success" role="alert"><i class="fa fa-check-square-o" aria-hidden="true"></i> บันทึกข้อมูลเสร็จเรียบร้อย</div>' : e.ProfileAlert = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <strong>ผิดพลาด!</strong> ไม่สามารถบันทึกข้อมูลได้ กรุณาติดต่อเจ้าหน้าที่</div>'
        })
    }, e.ChangePassword = function() {
        if (e.defaultErrorText(), e.formError = {
                old: !e.passwordForm.old.$valid,
                new: !e.passwordForm.new.$valid,
                confirm: !e.passwordForm.confirm.$valid
            }, e.passwordForm.$valid) return e.password.new != e.password.confirm ? (e.formError.confirm = !0, void(e.formErrorText.confirm = "ยืนยันรหัสผ่านใหม่ ไม่ถูกต้อง")) : void r.changePassword(e.password).then(function(n) {
            e.PasswordAlert = "", "success" == n.result ? (e.PasswordAlert = '<div class="alert alert-success" role="alert"><i class="fa fa-check-square-o" aria-hidden="true"></i> เปลี่ยนรหัสผ่านเสร็จเรียบร้อย</div>', setTimeout(function() {
                t.location.reload()
            }, 2e3)) : "old-error" == n.result ? (e.formError.old = !0, e.formErrorText.old = "รหัสผ่านเดิมไม่ถูกต้อง") : e.PasswordAlert = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <strong>ผิดพลาด!</strong> เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่</div>'
        })
    }, e.isAvailableChangePassword = !1, e.$watch("password", function(t, n) {
        e.AvailableChangePassword()
    }, !0), e.AvailableChangePassword = function() {
        "" != e.password.old && "" != e.password.new && "" != e.password.confirm ? e.password.new.length < 8 ? e.isAvailableChangePassword = !1 : e.password.new.length > 16 ? e.isAvailableChangePassword = !1 : e.password.new == e.password.confirm ? e.isAvailableChangePassword = !0 : e.isAvailableChangePassword = !1 : e.isAvailableChangePassword = !1
    }, e.defaultErrorText()
}]), 

app.factory("APIService", ["$window", "$q", "$http", "$filter", function(t, e, n, r) {
    return this.getUserStatus = function() {
        let t = e.defer();
        return n.get("../api/user-status").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.getUser = function(t) {
        let r = e.defer();
        return n.get("../api/user/" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getLotteryOptions = function() {
        let t = e.defer();
        return n.get("../api/lottery/info/options").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.getLotterySettings = function() {
        let t = e.defer();
        return n.get("../api/lottery/info/settings").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.getUsers = function() {
        let t = e.defer();
        return n.get("../api/user").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.saveUser = function(t) {
        let r = e.defer();
        return t.user_id > 0 ? n.post("../api/user/" + t.user_id, t).then(function(t) {
            r.resolve(t.data)
        }) : n.post("../api/user", t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getCredits = function(t, r) {
        let o = e.defer();
        return n.get("../api/user/" + t + "/credit?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.saveCredit = function(t) {
        let r = e.defer();
        return n.post("../api/user/" + t.user_id + "/credit", t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, 
    this.getLastLottery = function() {
        let t = e.defer();
        return n.get("../api/lottery/last").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.getPromotions = function(t) {
        let r = e.defer();
        return n.get("../api/promotion?type=" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getPromotion = function(t) {
        let r = e.defer();
        return n.get("../api/promotion/" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getLottery = function(t) {
        let r = e.defer();
        return n.get("../api/lottery/" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getNumbers = function(t, r) {
        let o = "";
        r > 0 && (o = "/" + r);
        let i = e.defer();
        return n.get("../api/lottery/" + t + "/numbers" + o).then(function(t) {
            i.resolve(t.data)
        }), i.promise
    }, this.getTicket = function(t) {
        let r = e.defer();
        return n.get("../api/ticket/" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, 
    
    this.getTickets = function(t, o) {
        let i = e.defer();
        //console.log(t);
        //console.log(o);
        if ("recent" == t) n.get("../api/ticket/recentfilter?lotto_type=" + o.lotto_type).then(function(t) {
            i.resolve(t.data)
        });
        else if ("history" == t) {
            let t = {
                from: r("date")(o.from, "yyyy-MM-dd"),
                to: r("date")(o.to, "yyyy-MM-dd"),
                lotto_type:o.lotto_type2
            };
            n.get("../api/ticket/history?" + $.param(t)).then(function(t) {
                i.resolve(t.data)
            })
        }
        return i.promise
    }, this.getResults = function(t) {
        let r = e.defer();
        return n.get("../api/lottery/results?type=" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getReports = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReportByMember = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "/by-member?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReportByMemberTicket = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "/by-member/ticket?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReportByType = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "/by-type?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReportByTypeNumbers = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "/by-type/numbers?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReportTickets = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "/by-ticket?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReportTicketNumbers = function(t, r) {
        let o = e.defer();
        return n.get("../api/report/" + t + "/by-ticket/numbers?" + $.param(r)).then(function(t) {
            o.resolve(t.data)
        }), o.promise
    }, this.getReceiveLimit = function(t) {
        let r = e.defer();
        return n.get("../api/setting/limit/" + t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.getReceiveLimits = function() {
        let t = e.defer();
        return n.get("../api/setting/limit").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.saveReceiveLimits = function(t) {
        let r = e.defer();
        return n.post("../api/setting/limits", t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.saveReceiveLimit = function(t) {
        let r = e.defer();
        return n.post("../api/setting/limit", t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this
}]), 

app.factory("AuthService", ["$window", "$q", "$http", function(t, e, n) {
    return this.Logout = function() {
        let t = e.defer();
        return n.post("../api/logout").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.currentLogin = function() {
        let t = e.defer();
        return n.get("../api/login").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.profile = function() {
        let t = e.defer();
        return n.get("../api/profile").then(function(e) {
            t.resolve(e.data)
        }), t.promise
    }, this.canAccess = function(n) {
        let r = e.defer();
        return this.currentLogin().then(function(e) {
            if ("success" == e.result) {
                Role.filter(function(t) {
                    return t == e.profile.role
                }).length > 0 ? r.resolve(e.profile) : (t.location.href = "../", r.resolve(!1))
            } else t.location.href = "../", r.resolve(!1)
        }), r.promise
    }, this.saveProfile = function(t) {
        let r = e.defer();
        return n.post("../api/profile", t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this.changePassword = function(t) {
        let r = e.defer();
        return n.post("../api/password", t).then(function(t) {
            r.resolve(t.data)
        }), r.promise
    }, this
}]), app.factory("CreditService", ["$window", "$q", "$http", function(t, e, n) {
    let r = {
        deposit: "เติมเงิน",
        withdraw: "ถอนเงิน",
        betting: "แทงหวย",
        "cancel-number": "ยกเลิกหมายเลข",
        "cancel-numbers": "ยกเลิกหมายเลข",
        "cancel-ticket": "คืนโพย",
        "member-deposit": "เติมเงินสมาชิก",
        "member-withdraw": "ถอนเงินจากสมาชิก",
        Win: "ถูกรางวัล",
        Summary: "สรุปยอดหวย"
    };
    return this.creditType = function(t) {
        return r[t]
    }, this
}]), app.factory("DateService", ["$window", "$q", "$http", function(t, e, n) {
    return this.ThaiDate = function(t) {
        return moment(t).add(543, "years").format("LL")
    }, this.ThaiDatetime = function(t) {
        return moment(t).add(543, "years").format("LLL")
    }, this.ShortDate = function(t) {
        return moment(t).add(543, "years").format("DD/MM/YYYY HH:mm:ss")
    }, this.ThaiMonth = function(t) {
        return moment(t).add(543, "years").format("MMMM YYYY")
    }, this
}]), app.factory("LotteryService", ["$window", "$q", "$http", function(t, e, n) {
    return this.lottery_type = {
        "lao-lottery": "หวยลาว",
        "hanoi-lottery": "หวยเวียดนาม ฮานอย",
        government: "หวยรัฐบาล"
        ,"pong-lottery":"หวยปิงปอง"
        ,"yiki-lottery":"หวยยี่กี"
        ,"1set-lottery":"หุ้นนิเคอิ เช้า"
        ,"2set-lottery":"หุ้นจีน เช้า"
        ,"3set-lottery":"หุ้นฮั่ง เช้า"
        ,"4set-lottery":"หุ้นไต้หวัน"
        ,"5set-lottery":"หุ้นเกาหลี"
        ,"6set-lottery":"หุ้นนิเคอิ บ่าย"
        ,"7set-lottery":"หุ้นจีน บ่าย"
        ,"8set-lottery":"หุ้นฮั่ง บ่าย"
        ,"9set-lottery":"หุ้นสิงคโป"
        ,"10set-lottery":"หุ้นไทย เย็น"
        ,"11set-lottery":"หุ้นอินเดีย"
        ,"12set-lottery":"หุ้นมาเลย์"
        ,"13set-lottery":"หุ้นอียิป"
        ,"14set-lottery":"หุ้นรัสเซีย"
        ,"15set-lottery":"หุ้นอังกฤษ"
        ,"16set-lottery":"หุ้นเยอรมัน"
        ,"17set-lottery":"หุ้นดาวโจนส์"
    },
    this.lottery_types = [{
        "category":"lao-lottery","name": "หวยลาว"},{
        "category":"hanoi-lottery","name": "หวยเวียดนาม ฮานอย"},{
        "category":"government","name": "หวยรัฐบาล"
    },{"category":"pong-lottery","name":"หวยปิงปอง"
},{"category":"yiki-lottery","name":"หวยยี่กี"
},{"category":"1set-lottery","name":"หุ้นนิเคอิ เช้า"
},{"category":"2set-lottery","name":"หุ้นจีน เช้า"
},{"category":"3set-lottery","name":"หุ้นฮั่ง เช้า"
},{"category":"4set-lottery","name":"หุ้นไต้หวัน"
},{"category":"5set-lottery","name":"หุ้นเกาหลี"
},{"category":"6set-lottery","name":"หุ้นนิเคอิ บ่าย"
},{"category":"7set-lottery","name":"หุ้นจีน บ่าย"
},{"category":"8set-lottery","name":"หุ้นฮั่ง บ่าย"
},{"category":"9set-lottery","name":"หุ้นสิงคโป"
},{"category":"10set-lottery","name":"หุ้นไทย เย็น"
},{"category":"11set-lottery","name":"หุ้นอินเดีย"
},{"category":"12set-lottery","name":"หุ้นมาเลย์"
},{"category":"13set-lottery","name":"หุ้นอียิป"
},{"category":"14set-lottery","name":"หุ้นรัสเซีย"
},{"category":"15set-lottery","name":"หุ้นอังกฤษ"
},{"category":"16set-lottery","name":"หุ้นเยอรมัน"
},{"category":"17set-lottery","name":"หุ้นดาวโจนส์"
    }]
    , this.number_type_name = {
        run_top: "วิ่งบน",
        run_bottom: "วิ่งล่าง",
        two_number_top: "2 ตัวบน",
        two_number_bottom: "2 ตัวล่าง",
        two_number_tode: "2 ตัวโต๊ด",
        three_number_top: "3 ตัวบน",
        three_number_tode: "3 ตัวโต๊ด",
        three_number_front: "3 ตัวหน้า",
        three_number_bottom: "3 ตัวล่าง"
    }, this.lotteryName = function(t) {
        return this.lottery_type[t]
    }, this.typeName = function(t) {
        return this.number_type_name[t]
    }, this.shuffleThreeNumber = function(t) {
        let e = t.split(""),
            n = [];
        return n.push(e[0] + e[1] + e[2]), n.push(e[0] + e[2] + e[1]), n.push(e[1] + e[0] + e[2]), n.push(e[1] + e[2] + e[0]), n.push(e[2] + e[0] + e[1]), n.push(e[2] + e[1] + e[0]), _.uniq(n)
    }, this.shuffleTwoNumber = function(t) {
        let e = t.split(""),
            n = [];
        return n.push(e[0] + e[1]), n.push(e[1] + e[0]), _.uniq(n)
    }, 
    this.shuffleOneNumber = function(t) {
        let e = [];
        for (let n = 0; n <= 9; n++) + t != n && (e.push(t + n + ""), e.push(n + t + ""));
        return _.uniq(e)
    }, 
    this.resultThreeNumberTode = function(t) {
        let e = t.split(""),
            n = [];
        return n.push(e[0] + e[1] + e[2]), n.push(e[0] + e[2] + e[1]), n.push(e[1] + e[0] + e[2]), n.push(e[1] + e[2] + e[0]), n.push(e[2] + e[0] + e[1]), n.push(e[2] + e[1] + e[0]), _.uniq(n)
    }, 
    this.resultTwoNumberTode = function(t) {
        let e = t.split(""),
            n = [];
        return n.push(e[0] + e[1]), n.push(e[0] + e[2]), n.push(e[1] + e[0]), n.push(e[1] + e[2]), n.push(e[2] + e[0]), n.push(e[2] + e[1]), _.uniq(n)
    }, 
    this.resultRunNumber = function(t) {
        let e = t.split("");
        return _.uniq(e)
    }, 

    this.numberResult = function(t, e) {
        return "lao" == t ? e.lao : "run_top" == t ? e.three_number_top : "run_bottom" == t ? e.two_number_bottom : "three_number_tode" == t ? e.three_number_top : "three_number_top" == t ? e.three_number_top : "two_number_top" == t ? e.two_number_top : "two_number_bottom" == t ? e.two_number_bottom : "two_number_tode" == t ? e.three_number_top : "-"
    }

    , this
}]), app.factory("TicketService", ["$window", "$q", "$http", function(t, e, n) {
    return this.status = function(t, e) {
        if ("Win" == t) return '<span class="label label-success">ถูกรางวัล</span>';
        if ("Lose" == t) return '<span class="label label-danger">ไม่ถูกรางวัล</span>';
        if ("Success" == t) return '<span class="label label-primary">ออกผลแล้ว</span>';
        if ("Process" == t) return '<span class="label label-warning">กำลังออกผล</span>';
        if ("Cancel" == t) return '<span class="label label-danger">ยกเลิก</span>';
        if ("New" == t) {
            let t = moment(new Date),
                n = moment(e);
            if (moment.duration(t.diff(n)).asMinutes() <= 30) return '<span class="label label-info">ใหม่</span>'
        }
        return '<span class="label label-primary">รับแทง</span>'
    }, this.can_cancel = function(t, e, n) {
        if ("New" == n) {
            let n = moment(new Date),
                r = moment(e),
                o = moment(t),
                i = moment.duration(n.diff(r)).asMinutes(),
                u = moment.duration(o.diff(n)).asMinutes();
            if (i <= 30 && u > 30) return !0
        }
        return !1
    }, this
}]);