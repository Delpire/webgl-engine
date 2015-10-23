var UpdateEngine = function(){}

UpdateEngine.prototype = {
	
	uEngine : (function(){
		
		var sceneGraph;
		
		function _update(){
			sceneGraph.update();
		}
		
		function _setSceneGraph(graph){
			sceneGraph = graph;
		}
		
		//Public API
		return {
			update: _update,
			setSceneGraph: _setSceneGraph
		}
		
		
	})(),

	update: function(){
		this.uEngine.update()
	},
	
	setSceneGraph: function(graph){
		this.uEngine.setSceneGraph(graph)
	}
	
}