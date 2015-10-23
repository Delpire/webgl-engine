var ModelNode = function(model){
	this.mNode = this.mNode(model);
}

ModelNode.prototype = {
	
	mNode : (function(m){
		
		var nodes = [];
		var nodeType = 0;
		var model = m;
		
		var mMatrix = mat4.create();
		var mMatrixFinal = mat4.create();
		
		var inputEngine;
		
		//TODO: Replace this with ArrayBuffer
		var transform = {x:0.0, y:0.0, z:-5.0, rx:0.0, ry:0.0, rz:0.0, sx:0.0, sy:0.0, sz:0.0};
		
		function _update(tMatrix){
			
			if(transform.sx == 1){
				transform.ry += 0.05;
			}
			if(transform.sx == 0.5){
				transform.rx += 0.05;
			}
			
			_createMMatrix(tMatrix);
			
			for (var node of nodes){
				node.update(mMatrix);
			}
		}
		
		function _getNodeType(){
			return nodeType;
		}
		
		function _getModelRenderData(buffer){
			
			//TODO: THIS IS A HACK! MAKE A PLAYER CLASS
			if(transform.sx === 1){
				var keyStates = inputEngine.getKeyStates();
				
				if(keyStates[87] == true){
					transform.x += 0.5;
				}
				if(keyStates[83] == true){
					transform.x -= 0.5;
				}
				if(keyStates[65] == true){
					transform.z -= 0.5;
				}
				if(keyStates[68] == true){
					transform.z += 0.5;
				}
			}
			
			buffer.push({mMatrix:mMatrixFinal, itemSize:model.itemSize, numItems:model.numItems, vertexBuffer:model.vertexBuffer, vertexIndiciesBuffer:model.vertexIndiciesBuffer, normalsBuffer:model.normalsBuffer, textureBuffer:model.textureBuffer, textureCoordinatesBuffer:model.textureCoordinatesBuffer, transform:transform});
			
			for (var node of nodes){
				
				if(node.getNodeType() == 0){
					node.getModelRenderData(buffer);
				}
			}
			
			return buffer;	
		}
		
		function _createMMatrix(tMatrix){
			
			mat4.identity(mMatrix);
			
			//Translate Matrix
			mat4.translate(mMatrix, mMatrix, [transform.x, transform.y, transform.z]);
			
			//Rotate Matrix
			mat4.rotateX(mMatrix, mMatrix, transform.rx);
			mat4.rotateY(mMatrix, mMatrix, transform.ry);
			mat4.rotateZ(mMatrix, mMatrix, transform.rz);
			
			//Scale Matrix
			var scaleVector = vec3.fromValues(transform.sx, transform.sy, transform.sz);
			mat4.scale(mMatrixFinal, mMatrix, scaleVector);
			
			mMatrixFinal = mat4.multiply(mMatrixFinal, tMatrix, mMatrixFinal);
		}
		
		function _getTransform(){
			return 	transform;
		}
		
		function _setTransform(x, y, z, rx, ry, rz, sx, sy, sz){
			transform.x = x;
			transform.y = y;
			transform.z = z;
			transform.rx = rx;
			transform.ry = ry;
			transform.rz = rz;
			transform.sx = sx;
			transform.sy = sy;
			transform.sz = sz;
			
		}
		
		function _getPosition(){
			return [transform.x, transform.y, transform.z]
		}
		
		function _addNode(node){
			nodes.push(node);
		}
		
		function _setInputEngine(iEngine){
			inputEngine = iEngine;
		}
		
		//Public API
		return {
			addNode: _addNode,
			update: _update,
			getModelRenderData: _getModelRenderData,
			getTransform: _getTransform,
			getNodeType: _getNodeType,
			getPosition: _getPosition,
			setTransform: _setTransform,
			setInputEngine: _setInputEngine
		}
		
		
	}),
	
	addNode: function(node){
		this.mNode.addNode(node)	
	},
	
	getNodeType: function(){
		return this.mNode.getNodeType();
	},
	
	update: function(tMatrix){
		this.mNode.update(tMatrix);
	},
	
	getModelRenderData: function(buffer){
		return this.mNode.getModelRenderData(buffer);
	},
	
	getPosition: function(){
		return this.mNode.getPosition();	
	},
	
	setTransform: function(x, y, z, rx, ry, rz, sx, sy, sz){
		this.mNode.setTransform(x, y, z, rx, ry, rz, sx, sy, sz);
	},
		
	setInputEngine: function(iEngine){
		this.mNode.setInputEngine(iEngine);
	}
	
	
}