var game = (function(){
	
	var sceneGraph = new SceneGraph();
	var updateEngine = new UpdateEngine();
	var renderEngine = new RenderEngine();
	var assetEngine = new AssetEngine();
	var inputEngine = new InputEngine();
    var guiEngine = new GuiEngine(renderEngine, assetEngine);
 
    var previousTime;
    var elapsedTime;
    var currentTime;
    var totalElapsedTime = 0;
    var count = 0;
    
    var TIME_STEP = 1000/60;
	
	function _loop(){
		
        currentTime = Date.now();
        
        elapsedTime = currentTime - previousTime;
        totalElapsedTime += elapsedTime;
        
        elapsedTime = Math.min(elapsedTime, 4 * TIME_STEP);
        previousTime = currentTime;
        
        count++;
        
        if(totalElapsedTime > 10000){
             totalElapsedTime = totalElapsedTime - 10000;
             count = 0;
        }
          
        guiEngine.clearCanvas();
        guiEngine.drawFont("FPS: " + Math.floor(count / (totalElapsedTime / 1000)), "15px monospace", { x:1, y:2 });
        guiEngine.createTextureFromCanvas();
        
		//Update
		updateEngine.update();
		
		//Render
		renderEngine.render();
		
		window.requestAnimationFrame(
			function(){
				_loop.call();
			}		
		);
	}
	
	function _start(){
		
		//Init Render Engine.
		renderEngine.initEngine();
		renderEngine.setAssetEngine(assetEngine);
		
        //TODO: Get size from context;
        //Init Gui Engine.
        guiEngine.setUpContext(1024);
        guiEngine.width = 1024;
        guiEngine.height = 576;
        guiEngine.createUIQuad();
        guiEngine.drawFont("FPS: ", "15px monospace", { x:1, y:2 });
        guiEngine.createTextureFromCanvas();
        
		//Init Asset Engine.
		assetEngine.setRenderEngine(renderEngine);
		
		assetEngine.loadTexture("cubeTexture", cubeTexture);
        assetEngine.loadTexture("crosshair", crossHair);
		assetEngine.loadModel("square", cubeVertices, cubeVertexIndices, cubeVertexNormals, "cubeTexture", cubeTextureCoordinates, 3);
		assetEngine.loadModel("plane", planeVertices, planeVertexIndicies, planeVertexNormals, "cubeTexture", planeTextureCoordinates, 3);
        
		sceneGraph.setInputEngine(inputEngine);
        
        var guiElement = new GuiElement("crosshair", vec2.fromValues(-0.025, 0.05), 0.1, 0.1).api; 
        guiEngine.addGuiElement(guiElement);
        
        renderEngine.setGuiEngine(guiEngine);

		//Set up square model.
		var sqModel = new ModelNode(assetEngine.getModel("square"));
		var sqModel2 = new ModelNode(assetEngine.getModel("plane"));
		var sqModel3 = new ModelNode(assetEngine.getModel("square"));
		sqModel.setTransform(0.0, 0.0, 0.0, 0.0, 0.9, 0, 1, 1, 1);
		sqModel2.setTransform(0, -1.01, 0.0, 0.0, 0.0, 0, 10, 10, 10);
		sqModel3.setTransform(0, 2.01, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5);
		sceneGraph.addNode(sqModel);
		sceneGraph.addNode(sqModel2);
		sqModel.addNode(sqModel3);
        sqModel.setMaterial(0.01, 0.01);
        sqModel2.setMaterial(0.5, 25);
        sqModel3.setMaterial(0.01, 0.01);
        
        
        var playerModel = new ModelNode(assetEngine.getModel("square"));
        playerModel.setTransform(0.0, 0.0, 0.0, 0.0, 0.9, 0, 1, 1, 1);
        
        var player = new Player(inputEngine, playerModel);
        var cameras = player.api.getCameras();
        
        sceneGraph.addNode(playerModel);
        playerModel.setMaterial(0.01, 0.01);
        sceneGraph.addNode(cameras.fps);
        sceneGraph.addNode(cameras.thirdPerson);
        sceneGraph.addNode(cameras.free);
		
		//var cameraNode = new CameraNode(sqModel);
		//sceneGraph.addNode(cameraNode);
        
        var lightNode = new LightNode( [2, 10, 2], [1, 1, 1] );
        sceneGraph.addNode(lightNode);
		
		updateEngine.setSceneGraph(sceneGraph);
        updateEngine.addPlayer(player);
		renderEngine.setSceneGraph(sceneGraph);
        previousTime = Date.now();
		_loop();
	}
	
	return{
		start: _start
	}
	
})()
