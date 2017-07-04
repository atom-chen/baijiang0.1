/**
 * 英雄的数据
 */
class HeroData {

    /**
     * 从服务器获取数据
     */
    public static initData(hero:any):void {
        HeroData.list = hero;
    }

    /**
     * 根据英雄的名字获取数据
     */
    public static getHeroData(name:string) {
        let data:any;
        if (!HeroData.list){
            data = ConfigManager.heroConfig[name];
        }else{
            data = HeroData.list[name];
        }
        return data;
    }

    /**
     * 添加新的英雄
     */
    public static addHeroData(name:string, data:any) {
        let hero = data[name];
        HeroData.list[name] = hero;
        HeroData.list[name]["lv"] = 1;        
        this.update();
    }

    /**
     * 判断是否已有英雄
     */
    public static hasHero(name:string):boolean {
        let status = false;
        for (var key in HeroData.list) {
            if (key == name) {
                status = true;
                break;
            }
        }
        return status;
    }

    public static setCurHeroData(name:string):void{
        this._curHeroData = HeroData.list[name];
    }

    /**
     * 更新英雄的数据
     */
    public static update():void{
        LeanCloud.GetInstance().SaveRoleData("hero", HeroData.list);
    }

    /**数据表 */
    public static list:any;
    /**当前英雄数据 */
    private static _curHeroData:any;
    /**英雄的id */
    private _id:number;
    /**英雄的名字 */
    private _name:string;
    /**攻击 */
    private _atk:number;
    /**血量 */
    private _hp:number;
    /**护甲 */
    private _def:number;
    /**闪避 */
    private _eva:number;
    /**暴击 */
    private _crit:number;
    /**移动速度 */
    private _mov:number;
    /**攻击速度 */
    private _atkspd:number;
    /**技能冷却 */
    private _cd:number;
}