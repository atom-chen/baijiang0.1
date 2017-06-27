/**
 * 战斗相关的逻辑模块
 */
namespace modBattle {
    /**
     * 创建一个刷新怪物的定时器
     */
    export function createTimer():void{
        timer = new egret.Timer(1000);
        timer.stop();
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, update, modBattle);
        maxEachWave = new Array();
    }

    /**
     * 初始化并启动定时器
     */
    export function init():void {
        timer.delay = 1000;
        timer.repeatCount = 1;
        productCount = 0;
        surviveCount = 0;
        getEnermyDistribute(GameData.curStage);
        timer.start();
    }

    /**
     * 开启或启动定时器
     */
    export function start():void {
        timer.start();
    }

    /**
     * 停止定时器
     */
    export function stop():void {
        timer.stop();
    }

    /**
     * 重置定时器
     */
    export function reset():void {
        timer.reset();
    }

    /**
     * 对象（战斗对象）回收
     */
    export function recycleObject():void {
        let heroCount = GameData.heros.length;
        let monsterCount = GameData.monsters.length;
        let bossCount = GameData.boss.length;
        ObjectPool.push("HeroData");
        for (let i = 0; i < heroCount; i++) {
            let hero:Hero = GameData.heros[i];
            hero.removeComplete();
            // hero.stopDragonBonesArmature();
            if (hero && hero.parent && hero.parent.removeChild) hero.parent.removeChild(hero);
            ObjectPool.push(GameData.heros[i]);
        }
        for (let i = 0; i < monsterCount; i++) {
            let monster:Monster = GameData.monsters[i];
            monster.removeComplete();
            if (monster && monster.parent && monster.parent.removeChild) {
                monster.parent.removeChild(monster);
            }                  
            ObjectPool.push(GameData.monsters[i]);
        }
        for (let i = 0; i < bossCount; i++) {
            let boss:Boss = GameData.boss[i];
            boss.removeComplete();
            if (boss && boss.parent && boss.parent.removeChild) {
                boss.parent.removeChild(boss);
            }                  
            ObjectPool.push(GameData.boss[i]);
        }
        for (let i = 0; i < heroCount; i++) GameData.heros.pop();
        for (let i = 0; i < monsterCount; i++) GameData.monsters.pop();
        for (let i = 0; i < bossCount; i++) GameData.boss.pop();
    }

    /**
     * 定时结束回调函数
     */
    function update():void{
        getSurviveCount();
    }

    /**
     * 计算关卡的敌人分别情况
     */
    function getEnermyDistribute(stage:number):void {
        //关卡的数据
        tcStage = ConfigManager.tcStage[stage-1];
        //敌人的最大数量
        let maxCount:number = tcStage.count;
        //波数
        let waveCount:number = tcStage.wave;
        //敌方的配置
        maxEachWave = MathUtils.randomStage(maxCount, waveCount);
        curWave = 0;
    }

    /**
     * 获取敌人存活的数量
     */
    function getSurviveCount():void{
        //地图上的敌人数量
        let count:number = GameData.monsters.length;
        surviveCount = 0;
        for (let i = 0; i < count; i++) {
            if (GameData.monsters[i].hp > 0) surviveCount ++;
        }
    }

    /**
     * 生产敌人
     */
    function production():void{
        //每次生产的数量
        let count:number = MathUtils.getRandom(1, 2);
        for (let i = 0; i < count; i++){
            //敌人的类型索引
            let index:number = MathUtils.getRandom(2);
            //生产的敌人数据
            let data:Array<any> = tcStage.monster[index];
            SceneManager.battleScene.createSingleMonster(data);
        }
    }

    /**生产的敌人数量 */
    var productCount:number;
    /**存活的敌人数量 */
    var surviveCount:number;
    /**关卡的配置数据 */
    var tcStage:any;
    /**每波敌方的最大数量 */
    var maxEachWave:Array<number>;
    /**当前的波数 */
    var curWave:number;
    /**定时器 */
    var timer:egret.Timer;
}