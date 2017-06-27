/**
 * 加载配置文件管理
 */
namespace ConfigManager {
    /**关卡配置文件 */
    export var tcStage:any;
    /**英雄数据配置文件 */
    export var heroConfig:any;
    /**敌方配置文件 */
    export var enermyConfig:any;

    /**装备配置文件 */
    export var tcEquip:any;
    /**英雄描述配置文件 */
    export var tcHero:any;
    /**技能配置文件 */
    export var tcSkill:any;
    /**
     * 加载配置文件
     */
    export function loadConfig() {
        tcStage = RES.getRes("TcStage_json");
        heroConfig = RES.getRes("heroConfig_json");
        enermyConfig = RES.getRes("enermyConfig_json");

        tcEquip = RES.getRes("TcEquip_json");
        tcHero = RES.getRes("TcHero_json");
        tcSkill = RES.getRes("TcSkill_json");
        initBattleDragonBones();
    }

    /**
     * 初始化骨骼的动画数据
     */
    function initBattleDragonBones():void {
        let arr:Array<string> = ["daoguang_effect", "diaochan", "monster01", "enter_monster_01", "Boss01",
        "Boss01_effect01", "blood_die", "diaochan_skill", "zhaoyun", "zhaoyun_skill", "buxiaoman", "buxiaoman_skill", "buff",
        "monster03", "monster02", "monster02_skill"];
        for (let i = 0; i < arr.length; i++) {
            let name:string = arr[i];
            let skeletonData = RES.getRes(name+"_ske_json");
            let textureData = RES.getRes(name+"_tex_json");
            let texture = RES.getRes(name+"_tex_png");
            DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
        }
    }
}