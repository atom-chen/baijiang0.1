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
    /**天赋配置文件 */
    export var tcTalent:any;
    /**天赋消耗配置文件 */
    export var tcTalentUp:any;
    /**解锁天赋页配置文件 */
    export var tcUnlockTalentPage:any;
    /**骨架数据 */
    export var armatures:Array<string> = ["daoguang_effect", "diaochan", "monster01", "enter_monster_01", "Boss01",
        "Boss01_effect01", "blood_die", "diaochan_skill", "zhaoyun", "zhaoyun_skill", "buxiaoman", "buxiaoman_skill", "buff",
        "monster03", "monster02", "monster02_skill"];
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
        tcTalent = RES.getRes("TcTalent_json");
        tcTalentUp = RES.getRes("TcTalentUp_json");
        tcUnlockTalentPage = RES.getRes("TcUnlockTalentPage_json");
        initBattleDragonBones();
    }

    export function isInArmatures(name:string):boolean {
        let status:boolean = false;
        for (let i = 0; i < armatures.length; i++) {
            if (armatures[i] == name) {
                status = true;
                break;
            }
        }
        return status;
    }

    /**
     * 初始化骨骼的动画数据
     */
    function initBattleDragonBones():void {
        for (let i = 0; i < armatures.length; i++) {
            let name:string = armatures[i];
            let skeletonData = RES.getRes(name+"_ske_json");
            let textureData = RES.getRes(name+"_tex_json");
            let texture = RES.getRes(name+"_tex_png");
            DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
        }
    }
}