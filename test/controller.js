/**
 * Created by Class on 2017/3/15.
 */
require("../core/Core");
require("./behaviours/CBTIdle");
require("./behaviours/CBTIsNight");
require("./behaviours/CBTNightRound");
require("./behaviours/CBTOpenUmbrella");
require("./behaviours/CBTOutside");
require("./behaviours/CBTRain");
require("./behaviours/CBTRoot");
require("./behaviours/CBTRound");
require("./behaviours/CBTUmbrella");
require("./behaviours/CBTVigil");

Class({
    ClassName:"Game.Test.Controller",
    m_pTicker:null,
    m_pBTRoot:null,
    ctor:function()
    {
        this.m_pBTRoot = new Game.BT.CBTROOT;
        var CBTUmbrella = new Game.BT.CBTUmbrella;
        this.m_pBTRoot.AddChild(CBTUmbrella);


        CBTUmbrella.AddChild(new Game.BT.CBTOutside);
        CBTUmbrella.AddChild(new Game.BT.CBTRain);
        CBTUmbrella.AddChild(new Game.BT.CBTOpenUmbrella);





        var CBTVigil = new Game.BT.CBTVigil;
        this.m_pBTRoot.AddChild(CBTVigil);
        var CBTNightRound = new Game.BT.CBTNightRound;
        CBTVigil.AddChild(CBTNightRound);
        CBTVigil.AddChild(new Game.BT.CBTIdle);

        CBTNightRound.AddChild(new Game.BT.CBTIsNight);
        CBTNightRound.AddChild(new Game.BT.CBTRound);



    },
    Start:function()
    {
        if(null == this.m_pTicker)
        {
            this.m_pTicker = setInterval(this.Tick.bind(this),1000,this);
        }
    },
    Stop:function()
    {
        if(null == this.m_pTicker)
        {
            clearTimeout(this.m_pTicker);
            this.m_pTicker = null;
        }
    },
    Tick:function()
    {
        console.log("-------------------------------------");
        var out = {};
        var input = { };
        var rand = Math.random();
        if(rand > 0.5)
        {
            input["rain"] = true;
        }
        rand = Math.random();
        if(rand > 0.5)
        {
            input["outside"] = true;
        }
        rand = Math.random();
        if(rand > 0.5)
        {
            input["night"] = true;
        }

        this.m_pBTRoot.Tick(input,out)
    }


}).Static({
    Instance:Core.Instance
})


Game.Test.Controller.Instance.Start();