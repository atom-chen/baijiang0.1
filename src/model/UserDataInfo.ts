class UserDataInfo{
    public constructor(){
    }

    public static instance:UserDataInfo;
    public static GetInstance():UserDataInfo{
        if(this.instance == null){
            this.instance = new UserDataInfo();
        }
        return this.instance;
    }

    public SaveEquipInfo():void{
        let equip_list:any = modEquip.EquipData.GetInstance().GetEquipList();
        localStorage.setItem("equip", JSON.stringify(equip_list));
    }

    public InitEquipInfo():void{
        let equip_list:any = JSON.parse(localStorage.getItem("equip"));
        if(equip_list == null) return;

        for(let i:number = 0; i < equip_list.length; i++){
            let equipInfo:modEquip.EquipInfo = new modEquip.EquipInfo();
            for(let j:number = 0; j < equip_list[i].attrType.length; j++){
                let attrType:modEquip.AttrType = new modEquip.AttrType(equip_list[i].attrType[j].type, equip_list[i].attrType[j].value);
                equipInfo.InsertAttrType(attrType);
            }
            equipInfo.Id = equip_list[i].id;
            equipInfo.Lv = equip_list[i].lv;
            equipInfo.Star = equip_list[i].star;
            equipInfo.SetEquipAttr(equip_list[i].attr_list);
            modEquip.EquipData.GetInstance().Add(equipInfo);
        }
    }

    public SaveData():void{
    }
}