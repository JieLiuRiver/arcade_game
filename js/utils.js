var utils = (function(){
	var factory = {};

	/*
	* [获取随机数]
	* @param min number 最小
	* @param max number 最大
	*/
	factory.random = function(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}
	

	/*
	* [根据id获取dom节点]
	* @param id string
	*/
	factory.$el = function(id){
		return document.getElementById(id);
	}

	/*
	* [判断节点对象是否有某类]
	* @param obj object  节点对象
	* @param cls string 类名 
	*/
	factory.hasClass = function(obj, cls){
		var obj_class = obj.className,
		obj_class_lst = obj_class.split(/\s+/);
		x = 0;
		for(x in obj_class_lst) {
			if(obj_class_lst[x] == cls) {
			  return true;
			}
		}
		return false;
	}

	/*
	* [添加相应类]
	* @param obj object  节点对象
	* @param cls string 类名 
	*/
	factory.addClass = function(obj, cls){
	  var obj_class = obj.className,
	  blank = (obj_class != '') ? ' ' : '';
	  added = obj_class + blank + cls;
	  obj.className = added;
	}

	/*
	* [移除相应类]
	* @param obj object  节点对象
	* @param cls string 类名 
	*/
	factory.removeClass = function(obj, cls){
		var obj_class = ' '+obj.className+' ';
		obj_class = obj_class.replace(/(\s+)/gi, ' '),
		removed = obj_class.replace(' '+cls+' ', ' ');
		removed = removed.replace(/(^\s+)|(\s+$)/g, '');
		obj.className = removed;
	}

	/*
	* [根据键名，设置相应存储]
	* @param key string  键名
	* @param name string 内容 
	*/
	factory.setStorage = function(key, name){
		return localStorage.setItem(key, name);
	}

	/*
	* [根据键名，获取对应存储值]
	* @param key string  键名
	* @param name string 内容 
	*/
	factory.getStorage = function(key){
		return localStorage.getItem(key);
	}

	/*
	* [根据键名，移除对应存储]
	* @param key string  键名
	* @param name string 内容 
	*/
	factory.removeStorage = function(key){
		return localStorage.removeItem(key)
	}
	return factory;
})();