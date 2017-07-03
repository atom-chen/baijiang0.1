/**
 * 暴怒空斩
 */
class SolaCut extends SkillBase {
    public constructor() {
        super();
    }

    public init(target:any = null) {
        super.init();
        this.name = "SolaCut";
        TimerManager.getInstance().doTimer(5000, 0, this._release, this);
        this.target = target;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
    }

    public update(target:any=null) {

    }

    public end() {
        super.end();
        ObjectPool.push(this);
        TimerManager.getInstance().remove(this._release, this);
    }

    private _release():void {
        if (this.target.curState == "attack") return;
        this.target.gotoSkill();
    }

    private target:any;
}