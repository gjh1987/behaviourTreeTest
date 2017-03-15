/**
 * Created by Class on 2017/3/15.
 */
require("../../behaviour/CBaseBTActionNode");
Class({
    ClassName:"Game.BT.CBTOpenUmbrella",
    Base:"Game.BT.CBaseBTActionNode",

    Tick:function()
    {
        console.log(" CBTOpenUmbrella ");
        return true;
    }
})