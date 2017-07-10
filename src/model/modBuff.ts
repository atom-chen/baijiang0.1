/**
 * buff模块
 */
namespace modBuff {
    /**
     * 根据id获取buff配置
     */
    export function getBuff(id:number) {
        for (let i = 0; i < ConfigManager.buffConfig.length; i++) {
            let buffcof = ConfigManager.buffConfig[i];
            if (id == buffcof.id) return buffcof;
        }
        return null
    }

    /**
     * 是否存在buff
     */
    export function isExistBuff(buff:Array<any>, id:number):boolean {
        for (let i = 0; i < buff.length; i++) {
            if (buff[i].buffData.id == id) return true;
        }
        return false;
    }
}