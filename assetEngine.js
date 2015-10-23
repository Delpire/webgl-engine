var AssetEngine = function(){}

AssetEngine.prototype = {
	
	aEngine : (function(){
		
		var renderEngine;
		var models = [];
		var textures = [];
		
		function _loadModel(n, verts, indicies, normals, textureName, textureCoordinates, size){
					
			if(_searchModel(n) !== null)
				return;
			
			var vBuffer = renderEngine.createArrayBuffer(verts);
			var tcBuffer = renderEngine.createArrayBuffer(textureCoordinates);
			var nBuffer = renderEngine.createArrayBuffer(normals);
			var iBuffer = renderEngine.createElementArrayBuffer(indicies);
			
			var tBuffer = _getTexture(textureName).textureBuffer;

			models.push({name:n, vertexBuffer:vBuffer, vertexIndiciesBuffer:iBuffer, normalsBuffer:nBuffer, textureBuffer:tBuffer, textureCoordinatesBuffer:tcBuffer, itemSize:size, numItems:indicies.length});
		}
		
		function _getModel(n){
			
			var model = _searchModel(n);
			
			return model;
		}
		
		function _loadTexture(name, src){
		
			if(_searchTextures(name) !== null)
				return;
			
			var tBuffer = renderEngine.createTexture(src);
			
			textures.push({name:name, textureBuffer:tBuffer})
		}
		
		function _getTexture(name){
			
			var texture = _searchTextures(name);
			
			return texture;
		}
		
		function _searchModel(n){
			
			var model = null;
			
			//TODO: Replace model names with a number for faster search.
			for (var i = 0; i < models.length; i++){
				
				if(models[i].name === n){
					model = models[i];
				}
			}
			
			return model;
		}
		
		function _searchTextures(n){
			
			var texture = null;
			
			//TODO: Replace model names with a number for faster search.
			for (var i = 0; i < textures.length; i++){
				
				if(textures[i].name === n){
					texture = textures[i];
				}
			}
			
			return texture;
		}
		
		function _setRenderEngine(engine){
			renderEngine = engine;
		}
		
		//Public API
		return {
			loadModel: _loadModel,
			getModel: _getModel,
			setRenderEngine: _setRenderEngine,
			loadTexture: _loadTexture
		}
		
	})(),
	
	loadModel: function(name, vertices, indicies, normals, textureName, textureCoordinates, itemSize){
		this.aEngine.loadModel(name, vertices, indicies, normals, textureName, textureCoordinates, itemSize);
	},

	getModel: function(name){
		return this.aEngine.getModel(name);
	},
	
	loadTexture: function(name, src){
		this.aEngine.loadTexture(name, src);
	},
	
	setRenderEngine: function(engine){
		this.aEngine.setRenderEngine(engine)
	}
}