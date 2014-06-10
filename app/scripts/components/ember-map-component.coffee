# TODO: not possible to use multiple instances atm because
# - $("#google-map-canvas")
# - DreamcodeComponents.EmberMapComponent.map
# - DreamcodeComponents.EmberMapComponent.currentLocationMarker
DreamcodeComponents.EmberMapComponent = Ember.Component.extend
  classNames: ["ember-map"]
  attributeBindings: [
    "lat", "lng", "zoom", "currentLocation",
    "swlat", "swlng", "nelat", "nelng"
  ]

  didInsertElement: -> @attachCanvas()
  willDestroyElement: -> @detachCanvas()

  attachCanvas: ->
    @canvas = $("#google-map-canvas")
    @buildMap() if @canvas.length is 0

    @map = DreamcodeComponents.EmberMapComponent.map;
    @currentLocationMarker = DreamcodeComponents.EmberMapComponent.currentLocationMarker;
    @addEventListeners()

    # NOTE: can't use @append because ember is strict about not letting us append elements that already exist in the DOM
    @$().append @canvas # TODO: this is modifying DOM and should be scheduled in run loop

  detachCanvas: ->
    @canvas.appendTo "body"
    @clearEventListeners()

  buildMap: ->
    # build and init
    @canvas = $("<div>")
      .attr("id", "google-map-canvas")
      .attr("style", "position: absolute; width: 100%; height: 100%")

    mapOptions =
      zoom: 16
      center: new google.maps.LatLng(49.2569777, -123.123904)
      mapTypeId: google.maps.MapTypeId.ROADMAP
      disableDefaultUI: true

    @map = new google.maps.Map(@canvas[0], mapOptions)
    @currentLocationMarker = @buildCurrentLocationMarker()

    DreamcodeComponents.EmberMapComponent.map = @map
    DreamcodeComponents.EmberMapComponent.currentLocationMarker = @currentLocationMarker

  buildCurrentLocationMarker: ->
    image = 
      url: @currentLocationMarkerImageUrl
      size: null
      origin: null
      anchor: new google.maps.Point(32, 32)
      scaledSize: new google.maps.Size(64, 64)

    return new google.maps.Marker
      map: @map
      icon: image

  updateCurrentLocationMarker: (->
    location = @get("currentLocation")
    latlng = new google.maps.LatLng(location[0], location[1])
    @currentLocationMarker.setPosition(latlng)
  ).observes('currentLocation')

  centerMap: (->
    @map.setCenter new google.maps.LatLng(@get('lat'), @get('lng'))
  ).observes('lat', 'lng')

  updateBounds: (->
    sw = @map.getBounds().getSouthWest()
    ne = @map.getBounds().getNorthEast()

    @set "swlat", sw.lat()
    @set "swlng", sw.lng()
    @set "nelat", ne.lat()
    @set "nelng", ne.lng()
  ).observes("lat", "lng", "zoom")

  addEventListeners: ->
    google.maps.event.addListener @map, "dragend", (event) =>
      center = @map.getCenter()
      @set "lat", center.lat()
      @set "lng", center.lng()

    google.maps.event.addListener @map, "zoom_changed", (event) =>
      @set "zoom", @map.getZoom()

  clearEventListeners: ->
    google.maps.event.clearListeners @map

