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
            
            if(node.getNodeType() === 0 || node.getNodeType() == 1){
                node.setInputEngine(inputEngine);
            }
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
		
        // Gets the render data for all the nodes that
        // can be rendered.
        // Model : NodeType 0
        // Light : NodeType 2
		function _getRenderData(renderCache){
			
			for (var node of nodes){
				
				if(node.getNodeType() === 0){
					node.getModelRenderData(renderCache.models);
				}
                else if(node.getNodeType() == 2){
                    node.getLightRenderData(renderCache.lights);
                }
			}
			
			return renderCache;	
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
			getRenderData: _getRenderData,
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
	
	getRenderData: function(buffer){
		return this.sGraph.getRenderData(buffer);
	},
	
	getActiveCamera: function(){
		return this.sGraph.getActiveCamera();
	},
	
	setInputEngine: function(iEngine){
		this.sGraph.setInputEngine(iEngine);
	}
	
	
}