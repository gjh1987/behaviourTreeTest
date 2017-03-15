/**
 * Created by Class on 2017/3/15.
 */
require("./CBaseBTNode");
Core.$Defines("Game.Const.CBaseBTActionNode", global)({
    "State":{
        "Idle":0,
        "Executing":1,
        "Completed":2,
        "Failed":"-1"
    }
});
Class({
    ClassName:"Game.BT.CBaseBTActionNode",
    Base:"Game.BT.CBaseBTNode",

    State:0,
    ctor:function()
    {
        Game.BT.CBaseBTNode.prototype.ctor.apply(this,arguments);
        this.State = Game.Const.CBaseBTActionNode.State.Idle;
    },
    Enter:function()
    {
        this.State = Game.Const.CBaseBTActionNode.State.Executing;
        this.translateIn();
        return true;
    },
    Exit:function()
    {
        this.State = Game.Const.CBaseBTActionNode.State.Completed;
        this.translateOut();
        return true;
    },
    translateIn:function()
    {

    },
    translateOut:function()
    {

    }
})