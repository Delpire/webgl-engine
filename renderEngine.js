/* global vec3 */
/* global mat4 */

var RenderEngine = function(){}

RenderEngine.prototype = {
	
	rEngine : (function(){
		
		var MAXNUMOFLIGHTS = 4;
		
		var sceneGraph;
		var assetEngine;
		
		var gl;
		var mMatrix = mat4.create();
		var vMatrix = mat4.create();
		var pMatrix = mat4.create();
		var shaderProgram;
		
		var renderCache = { models:[], lights:[] };
		
		var loadingTexture = false;
		var tempTexture;
		
		function _setupWebGl(){
			
			var canvas = document.getElementById("canvas");
			_initGL(canvas);
			_initShaders();
			
			//Clear canvas to black.
			gl.clearColor(0.0, 0.0, 0.0, 1.0);

			//Tells WebGl to do Depth Testing.
			gl.enable(gl.DEPTH_TEST);
	
			//Near things obscure things farther away.
			gl.depthFunc(gl.LEQUAL);
	
			//Clear color and depth buffer.
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			
			//Set up perspective camera.
			mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		}
		
		function _initGL(canvas){

			//Try to initialize gl.
			//If it doesn't, its probably a browser problem.
			try {
		
				//Get a webgl context.
				gl = canvas.getContext("webgl");
		
				//Set the Viewport width and height based on the canvas size.
				gl.viewportWidth = canvas.width;
				gl.viewportHeight = canvas.height;
		
			} catch(e){}
			if(!gl){
				alert("Could not initialize WebGL. Your browser probably sucks. Please upgrade");
			}
		}
		
		function _initShaders(){

			// var fragmentShader = getShader(gl, fragmentShaderScript);
			// var vertexShader = getShader(gl, vertexShaderScript);
		
			var fragmentShader = _getShader(gl, "shader-fs");
			var vertexShader = _getShader(gl, "shader-vs");
		
			//Create a WebGL program. This is got that runs on WebGL.
			//Each program can ONLY have 1 Fragment Shader and 1 Vertex Shader
			shaderProgram = gl.createProgram();
		
			//Attach shadders to WebGL
			gl.attachShader(shaderProgram, vertexShader);
			gl.attachShader(shaderProgram, fragmentShader);
		
			//Link the program.
			gl.linkProgram(shaderProgram);
		
			if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
				alert(gl.getProgramInfoLog(shaderProgram));
				alert("Could not initialise shaders");
				
			}
		
			gl.useProgram(shaderProgram);
		
			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
			
			//shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
			//gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
		
			shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
			gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		
			shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
			gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		
			shaderProgram.nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
			shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
			shaderProgram.invMMatrixUniform = gl.getUniformLocation(shaderProgram, "invUMMatrix");
			
            shaderProgram.reflectivity = gl.getUniformLocation(shaderProgram, "uReflectivity");
            shaderProgram.shineDamper = gl.getUniformLocation(shaderProgram, "uShineDamper");
            
            shaderProgram.numberOfLights = gl.getUniformLocation(shaderProgram, "uNumberOfLights");
            
            shaderProgram.directionalLightIntensity = gl.getUniformLocation(shaderProgram, "uDirectionalLightIntensity");
            shaderProgram.directionalLightDirection = gl.getUniformLocation(shaderProgram, "uDirectionalLightDirection");
            
			shaderProgram.lightPosition = [];
			shaderProgram.lightColor = [];
			for(var i = 0; i < MAXNUMOFLIGHTS; i++){
				shaderProgram.lightPosition[i] = gl.getUniformLocation(shaderProgram, "uLightPosition[" + i + "]");
				shaderProgram.lightColor[i] = gl.getUniformLocation(shaderProgram, "uLightColor[" + i + "]");	
			}
			
			
		
		}
		
		function _createArrayBuffer(array){
			
			var buffer = gl.createBuffer();
			
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
			
			return buffer;
		}
		
		function _createElementArrayBuffer(array){
			
			var indexBuffer = gl.createBuffer();
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), gl.STATIC_DRAW);
			
			return indexBuffer;
		}
		
		function _createTexture(src){
			
			tempTexture = gl.createTexture();

			loadingTexture = true;

			var image = new Image();
			//image.crossOrigin = "anonymous";
			image.onload = function(){ _createTextureBuffer(image, tempTexture)}
			image.src = src;
			
			return tempTexture;
		}
		
		function _createTextureBuffer(image, texture){
			
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
			
			loadingTexture = false;
		}
		
		function _getShader(gl, id) {
			var shaderScript = document.getElementById(id);
			if (!shaderScript) {
				return null;
			}
		
			var src = "";
			var k = shaderScript.firstChild;
			while (k) {
				if (k.nodeType == 3)
					src += k.textContent;
				k = k.nextSibling;
			}
		
			var shader;
			if (shaderScript.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = gl.createShader(gl.VERTEX_SHADER);
			} else {
				return null;
			}
		
			gl.shaderSource(shader, src);
			gl.compileShader(shader);
		
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(shader));
				return null;
			}
		
			return shader;
		}
        
        function _drawModel(model){
            
            mMatrix = model.mMatrix;
            
            gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.itemSize, gl.FLOAT, false, 0, 0);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, model.normalsBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordinatesBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, model.textureBuffer);
            gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
            
            gl.uniform1f(shaderProgram.reflectivity, model.material.reflectivity);
            gl.uniform1f(shaderProgram.shineDamper, model.material.shineDamper);
        
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.vertexIndiciesBuffer);
        
            //Moves matricies to WebGL
            _setMatrixUniforms();
            
            //Draw array of verticies as triangles starting at item 0 and ended at last element of the array.
            //Change this to gl.TRIANGLE_STRIP to draw quads.
            gl.drawElements(gl.TRIANGLES, model.numItems, gl.UNSIGNED_SHORT, 0); 
        }
		
		function _setMatrixUniforms(){
			var normalMatrix = mat4.create();
			var invUMatrix = mat4.create();
			mat4.identity(normalMatrix);
			mat4.identity(invUMatrix);
			mat4.invert(normalMatrix, mMatrix);
			mat4.invert(invUMatrix, mMatrix);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(shaderProgram.nUniform, false, normalMatrix)
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
            gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
			gl.uniformMatrix4fv(shaderProgram.invMMatrixUniform, false, invUMatrix);
		}
		
		function _fillRenderBuffer(){
			renderCache = { models:[], lights:[], directional_light:[] };
			sceneGraph.getRenderData(renderCache);
		}

		
		function _render(){
			
			//TODO: Move this to UPDATE ^^^^
			
			if(loadingTexture)
				return;
			
			//Tell WebGL about the size of the canvas.
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		
			//Clear the canvas.
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
			_fillRenderBuffer();
			
			vMatrix = sceneGraph.getActiveCamera().getCameraMatrix();
			
            for (var i = 0; i < renderCache.lights.length; i++){
                gl.uniform3fv(shaderProgram.lightPosition[i], renderCache.lights[i].position);
                gl.uniform3fv(shaderProgram.lightColor[i], renderCache.lights[i].color);
            }
            
            if (renderCache.directional_light.length > 0){
                gl.uniform3fv(shaderProgram.directionalLightIntensity, renderCache.directional_light[0].intensity);
                gl.uniform3fv(shaderProgram.directionalLightDirection, renderCache.directional_light[0].direction);
            }      
            
            gl.uniform1i(shaderProgram.numberOfLights, renderCache.lights.length)
            
			//TODO: FOR EACH RENDER BUFFER
			for (var model of renderCache.models){
				_drawModel(model);
			}
		}
		
		function _setSceneGraph(graph){
			sceneGraph = graph;
		}
		
		function _setAssetEngine(engine){
			assetEngine = engine;
		}
		
		//Public API
		return {
			initEngine: _setupWebGl,
			render: _render,
			setSceneGraph: _setSceneGraph,
			setAssetEngine: _setAssetEngine,
			createArrayBuffer: _createArrayBuffer,
			createElementArrayBuffer: _createElementArrayBuffer,
			createTexture: _createTexture,
		}
			
	})(),
	
	initEngine: function(){
		this.rEngine.initEngine();
	},

	render: function(){
		this.rEngine.render();
	},
	
	setSceneGraph: function(graph){
		this.rEngine.setSceneGraph(graph);
	},
	
	//TODO: Make this working. We need to have models in memory.
	//These models should be accessable by the RenderEngine from the AssetManager
	setAssetEngine: function(engine){
		this.rEngine.setAssetEngine(engine);
	},
	
	createArrayBuffer: function(array){
		return this.rEngine.createArrayBuffer(array);
	},
	
	createElementArrayBuffer: function(array){
		return this.rEngine.createElementArrayBuffer(array);
	},
	
	createTexture: function(image){
		return this.rEngine.createTexture(image);
	}
	
}