var _=function(obj){
	if(typeof obj=="string" && document.getElementById) obj=document.getElementById(obj);
	return obj;
}


//Element styles functions
var CSS=function(obj){
	return {
		//convert js style property to css property (zIndex -> z-index)
		js2css:function(prop){
			return prop.replace(/([A-Z])/g,"-$1").toLowerCase();
		},
		//get style|styles value from css element (arguments=[string|hash|array])
		get:function(prop){
			if(typeof prop=="string"){
				if(obj.currentStyle) return obj.currentStyle[prop];
				if(window.getComputedStyle) return window.getComputedStyle(obj,null).getPropertyValue(this.js2css(prop));
			}
			else if(prop){
				var style={};
				for(var i in prop){
					if(prop.length) i=prop[i]; //get prop if array
					style[i]=this.get(i);
				}
				return style;
			}
			else return 0;
		},
		//set new styles to element & return old styles (arguments=[hash])
		set:function(hash){
			var style={};
			for(var i in hash){
				style[i]=this.get(i);
				obj.style[i]=hash[i];
			}
			return style;
		},
		//copy style|styles from obj to anoter element & return this styles (arguments=[string|array])
		copy:function(prop,to){
			if(typeof prop=="string")
				return (to.style[prop]=this.get(prop));
			else if(prop){
				var style=this.get(prop);
				for(var i in style)
					to.style[i]=style[i];
				return style;
			}
			return null;
		},
		//check current element style|styles (arguments=[hash])
		check:function(hash){
			for(var i in hash)
				if(hash[i]!=this.get(i))
					return false;
			return true;
		}
	}
};


var COOKIE={
	set:function(name, value, expire) {
		if(expire){
			var d=new Date();
			d.setTime(d.getTime()+expire*1000);
			expire="; expires="+d.toUTCString();
		}
		else expire="";
		document.cookie=name+"="+escape(value)+expire+"; path=/";
	},
	get:function(name) {
		if(document.cookie.length==0) return false;
		var offset=document.cookie.indexOf(name+"=");
		if(offset!=-1) { 
			offset+=name.length+1;
			var end=document.cookie.indexOf(";", offset);
			if (end==-1) end=document.cookie.length;
			return unescape(document.cookie.substring(offset, end)) 
		}
		return false;
	}
};



(Smooth=function(opt){this.init(opt)}).prototype={
	init:function(opt){
		//init values & default styles
		this.opt=opt;
		this.obj=opt.obj || this.obj;
		this.prop=opt.prop || this.prop;
		this.startPos=opt.startPos || 0;
		this.endPos=opt.endPos || 100;
	},
	go:function(){
		this.start(this.startPos, this.endPos, 1);
	},
	back:function(){
		this.start(this.endPos, this.startPos, -1);
	},
	move:function(startPos, endPos){
		this.start(startPos, endPos, startPos<endPos?1:-1);
	},
	start:function(startPos, endPos, d){
		if(this.tm) this.end(d);
		this.onstart(d);
		this._startPos=startPos;
		this._endPos=endPos;
		this._curPos=this._startPos;
		this.speed=((this._endPos-this._startPos)*d)/2; //firstly increment value (calculate real scrollStep)
		this.play(d); //start scrolling
	},
	play:function(d){
		var _this=this;
		this.speed=Math.round(this.speed-this.speed/3); //increment
		this._curPos+=d*this.speed;
		if(this._endPos*d<this._curPos*d){
			//alert(this.endPos*d+"<"+this.curPos*d);
			return this.end(d);
		}
		this.obj.style[this.prop]=this._curPos+"px";	
		this.tm=setTimeout(function(){_this.play(d)},10);
	},
	end:function(d){
		clearTimeout(this.tm);
		this.tm=null;
		this._curPos=this._endPos;
		this.obj.style[this.prop]=this._curPos+"px";
		this.onend(d);
		return false;
	},
	onstart:function(){},
	onend:function(){}
};

var SlideModule={
	init:function(obj){
		//init smooth
		obj.smooth=new Smooth({"obj":obj, prop:"height", startPos:0, endPos:this.checkHeight(obj)});
		obj.smooth.onend=function(d){
			if(d>0){
				obj.style.height="auto";
				CSS(obj).set({overflow:obj.old_styles.overflow});
			}
		};
	},
	checkHeight:function(obj){
		obj.old_styles=CSS(obj).get(["position","visibility","display","overflow", "height"]);
		CSS(obj).set({position:"absolute", visibility:"hidden", display:"block", overflow:"visible", height:"auto"});
		var h=obj.offsetHeight;
		CSS(obj).set(obj.old_styles);
		return h;
	},
	toogle:function(obj){
		if(obj.isShow==undefined) obj.isShow=(obj.style.display=="block");
		this[obj.isShow?"hide":"show"](obj);
		obj.isShow=!obj.isShow;
		COOKIE.set("contacts_open", obj.isShow?"1":"");
		obj.blur();
		return false;
	},
	show:function(obj){
		CSS(obj).set({display:"block"});
		this.start(obj, 1);
	},
	hide:function(obj){
		this.start(obj, -1);
	},
	start:function(obj, d){
		if(!obj.smooth) this.init(obj);
		else obj.smooth.endPos=this.checkHeight(obj);
		CSS(obj).set({overflow:"hidden"});
		obj.smooth[d>0?"go":"back"]();
	}
};


function init_mail(id){
	_(id).innerHTML=_(id).lang+"@"+_(id).innerHTML;
	_(id).href="mailto:"+_(id).innerHTML;
}


function check_contacts(id){
	_(id).style.display=COOKIE.get("contacts_open")?"block":"none";
}

function init_menu(id){
	var a =_(id).getElementsByTagName("a");
	for (i=0; i < a.length; i++) {
		a[i].smooth=new Smooth({"obj":a[i], prop:"paddingLeft", endPos:4});
		a[i].onmouseover=function() {
			this.smooth.go();
		}
		a[i].onmouseout=function() {
			this.smooth.back();
		}
	}
}

document.onload=function(){
	check_contacts('contact_info')
	init_mail("mail_1");
	init_menu("nav")
}