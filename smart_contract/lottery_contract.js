'use strict'
var Lottery = function (text) {
    if (text) {
        var o = JSON.parse(text)
        this.id = o.messageId
        this.starter = o.starter // 发起人
        this.title = o.title // 抽奖标题
        this.desc = o.desc // 抽奖描述
        this.state = o.state // 抽奖状态
        this.award = o.award // 抽奖奖品
        this.awardCount = o.awardCount //奖品数量
        this.fans = o.fans //参与抽奖的人
        this.winner = o.winner // 中奖的人
    } else {
        this.id = 0
        this.starter = ''
        this.title = ''
        this.desc = ''
        this.state = ''
        this.award = ''
        this.awardCount = 0
        this.fans = []
        this.winner = []
    }
}

Lottery.prototype = {
    toString: function () {
        return JSON.stringify(this)
    }
}

var LotteryContract = function () {
    LocalContractStorage.defineMapProperty(this, 'lotteries', {
        parse: function (text) {
            return new Lottery(text)
        },
        stringify: function (o) {
            return o.toString()
        }
    })

    LocalContractStorage.defineProperty(this, "lotteryCount");

    LocalContractStorage.defineProperties(this, {
        owner: null
    })
}

LotteryContract.prototype = {
    init: function (owner) {
        this.lotteryCount = 0;
        this.owner = owner;
    },
    withdraw: function (amount) {
        if (Blockchain.transaction.from == this.owner) {
            var num = new BigNumber(amount)
            var result = Blockchain.transfer(Blockchain.transaction.from, num)
            return {
                'errcode': 0,
                'result': result
            }
        } else {
            return {
                'errcode': -1,
                'msg': 'not owner'
            }
        }
    },
    getLotterys: function () {
        var resultArr = []
        for (var i = 1; i <= this.lotteryCount; i++) {
            resultArr.push(this.lotteries.get(i))
        }
        return {
            'errcode': 0,
            'count': this.lotteryCount,
            'lotteries': resultArr
        }
    },
    addLottery: function (title, desc, award, awardCount) {
        this.lotteryCount++
        var id = this.lotteryCount
        var LotteryObj = new Lottery()
        LotteryObj.id = id
        LotteryObj.starter = Blockchain.transaction.from
        LotteryObj.title = title
        LotteryObj.desc = desc
        LotteryObj.award = award
        LotteryObj.awardCount = awardCount
        LotteryObj.fans = []
        LotteryObj.state = 'ing'
        LotteryObj.winner = []
        this.lotteries.put(id, LotteryObj);
        return {
            'errcode': null,
            'lottery': LotteryObj
        }
    },
    joinLottery: function (id, username) {
        var Lottery = this.lotteries.get(id)
        if (Lottery == undefined) {
            return {
                'errcode': -1,
                'msg': 'no this lottery'
            }
        }
        var joiner = {
            'id': Blockchain.transaction.from,
            'username': username
        }
        if (Lottery.state == 'ing') {
            for (var i = 0; i < Lottery.fans.length; i++) {
                var fan = Lottery.fans[i]
                if (fan['id'] == joiner['id']) {
                    return {
                        'errcode': -1,
                        'msg': 'have joined'
                    }
                }
            }
            Lottery.fans.push(joiner)
            this.lotteries.put(id, Lottery);
            return {
                'errcode': 0,
                'lottery': Lottery
            }
        } else {
            return {
                'errcode': -1,
                'msg': 'the lottery finished'
            }
        }
    },
    openLottery: function (id) {
        var Lottery = this.lotteries.get(id)
        if (Lottery == undefined) {
            return {
                'errcode': -1,
                'msg': 'no this lottery'
            }
        }
        if (Lottery.state == 'ing') {
            if (Lottery.starter != Blockchain.transaction.from) {
                return {
                    'errcode': -1,
                    'msg': 'you are not the starter'
                }
            }
            var joiners = Lottery.fans.slice()
            var winners = []
            if (joiners.length < Lottery.awardCount) { // 全部中奖
                for (var i = 0; i < joiners.length; i++) {
                    winners.push(joiners[index])
                }
            } else {
                for (var i = 0; i < Lottery.awardCount; i++) {
                    var index = parseInt(Math.random() * joiners.length);
                    winners.push(joiners[index])
                    joiners.splice(index, 1)
                }
            }
            Lottery.state = 'finished'
            Lottery.winner = winners
            this.lotteries.put(id, Lottery);
            return {
                'errcode': null,
                'lottery': Lottery
            }
        } else {
            return {
                'errcode': -1,
                'msg': 'the lottery finished'
            }
        }
    }

}

module.exports = LotteryContract