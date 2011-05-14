(function($){
     var log = function(){};
     try{
	 log = console.log;
     } catch (x) {}

     var cssInt = function(obj, cssAttr){
	 return parseInt($(obj).css(cssAttr));
     };

     var fillHeight = function(parent, child){
	 var $child = $(child, $(parent));
	 var parentHeight = parseInt($(parent).height());
	 var pt = cssInt($child, 'padding-top');
	 var pb = cssInt($child, 'padding-bottom');
	 var mt = cssInt($child, 'margin-top');
	 var mb = cssInt($child, 'margin-bottom');
	 
	 var newHeight = parentHeight - pt - pb - mt - mb;
	 $child.css('height', newHeight);
     };

     var wrapAllInClass = function(nodesToWrap, className){
	 var p = nodesToWrap.parent();
	 nodesToWrap.wrapAll($('<div/>').addClass(className));
	 return $('.' + className, p);
	 
     };

     var lcars_colors = {
	 'orange':'#ff9900',
	 'purple':'#cc99cc',
	 'blue':'#9999ff',
	 'lightBlue':'#9999cc',
	 'red':'#cc0000',
	 'lightRed':'#cc6666',
	 'tan':'#ff9966',
	 'lightTan':'#ffcc99',
	 'pink':'#cc6699',
	 'white':'#ccccff'
     };


     $.fn.lcars_cframe = function(options){ 
	 return this.each(
	     function(){
		 var $this = $(this);

		 //add borders
		 /*
		  * borders are handled as inner/outer frames
		  * 
		  */
		 var contentFrame = wrapAllInClass($this.contents(), 
						   'lcars-content-frame');

		 var borderFrame = wrapAllInClass($this.contents(), 
						  'lcars-border-frame');

		 var fn = function(){
		     fillHeight($this, borderFrame);
		     fillHeight(borderFrame, '.lcars-content-frame');
		 };
		 $(window).resize(fn);
		 fn();
		 
		 //add side-panel
		 var sidePanel = $('<div class="lcars-side-panel"></div>');
		 borderFrame.prepend(sidePanel);
		 
		 borderFrame.append('<div style="clear:both;">');
	     });
     };

     $.fn.lcars_tframe = function(options){
	 var drawSplitter = 
	     function(ctx, height, width, leftColor, sepColor, barColor, rightColor){
		 var h = {};
		 var w = {};
		 var round = function(val){
		     return Math.max(1, Math.round(val));
		 };
		 for(var i = 1; i <= 100; i++){
		     h[i] = round(i*(height/100));
		     w[i] = round(i*(width/100));
		 }

		 var colWidth = w[10]; //TODO: calculate this better

		 // determine some sizes based on available space
		 var shoulderHeight = h[45];
		 var shoulderLength = colWidth + w[5];
		 var shoulderBarHeight = h[30];
		 var leftBarHeight = shoulderHeight - shoulderBarHeight;
		 var spacer = round(w[1]/2);
		 var leftEndSepLength = spacer*3;
		 var leftSplitterLength = w[45] - (shoulderLength+spacer+spacer+leftEndSepLength+spacer);


		 //handle the first curved segment
 		 ctx.save();
		 ctx.fillStyle = leftColor;
		 ctx.beginPath();
		 ctx.arc(shoulderHeight,0, shoulderHeight, Math.PI, Math.PI/2, true);
		 ctx.lineTo(shoulderLength,shoulderHeight);
		 ctx.lineTo(shoulderLength,shoulderBarHeight);


		 ctx.arc(colWidth+shoulderBarHeight, 0, 
			 shoulderBarHeight, Math.PI/2, Math.PI, false);

		 ctx.lineTo(0,0);
		 ctx.fill();
		 ctx.translate(shoulderLength+spacer,0); //shift coords
		 
		 //straight and narrow for a bit, same color
		 //this will shrink when colWidth is big
		 ctx.fillRect(0, shoulderBarHeight, 
			      leftSplitterLength, leftBarHeight);
		 ctx.translate(leftSplitterLength+spacer,0); //shift coords

		 //small rect as a border before the midpoint
		 ctx.fillStyle = sepColor;
		 ctx.fillRect(0, shoulderBarHeight, 
			      leftEndSepLength, leftBarHeight);
		 ctx.translate(leftEndSepLength+spacer,0); //shift coords
		 
		 //now the right side!

		 // short red bit
		 var rightShortRectLength = w[10];
		 var rightShortRectHeight = Math.round(leftBarHeight*0.6);
		 		 
 		 ctx.fillStyle = rightColor;
		 ctx.fillRect(0, shoulderBarHeight, rightShortRectLength, 
			      rightShortRectHeight);


		 // long bit
		 ctx.fillRect(rightShortRectLength, shoulderBarHeight, 
			      w[50], leftBarHeight);		 

		 // little orange line
		 var rightBarHeight = round(spacer/2);
 		 ctx.fillStyle = barColor;
		 ctx.save();
		 ctx.translate(0, shoulderBarHeight);
		 ctx.scale(1,-1);
		 ctx.fillRect(0, rightBarHeight, rightShortRectLength, 
			      rightBarHeight);
		 ctx.restore();

		 //little box in the center
		 ctx.fillRect(0, shoulderBarHeight+leftBarHeight, 
			      spacer*2, rightBarHeight);

		 ctx.restore();
	     
	 };

	 return this.each(
	     function(){
		 var $this = $(this);
		 var upperPanel = wrapAllInClass($('.lcars-upper',$this), 
						 'lcars-upper-panel');
		 var lowerPanel = wrapAllInClass($('.lcars-lower',$this), 
						 'lcars-lower-panel');

		 var canvas = $('<canvas/>').addClass('lcars-swirly');
		 lowerPanel.before(canvas);

		 canvas = $('canvas.lcars-swirly', $this);
		 var height = canvas.height();
		 var width = canvas.width();

		 //need to explictly set these for the canvas to know about it
		 canvas.attr('height', height);
		 canvas.attr('width', width);

		 var ctx = canvas.get(0).getContext('2d');
		 drawSplitter(ctx, height, width, 
			      lcars_colors.purple, lcars_colors.blue, lcars_colors.orange, lcars_colors.lightRed);
		 ctx.save();
		 ctx.translate(0,height);
		 ctx.scale(1,-1);
		 drawSplitter(ctx, height, width, 
			      lcars_colors.lightRed, lcars_colors.blue, lcars_colors.orange, lcars_colors.purple);
		 ctx.restore();


		 
		 

		 
			  });
	 
	 
     };
     
     $(document).ready(function(){
			   $('.lcars-tframe').lcars_tframe();
			   $('.lcars-cframe').lcars_cframe();
		       }); 
 })(jQuery);

