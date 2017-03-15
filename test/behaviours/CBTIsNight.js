/**
 * Created by Class on 2017/3/15.
 */
require("../../behaviour/CBaseBTConditionNode");
Class({
    ClassName:"Game.BT.CBTIsNight",
    Base:"Game.BT.CBaseBTConditionNode",
    Tick:function(input,out)
    {
        return input.hasOwnProperty("night");
    }

})