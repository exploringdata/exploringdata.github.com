// https://d3-geomap.github.io v3.0.0 Copyright 2019 Ramiro Gómez
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-transition'), require('topojson'), require('d3-fetch'), require('d3-geo'), require('d3-array'), require('d3-scale'), require('d3-format')) :
typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-transition', 'topojson', 'd3-fetch', 'd3-geo', 'd3-array', 'd3-scale', 'd3-format'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3, global.topojson, global.d3, global.d3, global.d3, global.d3, global.d3));
}(this, function (exports, d3Selection, d3Transition, topojson, d3Fetch, d3Geo, d3Array, d3Scale, d3Format) { 'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function addAccessor(obj, name, value) {
  obj[name] = function (_) {
    if (typeof _ === 'undefined') return obj.properties[name] || value;
    obj.properties[name] = _;
    return obj;
  };
}

var Geomap =
/*#__PURE__*/
function () {
  function Geomap() {
    _classCallCheck(this, Geomap);

    // Set default properties optimized for naturalEarth projection.
    this.properties = {
      /**
       * URL to TopoJSON file to load when geomap is drawn. Ignored if geoData is specified.
       *
       * @type {string|null}
       */
      geofile: null,

      /**
       * Contents of TopoJSON file. If specified, geofile is ignored.
       *
       * @type {Promise<object>|object|null}
       */
      geoData: null,
      height: null,
      postUpdate: null,
      projection: d3Geo.geoNaturalEarth1,
      rotate: [0, 0, 0],
      scale: null,
      translate: null,
      unitId: 'iso3',
      unitPrefix: 'unit-',
      units: 'units',
      unitTitle: function unitTitle(d) {
        return d.properties.name;
      },
      width: null,
      zoomFactor: 4
    }; // Setup methods to access properties.

    for (var key in this.properties) {
      addAccessor(this, key, this.properties[key]);
    } // Store internal properties.


    this._ = {};
  }

  _createClass(Geomap, [{
    key: "clicked",
    value: function clicked(d) {
      var _this = this;

      var k = 1,
          x0 = this.properties.width / 2,
          y0 = this.properties.height / 2,
          x = x0,
          y = y0;

      if (d && d.hasOwnProperty('geometry') && this._.centered !== d) {
        var centroid = this.path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = this.properties.zoomFactor;
        this._.centered = d;
      } else {
        this._.centered = null;
      }

      this.svg.selectAll('path.unit').classed('active', this._.centered && function (_) {
        return _ === _this._.centered;
      });
      this.svg.selectAll('g.zoom').transition().duration(750).attr('transform', "translate(".concat(x0, ", ").concat(y0, ")scale(").concat(k, ")translate(-").concat(x, ", -").concat(y, ")"));
    }
    /**
     * Load geo data once here and draw map. Call update at the end.
     *
     * By default map dimensions are calculated based on the width of the
     * selection container element so they are responsive. Properties set before
     * will be kept.
     */

  }, {
    key: "draw",
    value: function draw(selection) {
      var self = this;
      self.data = selection.datum();
      if (!self.properties.width) self.properties.width = selection.node().getBoundingClientRect().width;
      if (!self.properties.height) self.properties.height = self.properties.width / 1.92;
      if (!self.properties.scale) self.properties.scale = self.properties.width / 5.8;
      if (!self.properties.translate) self.properties.translate = [self.properties.width / 2, self.properties.height / 2];
      self.svg = selection.append('svg').attr('width', self.properties.width).attr('height', self.properties.height);
      self.svg.append('rect').attr('class', 'background').attr('width', self.properties.width).attr('height', self.properties.height).on('click', self.clicked.bind(self)); // Set map projection and path.

      var proj = self.properties.projection().scale(self.properties.scale).translate(self.properties.translate).precision(.1); // Not every projection supports rotation, e. g. albersUsa does not.

      if (proj.hasOwnProperty('rotate') && self.properties.rotate) proj.rotate(self.properties.rotate);
      self.path = d3Geo.geoPath().projection(proj);

      var drawGeoData = function drawGeoData(geo) {
        self.geo = geo;
        self.svg.append('g').attr('class', 'units zoom').selectAll('path').data(topojson.feature(geo, geo.objects[self.properties.units]).features).enter().append('path').attr('class', function (d) {
          return "unit ".concat(self.properties.unitPrefix).concat(d.properties[self.properties.unitId]);
        }).attr('d', self.path).on('click', self.clicked.bind(self)).append('title').text(self.properties.unitTitle);
        self.update();
      };

      Promise.resolve().then(function () {
        if (self.properties.geoData) {
          return self.properties.geoData;
        }

        return d3Fetch.json(self.properties.geofile);
      }).then(function (geo) {
        return drawGeoData(geo);
      });
    }
  }, {
    key: "update",
    value: function update() {
      if (this.properties.postUpdate) this.properties.postUpdate();
    }
  }]);

  return Geomap;
}();

var D3_CHROMATIC_SCHEME_OrRd9 = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'];
var Choropleth =
/*#__PURE__*/
function (_Geomap) {
  _inherits(Choropleth, _Geomap);

  function Choropleth() {
    var _this;

    _classCallCheck(this, Choropleth);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Choropleth).call(this));
    var properties = {
      colors: Choropleth.DEFAULT_COLORS,
      column: null,
      domain: null,
      duration: null,
      format: d3Format.format(',.02f'),
      legend: false,
      valueScale: d3Scale.scaleQuantize
    };

    for (var key in properties) {
      _this.properties[key] = properties[key];
      addAccessor(_assertThisInitialized(_this), key, properties[key]);
    }

    return _this;
  }

  _createClass(Choropleth, [{
    key: "columnVal",
    value: function columnVal(d) {
      return +d[this.properties.column];
    }
  }, {
    key: "defined",
    value: function defined(val) {
      return !(isNaN(val) || 'undefined' === typeof val || '' === val);
    }
  }, {
    key: "update",
    value: function update() {
      var self = this;
      self.extent = d3Array.extent(self.data, self.columnVal.bind(self));
      self.colorScale = self.properties.valueScale().domain(self.properties.domain || self.extent).range(self.properties.colors); // Remove fill styles that may have been set previously.

      self.svg.selectAll('path.unit').style('fill', null); // Add new fill styles based on data values.

      self.data.forEach(function (d) {
        var uid = d[self.properties.unitId].toString().trim(),
            val = d[self.properties.column].toString().trim(); // selectAll must be called and not just select, otherwise the data
        // attribute of the selected path object is overwritten with self.data.

        var unit = self.svg.selectAll(".".concat(self.properties.unitPrefix).concat(uid)); // Data can contain values for non existing units and values can be empty or NaN.

        if (!unit.empty() && self.defined(val)) {
          var fill = self.colorScale(val),
              text = self.properties.unitTitle(unit.datum());
          if (self.properties.duration) unit.transition().duration(self.properties.duration).style('fill', fill);else unit.style('fill', fill); // New title with column and value.

          val = self.properties.format(val);
          unit.select('title').text("".concat(text, "\n\n").concat(self.properties.column, ": ").concat(val));
        }
      });
      if (self.properties.legend) self.drawLegend(self.properties.legend); // Make sure postUpdate function is run if set.

      _get(_getPrototypeOf(Choropleth.prototype), "update", this).call(this);
    }
    /**
     * Draw legend including color scale and labels.
     *
     * If bounds is set to true, legend dimensions will be calculated based on
     * the map dimensions. Otherwise bounds must be an object with width and
     * height attributes.
     */

  }, {
    key: "drawLegend",
    value: function drawLegend() {
      var bounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this,
          steps = self.properties.colors.length,
          wBox,
          hBox;
      var wFactor = 10,
          hFactor = 3;

      if (bounds === true) {
        wBox = self.properties.width / wFactor;
        hBox = self.properties.height / hFactor;
      } else {
        wBox = bounds.width;
        hBox = bounds.height;
      }

      var wRect = wBox / (wFactor * .75),
          hLegend = hBox - hBox / (hFactor * 1.8),
          offsetText = wRect / 2,
          offsetY = self.properties.height - hBox,
          tr = 'translate(' + offsetText + ',' + offsetText * 3 + ')'; // Remove possibly existing legend, before drawing.

      self.svg.select('g.legend').remove(); // Reverse a copy to not alter colors array.

      var colors = self.properties.colors.slice().reverse(),
          hRect = hLegend / steps,
          offsetYFactor = hFactor / hRect;
      var legend = self.svg.append('g').attr('class', 'legend').attr('width', wBox).attr('height', hBox).attr('transform', 'translate(0,' + offsetY + ')');
      legend.append('rect').style('fill', '#fff').attr('class', 'legend-bg').attr('width', wBox).attr('height', hBox); // Draw a rectangle around the color scale to add a border.

      legend.append('rect').attr('class', 'legend-bar').attr('width', wRect).attr('height', hLegend).attr('transform', tr);
      var sg = legend.append('g').attr('transform', tr); // Draw color scale.

      sg.selectAll('rect').data(colors).enter().append('rect').attr('y', function (d, i) {
        return i * hRect;
      }).attr('fill', function (d, i) {
        return colors[i];
      }).attr('width', wRect).attr('height', hRect); // Determine display values for lower and upper thresholds. If the
      // minimum data value is lower than the first element in the domain
      // draw a less than sign. If the maximum data value is larger than the
      // second domain element, draw a greater than sign.

      var minDisplay = self.extent[0],
          maxDisplay = self.extent[1],
          addLower = false,
          addGreater = false;

      if (self.properties.domain) {
        if (self.properties.domain[1] < maxDisplay) addGreater = true;
        maxDisplay = self.properties.domain[1];
        if (self.properties.domain[0] > minDisplay) addLower = true;
        minDisplay = self.properties.domain[0];
      } // Draw color scale labels.


      sg.selectAll('text').data(colors).enter().append('text').text(function (d, i) {
        // The last element in the colors list corresponds to the lower threshold.
        if (i === steps - 1) {
          var text = self.properties.format(minDisplay);
          if (addLower) text = "< ".concat(text);
          return text;
        }

        return self.properties.format(self.colorScale.invertExtent(d)[0]);
      }).attr('class', function (d, i) {
        return 'text-' + i;
      }).attr('x', wRect + offsetText).attr('y', function (d, i) {
        return i * hRect + (hRect + hRect * offsetYFactor);
      }); // Draw label for end of extent.

      sg.append('text').text(function () {
        var text = self.properties.format(maxDisplay);
        if (addGreater) text = "> ".concat(text);
        return text;
      }).attr('x', wRect + offsetText).attr('y', offsetText * offsetYFactor * 2);
    }
  }]);

  return Choropleth;
}(Geomap);
Choropleth.DEFAULT_COLORS = D3_CHROMATIC_SCHEME_OrRd9;

function geomap() {
  return new Geomap();
}

function choropleth() {
  return new Choropleth();
}

exports.choropleth = choropleth;
exports.geomap = geomap;

Object.defineProperty(exports, '__esModule', { value: true });

}));
