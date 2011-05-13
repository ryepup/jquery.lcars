(function($){
     $.fn.lcars = function(options){
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
	     console.log(parentHeight, '-', pt, '-', pb, '-', mt, '-', mb, '=', newHeight);
	     $child.css('height', newHeight);
	 };

	 
	 return this.each(
	     function(){
		 var $this = $(this);

		 //add borders
		 /*
		  * borders are handled as inner/outer frames
		  * 
		  */
		 var contentFrame = $('<div class="lcars-content-frame"/>');
		 $this.contents().wrapAll(contentFrame);
		 

		 $this.contents().wrapAll('<div class="lcars-border-frame"/>');
		 var borderFrame = $('.lcars-border-frame');
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
     
     $(document).ready(function(){
			   $('body.lcars').lcars();
		       }); 
 })(jQuery);

