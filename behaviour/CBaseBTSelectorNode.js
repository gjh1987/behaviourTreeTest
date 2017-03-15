/**
 * Created by Class on 2017/3/15.
 */
require("./CBaseBTNode");
Class({
    ClassName:"Game.BT.CBaseBTSelectorNode",
    Base:"Game.BT.CBaseBTNode",
    Tick:function(input,out)
    {
        for(var i=0;i<this.Children.length;i++)
        {
            if(this.Children[i].Tick(input,out))
            {
                return true;
            }
        }
        return false;
    }

})