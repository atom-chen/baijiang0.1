/**
 * 天赋逻辑
 */
namespace modTalent {
    /**
     * 解锁条件：
     * 1:[[1,2], [8, 9], [15, 16]]
     * 2:[[3,4], [10, 11], [17, 18]]
     * 3:[[5,6], [12, 13], [19, 20]]
     * 4:[7, 14, 21]
     */
    /**天赋的个数 */
    var talentCount:number = 21;
    /**玩家的天赋 */
    var talent:Array<any> = new Array();

    /**
     * 获取初始玩家天赋的配置
     */
    export function getInitialData():any {
        talent = [[1, 0], [2, 0], [8, 0], [9, 0], [15, 0], [16, 0]];
        return talent;
    }
    
    /**
     * 将当前的天赋页数值传递给talent
     */
    export function transTalent(curTalent:Array<any>):void {
        
    }

    /**
     * 初始化玩家天赋
     */
    export function init() {
        talent = [[1, 0], [2, 0], [8, 0], [9, 0], [15, 0], [16, 0]];
        // for (let i = 0; i < talentCount; i++) {
        //     let temp:Array<number> = new Array();
        //     temp = [i+1, 0];
        //     talent.push(temp);
        // }
        // Common.log(JSON.stringify(talent));
    }

}