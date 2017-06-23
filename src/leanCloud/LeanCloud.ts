const AV = window["AV"];
class LeanCloud{
    public constructor(){
    }

    public static instance:LeanCloud;
    public static GetInstance():LeanCloud{
        if(this.instance == null){
            this.instance = new LeanCloud();
        }
        return this.instance;
    }

    /** 注册账号 */
    public Register(username:string, password:string):void{
        let user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        user.signUp().then(function (User){
            Common.log(JSON.stringify(User))
            LeanCloud.createRoleData(user);
        }, function (error){
            console.log(" error ")
        });
    }

     /** 登入 */
    public Login(username:string, password:string):void{
         AV.User.logIn(username, password).then(function (loginedUser) {
            // 登录成功，跳转到商品 list 页面
            Common.log(JSON.stringify(loginedUser))
            LeanCloud.ObjectId = loginedUser.id; 
        }, function (error) {
            Common.log(JSON.stringify(error));
        });
    }

    /** 创建角色数据 */
    public static createRoleData(user:any):void{
        console.log(" enter create role");
        let RoleData = AV.Object.extend("RoleData");
        let rd = new RoleData();
        rd.set("lv", "1");
        rd.set("gold", "1000");
        rd.set("silver", "1000");
        rd.set("sole", "1000");
        rd.save().then(function(todo){
            user.set("roleId", todo.id);
            user.set("goodsId", "");
            user.save();
        },function(error){
            console.log(" create roledata error")
        })
    }

    /** 保存装备数据 */
    public SaveEquipData():void{

        if(LeanCloud.GoodsId.length == 0){
            let EquipData = AV.Object.extend("EquipData");
            let td = new EquipData();
            td.set("equip", JSON.stringify(modEquip.EquipData.GetInstance().GetEquipList()));
            td.save().then(function(todo){
                let data = todo.get("equip");
                Common.log(JSON.stringify(data));
                let query = new AV.Query("_User");
                LeanCloud.GoodsId = todo.id;
                query.get(LeanCloud.ObjectId).then(function(info){
                    info.set("goodsId", LeanCloud.GoodsId);
                    info.save();
                });
                
            },function(error){
                console.log("create equip error");
            })
        }
        else
        {
            let query = new AV.Query("EquipData");
            query.get(LeanCloud.GoodsId).then(function(todo){
                todo.set("equip", JSON.stringify(modEquip.EquipData.GetInstance().GetEquipList()));
                todo.save();
            },function(error){
                console.log(" save euqip error ")
            });
        }
    }

    /** 保存角色数据 */
    public SaveRoleData(tag:string, num:number):void{
        let query = new AV.Query("RoleData");
        query.get(LeanCloud.RoleId).then(function(todo){
            todo.set(tag, JSON.stringify(num));
            todo.save();
        });
    }

    /** 初始化装备数据 并将其保存到全局变量数组中 */
    public static InitEquipData():void{
        let query = new AV.Query("EquipData");
        query.get(LeanCloud.GoodsId).then(function(todo){
            Common.log(todo.get("equip"));
            let data = JSON.parse(todo.get("equip"));
            for(let i:number = 0; i < data.length; i++){
                let info = new modEquip.EquipInfo();
                info.Id = data[i].id;
                info.Lv = data[i].lv;
                info.Quality = data[i].quality;
                info.Star    = data[i].star;
                info.SetEquipAttr(data[i].attr_list);
                for(let j in data[i].attrType){
                    info.InsertAttrType(new modEquip.AttrType(data[i].attrType[j].type, data[i].attrType[j].value));
                }
                modEquip.EquipData.GetInstance().Add(info);
            }
             Common.log(data);
         },function(error){
             console.log(" init euqip error ")
         });
    }

    /** 获得初始数据 */
    public InitData():any{
       
        let query = new AV.Query("_User");

        query.get(LeanCloud.ObjectId).then(function(todo){
            LeanCloud.GoodsId = todo.get("goodsId");
            LeanCloud.RoleId = todo.get("roleId");
            if(LeanCloud.GoodsId.length != 0){
                LeanCloud.InitEquipData()
            }
        },
        function(error){
            console.log(" error")
        })
    }

    public UpObjectData(objName:string):void{

    }

    public static set ObjectId(val:string){
        this.objectId = val;
    }

    public static get ObjectId(){
        return this.objectId;
    }

    public static set GoodsId(val:string){
        this.goodsId = val;
    }

    public static get GoodsId(){
        return this.goodsId;
    }

    public static set RoleId(val:string){
        this.roleId = val;
    }

    public static get RoleId(){
        return this.roleId;
    }

    private static objectId:string;
    private static goodsId:string;
    private static roleId:string;
}