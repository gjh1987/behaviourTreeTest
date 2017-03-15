/**
 * Created by Class on 2016/2/24.
 */
//var global = global || this;
var Core = {};
(function()
{
    Core.$AlwaysGetMember = function(a, c) {
        c || (c = global);
        if (!a || 0 >= a.length) return c;
        for (var b = a.split("."), d = 0; d < b.length; d++) {
            var e = b[d];
            if (!e || 0 === e.length) throw "$Defines:(obj,name) name format error.";
            if (c.hasOwnProperty(e)) c[e].constructor !== Object && (c[e] = {}),
                c = c[e];
            else {

                c = c[e] = {};
            }
        }
        return c
    }
    Core.$TryGetMember = function(a, c) {
        c || (c = global);
        if (!a || 0 >= a.length) return c;
        for (var b = a.split("."), d = 0; d < b.length; d++) {
            var e = b[d];
            if (!e || 0 === e.length) return null;
            if (c.hasOwnProperty(e))
                c = c[e];
            else {
                return null;
            }
        }
        return c
    }
    Core.$Defines = function(a, c) {
        var b = this.$AlwaysGetMember(a, c);
        return function(a, c) {
            for (var f in a) if (b.hasOwnProperty(f)) {

                 throw "Item defined "  + f + " defined before.";
            } else b[f] = a[f];
            return b
        }
    }
    Core.$AlwaysDefines = function(a,c)
    {
        var b = global;
        var d = a.split(".");
        for(var i=0;i<d.length;i++)
        {
            var key = d[i];
            if(i == d.length-1)
                b[key] = c;
            else
            {
                if(!b[key])
                    b[key] = {};
                b = b[key] ;
            }
        }
    }
    var fnTest  = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    var cc = cc;
    if(cc && cc.Class)
    {
        Core.baseClass = cc.Class;
    }
    else
    {
        Core.ClassManager = {};

        Core.clone = function (obj) {

            var newObj = (obj.constructor) ? new obj.constructor : {};

            for (var key in obj) {
                var copy = obj[key];
                // Beware that typeof null == "object" !
                if (((typeof copy) === "object") && copy  && !(copy instanceof HTMLElement)) {
                    newObj[key] = Core.clone(copy);
                } else {
                    newObj[key] = copy;
                }
            }
            return newObj;
        };

        var id = 1,
            instanceid = 1;
        Core.expand = function(root, name) {
            var results = [], parts, part;
            if (/^\.\.?(\/|$)/.test(name)) {
                parts = [root, name].join('/').split('/');
            } else {
                parts = name.split('/');
            }
            for (var i = 0, length = parts.length; i < length; i++) {
                part = parts[i];
                if (part == '..') {
                    results.pop();
                } else if (part != '.' && part != '') {
                    results.push(part);
                }
            }
            return results.join('/');
        }
        Core.forceRequire = function (file,fileTye)
        {
            file = '/' + Core.expand('',file) + (fileTye || ".json");

            if(require.cache[file]  )
            {
                delete require.cache[file]
            }

            return require(file);
        }
        Core.NewClassId = function()
        {
            return id++;
        }
        Core.NewInstanceId = function()
        {
            return instanceid++;
        }





        Core.baseClass = function () {
        };
        Core.baseClass.extend = function (props) {
            var _super = this.prototype;

            // Instantiate a base Class (but only create the instance,
            // don't run the init constructor)
            var prototype = Object.create(_super);


            var classId = Core.NewClassId();
            Core.ClassManager[classId] = _super;
            // Copy the properties over onto the new prototype. We make function
            // properties non-eumerable as this makes typeof === 'function' check
            // unneccessary in the for...in loop used 1) for generating Class()
            // 2) for cc.clone and perhaps more. It is also required to make
            // these function properties cacheable in Carakan.
            var desc = { writable: true, enumerable: false, configurable: true };

            prototype.__instanceId = null;

            // The dummy Class constructor
            function Class() {
                this.__instanceId = Core.NewInstanceId();
                // All construction is actually done in the init method

                if (this.ctor)
                    this.ctor.apply(this, arguments);
            }

            Class.id = classId;
            // desc = { writable: true, enumerable: false, configurable: true,
            //          value: XXX }; Again, we make this non-enumerable.
            desc.value = classId;
            Object.defineProperty(prototype, '__pid', desc);

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            desc.value = Class;
            Object.defineProperty(Class.prototype, 'constructor', desc);

            // Copy getter/setter
            this.__getters__ && (Class.__getters__ = Core.clone(this.__getters__));
            this.__setters__ && (Class.__setters__ = Core.clone(this.__setters__));

            for(var idx = 0, li = arguments.length; idx < li; ++idx) {
                var prop = arguments[idx];
                for (var name in prop) {
                    var isFunc = (typeof prop[name] === "function");
                    var override = (typeof _super[name] === "function");
                    var hasSuperCall = fnTest.test(prop[name]);

                    if (isFunc && override && hasSuperCall) {
                        desc.value = (function (name, fn) {
                            return function () {
                                var tmp = this._super;

                                // Add a new ._super() method that is the same method
                                // but on the super-Class
                                this._super = _super[name];

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);
                                this._super = tmp;

                                return ret;
                            };
                        })(name, prop[name]);
                        Object.defineProperty(prototype, name, desc);
                    } else if (isFunc) {
                        prototype[name] = prop[name];
                    } else {
                        var pobj = prop[name];
                        if(pobj instanceof Object && (pobj.set || pobj.get))
                        {

                            if(pobj.get )
                            {
                                prototype.__defineGetter__(name, pobj.get)
                            }
                            if(pobj.set )
                            {
                                prototype.__defineSetter__(name, pobj.set )
                            }

                            var defaultValue = pobj.value || 0;
                            if(pobj.key)
                            {
                                prototype[pobj.key] = defaultValue;
                            }
                            else if(defaultValue){
                                prototype["__"+name] =defaultValue;
                            }

                        }
                        else
                        {
                            prototype[name] = pobj;
                        }
                        //prototype[name] = prop[name];
                    }

                    if (isFunc) {
                        // Override registered getter/setter
                        var getter, setter, propertyName;
                        if (this.__getters__ && this.__getters__[name]) {
                            propertyName = this.__getters__[name];
                            for (var i in this.__setters__) {
                                if (this.__setters__[i] === propertyName) {
                                    setter = i;
                                    break;
                                }
                            }
                            cc.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                        }
                        if (this.__setters__ && this.__setters__[name]) {
                            propertyName = this.__setters__[name];
                            for (var i in this.__getters__) {
                                if (this.__getters__[i] === propertyName) {
                                    getter = i;
                                    break;
                                }
                            }
                            cc.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                        }
                    }
                }
            }

            // And make this Class extendable
            Class.extend = Core.baseClass.extend;

            //add implementation method
            Class.implement = function (prop) {
                for (var name in prop) {
                    prototype[name] = prop[name];
                }
            };
            Class.Static = function(funs)
            {
                for(var fname in funs)
                {
                    var f = funs[fname];
                    if(f instanceof Object && (f.set || f.get) )
                    {
                        Object.defineProperty(Class,fname,f);

                        var defaultValue = f.value || 0;
                        if(f.key)
                        {
                            Class[f.key] = defaultValue;
                        }
                        else if(defaultValue){
                            Class["__"+fname] =defaultValue;
                        }
                    }
                    else
                        Class[fname] = f;
                }
                return Class;
            }

            var oldContructor = prototype.__proto__.constructor;
            for(var key in oldContructor)
            {
                if(!Class.hasOwnProperty(key))
                {
                    Class[key] = oldContructor[key];
                }
            }

            if(prop.ClassName)
            {
                Core.$AlwaysDefines(prop.ClassName,Class)
            }
            return Class;
        };


    }

    Core.baseClass = Core.baseClass.extend({
        $Dispose:function()
        {
            if(this.destruct)
            {
                this.destruct();
            }
            //for(var key in this)
            //{
            //    if(this[key].$Dispose)
            //    {
            //        this[key].$Dispose();
            //    }
            //    delete this[key];
            //}
        }
    })
    Core.Instance =
    {
        get:function(){
            if(!this.__instance)
            {
                this.__instance = new this;
            }
            return this.__instance;
        }
    }


    //Core.$AlwaysDefines("Class",function(b)
    //{
    //    if(b.Base)
    //    {
    //        var baseClass = Core.$TryGetMember(b.Base);
    //        if(baseClass && baseClass.extend)
    //        {
    //            return baseClass.extend(b);
    //        }
    //        else
    //        {
    //            throw "not find baseClass:"+ b.Base;
    //            return null;
    //        }
    //    }
    //    else
    //        return Core.baseClass.extend(b);
    //});
    global.Class = function(b)
    {
        if(b.Base)
        {
            var baseClass = Core.$TryGetMember(b.Base);
            if(baseClass && baseClass.extend)
            {
                return baseClass.extend(b);
            }
            else
            {
                throw "not find baseClass:"+ b.Base;
                return null;
            }
        }
        else
            return Core.baseClass.extend(b);
    }
})()
module.exports = Core;
global.Core = Core;


