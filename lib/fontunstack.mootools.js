/*  
 *  Font UnStack 0.11
 * 
 *  Developed for MooTools by Arlen Walker (Paladin)
 *	Derived from Font Unstack jQuery Plugin developed by Phil Oyes
 *  Changes From Phil's version Copyright (c) 2009 Arlen Walker, http://www.paladinweb.net/
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 */
(function(){
	if( parseFloat(MooTools.version) >= 1.2 ) {
		Element.implement({
			options: { class_prefix: "set_in_" },
			fontunstack: function(stack, opts) {
				$extend( this.options, opts );
				
				if( this.options.class_prefix == "") {
					this.options.class_prefix = "set_in_";
				}
				
	// If a css-style font-family declaration (string) passed in, convert to array
				if (typeof stack == "string") {
				  stack = stack.match(/[^'",;\s][^'",;]*/g) || [];
				}
			   this.analyzeStack(stack);
			},
			analyzeStack: function(stack) {
				var generics = ["monospace", "sans-serif", "serif", "cursive", "fantasy"];
				var baseline = generics[0];
				var num_fonts = stack.length;
				var last_resort = stack[num_fonts -1];
				
	// If author hasn't included a generic (tsk, tsk), let's add one
				if (last_resort in generics) { 
					stack.push(baseline);
					num_fonts++;
				}
				
	// If the generic is the same as our baseline, let's use another.
				if (last_resort == baseline) {
					baseline = generics[1]; 
				};
				
	// At this point we're sure there is a generic fallback font, so we'll only iterate though the non-generics.
				for (var i=0; i<num_fonts -1; i++) {
					font = stack[i];
					if (this.testFont(font, baseline)) {
						
	// Remove any class that has our prefix to prevent doubles.
						var re = new RegExp('\\b' + this.options.class_prefix + '.*?\\b','g');
						this.setProperty('class', this.getProperty('class').replace(re, ''));
						
	// This should convert UTF8 to lowercase ANSI, removing all punctuation/spaces, but regexp scares Phil. ;{>}
						safe_font_name = encodeURIComponent( font.replace( /[\s\-.!~*'()"]/g, "").toLowerCase() );
						this.addClass(this.options.class_prefix + safe_font_name);
						break; //We only want to find one installed font per stack.
					}
				}
			},
			testFont: function(requested_font, baseline_font) {
				var testElement = new Element( 'span', {'id': 'font_tester'} );
				testElement.setStyles( {'font-family' : baseline_font,
										'font-size': '144px',
										'position' : 'absolute',
										'left' : '-10000px',
										'top' : '-10000px' });
				testElement.appendText( 'mmmmmmmmmmmmmmmmmmmmmmmmmmmml' );
				testElement.inject( $(document.body), 'top' );
				var baseline_width = testElement.getSize().x;
				testElement.setStyle('font-family', requested_font + ',' + baseline_font );
				var requested_width = testElement.getSize().x;
				testElement.dispose();
				
	// If the dimensions change, the font is installed
				return((requested_width != baseline_width)? true: false);
			}
	
		});
	}
	else
	{
		Elements.extend({
			options: { class_prefix: "set_in_" },
			fontunstack: function(stack, opts) {
				$extend( this.options, opts );
				
				if( this.options.class_prefix == "") {
					this.options.class_prefix = "set_in_";
				}
				
	// If a css-style font-family declaration (string) passed in, convert to array
				if (typeof stack == "string") {
				  stack = stack.match(/[^'",;\s][^'",;]*/g) || [];
				}
			   this.analyzeStack(stack);
			},
			analyzeStack: function(stack) {
				var generics = ["monospace", "sans-serif", "serif", "cursive", "fantasy"];
				var baseline = generics[0];
				var num_fonts = stack.length;
				var last_resort = stack[num_fonts -1];
				
	// If author hasn't included a generic (tsk, tsk), let's add one
				if (last_resort in generics) { 
					stack.push(baseline);
					num_fonts++;
				}
				
	// If the generic is the same as our baseline, let's use another.
				if (last_resort == baseline) {
					baseline = generics[1]; 
				};
				
	// At this point we're sure there is a generic fallback font, so we'll only iterate though the non-generics.
				for (var i=0; i<num_fonts -1; i++) {
					font = stack[i];
					if (this.testFont(font, baseline)) {
						
	// Remove any class that has our prefix to prevent doubles.
						var re = new RegExp('\\b' + this.options.class_prefix + '.*?\\b','g');
						$each( this, function( elem ) {
							elem.setProperty('class', elem.getProperty('class').replace(re, ''));
							});
						
	// This should convert UTF8 to lowercase ANSI, removing all punctuation/spaces, but regexp scares Phil. ;{>}
						safe_font_name = encodeURIComponent( font.replace( /[\s\-.!~*'()"]/g, "").toLowerCase() );
						this.addClass(this.options.class_prefix + safe_font_name);
						break; //We only want to find one installed font per stack.
					}
				}
			},
			testFont: function(requested_font, baseline_font) {
				var testElement = new Element( 'span', {'id': 'font_tester', 
						'styles': 'font-family:' + baseline_font + '; font-size:144px;position:absolute;left:-10000px;top:-10000px;visibility:hidden;' });
				testElement.setText( 'mmmmmmmmmmmmmmmmmmmmmmmmmmmml' );
				testElement.inject( $(document.body), 'top' );
				var baseline_width = testElement.getSize().size.x;
				testElement.setStyle('font-family', requested_font + ',' + baseline_font );
				var requested_width = testElement.getSize().size.x;
				testElement.remove();
				
	// If the dimensions change, the font is installed
				return((requested_width != baseline_width)? true: false);
			}
		});
	}
})();