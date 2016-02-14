var DirectionalLightNode = function(intensity, direction){
    this.lNode = this.lNode(intensity, direction);
}

DirectionalLightNode.prototype = {
	
	lNode : (function(intensity, direction){
		
		var _intensity = intensity;
		var _direction = direction;
        var nodeType = 3;
		
		function _update(){

		}
        
        function _getLightRenderData(buffer){
            
            buffer.push({intensity:_intensity, direction: _direction});
            
            return buffer;
        }
        
        function _getNodeType(){
			return nodeType;
		}
		
		//Public API
		return {
			update: _update,
            getLightRenderData: _getLightRenderData,
            getNodeType: _getNodeType,
		}
		
		
	}),

	update: function(){
		this.lNode.update()
	},
    
    getLightRenderData: function(buffer){
        this.lNode.getLightRenderData(buffer);
    },
    
    getNodeType: function(){
        return this.lNode.getNodeType();
    }
	
}