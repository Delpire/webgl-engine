var GuiEngine = function(rEngine, aEngine){
    this.api = this.init(rEngine, aEngine);
}

GuiEngine.prototype.init = function(rEngine, aEngine){
    
    var _guiElements = [];
    var _renderEngine = rEngine;
    var _assetEngine = aEngine;
    
    function _addGuiElement(guiElement){
        // Add UI elements.
        // TODO: We may want a gui key so we can easily access ui elements.
        // For example: .push( {id:"healthbar", element:guiElement});
        _guiElements.push(guiElement);
        var verts = guiElement.createVerticies();
        var vertexBuffer = _renderEngine.createArrayBuffer(verts);
        guiElement.VertexBuffer = vertexBuffer;
        
        guiElement.TextureCoordinatesBuffer = _renderEngine.createArrayBuffer( 
            [ 0.0,  0.0,
              1.0,  0.0,
              0.0,  1.0,
              1.0,  1.0]);
                
        var texture = _assetEngine.getTexture(guiElement.TextureName);
        guiElement.TextureBuffer = texture.textureBuffer;
        guiElement.TextureIndex = texture.textureIndex;
        guiElement.IndexBuffer = _renderEngine.createElementArrayBuffer([0, 1, 2, 3]);
     
    }
    
    function _getGuiElements(){
        return _guiElements;
    }
    
    //Public API
    return {
        addGuiElement: _addGuiElement,
        getGuiElements: _getGuiElements,
    }	

};