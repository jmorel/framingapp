function FrameFormat() {
    
    this.name = '';
    this.sheet = '';
    this.width = 0;
    this.height = 0;
    this.margin = {top: 0, bottom: 0, left: 0, right: 0};
    this.id = '';
    
    this.html4settings = function() {
        var html = '<table ffID="'+this.id+'">';
        html = html + '<tr>';
        html = html + '    <td class="top">';
        html = html + '    <td class="top"> <input type="number" placeholder="top" name="margintop" value="'+this.margin.top+'" ffID="'+this.id+'">';
        html = html + '    <td class="top"> <img src="pix/cross.png" id="delFF" ffID="'+this.id+'">';
        html = html + '<tr>';
        html = html + '    <td class="left"> <input type="number" placeholder="left" name="marginleft" value="'+this.margin.left+'" ffID="'+this.id+'">';
        html = html + '    <td class="middle"> <select name="sheetsize" ffID="'+this.id+'">'+sheetSizesOptions(this.sheet)+'</select>';
        html = html + '    <td class="right"> <input type="number" placeholder="right" name="marginright" value="'+this.margin.right+'" ffID="'+this.id+'">';
        html = html + '<tr>';
        html = html + '    <td class="bottom"> ';
        html = html + '    <td class="bottom"> <input type="number" placeholder="bottom" name="marginbottom" value="'+this.margin.bottom+'" ffID="'+this.id+'">';
        html = html + '    <td class="bottom">';
        html = html + '<tr>';
        html = html + '     <td colspan="3" class="caption"> <input type="text" placeholder="name" name="name" value="'+this.name+'" ffID="'+this.id+'">';
        html = html + '</table>';
        return html;
    }
    
    this.html4menu = function() {
        var html = '<li id="'+this.id+'">'+this.name+' ('+this.sheet+')</li>';
        return html;
    } 
}

