namespace modHero {

    /**根据英雄的id获取索引 */
    export function getIndextFromId(id:number):number {
        let index:number;
        for (let i = 0; i < ConfigManager.tcHero.length; i++) {
            if (ConfigManager.tcHero[i].hero_id == id) {
                index = i;
                curIndex = i;
                break;
            }
        }
        return index;
    }

    export function getCurIndex():number {
        return curIndex;
    }

    var curIndex:number = 0;
}