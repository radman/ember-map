(function() {
  window.DreamcodeComponents = Ember.Namespace.create();

}).call(this);

(function() {
  DreamcodeComponents.EmberMapComponent = Ember.Component.extend({
    classNames: ["ember-map"],
    attributeBindings: ["lat", "lng", "zoom", "currentLocation", "swlat", "swlng", "nelat", "nelng"],
    didInsertElement: function() {
      return this.attachCanvas();
    },
    willDestroyElement: function() {
      return this.detachCanvas();
    },
    attachCanvas: function() {
      this.canvas = $("#google-map-canvas");
      if (this.canvas.length === 0) {
        this.buildMap();
      }
      this.map = DreamcodeComponents.EmberMapComponent.map;
      this.currentLocationMarker = DreamcodeComponents.EmberMapComponent.currentLocationMarker;
      this.addEventListeners();
      this.centerMap();
      this.updateZoom();
      if (this.map.getBounds()) {
        this.updateBounds();
      } else {
        google.maps.event.addListenerOnce(this.map, "bounds_changed", (function(_this) {
          return function() {
            return _this.updateBounds();
          };
        })(this));
      }
      return this.$().append(this.canvas);
    },
    detachCanvas: function() {
      this.canvas.appendTo("body");
      return this.clearEventListeners();
    },
    buildMap: function() {
      var mapOptions;
      this.canvas = $("<div>").attr("id", "google-map-canvas").attr("style", "position: absolute; width: 100%; height: 100%");
      mapOptions = {
        zoom: this.get("zoom"),
        center: new google.maps.LatLng(this.get("lat"), this.get("lng")),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      };
      this.map = new google.maps.Map(this.canvas[0], mapOptions);
      this.currentLocationMarker = this.buildCurrentLocationMarker();
      DreamcodeComponents.EmberMapComponent.map = this.map;
      return DreamcodeComponents.EmberMapComponent.currentLocationMarker = this.currentLocationMarker;
    },
    buildCurrentLocationMarker: function() {
      var image;
      image = {
        url: this.currentLocationMarkerImageUrl,
        size: null,
        origin: null,
        anchor: new google.maps.Point(32, 32),
        scaledSize: new google.maps.Size(64, 64)
      };
      return new google.maps.Marker({
        map: this.map,
        icon: image
      });
    },
    updateCurrentLocationMarker: (function() {
      var latlng, location;
      location = this.get("currentLocation");
      latlng = new google.maps.LatLng(location[0], location[1]);
      return this.currentLocationMarker.setPosition(latlng);
    }).observes('currentLocation'),
    centerMap: (function() {
      return this.map.setCenter(new google.maps.LatLng(this.get('lat'), this.get('lng')));
    }).observes('lat', 'lng'),
    updateBounds: (function() {
      var ne, sw;
      sw = this.map.getBounds().getSouthWest();
      ne = this.map.getBounds().getNorthEast();
      this.set("swlat", sw.lat());
      this.set("swlng", sw.lng());
      this.set("nelat", ne.lat());
      return this.set("nelng", ne.lng());
    }).observes("lat", "lng", "zoom"),
    updateZoom: (function() {
      return this.map.setZoom(this.get("zoom"));
    }).observes("zoom"),
    addEventListeners: function() {
      var dragendListener, zoomChangedListener;
      this.customListeners = [];
      dragendListener = google.maps.event.addListener(this.map, "dragend", (function(_this) {
        return function(event) {
          return Ember.run(function() {
            var center;
            center = _this.map.getCenter();
            _this.set("lat", center.lat());
            return _this.set("lng", center.lng());
          });
        };
      })(this));
      zoomChangedListener = google.maps.event.addListener(this.map, "zoom_changed", (function(_this) {
        return function(event) {
          return Ember.run(function() {
            return _this.set("zoom", _this.map.getZoom());
          });
        };
      })(this));
      this.customListeners.push(dragendListener);
      return this.customListeners.push(zoomChangedListener);
    },
    clearEventListeners: function() {
      var listener, _i, _len, _ref;
      _ref = this.customListeners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        google.maps.event.removeListener(listener);
      }
      return this.customListeners = [];
    }
  });

}).call(this);

(function() {
  DreamcodeComponents.Register = Ember.Mixin.create({
    EmberMapComponent: DreamcodeComponents.EmberMapComponent
  });

}).call(this);
