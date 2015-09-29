Rickshaw.namespace('Rickshaw.Graph.RangeSlider');
jQuery.widget.bridge( "rickshaw_ui_slider", jQuery.ui.slider );

Rickshaw.Graph.RangeSlider = Rickshaw.Class.create({

	initialize: function(args) {

		var element = this.element = args.element;
		var graph = this.graph = args.graph;

		this.slideCallbacks = [];

		this.build();

		graph.onUpdate( function() { this.update() }.bind(this) );
	},

	build: function() {

		var element = this.element;
		var graph = this.graph;
		var $ = jQuery;

		var domain = graph.dataDomain();
		var self = this;

		$( function() {
			$(element).rickshaw_ui_slider( {
				range: true,
				min: domain[0],
				max: domain[1],
				values: [ 
					domain[0],
					domain[1]
				],
				slide: function( event, ui ) {

					if (ui.values[1] <= ui.values[0]) return;

					graph.window.xMin = ui.values[0];
					graph.window.xMax = ui.values[1];
					graph.update();

					var domain = graph.dataDomain();

					// if we're at an extreme, stick there
					if (domain[0] == ui.values[0]) {
						graph.window.xMin = undefined;
					}

					if (domain[1] == ui.values[1]) {
						graph.window.xMax = undefined;
					}

					self.slideCallbacks.forEach(function(callback) {
						callback(graph, graph.window.xMin, graph.window.xMax);
					});
				}
			} );
		} );

		graph.onConfigure(this.configure.bind(this));
		this.configure();

	},

	configure: function() {
		this.element.style.width = this.graph.width + 'px';
	},

	update: function() {

		var element = this.element;
		var graph = this.graph;
		var $ = jQuery;

		var values = $(element).rickshaw_ui_slider('option', 'values');

		var domain = graph.dataDomain();

		$(element).rickshaw_ui_slider('option', 'min', domain[0]);
		$(element).rickshaw_ui_slider('option', 'max', domain[1]);

		if (graph.window.xMin == null) {
			values[0] = domain[0];
		}
		if (graph.window.xMax == null) {
			values[1] = domain[1];
		}

		$(element).rickshaw_ui_slider('option', 'values', values);
	},

	onSlide: function(callback) {
		this.slideCallbacks.push(callback);
	}
});
