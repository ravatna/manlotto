"use strict";
const Version = (new Date).getTime(),
    Role = ["Senior", "Master", "Agent"];
let app = angular.module("Lottery", ["angular.filter", "ui.router", "ui.bootstrap", "ngSanitize", "datatables", "datatables.bootstrap", "ngAnimate"]);
app.config(["$stateProvider", "$urlRouterProvider", function(e, t) {
    let r = {
            name: "dashboard",
            url: "/",
            templateUrl: "../assets/templates/agent/dashboard.html?v=" + Version,
            controller: "DashboardCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    var r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        n = {
            name: "profile",
            url: "/profile",
            templateUrl: "../assets/templates/auth/profile.html?v=" + Version,
            controller: "ProfileCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    var r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        };
    e.state(r).state(n), t.when("/report", "/report/onprocess"), t.otherwise(function(e) {
        e.get("$state").go("dashboard")
    })
}]), app.directive("balance", ["AuthService", "AgentService", function(e, t) {
    return {
        restrict: "A",
        link: function(r, n, o) {
            r.$watch(function() {
                return t.reloadBalance
            }, function(e, n) {
                t.reloadBalance && r.reload()
            }), r.reload = function() {
                r.is_loading = !0, e.currentLogin().then(function(e) {
                    r.is_loading = !1, r.profile = e.profile, t.Balance = e.profile.balance, t.reloadBalance = !1
                })
            }, r.reload(), r.reloadBalance = function() {
                t.reloadBalance = !0
            }
        }
    }
}]), app.controller("CreditModalCtrl", ["$window", "$scope", "$q", "$uibModalInstance", "UserId", "AgentService", "APIService", "$compile", "DTOptionsBuilder", "DTColumnBuilder", function(e, t, r, n, o, i, a, s, l, c) {
    console.log("user credit modal controller", o), t.dtInstance = [], t.reloadUser = function() {
        a.getUser(o).then(function(e) {
            t.User = e.user, t.ModalTitle = "รายงานเครดิต: " + t.User.username, console.log(t.User)
        })
    }, t.reloadUser(), t.selectForm = "", t.toggleForm = function(e) {
        t.selectForm == e ? t.selectForm = "" : (t.selectForm = e, t.invalidDeposit = !1, t.invalidWithdraw = !1, t.isSuccess = !1, t.deposit = {
            type: "deposit",
            user_id: o,
            amount: 0,
            note: ""
        }, t.withdraw = {
            type: "withdraw",
            user_id: o,
            amount: 0,
            note: ""
        })
    }, t.saveDeposit = function() {
        t.deposit.amount > 0 ? a.saveCredit(t.deposit).then(function(e) {
            "success" == e.result && (t.isReload = !0, t.isSuccess = !0, t.reloadUser())
        }) : t.invalidDeposit = !0
    }, t.saveWithdraw = function() {
        t.withdraw.amount > 0 && t.withdraw.amount <= t.User.balance ? a.saveCredit(t.withdraw).then(function(e) {
            "success" == e.result && (t.isReload = !0, t.isSuccess = !0, t.reloadUser())
        }) : t.invalidWithdraw = !0
    }, t.closeForm = function() {
        t.selectForm = "", t.isSuccess && t.dtInstance.rerender()
    }, t.cancelForm = function() {
        t.isReload ? n.close("success") : n.close("cancel")
    }, t.dtOptions = l.fromFnPromise(function() {
        var e = r.defer();
        return a.getCredits(o).then(function(t) {
            e.resolve(t.credits)
        }), e.promise
    }).withDOM("<'row'<'col-md-12'f>><'table-responsive't><'row'<'col-md-12'i><'col-md-12 text-center'p>>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
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
    }).withOption("lengthChange", !1).withOption("createdRow", function(e, r, n) {
        s(angular.element(e).contents())(t)
    }).withOption("autoWidth", !1).withOption("order", [0, "desc"]).withOption("responsive", !0), t.dtColumns = [c.newColumn("credit_id").withTitle("เลขที่"), c.newColumn("created_at").withTitle("วันที่"), c.newColumn("credit_type").withTitle("ประเภท"), c.newColumn("credit_amount").withTitle("จำนวน"), c.newColumn("credit_balance").withTitle("คงเหลือ"), c.newColumn("action_by_name").withTitle("โดย"), c.newColumn("credit_note").withTitle("รายละเอียด")]
}]), app.controller("UserModalCtrl", ["$window", "$scope", "$q", "$uibModalInstance", "UserId", "UserStatus", "AgentService", "APIService", function(e, t, r, n, o, i, a, s) {
    console.log("add user modal controller"), t.UserStatus = i, t.Password = "", t.isSuccess = !1, t.ModalTitle = "เพิ่มสมาชิก", t.user = {
        user_id: 0,
        status: "Active",
        fullname: "",
        tel: "",
        line: ""
    }, t.formError = {
        fullname: !1
    }, t.saveUser = function() {
        t.formError = {
            fullname: !t.formUser.fullname.$valid
        }, t.formUser.$valid && s.saveUser(t.user).then(function(e) {
            "success" == e.result && (t.isSuccess = !0, t.Password = e.password, t.loadUser(e.user_id))
        })
    }, t.loadUser = function(e) {
        s.getUser(e).then(function(e) {
            "success" == e.result && (t.ModalTitle = "ข้อมูลสมาชิก", t.user = {
                user_id: e.user.user_id,
                username: e.user.username,
                status: e.user.status,
                fullname: e.user.fullname,
                tel: e.user.tel,
                line: e.user.line,
                password: t.Password
            })
        })
    }, t.cancelForm = function() {
        t.isSuccess ? n.close("success") : n.close("cancel")
    }, o > 0 && t.loadUser(o)
}]), app.controller("DashboardCtrl", ["$window", "$scope", function(e, t) {
    console.log("dashboard controller")
}]), app.factory("AgentService", ["$window", "$q", "$http", "$filter", function(e, t, r, n) {
    return this.reloadBalance = !1, this.Balance = 0, this.getRoles = function() {
        let e = t.defer();
        return r.get("../api/roles").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getAgentInfo = function() {
        let e = t.defer();
        return r.get("../api/agent/info").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.defaultUser = function() {
        let e = t.defer();
        return r.get("../api/agent/default-user").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getFinancialSummary = function() {
        let e = t.defer();
        return r.get("../api/agent/financial-summary").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getTransactions = function(e) {
        let n = t.defer();
        return r.get("../api/agent/transaction?" + $.param(e)).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getWinLose = function(e) {
        let o = t.defer(),
            i = {
                from: n("date")(e.from, "yyyy-MM-dd"),
                to: n("date")(e.to, "yyyy-MM-dd")
            };
        return r.get("../api/agent/win-lose?" + $.param(i)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this
}]), app.controller("FinancialCtrl", ["$window", "$scope", "$q", "CanAccess", function(e, t, r, n) {
    console.log("financial controller")
}]), app.controller("FinancialSummaryCtrl", ["$window", "$scope", "$q", "CanAccess", "AgentService", function(e, t, r, n, o) {
    console.log("financial summary controller"), o.getFinancialSummary().then(function(e) {
        t.Summary = e.summary, t.Roles = e.roles
    })
}]), app.controller("FinancialTransactionCtrl", ["$window", "$scope", "$q", "CanAccess", "AgentService", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "DateService", "CreditService", "$filter", function(e, t, r, n, o, i, a, s, l, c, u) {
    console.log("financial transaction controller"), t.dtInstance = [];
    let m = new Date;
    t.filters = {
        from: new Date(m.getFullYear(), m.getMonth(), m.getDate()),
        to: new Date(m.getFullYear(), m.getMonth(), m.getDate())
    }, t.date_range = "today", t.selected_month = "0", t.report_month = [];
    for (let e = 0; e < 12; e++) t.report_month.push({
        n: e,
        name: l.ThaiMonth(new Date(m.getFullYear(), m.getMonth() - e, m.getDate()))
    });
    t.dtOptions = a.fromFnPromise(function() {
        let e = r.defer();
        return o.getTransactions({
            from: u("date")(t.filters.from, "yyyy-MM-dd"),
            to: u("date")(t.filters.to, "yyyy-MM-dd")
        }).then(function(t) {
            e.resolve(t.credits)
        }), e.promise
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
    }).withOption("lengthChange", !1).withOption("createdRow", function(e, r, n) {
        i(angular.element(e).contents())(t)
    }).withOption("autoWidth", !1).withOption("ordering", !1).withOption("responsive", !0), t.dtColumns = [s.newColumn("credit_id").withTitle("เลขที่"), s.newColumn(null).renderWith(function(e, t, r, n) {
        return l.ThaiDatetime(e.created_at)
    }).withTitle("วันที่"), s.newColumn(null).renderWith(function(e, t, r, n) {
        return c.creditType(e.credit_type)
    }).withTitle("ประเภท"), s.newColumn("credit_amount").withTitle("จำนวน").withClass("number-color text-right"), s.newColumn("credit_balance").withTitle("คงเหลือ").withClass("number-color text-right"), s.newColumn("action_by_name").withTitle("โดย").withClass("text-center"), s.newColumn(null).renderWith(function(e, t, r, n) {
        return e.credit_note || "-"
    }).withTitle("รายละเอียด")], t.isOpenDatePopup = !1, t.toggleOpenDatePopup = function() {
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
                t.filters.from = new Date(m.getFullYear(), m.getMonth() - +t.selected_month, 1), t.filters.to = new Date(m.getFullYear(), m.getMonth() - +t.selected_month + 1, 0)
        }
        t.dtInstance.rerender()
    }
}]), app.config(["$stateProvider", "$urlRouterProvider", function(e, t) {
    let r = {
            name: "financial",
            url: "/financial",
            templateUrl: "../assets/templates/agent/financial/financial.html?v=" + Version,
            controller: "FinancialCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            },
            redirectTo: "financial.summary"
        },
        n = {
            name: "financial.transaction",
            url: "/transaction",
            templateUrl: "../assets/templates/agent/financial/transaction.html?v=" + Version,
            controller: "FinancialTransactionCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        o = {
            name: "financial.summary",
            url: "/summary",
            templateUrl: "../assets/templates/agent/financial/summary.html?v=" + Version,
            controller: "FinancialSummaryCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        };
    e.state(r).state(n).state(o)
}]), app.controller("ReportCtrl", ["$window", "$scope", "$q", "CanAccess", function(e, t, r, n) {
    console.log("report controller")
}]), app.controller("ReportDetailByMemberCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail by member controller");
    let a = {
        member_id: 0 | o.member_id
    };
    i.getReportByMember(o.lottery_id, a).then(function(e) {
        t.Members = e.members, t.memberRole = e.role, t.Roles = e.roles, t.Summary = e.summary, t.Referers = e.referers, t.calTotal()
    }), t.calTotal = function() {
        t.Summary = {
            member_bet: 0,
            member_discount: 0,
            member_total: 0,
            ag_receive: 0,
            ag_commission: 0,
            ag_total: 0,
            ma_receive: 0,
            ma_commission: 0,
            ma_total: 0,
            se_receive: 0,
            se_commission: 0,
            se_total: 0,
            ad_receive: 0,
            ad_commission: 0,
            ad_total: 0
        }, angular.forEach(t.Members, function(e, r) {
            t.Summary.member_bet += +e.member.bet, t.Summary.member_discount += +e.member.discount, t.Summary.member_total += +e.member.total, t.Summary.ag_receive += +e.agent.receive, t.Summary.ag_commission += +e.agent.commission, t.Summary.ag_total += +e.agent.total, t.Summary.ma_receive += +e.master.receive, t.Summary.ma_commission += +e.master.commission, t.Summary.ma_total += +e.master.total, t.Summary.se_receive += +e.senior.receive, t.Summary.se_commission += +e.senior.commission, t.Summary.se_total += +e.senior.total, t.Summary.ad_receive += +e.admin.receive, t.Summary.ad_commission += +e.admin.commission, t.Summary.ad_total += +e.admin.total
        })
    }
}]), app.controller("ReportDetailByMemberTicketCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail by member ticket controller"), i.getReportByMemberTicket(o.lottery_id, {
        member_id: o.member_id
    }).then(function(e) {
        t.Role = e.role, t.Roles = e.roles, t.Referers = e.referers, t.Numbers = e.numbers, t.calTotal()
    }), t.calTotal = function() {
        t.Summary = {
            total_amount: 0,
            ag_receive: 0,
            ma_receive: 0,
            se_receive: 0,
            ad_receive: 0
        }, angular.forEach(t.Numbers, function(e, r) {
            t.Summary.total_amount += +e.t_amount, t.Summary.ag_receive += +e.ag_receive, t.Summary.ma_receive += +e.ma_receive, t.Summary.se_receive += +e.se_receive, t.Summary.ad_receive += +e.ad_receive
        })
    }
}]), app.controller("ReportDetailByTicketCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail by ticket controller"), i.getReportTickets(o.lottery_id, {}).then(function(e) {
        t.Role = e.role, t.Tickets = e.tickets, console.log(t.Role), t.calTotal()
    }), t.calTotal = function() {
        t.Summary = {
            amount: 0,
            discount: 0,
            credit: 0,
            ag_receive: 0,
            ag_commission: 0,
            ag_total: 0,
            ma_receive: 0,
            ma_commission: 0,
            ma_total: 0,
            se_receive: 0,
            se_commission: 0,
            se_total: 0,
            ad_receive: 0,
            ad_commission: 0,
            ad_total: 0
        }, angular.forEach(t.Tickets, function(e, r) {
            t.Summary.amount += +e.amount, t.Summary.discount += +e.discount, t.Summary.credit += +e.credit, t.Summary.ag_receive += +e.ag_receive, t.Summary.ag_commission += +e.ag_commission, t.Summary.ag_total += +e.ag_total, t.Summary.ma_receive += +e.ma_receive, t.Summary.ma_commission += +e.ma_commission, t.Summary.ma_total += +e.ma_total, t.Summary.se_receive += +e.se_receive, t.Summary.se_commission += +e.se_commission, t.Summary.se_total += +e.se_total, t.Summary.ad_receive += +e.ad_receive, t.Summary.ad_commission += +e.ad_commission, t.Summary.ad_total += +e.ad_total
        })
    }
}]), app.controller("ReportDetailByTicketNumbersCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail by ticket numbers controller"), i.getReportTicketNumbers(o.lottery_id, {
        ticket_id: o.ticket_id
    }).then(function(e) {
        t.Role = e.role, t.Numbers = e.numbers, t.calTotal()
    }), t.calTotal = function() {
        t.Summary = {
            total_amount: 0,
            ag_receive: 0,
            ma_receive: 0,
            se_receive: 0,
            ad_receive: 0
        }, angular.forEach(t.Numbers, function(e, r) {
            t.Summary.total_amount += +e.t_amount, t.Summary.ag_receive += +e.ag_receive, t.Summary.ma_receive += +e.ma_receive, t.Summary.se_receive += +e.se_receive, t.Summary.ad_receive += +e.ad_receive
        })
    }
}]), app.controller("ReportDetailByTypeCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail by type controller"), i.getReportByType(o.lottery_id, {}).then(function(e) {
        t.Reports = e.reports, t.Role = e.role, t.calTotal()
    }), t.calTotal = function() {
        t.Summary = {
            amount: 0,
            discount: 0,
            credit: 0,
            ag_receive: 0,
            ag_commission: 0,
            ag_total: 0,
            ma_receive: 0,
            ma_commission: 0,
            ma_total: 0,
            se_receive: 0,
            se_commission: 0,
            se_total: 0,
            ad_receive: 0,
            ad_commission: 0,
            ad_total: 0
        }, angular.forEach(t.Reports, function(e, r) {
            t.Summary.amount += +e.amount, t.Summary.discount += +e.discount, t.Summary.credit += +e.credit, t.Summary.ag_receive += +e.ag_receive, t.Summary.ag_commission += +e.ag_commission, t.Summary.ag_total += +e.ag_total, t.Summary.ma_receive += +e.ma_receive, t.Summary.ma_commission += +e.ma_commission, t.Summary.ma_total += +e.ma_total, t.Summary.se_receive += +e.se_receive, t.Summary.se_commission += +e.se_commission, t.Summary.se_total += +e.se_total, t.Summary.ad_receive += +e.ad_receive, t.Summary.ad_commission += +e.ad_commission, t.Summary.ad_total += +e.ad_total
        })
    }
}]), app.controller("ReportDetailByTypeNumbersCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail by type number controller"), i.getReportByTypeNumbers(o.lottery_id, {
        type: o.type
    }).then(function(e) {
        t.Reports = e.reports, t.Role = e.role, t.calTotal()
    }), t.calTotal = function() {
        t.Summary = {
            amount: 0,
            discount: 0,
            credit: 0,
            ag_receive: 0,
            ag_commission: 0,
            ag_total: 0,
            ma_receive: 0,
            ma_commission: 0,
            ma_total: 0,
            se_receive: 0,
            se_commission: 0,
            se_total: 0,
            ad_receive: 0,
            ad_commission: 0,
            ad_total: 0
        }, angular.forEach(t.Reports, function(e, r) {
            t.Summary.amount += +e.amount, t.Summary.discount += +e.discount, t.Summary.credit += +e.credit, t.Summary.ag_receive += +e.ag_receive, t.Summary.ag_commission += +e.ag_commission, t.Summary.ag_total += +e.ag_total, t.Summary.ma_receive += +e.ma_receive, t.Summary.ma_commission += +e.ma_commission, t.Summary.ma_total += +e.ma_total, t.Summary.se_receive += +e.se_receive, t.Summary.se_commission += +e.se_commission, t.Summary.se_total += +e.se_total, t.Summary.ad_receive += +e.ad_receive, t.Summary.ad_commission += +e.ad_commission, t.Summary.ad_total += +e.ad_total
        })
    }
}]), app.controller("ReportDetailCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report detail controller"), i.getLottery(o.lottery_id).then(function(e) {
        t.Lottery = e.lottery
    })
}]), app.controller("ReportHistoryCtrl", ["$window", "$scope", "$q", "APIService", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "LotteryService", "DateService", "$filter", function(e, t, r, n, o, i, a, s, l, c) {
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
}]), app.controller("ReportHistoryLotteryCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("report historry lottery controller"), i.getLottery(o.lottery_id).then(function(e) {
        t.Lottery = e.lottery
    })
}]), app.controller("ReportLimitSettingCtrl", ["$window", "$scope", "$q", "CanAccess", "$stateParams", "APIService", function(e, t, r, n, o, i) {
    console.log("limit setting controller"), t.reload = function() {
        i.getReceiveLimit(o.lottery_id).then(function(e) {
            t.limit = e.limit
        })
    }, t.reload(), t.allInput = "", t.allSubmit = function() {
        "" != t.allInput && +t.allInput >= 0 && angular.forEach(t.limit.limit_option, function(e, r) {
            t.limit.limit_option[r] = +t.allInput
        })
    }, t.saveLimit = function() {
        i.saveReceiveLimit(t.limit).then(function(e) {
            "success" == e.result ? (swal({
                title: "บันทึกข้อมูลเสร็จเรียบร้อย",
                type: "success"
            }), t.reload()) : swal({
                title: "ผิดพลาด! กรุณาติดต่อเจ้าหน้าที่",
                type: "error"
            })
        })
    }
}]), app.controller("ReportOnprocessCtrl", ["$window", "$scope", "$q", "APIService", "CanAccess", function(e, t, r, n, o) {
    console.log("report onprocess controller"), t.memberRole = o.role, t.filter = {
        group: ""
    }, t.reloadReport = function() {
        n.getReports("onprocess", t.filter).then(function(e) {
            t.Lotteries = e.lotteries, t.Opens = e.opens, t.calTotal()
        })
    }, t.reloadReport(), t.calTotal = function() {
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
}]), app.config(["$stateProvider", "$urlRouterProvider", function(e, t) {
    let r = {
            name: "report",
            url: "/report",
            templateUrl: "../assets/templates/agent/report/report.html?v=" + Version,
            controller: "ReportCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            },
            redirectTo: "report.onprocess"
        },
        n = {
            name: "report.onprocess",
            url: "/onprocess",
            templateUrl: "../assets/templates/agent/report/onprocess.html?v=" + Version,
            controller: "ReportOnprocessCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        o = {
            name: "report.detail",
            url: "/detail/{lottery_id:int}",
            templateUrl: "../assets/templates/agent/report/detail.html?v=" + Version,
            controller: "ReportDetailCtrl",
            redirectTo: "report.detail.by_member"
        },
        i = {
            name: "report.detail.by_member",
            url: "/by-member",
            templateUrl: "../assets/templates/agent/report/detail-by-member.html?v=" + Version,
            controller: "ReportDetailByMemberCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        a = {
            name: "report.detail.by_member.sub_member",
            url: "/{member_id:int}",
            templateUrl: "../assets/templates/agent/report/detail-by-member.html?v=" + Version,
            controller: "ReportDetailByMemberCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        s = {
            name: "report.detail.by_member.ticket",
            url: "/{member_id:int}/ticket",
            templateUrl: "../assets/templates/agent/report/detail-by-member-ticket.html?v=" + Version,
            controller: "ReportDetailByMemberTicketCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        l = {
            name: "report.detail.by_type",
            url: "/by-type",
            templateUrl: "../assets/templates/agent/report/detail-by-type.html?v=" + Version,
            controller: "ReportDetailByTypeCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        c = {
            name: "report.detail.by_type.numbers",
            url: "/{type}",
            templateUrl: "../assets/templates/agent/report/detail-by-type-number.html?v=" + Version,
            controller: "ReportDetailByTypeNumbersCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        u = {
            name: "report.detail.by_ticket",
            url: "/by-ticket",
            templateUrl: "../assets/templates/agent/report/detail-by-ticket.html?v=" + Version,
            controller: "ReportDetailByTicketCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        m = {
            name: "report.detail.by_ticket.numbers",
            url: "/{ticket_id:int}",
            templateUrl: "../assets/templates/agent/report/detail-by-ticket-numbers.html?v=" + Version,
            controller: "ReportDetailByTicketNumbersCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        p = {
            name: "report.detail.by_ticket.member",
            url: "/member/{member_id:int}",
            templateUrl: "../assets/templates/agent/report/detail-by-ticket.html?v=" + Version,
            controller: "ReportDetailByTicketCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        d = {
            name: "report.detail.limit_setting",
            url: "/limit-setting",
            templateUrl: "../assets/templates/agent/report/limit-setting.html?v=" + Version,
            controller: "ReportLimitSettingCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        f = {
            name: "report.history",
            url: "/history",
            templateUrl: "../assets/templates/agent/report/history.html?v=" + Version,
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
        h = {
            name: "report.history.lottery",
            url: "/{lottery_id:int}",
            templateUrl: "../assets/templates/agent/report/history-lottery.html?v=" + Version,
            controller: "ReportHistoryLotteryCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        };
    e.state(r).state(f).state(n).state(o).state(i).state(a).state(s).state(l).state(c).state(u).state(m).state(p).state(d).state(h)
}]), app.controller("SettingCtrl", ["$window", "$scope", "$q", function(e, t, r) {
    console.log("setting controller")
}]), app.controller("SettingLimitCtrl", ["$window", "$scope", "$q", "CanAccess", "APIService", function(e, t, r, n, o) {
    console.log("setting limit controller"), t.reload = function() {
        o.getReceiveLimits().then(function(e) {
            t.Lotteries = e.lotteries
        })
    }, t.reload(), t.allInput = "", t.allSubmit = function() {
        "" != t.allInput && +t.allInput >= 0 && angular.forEach(t.Lotteries, function(e, r) {
            angular.forEach(e.limit_option, function(e, n) {
                t.Lotteries[r].limit_option[n] = +t.allInput
            })
        })
    }, t.saveLimit = function() {
        o.saveReceiveLimits(t.Lotteries).then(function(e) {
            "success" == e.result ? (swal({
                title: "บันทึกข้อมูลเสร็จเรียบร้อย",
                type: "success"
            }), t.reload()) : swal({
                title: "ผิดพลาด! กรุณาติดต่อเจ้าหน้าที่",
                type: "error"
            })
        })
    }
}]), app.config(["$stateProvider", "$urlRouterProvider", function(e, t) {
    let r = {
            name: "setting",
            url: "/setting",
            templateUrl: "../assets/templates/agent/setting/setting.html?v=" + Version,
            controller: "SettingCtrl",
            redirectTo: "setting.limit"
        },
        n = {
            name: "setting.limit",
            url: "/limit",
            templateUrl: "../assets/templates/agent/setting/limits.html?v=" + Version,
            controller: "SettingLimitCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        };
    e.state(r).state(n)
}]), app.controller("AddUserCtrl", ["$window", "$scope", "$q", "UserSetting", "APIService", "$state", "DefaultUser", "AgentInfo", "AgentService", function(e, t, r, n, o, i, a, s, l) {
    console.log("add user controller"), t.Roles = n[0].roles, t.UserStatus = n[1].status, t.LotteryOptions = n[2].options, t.LotterySettings = n[3].settings, t.AgentInfo = s.agent, t.share_level = [];
    for (let e = +t.AgentInfo.share; e >= 0; e -= .5) t.share_level.push(e);
    t.user = a, t.MemberShare = function() {
        if ("Member" == t.user.role) t.user.share = "0";
        else {
            let e = t.Roles.find(function(e) {
                return e.key == t.user.role
            });
            t.user.share = e.share + ""
        }
    }, t.isOpen = function(e) {
        return t.user.bet_opens[e].is_open
    }, t.isActiveTab = "on-off", t.toggleTab = function(e) {
        t.isActiveTab = e
    }, t.addUser = function() {
        o.saveUser(t.user).then(function(e) {
            "success" == e.result ? swal({
                title: "เพิ่มสมาชิกเสร็จเรียบร้อย",
                type: "success"
            }).then(function() {
                l.reloadBalance = !0, i.go("user.dashboard.setting", {
                    user_id: e.user_id
                })
            }) : "error" == e.result ? swal({
                title: e.text,
                type: "error"
            }) : swal({
                title: "ผิดพลาด! กรุณาติดต่อเจ้าหน้าที่",
                type: "error"
            })
        })
    }
}]), app.config(["$stateProvider", "$urlRouterProvider", function(e, t) {
    let r = {
            name: "user",
            url: "/user",
            templateUrl: "../assets/templates/agent/user/users.html?v=" + Version,
            controller: "UsersCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }],
                UserSetting: ["AgentService", "APIService", "$q", function(e, t, r) {
                    let n = r.defer();
                    return r.all([e.getRoles(), t.getUserStatus(), t.getLotteryOptions(), t.getLotterySettings()]).then(function(e) {
                        n.resolve(e)
                    }), n.promise
                }]
            }
        },
        n = {
            name: "user.add",
            url: "/add",
            templateUrl: "../assets/templates/agent/user/add.html?v=" + Version,
            controller: "AddUserCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }],
                DefaultUser: ["AgentService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.defaultUser().then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }],
                AgentInfo: ["AgentService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.getAgentInfo().then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        o = {
            name: "user.dashboard",
            url: "/{user_id:int}",
            templateUrl: "../assets/templates/agent/user/dashboard.html?v=" + Version,
            controller: "UserDashboardCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        i = {
            name: "user.dashboard.setting",
            url: "/setting",
            templateUrl: "../assets/templates/agent/user/setting.html?v=" + Version,
            controller: "UserSettingCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }],
                AgentInfo: ["AgentService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.getAgentInfo().then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        a = {
            name: "user.dashboard.financial",
            url: "/financial",
            templateUrl: "../assets/templates/agent/user/financial.html?v=" + Version,
            controller: "UserFinancialCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            },
            redirectTo: "user.dashboard.financial.search"
        },
        s = {
            name: "user.dashboard.financial.search",
            url: "/search",
            templateUrl: "../assets/templates/agent/user/financial-search.html?v=" + Version,
            controller: "UserFinancialSearchCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        l = {
            name: "user.dashboard.financial.deposit",
            url: "/deposit",
            templateUrl: "../assets/templates/agent/user/financial-deposit.html?v=" + Version,
            controller: "UserFinancialDepositCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        },
        c = {
            name: "user.dashboard.financial.withdraw",
            url: "/withdraw",
            templateUrl: "../assets/templates/agent/user/financial-withdraw.html?v=" + Version,
            controller: "UserFinancialWithdrawCtrl",
            resolve: {
                CanAccess: ["AuthService", "$q", function(e, t) {
                    let r = t.defer();
                    return e.canAccess(Role).then(function(e) {
                        r.resolve(e)
                    }), r.promise
                }]
            }
        };
    e.state(r).state(n).state(o).state(i).state(a).state(s).state(l).state(c)
}]), app.controller("UserDashboardCtrl", ["$window", "$scope", "$q", "UserSetting", "APIService", "$stateParams", "$state", function(e, t, r, n, o, i, a) {
    console.log("user dashboard controller"), t.userId = i.user_id, t.currentState = a.current.name, t.financialState = function() {
        return "user.dashboard.financial.search" == t.currentState || "user.dashboard.financial.deposit" == t.currentState || "user.dashboard.financial.withdraw" == t.currentState
    }
}]), app.controller("UserFinancialCtrl", ["$window", "$scope", "$q", "APIService", "CreditService", "DateService", "$compile", "DTOptionsBuilder", "DTColumnBuilder", "$filter", "$stateParams", function(e, t, r, n, o, i, a, s, l, c, u) {
    console.log("user financial controller"), t.userId = u.user_id;
    let m = new Date;
    t.dtInstance = [], t.filters = {
        from: new Date(m.getFullYear(), m.getMonth(), m.getDate()),
        to: new Date(m.getFullYear(), m.getMonth(), m.getDate())
    }, t.number_format = function(e) {
        return c("number")(e)
    }, t.dtOptions = s.fromFnPromise(function() {
        var e = r.defer();
        return n.getCredits(u.user_id, {
            from: c("date")(t.filters.from, "yyyy-MM-dd"),
            to: c("date")(t.filters.to, "yyyy-MM-dd")
        }).then(function(t) {
            e.resolve(t.credits)
        }), e.promise
    }).withDOM("<'table-responsive't><'row'<'col-md-12'i><'col-md-12 text-center'p>>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
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
    }).withOption("lengthChange", !1).withOption("createdRow", function(e, r, n) {
        a(angular.element(e).contents())(t)
    }).withOption("autoWidth", !1).withOption("order", [0, "desc"]).withOption("responsive", !0), t.dtColumns = [l.newColumn("credit_id").withTitle("เลขที่"), l.newColumn(null).renderWith(function(e, t, r, n) {
        return i.ShortDate(e.created_at)
    }).withTitle("วันที่"), l.newColumn(null).renderWith(function(e, t, r, n) {
        return o.creditType(e.credit_type)
    }).withTitle("ประเภท"), l.newColumn("credit_amount").withTitle("จำนวน").withClass("number-color text-right"), l.newColumn("credit_balance").withTitle("ยอดสุทธิ").withClass("number-color text-right"), l.newColumn("action_by_name").withTitle("โดย").withClass("text-center"), l.newColumn("credit_note").withTitle("รายละเอียด")]
}]), app.controller("UserFinancialDepositCtrl", ["$window", "$scope", "$stateParams", "APIService", "AgentService", function(e, t, r, n, o) {
    console.log("user financial deposit controller"), t.userId = r.user_id, t.MaxAmount = 0, t.deposit = {
        type: "deposit",
        user_id: r.user_id,
        amount: 0,
        note: ""
    }, o.getFinancialSummary().then(function(e) {
        t.MaxAmount = e.summary.credit_balance + e.summary.netamount
    }), t.saveDeposit = function() {
        t.deposit.amount > 0 && t.deposit.amount < t.MaxAmount ? n.saveCredit(t.deposit).then(function(e) {
            "success" == e.result && t.$parent.dtInstance.rerender()
        }) : swal({
            title: "ผิดพลาด! ยอดเงินไม่ถูกต้อง",
            type: "error"
        })
    }
}]), app.controller("UserFinancialSearchCtrl", ["$window", "$scope", "$stateParams", "DateService", function(e, t, r, n) {
    console.log("user financial search controller"), t.userId = r.user_id;
    let o = new Date;
    t.date_range = "today", t.selected_month = "0", t.report_month = [];
    for (let e = 0; e < 12; e++) t.report_month.push({
        n: e,
        name: n.ThaiMonth(new Date(o.getFullYear(), o.getMonth() - e, o.getDate()))
    });
    t.isOpenDatePopup = !1, t.toggleOpenDatePopup = function() {
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
                    t.$parent.filters.from = new Date(e.setDate(n)), t.$parent.filters.to = new Date(e.setDate(n + 6))
                }();
                break;
            case "month":
                t.$parent.filters.from = new Date(o.getFullYear(), o.getMonth() - +t.selected_month, 1), t.$parent.filters.to = new Date(o.getFullYear(), o.getMonth() - +t.selected_month + 1, 0)
        }
        t.$parent.dtInstance.rerender()
    }
}]), app.controller("UserFinancialWithdrawCtrl", ["$window", "$scope", "$stateParams", "APIService", function(e, t, r, n) {
    console.log("user financial withdraw controller"), t.userId = r.user_id, t.withdraw = {
        type: "withdraw",
        user_id: r.user_id,
        amount: 0,
        note: ""
    }, n.getUser(r.user_id).then(function(e) {
        "success" == e.result && (t.user = {
            user_id: e.user.user_id,
            balance: +e.user.balance
        })
    }), t.saveWithdraw = function() {
        t.withdraw.amount > t.user.balance ? swal({
            title: "ผิดพลาด! ยอดเงินไม่ถูกต้อง",
            type: "error"
        }) : t.withdraw.amount > 0 ? n.saveCredit(t.withdraw).then(function(e) {
            "success" == e.result && t.$parent.dtInstance.rerender()
        }) : swal({
            title: "ผิดพลาด! ยอดเงินไม่ถูกต้อง",
            type: "error"
        })
    }
}]), app.controller("UsersCtrl", ["$window", "$scope", "AgentService", "APIService", "UserSetting", "$q", "$uibModal", "$compile", "DTOptionsBuilder", "DTColumnBuilder", function(e, t, r, n, o, i, a, s, l, c) {
    console.log("users controller"), t.dtInstance = [], t.Roles = o[0].roles, t.UserStatus = o[1].status, t.dtOptions = l.fromFnPromise(function() {
        var e = i.defer();
        return n.getUsers().then(function(t) {
            e.resolve(t.users)
        }), e.promise
    }).withDOM("<'row'<'col-md-12'f>><'table-responsive't><'row'<'col-md-12'i><'col-md-12 text-center'p>>").withBootstrap().withDisplayLength(40).withBootstrapOptions({
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
    }).withOption("lengthChange", !1).withOption("createdRow", function(e, r, n) {
        s(angular.element(e).contents())(t)
    }).withOption("autoWidth", !1).withOption("responsive", !0), t.dtColumns = [c.newColumn(null).renderWith(function(e, t, r, n) {
        return n.row + 1
    }).withTitle("No."), c.newColumn(null).renderWith(function(e, r, n, o) {
        return t.Roles.find(function(t) {
            return e.user_role == t.key
        }).text
    }).withTitle("ระดับ"), c.newColumn("username").withTitle("ชื่อผู้ใช้"), c.newColumn("fullname").withTitle("ชื่อ"), c.newColumn(null).renderWith(function(e, t, r, n) {
        if (null != e.referer) return e.referer.fullname;
        return "-"
    }).withTitle("โดย"), c.newColumn("credit").withTitle("เครดิต").withClass("number-format text-right"), c.newColumn("balance").withTitle("ยอดสุทธิ").withClass("number-color text-right"), c.newColumn(null).renderWith(function(e, r, n, o) {
        return t.UserStatus.find(function(t) {
            return e.status == t.key
        }).text
    }).withTitle("สถานะ").withClass("text-center"), c.newColumn("last_login").withTitle("เข้าสู่ระบบล่าสุด"), c.newColumn(null).renderWith(function(e, t, r, n) {
        return '<div class="text-right"><a ui-sref="user.dashboard.setting({user_id: ' + e.user_id + '})" class="btn btn-info btn-sm"><i class="fa fa-file-text" aria-hidden="true"></i> รายละเอียด</a></div>'
    })]
}]), app.controller("UserSettingCtrl", ["$window", "$scope", "$q", "UserSetting", "APIService", "$stateParams", "AgentInfo", function(e, t, r, n, o, i, a) {
    console.log("user setting controller"), t.Roles = n[0].roles, t.UserStatus = n[1].status, t.LotteryOptions = n[2].options, t.LotterySettings = n[3].settings, t.AgentInfo = a.agent, t.share_level = [];
    for (let e = 100; e >= 0; e -= .5) t.share_level.push(e);
    t.MemberShare = function() {
        if ("Member" == t.user.role) t.user.share = "0";
        else {
            let e = t.Roles.find(function(e) {
                return e.key == t.user.role
            });
            t.user.share = e.share + ""
        }
    }, t.isActiveTab = "on-off", t.toggleTab = function(e) {
        t.isActiveTab = e
    }, t.updateUser = function() {
        o.saveUser(t.user).then(function(e) {
            "success" == e.result && console.log("response", e)
        }), o.saveUser(t.user).then(function(e) {
            "success" == e.result ? swal({
                title: "บันทึกข้อมูลเสร็จเรียบร้อย",
                type: "success"
            }) : "error" == e.result ? swal({
                title: e.text,
                type: "error"
            }) : swal({
                title: "ผิดพลาด! กรุณาติดต่อเจ้าหน้าที่",
                type: "error"
            })
        })
    }, t.loadUser = function(e) {
        o.getUser(e).then(function(e) {
            "success" == e.result && (t.user = {
                user_id: e.user.user_id,
                role: e.user.role,
                status: e.user.status,
                fullname: e.user.fullname,
                tel: e.user.tel,
                line: e.user.line,
                credit: e.user.credit,
                username: e.user.username,
                password: "",
                share: e.user.share,
                bet_setting: e.user.bet_setting,
                bet_opens: e.user.bet_opens
            }, t.credit2 = e.user.credit2)
        })
    }, t.loadUser(i.user_id)
}]), app.directive("betCountdown", ["$interval", function(e) {
    return {
        restrict: "A",
        link: function(t, r, n) {
            let o, i, a, s, l, c = e(function() {
                o = moment(n.betCountdown), i = moment(new Date), (a = o.diff(i)) > 0 ? (s = moment.duration(a), l = Math.floor(s.asHours()) + moment.utc(a).format(" : mm : ss"), r[0].innerHTML = '<span class="alert-success">' + l + "</span>") : (r[0].innerHTML = '<span class="alert-danger">ปิดรับแทง</span>', e.cancel(c))
            }, 1e3)
        }
    }
}]), app.directive("countDown", ["$interval", function(e) {
    return {
        restrict: "A",
        link: function(t, r, n) {
            let o, i, a, s, l, c = e(function() {

                let sv_time = n.countDown.split("|")[1];
                let close_time = n.countDown.split("|")[0];
                //console.log(sv_time);
                //console.log(close_time);

                o = moment(close_time), 
                i = moment(sv_time), 

                 (a = o.diff(i)) > 0 ? (s = moment.duration(a), l = Math.floor(s.asHours()) + moment.utc(a).format(" : mm : ss"), r[0].textContent = l) : (r[0].textContent = "ปิดรับแทง", e.cancel(c))
            }, 1e3)
        }
    }
}]), app.directive("inputNumber", function() {
    return function(e, t, r) {
        t.bind("keypress", function(e) {
            let t = e.keyCode || e.which;
            0 != t && 46 != t && (t > 57 || t < 48) && e.preventDefault()
        })
    }
}), app.directive("loading", ["$http", function(e) {
    return {
        restrict: "A",
        link: function(t, r, n) {
            t.isLoading = function() {
                return e.pendingRequests.length > 0
            }, t.$watch(t.isLoading, function(e) {
                e ? r.show() : r.hide()
            })
        }
    }
}]), app.directive("ngLimitNumber", ["$interval", function(e) {
    return {
        restrict: "A",
        link: function(e, t, r) {
            t.bind("blur", function(n) {
                let o, i, a = r.ngLimitNumber.split(",");
                2 == a.length ? (o = +a[0], i = +a[1]) : (o = 0, i = +a[0]), +t[0].value > i ? swal({
                    title: "ผิดพลาด! ค่าไม่ถูกต้อง",
                    text: "สูงสุด " + i,
                    type: "warning"
                }).then(function() {
                    t[0].focus(), e.$apply()
                }) : +t[0].value < o && swal({
                    title: "ผิดพลาด! ค่าไม่ถูกต้อง",
                    text: "ต่ำสุด " + o,
                    type: "warning"
                }).then(function() {
                    t[0].focus(), e.$apply()
                })
            })
        }
    }
}]), app.directive("numberColor", ["$interval", "$filter", function(e, t) {
    return {
        restrict: "A",
        scope: {
            number: "@numberColor"
        },
        link: function(e, r, n) {
            function o(e) {
                e > 0 ? (r[0].style.color = "green", r[0].textContent = t("number")(e, 2)) : e < 0 ? (r[0].style.color = "red", r[0].textContent = t("number")(e, 2)) : (e || (r[0].textContent = "-"), r[0].style.color = "#333")
            }
            o(+e.number), e.$watch("number", function(e) {
                o(+e)
            })
        }
    }
}]), app.directive("numberColor", ["$interval", "$filter", function(e, t) {
    return {
        restrict: "C",
        link: function(e, r, n) {
            ! function(e) {
                e > 0 ? (r[0].style.color = "green", r[0].textContent = t("number")(e, 2)) : e < 0 && (r[0].style.color = "red", r[0].textContent = t("number")(e, 2))
            }(+r[0].textContent)
        }
    }
}]), app.directive("numberFormat", ["$interval", "$filter", function(e, t) {
    return {
        restrict: "C",
        link: function(e, r, n) {
            let o = +r[0].textContent;
            r[0].textContent = t("number")(o, 2)
        }
    }
}]), app.filter("absNumber", ["$filter", function(e) {
    return function(t, r) {
        return e("number")(Math.abs(+t), r)
    }
}]), app.filter("lotteryDate", ["DateService", function(e) {
    return function(t) {
        return e.ThaiDate(t)
    }
}]), app.filter("lotteryGroup", ["LotteryService", function(e) {
    return function(t) {
        return e.lottery_type[t]
    }
}]), app.filter("lotteryOptionName", ["LotteryService", function(e) {
    return function(t) {
        return e.typeName(t)
    }
}]), app.filter("ShortDate", ["DateService", function(e) {
    return function(t) {
        return e.ShortDate(t)
    }
}]), app.controller("MenuCtrl", ["$window", "$scope", "$q", "AuthService", "$state", function(e, t, r, n, o) {
    console.log("menu controller"), n.currentLogin().then(function(e) {
        "success" == e.result && (t.Profile = e.profile)
    }), t.is_state = function(e) {
        return o.is(e)
    }, t.logout = function() {
        n.Logout().then(function(t) {
            e.location.href = "../"
        })
    }
}]), app.controller("ProfileCtrl", ["$window", "$scope", "$q", "AuthService", function(e, t, r, n) {
    console.log("profile controller"), t.ProfileAlert = "", t.PasswordAlert = "", t.password = {
        old: "",
        new: "",
        confirm: ""
    }, t.formError = {
        old: !1,
        new: !1,
        confirm: !1
    }, t.defaultErrorText = function() {
        t.formErrorText = {
            old: "กรุณากรอก รหัสผ่านเดิม",
            new: "กรุณากรอก รหัสผ่านใหม่",
            confirm: "กรุณา ยืนยันรหัสผ่านใหม่"
        }
    }, n.profile().then(function(e) {
        t.Profile = e.profile
    }), t.SaveProfile = function() {
        n.saveProfile(t.Profile).then(function(e) {
            "success" == e.result ? t.ProfileAlert = '<div class="alert alert-success" role="alert"><i class="fa fa-check-square-o" aria-hidden="true"></i> บันทึกข้อมูลเสร็จเรียบร้อย</div>' : t.ProfileAlert = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <strong>ผิดพลาด!</strong> ไม่สามารถบันทึกข้อมูลได้ กรุณาติดต่อเจ้าหน้าที่</div>'
        })
    }, t.ChangePassword = function() {
        if (t.defaultErrorText(), t.formError = {
                old: !t.passwordForm.old.$valid,
                new: !t.passwordForm.new.$valid,
                confirm: !t.passwordForm.confirm.$valid
            }, t.passwordForm.$valid) return t.password.new != t.password.confirm ? (t.formError.confirm = !0, void(t.formErrorText.confirm = "ยืนยันรหัสผ่านใหม่ ไม่ถูกต้อง")) : void n.changePassword(t.password).then(function(r) {
            t.PasswordAlert = "", "success" == r.result ? (t.PasswordAlert = '<div class="alert alert-success" role="alert"><i class="fa fa-check-square-o" aria-hidden="true"></i> เปลี่ยนรหัสผ่านเสร็จเรียบร้อย</div>', setTimeout(function() {
                e.location.reload()
            }, 2e3)) : "old-error" == r.result ? (t.formError.old = !0, t.formErrorText.old = "รหัสผ่านเดิมไม่ถูกต้อง") : t.PasswordAlert = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> <strong>ผิดพลาด!</strong> เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่</div>'
        })
    }, t.isAvailableChangePassword = !1, t.$watch("password", function(e, r) {
        t.AvailableChangePassword()
    }, !0), t.AvailableChangePassword = function() {
        "" != t.password.old && "" != t.password.new && "" != t.password.confirm ? t.password.new.length < 8 ? t.isAvailableChangePassword = !1 : t.password.new.length > 16 ? t.isAvailableChangePassword = !1 : t.password.new == t.password.confirm ? t.isAvailableChangePassword = !0 : t.isAvailableChangePassword = !1 : t.isAvailableChangePassword = !1
    }, t.defaultErrorText()
}]), app.factory("APIService", ["$window", "$q", "$http", "$filter", function(e, t, r, n) {
    return this.getUserStatus = function() {
        let e = t.defer();
        return r.get("../api/user-status").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getUser = function(e) {
        let n = t.defer();
        return r.get("../api/user/" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getLotteryOptions = function() {
        let e = t.defer();
        return r.get("../api/lottery/info/options").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getLotterySettings = function() {
        let e = t.defer();
        return r.get("../api/lottery/info/settings").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getUsers = function() {
        let e = t.defer();
        return r.get("../api/user").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.saveUser = function(e) {
        let n = t.defer();
        return e.user_id > 0 ? r.post("../api/user/" + e.user_id, e).then(function(e) {
            n.resolve(e.data)
        }) : r.post("../api/user", e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getCredits = function(e, n) {
        let o = t.defer();
        return r.get("../api/user/" + e + "/credit?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.saveCredit = function(e) {
        let n = t.defer();
        return r.post("../api/user/" + e.user_id + "/credit", e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getLastLottery = function() {
        let e = t.defer();
        return r.get("../api/lottery/last").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.getPromotions = function(e) {
        let n = t.defer();
        return r.get("../api/promotion?type=" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getPromotion = function(e) {
        let n = t.defer();
        return r.get("../api/promotion/" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getLottery = function(e) {
        let n = t.defer();
        return r.get("../api/lottery/" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getNumbers = function(e, n) {
        let o = "";
        n > 0 && (o = "/" + n);
        let i = t.defer();
        return r.get("../api/lottery/" + e + "/numbers" + o).then(function(e) {
            i.resolve(e.data)
        }), i.promise
    }, this.getTicket = function(e) {
        let n = t.defer();
        return r.get("../api/ticket/" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getTickets = function(e, o) {
        let i = t.defer();
        if ("recent" == e) r.get("../api/ticket/recent").then(function(e) {
            i.resolve(e.data)
        });
        else if ("history" == e) {
            let e = {
                from: n("date")(o.from, "yyyy-MM-dd"),
                to: n("date")(o.to, "yyyy-MM-dd")
            };
            r.get("../api/ticket/history?" + $.param(e)).then(function(e) {
                i.resolve(e.data)
            })
        }
        return i.promise
    }, this.getResults = function(e) {
        let n = t.defer();
        return r.get("../api/lottery/results?type=" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getReports = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReportByMember = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "/by-member?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReportByMemberTicket = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "/by-member/ticket?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReportByType = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "/by-type?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReportByTypeNumbers = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "/by-type/numbers?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReportTickets = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "/by-ticket?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReportTicketNumbers = function(e, n) {
        let o = t.defer();
        return r.get("../api/report/" + e + "/by-ticket/numbers?" + $.param(n)).then(function(e) {
            o.resolve(e.data)
        }), o.promise
    }, this.getReceiveLimit = function(e) {
        let n = t.defer();
        return r.get("../api/setting/limit/" + e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.getReceiveLimits = function() {
        let e = t.defer();
        return r.get("../api/setting/limit").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.saveReceiveLimits = function(e) {
        let n = t.defer();
        return r.post("../api/setting/limits", e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.saveReceiveLimit = function(e) {
        let n = t.defer();
        return r.post("../api/setting/limit", e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this
}]), app.factory("AuthService", ["$window", "$q", "$http", function(e, t, r) {
    return this.Logout = function() {
        let e = t.defer();
        return r.post("../api/logout").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.currentLogin = function() {
        let e = t.defer();
        return r.get("../api/login").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.profile = function() {
        let e = t.defer();
        return r.get("../api/profile").then(function(t) {
            e.resolve(t.data)
        }), e.promise
    }, this.canAccess = function(r) {
        let n = t.defer();
        return this.currentLogin().then(function(t) {
            if ("success" == t.result) {
                Role.filter(function(e) {
                    return e == t.profile.role
                }).length > 0 ? n.resolve(t.profile) : (e.location.href = "../", n.resolve(!1))
            } else e.location.href = "../", n.resolve(!1)
        }), n.promise
    }, this.saveProfile = function(e) {
        let n = t.defer();
        return r.post("../api/profile", e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this.changePassword = function(e) {
        let n = t.defer();
        return r.post("../api/password", e).then(function(e) {
            n.resolve(e.data)
        }), n.promise
    }, this
}]), app.factory("CreditService", ["$window", "$q", "$http", function(e, t, r) {
    let n = {
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
    return this.creditType = function(e) {
        return n[e]
    }, this
}]), app.factory("DateService", ["$window", "$q", "$http", function(e, t, r) {
    return this.ThaiDate = function(e) {
        return moment(e).add(543, "years").format("LL")
    }, this.ThaiDatetime = function(e) {
        return moment(e).add(543, "years").format("LLL")
    }, this.ShortDate = function(e) {
        return moment(e).add(543, "years").format("DD/MM/YYYY HH:mm:ss")
    }, this.ThaiMonth = function(e) {
        return moment(e).add(543, "years").format("MMMM YYYY")
    }, this
}]), app.factory("LotteryService", ["$window", "$q", "$http", function(e, t, r) {
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
    }, this.number_type_name = {
        run_top: "วิ่งบน",
        run_bottom: "วิ่งล่าง",
        two_number_top: "2 ตัวบน",
        two_number_bottom: "2 ตัวล่าง",
        two_number_tode: "2 ตัวโต๊ด",
        three_number_top: "3 ตัวบน",
        three_number_tode: "3 ตัวโต๊ด",
        three_number_front: "3 ตัวหน้า",
        three_number_bottom: "3 ตัวล่าง"
    }, this.lotteryName = function(e) {
        return this.lottery_type[e]
    }, this.typeName = function(e) {
        return this.number_type_name[e]
    }, this.shuffleThreeNumber = function(e) {
        let t = e.split(""),
            r = [];
        return r.push(t[0] + t[1] + t[2]), r.push(t[0] + t[2] + t[1]), r.push(t[1] + t[0] + t[2]), r.push(t[1] + t[2] + t[0]), r.push(t[2] + t[0] + t[1]), r.push(t[2] + t[1] + t[0]), _.uniq(r)
    }, this.shuffleTwoNumber = function(e) {
        let t = e.split(""),
            r = [];
        return r.push(t[0] + t[1]), r.push(t[1] + t[0]), _.uniq(r)
    }, this.shuffleOneNumber = function(e) {
        let t = [];
        for (let r = 0; r <= 9; r++) + e != r && (t.push(e + r + ""), t.push(r + e + ""));
        return _.uniq(t)
    }, this.resultThreeNumberTode = function(e) {
        let t = e.split(""),
            r = [];
        return r.push(t[0] + t[1] + t[2]), r.push(t[0] + t[2] + t[1]), r.push(t[1] + t[0] + t[2]), r.push(t[1] + t[2] + t[0]), r.push(t[2] + t[0] + t[1]), r.push(t[2] + t[1] + t[0]), _.uniq(r)
    }, this.resultTwoNumberTode = function(e) {
        let t = e.split(""),
            r = [];
        return r.push(t[0] + t[1]), r.push(t[0] + t[2]), r.push(t[1] + t[0]), r.push(t[1] + t[2]), r.push(t[2] + t[0]), r.push(t[2] + t[1]), _.uniq(r)
    }, this.resultRunNumber = function(e) {
        let t = e.split("");
        return _.uniq(t)
    }, this.numberResult = function(e, t) {
        return "lao" == e ? t.lao : "run_top" == e ? t.three_number_top : "run_bottom" == e ? t.two_number_bottom : "three_number_tode" == e ? t.three_number_top : "three_number_top" == e ? t.three_number_top : "two_number_top" == e ? t.two_number_top : "two_number_bottom" == e ? t.two_number_bottom : "two_number_tode" == e ? t.three_number_top : "-"
    }, this
}]), app.factory("TicketService", ["$window", "$q", "$http", function(e, t, r) {
    return this.status = function(e, t) {
        if ("Win" == e) return '<span class="label label-success">ถูกรางวัล</span>';
        if ("Lose" == e) return '<span class="label label-danger">ไม่ถูกรางวัล</span>';
        if ("Success" == e) return '<span class="label label-primary">ออกผลแล้ว</span>';
        if ("Process" == e) return '<span class="label label-warning">กำลังออกผล</span>';
        if ("Cancel" == e) return '<span class="label label-danger">ยกเลิก</span>';
        if ("New" == e) {
            let e = moment(new Date),
                r = moment(t);
            if (moment.duration(e.diff(r)).asMinutes() <= 30) return '<span class="label label-info">ใหม่</span>'
        }
        return '<span class="label label-primary">รับแทง</span>'
    }, this.can_cancel = function(e, t, r) {
        if ("New" == r) {
            let r = moment(new Date),
                n = moment(t),
                o = moment(e),
                i = moment.duration(r.diff(n)).asMinutes(),
                a = moment.duration(o.diff(r)).asMinutes();
            if (i <= 30 && a > 30) return !0
        }
        return !1
    }, this
}]);