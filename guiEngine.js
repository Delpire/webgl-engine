var GuiEngine = function(rEngine, aEngine){
   
    this.guiCtx;

    this.width;
    this.height;

    this.guiElements = [];
    this.renderEngine = rEngine;
    this.assetEngine = aEngine; 

    this.vertexBuffer;
    this.indexBuffer;
    this.textureBuffer;
    this.textureCoordsBuffer;
}

GuiEngine.prototype = {

    addGuiElement: function(guiElement){
        // Add UI elements.
        // TODO: We may want a gui key so we can easily access ui elements.
        // For example: .push( {id:"healthbar", element:guiElement});
        this.guiElements.push(guiElement);
        var verts = guiElement.createVerticies();
        var vertexBuffer = this.renderEngine.createArrayBuffer(verts);
        guiElement.VertexBuffer = vertexBuffer;
        
        guiElement.TextureCoordinatesBuffer = this.renderEngine.createArrayBuffer( 
            [ 0.0,  0.0,
              1.0,  0.0,
              0.0,  1.0,
              1.0,  1.0]);
        
        var texture = this.assetEngine.getTexture(guiElement.TextureName);
        guiElement.TextureBuffer = texture.textureBuffer;
        guiElement.TextureIndex = texture.textureIndex;
        guiElement.IndexBuffer = this.renderEngine.createElementArrayBuffer([0, 1, 2, 3]);
    },

    setUpContext: function(size){   
        this.guiCtx = document.createElement("canvas").getContext("2d");
        this.guiCtx.canvas.width = size;
        this.guiCtx.canvas.height = size;
    },
    
    clearCanvas: function(){
        this.guiCtx.clearRect(0, 0, this.guiCtx.canvas.width, this.guiCtx.canvas.height);
    },
    
    drawFont: function(text, font, position){
        
        this.guiCtx.textAlign = "left";
        this.guiCtx.textBaseline = "top";
        this.guiCtx.fillStyle = "white";
        this.guiCtx.font = font;
        this.guiCtx.fillText(text, position.x, position.y);
    },
    
    createTextureFromCanvas: function(){     
        this.textureBuffer = this.renderEngine.createTextureBufferFromCanvas(this.guiCtx.canvas);
    },
    
    createUIQuad: function(){
        
        var verts = [
          -1,  1, 0,
           1,  1, 0,
          -1, -1, 0,
           1, -1, 0,
        ];
        
        var textureCoords = [
            0.0,  0.0,
            1,  0.0,
            0,  this.height / this.width,
            1,  this.height / this.width
        ];
        
        this.vertexBuffer = this.renderEngine.createArrayBuffer(verts);
        this.indexBuffer = this.renderEngine.createElementArrayBuffer([0, 1, 2, 3]);
        this.textureCoordsBuffer = this.renderEngine.createArrayBuffer(textureCoords);
    },
    
    getGuiElements: function(){
        return this.guiElements;
    }
   
};