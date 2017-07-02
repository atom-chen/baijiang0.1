/**
 * 召唤
 */
class Summon extends SkillBase {
    public constructor() {
        super();
    }

    public init(target:any = null) {
        super.init();
        TimerManager.getInstance().doTimer(10000, 0, this._onCall, this);
        this.target = target;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
    }

    public update(target:any) {
        //每次生产的数量
        let count:number = MathUtils.getRandom(1, 2);
        for (let i = 0; i < count; i++){
            //敌人的类型索引
            let index:number = MathUtils.getRandom(2);
            //生产的敌人数据
            let data:Array<any> = this._summon[index];
            SceneManager.battleScene.createSingleMonster(data);
        }
    }

    public end() {
        super.end();
        ObjectPool.push(this);
        TimerManager.getInstance().remove(this._onCall, this);
    }

    /**
     * 召唤
     */
    private _onCall():void {
        Common.log("召唤小兵");
        this.target.armature.play("skill02", 1);
    }

    private target:any;
    private _summon:Array<any> = [
        ["monster01", 1],
        ["monster02", 1],
        ["monster03", 1]
    ]
}