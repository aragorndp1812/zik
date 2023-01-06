window.boot = function () {
    var settings = {
					   "platform":"android",
					   "groupList":[
						  "default",
						  "fish",
						  "bullet"
					   ],
					   "collisionMatrix":[
						  [
							 true
						  ],
						  [
							 false,
							 false,
							 true
						  ],
						  [
							 false,
							 true,
							 false
						  ]
					   ],
					   "hasResourcesBundle":false,
					   "hasStartSceneBundle":false,
					   "remoteBundles":[
						  
					   ],
					   "subpackages":[
						  
					   ],
					   "launchScene":"db://assets/android_phuho88/phuho88.fire",
					   "orientation":"",
					   "server":"https://dlph88.gadota.com",
					   "jsList":[
						  
					   ],
					   "bundleVers": {
							"internal" : "627df"
					   }
					};
		
	window._CCSettings = undefined;
	window.isHasSdkBox = false;
	window.app_name = "ANDROID_PHPREVIEW";
    var onProgress = null;
    
    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = "https://dlphpreview.gadota.com/main";
	
    var onStart = function () {

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_BAIDU_APP,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
                cc.sys.BROWSER_TYPE_HUAWEI,
                cc.sys.BROWSER_TYPE_UC,
            ].indexOf(cc.sys.browserType) < 0);
        }


        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.assetManager.downloader.maxConcurrency = 20;
            cc.assetManager.downloader.maxRequestsPerFrame = 10;
        }

		var scene = new cc.Scene("loadingScene");
		var canvasNode = new cc.Node("Canvas");
		var canvasComp = canvasNode.addComponent(cc.Canvas);

		var label = new cc.Node("Loading");
		var labelComp = label.addComponent(cc.Label);
		labelComp.string = "Loading...";
		label.color = cc.Color.WHITE;
		canvasNode.addChild(label);
		
		scene.addChild(canvasNode);
		
		var launchScene = settings.launchScene;

		cc.director.runSceneImmediate(scene, () => {
			cc.assetManager.loadBundle(MAIN,
			function (err) {
				var bundle = cc.assetManager.bundles.find(function (b) {
					return b.getSceneInfo(launchScene);
				});
				var lastProgress = 0;
				bundle.preloadScene(launchScene, (loaded, total) => {
						var prog = loaded / total;
						if(lastProgress > prog)
							return;
						lastProgress = prog;
						labelComp.string = Math.floor(lastProgress * 100) + "%";
					}, (err) => {
						if(err)
						{
							labelComp.string = "Please try again";
							onStart();
							return;
						}
						cc.director.loadScene(launchScene);
					});
			});
		});
    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({ 
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server
    });
	

	var bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;
	
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.game.run(option, onStart);
        }
     }

     cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);

     for (var i = 0; i < bundleRoot.length; i++) {
         cc.assetManager.loadBundle(bundleRoot[i], cb);
     }

};

if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('src/settings.a4143.js');
        require('src/cocos2d-runtime.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.25d44.js');
        }
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('src/settings.a4143.js');
        require('src/cocos2d-jsb.c156d.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.25d44.js');
        }
        require('jsb-adapter/jsb-engine.js');
    }

    cc.macro.CLEANUP_IMAGE_CACHE = true;
    window.boot();
}
