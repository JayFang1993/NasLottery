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
    } else {
        this.id = 0
        this.starter = ''
        this.title = ''
        this.desc = ''
        this.state = ''
        this.award = ''
        this.awardCount = 0
        this.fans = []
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
                'error': null,
                'result': result
            }
        } else {
            return {
                'error': 'not owner',
                'result': null
            }
        }
    },
    getLotterys: function () {
        var resultArr = []
        for (var i = 0; i < this.lotteryCount; i++) {
            resultArr.push(this.lotteries.get(i))
        }
        return {
            'error': null,
            'count': this.lotteryCount,
            'lotteries': resultArr
        }
    },
    addLottery: function (title, desc, award, awardCount) {

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
        this.lotteries.put(id, LotteryObj);
        this.lotteryCount++;
        return {
            'error': null,
            'id': id,
            'total_count': this.lotteryCount,
            'lottery': LotteryObj
        }
    },
    joinLottery: function (id, username) {
        var Lottery = this.lotteries.get(id)
        if (Lottery != undefined && Lottery.state == 'ing') {
            var joiner = {
                'id': Blockchain.transaction.from,
                'username': username
            }
            Lottery.fans.push(joiner)
            this.lotteries.put(id, LotteryObj);
        }
        return {
            'error': null,
            'lottery': Lottery
        }
    }

}

module.exports = LotteryContract