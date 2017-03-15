/**
 * Created by Class on 2017/3/15.
 */

require("../core/Core");

Class({
    ClassName:"Game.BT.CBaseBTNode",
    Parent:null,
    Children:null,
    ctor:function()
    {
        this.Children = [];
    },

    Tick:function()
    {
        return true;
    },
    AddChild:function(p)
    {
        p.Parent = this;
        this.Children.push(p);
    },
    RemoveChild:function(p)
    {
        for(var i=0;i<this.Children.length;i++)
        {
            if(this.Children[i] == p)
            {
                p.Parent = null;
                this.Children.splice(i,1);
                return true;
            }
        }
        return false;
    }

})