var game = (function(){
	
	var sceneGraph = new SceneGraph();
	var updateEngine = new UpdateEngine();
	var renderEngine = new RenderEngine();
	var assetEngine = new AssetEngine();
	var inputEngine = new InputEngine();
	
	function _loop(time){
		
		//Update
		updateEngine.update();
		
		//Render
		renderEngine.render();
		
		window.requestAnimationFrame(
			function(time){
				_loop.call(time)
			}		
		);
	}
	
	function start(){
		
		//Init Render Engine.
		renderEngine.initEngine();
		renderEngine.setAssetEngine(assetEngine);
		
		//Init Asset Engine.
		assetEngine.setRenderEngine(renderEngine);
		
		assetEngine.loadTexture("cubeTexture", cubeTexture);
		assetEngine.loadModel("square", cubeVertices, cubeVertexIndices, cubeVertexNormals, "cubeTexture", cubeTextureCoordinates, 3);
		assetEngine.loadModel("plane", planeVertices, planeVertexIndicies, planeVertexNormals, "cubeTexture", planeTextureCoordinates, 3);

		sceneGraph.setInputEngine(inputEngine);

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
		
		var cameraNode = new CameraNode(sqModel);
		sceneGraph.addNode(cameraNode);
		
		updateEngine.setSceneGraph(sceneGraph);
		renderEngine.setSceneGraph(sceneGraph);
		_loop();
	}
	
	return{
		start: start
	}
	
})()