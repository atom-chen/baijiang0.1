class HeroData {
    public constructor (name:string) {
        this._name = name;
    }


    /**数据表 */
    private _list:Array<any>;
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