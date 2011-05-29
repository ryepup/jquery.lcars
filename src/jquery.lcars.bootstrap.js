(function($){
     var log = function(){};

     try{
	 if (window['console'] && window['console']['log']) {
	     log = window['console']['log'];
	     log('setting up');
	 }
	 
     } catch (x) { log = function(){}; }

     var cssInt = function(obj, cssAttr){
	 return parseInt($(obj).css(cssAttr));
     };

     var round = function(val){
	 return Math.max(1, Math.round(val));
     };

     var marginPaddingSum = function(elem){
	 var pt = cssInt(elem, 'padding-top');
	 var pb = cssInt(elem, 'padding-bottom');
	 var mt = cssInt(elem, 'margin-top');
	 var mb = cssInt(elem, 'margin-bottom');	 
	 return pt+pb+mt+mb;
     };

     var fillHeight = function(parent, child){
	 var $child = $(child, $(parent));
	 var parentHeight = parseInt($(parent).height());	 
	 var newHeight = parentHeight - marginPaddingSum($child);
	 log(parent, child, parentHeight, marginPaddingSum($child), newHeight);
	 $child.css('height', newHeight);
     };

     var wrapAllInClass = function(nodesToWrap, className){
	 var p = nodesToWrap.parent();
	 nodesToWrap.wrapAll($('<div/>').addClass(className));
	 return $('.' + className, p);
	 
     };
     //adjust the height of the lower panel to match the container
     var adjustHeight=function(parent, target, offset){
	 var parentHeight = parseInt(parent.height());
	 
	 var newHeight = parentHeight - marginPaddingSum(target) 
	     - offset.height();
	 log(parent, parentHeight, offset, offset.height(), target, newHeight);
	 target.css('height', newHeight);		     
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
	 var opts = options || {};
	 var defaults = {
	     upperColor:lcars_colors.purple,
	     lowerColor:lcars_colors.lightRed,
	     seperatorColor:lcars_colors.blue,
	     flairColor:lcars_colors.orange
	 };
	 $.extend(opts,defaults);
	 var drawHalfSplitter = function(ctx, height, width, colWidth, leftColor, sepColor, barColor, rightColor){

	     var h = {};
	     var w = {};
	     for(var i = 1; i <= 100; i++){
		 h[i] = round(i*(height/100));
		 w[i] = round(i*(width/100));
	     }
	     	     
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
	 
	 var drawSplitter = function(canvas, colWidth){
	     var height = 50;
	     var width = canvas.width();
	     
	     //need to explictly set these for the canvas to know about it
	     canvas.attr('height', height);
	     canvas.attr('width', width);
	     
	     var ctx = canvas.get(0).getContext('2d');
	     ctx.fillStyle='#000';
	     ctx.fillRect(0,0,width,height);
	     drawHalfSplitter(ctx, height, width, colWidth,
					     opts.upperColor, opts.seperatorColor, 
					     opts.flairColor, opts.lowerColor);
	     
	     ctx.save();
	     ctx.translate(0,height);
	     ctx.scale(1,-1);
	     drawHalfSplitter(ctx, height, width, colWidth,
			      opts.lowerColor, opts.seperatorColor, 
			      opts.flairColor, opts.upperColor);
	     ctx.restore();	     
	 };

	 var processNav = function(panel){
	     var defaultWidth = round(panel.width()*.1);
	     var rawNav = panel.children('.lcars-upper,.lcars-lower')
		 .children('ul.lcars-nav,ol.lcars-nav');
	     if (rawNav.length == 0){
		 log('No nav for', panel);
		 return defaultWidth;
	     }
	     var navWrapper = $('<div>').addClass('lcars-nav-wrapper');
	     panel.prepend(navWrapper);

	     rawNav.detach();
	     navWrapper.append(rawNav);
	     rawNav.css('float', 'none');

	     var maxWidth = Math.max(navWrapper.width(), defaultWidth);

	     //if the nav is a link, make the button blue
	     var currentLocation = window.location.pathname;
	     $('li', rawNav).each(function(idx, elem){
				      var link = $('a', elem).get(0);
				      if(link){
					  var $link = $(link);
					  $(elem).append($link.contents())
					      .addClass('lcars-link-button');
					  var href = $link.attr('href');
					  var sameLocation = href == currentLocation;
					  var color =  sameLocation ? lcars_colors.orange : lcars_colors.blue;
					  $(elem).css('background-color', color);
					  if (!sameLocation){
					      $(elem).click(function(){
								window.location = href;
							    })
						  .addClass('lcars-clickable');
					  }

					  
					  $link.remove();
				      }
	     });

	     panel.append('<div style="clear:both"/>');
	     return maxWidth;
	 };

	 return this.each(
	     function(){
		 var $this = $(this);
		 var upperPanel = wrapAllInClass($this.children('.lcars-upper'), 
						 'lcars-upper-panel');
		 upperPanel.css('background-color', opts.upperColor);
		 $('h1,h2,h3,h4,h5', upperPanel)
		     .addClass('lcars-heading')
		     .css('color', opts.upperColor);
		 var lowerPanel = wrapAllInClass($this.children('.lcars-lower'), 
						 'lcars-lower-panel');
		 lowerPanel.css('background-color', opts.lowerColor);


		 var upperColWidth = processNav(upperPanel);
		 var lowerColWidth = processNav(lowerPanel);
		 var colWidth = Math.max(upperColWidth, lowerColWidth);
		 log('col widths', upperColWidth, lowerColWidth, colWidth);
		 $('.lcars-nav-wrapper', $this).width(colWidth);

		 var canvas = $('<canvas/>').addClass('lcars-swirly').attr('height', "50");
		 var w = $('<div/>');
		 w.append(canvas);
		 lowerPanel.prepend(w);
		 w.height(50);
		 canvas = lowerPanel.children('canvas.lcars-swirly');
		 canvas = $('canvas.lcars-swirly', lowerPanel);
		 var drawTFrame = function(){
		     drawSplitter(canvas, colWidth);
		     upperPanel.children('.lcars-upper').css('margin-left', colWidth+'px');
		     fillHeight(upperPanel, '.lcars-upper');

		     lowerPanel.children('.lcars-lower').css('margin-left', colWidth+'px');
		     adjustHeight($this, lowerPanel, upperPanel);
		     adjustHeight(lowerPanel, lowerPanel.children('.lcars-lower'), 
				  canvas);
		     
		 };

		 drawTFrame();
		 $(window).resize(drawTFrame);
		 log('done wth tframe');
	     });
     };
     
     $(document).ready(function(){
			   $('.lcars-tframe').lcars_tframe();
			   $('.lcars-cframe').lcars_cframe();
		       }); 
 })(jQuery);

