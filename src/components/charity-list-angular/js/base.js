/*global $, document, window */
/**
 * Pulls in list of charities
 * @author Jon Hughes
 * @date 06/10/2013
 *
 */
var wts = window.wts || {};

wts.main = {
  init: function () {
    wts.header.init();
    wts.main.wtsDropdown();
  }
};

wts.header = {
  init: function () {
    wts.header.populateCharityList();
  }
};

wts.main.wtsDropdown = function () {
  var $dropdowns = $('.wts-dropdown');

  $dropdowns.on({
    mouseenter: function () {
      $(this).find('.wts-dropdown-menu').show();
    },
    mouseleave: function () {
      $(this).find('.wts-dropdown-menu').hide();
    }
  });
};

wts.header.populateCharityList = function () {
  var $charityList = $('.charity-list');

  getListOfActiveCharities(function(response) {
    if(response && response.vo) {
      var i, charityList = response.vo, charityListHTML = '', charity;
      for (i = 0, charityListLength = charityList.length; i < charityListLength; i = i + 1) {
        charity = charityList[i];
        charityListHTML += '<li><a href="#">' + charity.name + '</a></li>';
      }
      $charityList.html(charityListHTML);
    }
  });
};

function applicationConnectedReady() {
  wts.main.init();
}
