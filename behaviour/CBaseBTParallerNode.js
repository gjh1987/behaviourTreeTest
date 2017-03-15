/**
 * Created by Class on 2017/3/15.
 */
require("./CBaseBTNode");
Class({
    ClassName:"Game.BT.CBaseBTParallerNode",
    Base:"Game.BT.CBaseBTNode",
    Tick:function(input,out)
    {
        for(var i=0;i<this.Children.length;i++)
        {
            this.Children[i].Tick(input,out);
        }
        return false;
    }

})