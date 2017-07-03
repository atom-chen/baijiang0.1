class TcManager{
    public constructor(){
        //(0)装备表 (1)升星配置表 (2)升级配置表
        let str_list:Array<string> = ["TcEquip_json","TcEquipStarUp_json","TcEquipUp_json"];
        this.tc_list = [];
        for(let i:number = 0; i < str_list.length; i++){
            this.tc_list[i] = RES.getRes(str_list[i]);
        }
    }

    public static Instance:TcManager;
    public static GetInstance():TcManager{
        if(this.Instance == null){
            this.Instance = new TcManager();
        }
        return this.Instance;
    }

    public GetTcEquipData(id:number):any{
        let list = this.tc_list[0];
        for(let i:number = 0; i < list.length; i++){
            if(id == list[i].id) return list[i];
        }

        return null;
    }

    public GetTcEquipStarUpData(grade:number,star:number):any{
        let list = this.tc_list[1];
        for(let i in list){
            if(list[i].stage == grade && list[i].star == star){
                return list[i];
            }
        }
        return null;
    }

    public GetTcEquipUpData(lv:number):any{
        let list = this.tc_list[2];
        for(let i:number = 0; i < list.length; i++){
            if(lv == list[i].lv){
                return list[i];
            }
        }
        return null;
    }

    public GetDataFromQuality(quality:number):any{
        if(quality < 0 || quality > 4) return;
        return this.damage_list[quality];
    }

    private tc_list:any;
    private damage_list:any = [[30, 30,0,0,0],[50, 50,20,0,0],[80, 80, 50, 1,0],
                          [150, 150, 80, 3, 3],[200, 200, 150, 5, 5]];
}