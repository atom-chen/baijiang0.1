/**
 * 武器详情
 */
class EquipInfoDialog extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/equipInfoSkin.exml";
    }

    public Init():void{
        super.Init();
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Show(info:modEquip.EquipInfo):void{
        super.Show();
        this.lab_name.text = modEquip.TcEquipData.GetInstance().GetEquipInfoFromId(info.Id).name;
        this.lab_lv.text   = info.Lv + "/100";
        this.lab_attr1.text = "+ " + info.GetEquipAttr()[1] + "攻击";
        this.lab_attr2.text = "+ " + info.GetEquipAttr()[0] + "生命";
        this.lab_attr3.text = "+ " + info.GetEquipAttr()[2] + "护甲";
        this.lab_attr4.text = "+ " + info.GetEquipAttr()[3] + "%暴击";
    }

    public Reset():void{
        this.btn_closeDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    public Close():void{
        super.Close();
        this.btn_closeDetail.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    /**武器配置文件 */
    private btn_closeDetail:eui.Group;

    private lab_name:eui.Label;
    private lab_lv:eui.Label;
    private lab_equiptor:eui.Label;
    private lab_attr1:eui.Label;
    private lab_attr2:eui.Label;
    private lab_attr3:eui.Label;
    private lab_attr4:eui.Label;
}