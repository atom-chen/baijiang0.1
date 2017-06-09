/**
 * 游戏商城的逻辑
 */
namespace modShop {
    /**抽卡roll的范围 */
    var rolls:Array<any> = [[1, 5400], [5401, 8900], [8901, 9900], [9901, 10000]]
    /**
     * 抽卡逻辑(1~2:54, 3:35, 4:10, 5:1)
     * 1~2: [1, 5400]
     * 3: [5401, 8900]
     * 4: [8901, 9900]
     * 5: [9901, 10000]
     */
    function drawCard(roll:number):number {
        let id;
        if (roll >= rolls[0][0] && roll <= rolls[0][1]) {
            id = MathUtils.getRandom(1, 9);
        }
        else if (roll >= rolls[1][0] && roll <= rolls[1][1]) {
            id = MathUtils.getRandom(10, 14);
        }
        else if (roll >= rolls[2][0] && roll <= rolls[2][1]) {
            id = MathUtils.getRandom(15, 19);
        }
        else if (roll >= rolls[3][0] && roll <= rolls[3][1]) {
            id = MathUtils.getRandom(20, 24);
        }
        return id;
    }

    /**
     * 从紫色武器以上抽取(十抽情况下，前面9个在紫色品级一下的情况)
     */
    function certainlyPurple():number {
        Common.log("非洲难民");
        let roll:number = MathUtils.getRandom(8901, 10000);
        let id:number = drawCard(roll);
        return id;
    }

    /**
     * fisher-yates shuffle算法(洗牌算法)
     */
    function shuffle(arr:Array<number>):void {
        let len = arr.length;
        if (len == 0) return;
        let temp = 0;
        for (let i = 0; i < len; i++) {
                let j = MathUtils.getRandom(1, len);
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
        }
    }

    /**
     * 单抽(1~5星)
     */
    export function drawOnce():number {
        let roll:number = MathUtils.getRandom(1, 10000);
        let id:number = drawCard(roll);
        // Common.log("roll:", roll, "id:", id);
        return id;
    }

    /**
     * 十连(必出紫色武器以上)
     */
    export function drawTen():Array<number> {
        let ids:any[] = [];
        let isPurple:boolean = false;
        // 十抽
        for (let i = 0; i < 10; i++) {
            let id = drawOnce();
            // 判断是否有紫色武器以上
            if (id >= 15 && id <= 24) {
                isPurple = true;
            }
            ids.push(id);
        }
        if (isPurple == false) {
            ids.pop();
            let id = certainlyPurple();
            ids.push(id);
        }
        shuffle(ids);
        for (let i = 0; i < ids.length; i ++) {
            if (typeof(ids[i]) == "undefined") ids.splice(i, 1);
        }
        // Common.log("洗牌", ids, ids.length);
        return ids;
    }
}