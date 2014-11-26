/* Display Services */

angular.module('Display.services', [ 'ngResource' ])
.service('ResolutionService', ['$window', '$rootScope', function(win, rootScope) {

  // Init Object
  var displayOptions = {};

  // Resolution breakpoints
  displayOptions.tinyScreen   = 480;
  displayOptions.smallScreen  = 768;
  displayOptions.mediumScreen = 992;
  displayOptions.largeScreen  = 1200;

  // Device Pixel Density for Photos
  displayOptions.pixelRatio   = win.devicePixelRatio > 1;

  // Device Resolution (Falsy)
  displayOptions.resolutionInit = function() {
    displayOptions.tinyResolution     = win.outerWidth <=  displayOptions.tinyScreen;
    displayOptions.smallResolution    = win.outerWidth >   displayOptions.tinyScreen   && win.outerWidth <= displayOptions.smallScreen;
    displayOptions.mediumResolution   = win.outerWidth >   displayOptions.smallScreen  && win.outerWidth <= displayOptions.mediumScreen;
    displayOptions.largeResolution    = win.outerWidth >   displayOptions.mediumScreen && win.outerWidth <= displayOptions.largeScreen;
    displayOptions.massiveResolution  = win.outerWidth >   displayOptions.largeScreen;

    rootScope.$broadcast('resolutionServiceChange');
  };

  var windowChange = _.debounce(displayOptions.resolutionInit, 300);

  displayOptions.resolutionInit();
  window.onresize = windowChange;

  // Chrome Fix for opening in new tabs
  // if (document.webkitVisibilityState != 'undefined') {
  //   document.addEventListener('webkitvisibilitychange', windowChange, false);
  // }

  // Image Server Service
  displayOptions.imageServerOptions = function(width, height, centered) {

    var imageWidth = width;
    var imageHeight = height;

    // Add Mobile Max
    if (displayOptions.tinyResolution && width > displayOptions.tinyScreen) {
      var ratio = width / 480;

      imageWidth  = 480;
      imageHeight = height * ratio;
    }

    var imageServerWidth    = this.pixelRatio ? imageWidth * 2  : imageWidth;
    var imageServerHeight   = this.pixelRatio ? imageHeight * 2 : imageHeight;
    var imageServerCentered = centered ? '&aspect=centered' : '&aspect=FitWithinNoPad';

    // &aspect=FitWithinNoPad || &aspect=centered

    return '?width=' + imageServerWidth + '&height=' + imageServerHeight + imageServerCentered;
  };


  return displayOptions;

}])
.provider('Resolution', function() {

  var win = window;
  var displayOptions = {};

  // Resolution breakpoints
  displayOptions.tinyScreen   = 480;
  displayOptions.smallScreen  = 768;
  displayOptions.mediumScreen = 992;
  displayOptions.largeScreen  = 1200;

  // Device Pixel Density for Photos
  displayOptions.pixelRatio   = win.devicePixelRatio > 1;

  // Device Resolution (Falsy)
  displayOptions.tinyResolution     = win.outerWidth <=  displayOptions.tinyScreen;
  displayOptions.smallResolution    = win.outerWidth >   displayOptions.tinyScreen   && win.outerWidth <= displayOptions.smallScreen;
  displayOptions.mediumResolution   = win.outerWidth >   displayOptions.smallScreen  && win.outerWidth <= displayOptions.mediumScreen;
  displayOptions.largeResolution    = win.outerWidth >   displayOptions.mediumScreen && win.outerWidth <= displayOptions.largeScreen;
  displayOptions.massiveResolution  = win.outerWidth >   displayOptions.largeScreen;

  this.displayOptions = displayOptions;

  this.$get = function() {

    return displayOptions;

  };

})
.factory('OrientationService', ['$window', '$rootScope', function(win, rootScope) {

  var deviceOrientation = {};

  var checkOrientation = function() {
    deviceOrientation.portrait  = Math.abs(win.orientation) == 90 ? false : true;
    deviceOrientation.landscape = Math.abs(win.orientation) == 90 ? true : false;

    rootScope.$broadcast('orientationServiceChange');

  };


  if (window.DeviceOrientationEvent && window.addEventListener)
    win.addEventListener("orientationchange" , checkOrientation, false);

    checkOrientation();

    return deviceOrientation;
  }]);
