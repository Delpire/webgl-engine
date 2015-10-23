var SceneGraph = function(){}

SceneGraph.prototype = {
	
	sGraph : (function(){
		
		var nodes = [];
		
		var inputEngine;
		
		var activeCamera;
		
		var identity = mat4.create();
		mat4.identity(identity);
		
		function _addNode(node){
			nodes.push(node)
			node.setInputEngine(inputEngine);
		}
		
		function _update(){
			
			for (var node of nodes){
				node.update(identity);
				
				if(node.getNodeType() === 1){
					if(node.getIsActive){
						activeCamera = node;
					}
				}
			}
		}
		
		function _getModelRenderData(buffer){
			
			for (var node of nodes){
				
				if(node.getNodeType() === 0){
					node.getModelRenderData(buffer);
				}
			}
			
			return buffer;	
		}
		
		function _getActiveCamera(){
			return activeCamera;
		}
		
		function _setInputEngine(iEngine){
			inputEngine = iEngine;
		}
		
		//Public API
		return {
			addNode: _addNode,
			update: _update,
			getModelRenderData: _getModelRenderData,
			getActiveCamera: _getActiveCamera,
			setInputEngine: _setInputEngine
		}
		
		
	})(),
	
	addNode: function(node){
		this.sGraph.addNode(node);
	},
	
	update: function(){
		this.sGraph.update();
	},
	
	getModelRenderData: function(buffer){
		return this.sGraph.getModelRenderData(buffer);
	},
	
	getActiveCamera: function(){
		return this.sGraph.getActiveCamera();
	},
	
	setInputEngine: function(iEngine){
		this.sGraph.setInputEngine(iEngine);
	}
	
	
}