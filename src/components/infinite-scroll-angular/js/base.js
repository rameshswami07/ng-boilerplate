/*global $, document, window, console */
/*jslint indent: 2 */
/**
 * Sets up responsive masonry tiles and infinite scroller
 * @author Jon Hughes
 * @date 05/30/2013
 *
 * TODO:
 * Add loading indicator
 * Add visual indicator of stream end
 */
var wts = window.wts || {},
  infiniteScroll = angular.module('infiniteScroll', []),
  _scope;

/* Angular Implementations */

infiniteScroll.controller('InfiniteScrollCtrl', function ($scope) {
  _scope = $scope;

  $scope.categoryCallback = function (response) {
    $scope.categories = response.vo;
    $scope.$apply();
  };

  $scope.tileCallback = function (response) {

    var i, itemsLength, $newItems, newItemsHTML = '', item,
      imgPath = 'http://dhg8u48nhwyd0.cloudfront.net/item/', anonymousAvatar = 'img/avatar.jpg';

    // $scope.tiles = $scope.tiles || [];
    $scope.tiles = JSON.parse(response.vo).hits.hit;
    console.log($scope.tiles);
    $scope.$apply();
  };

  $scope.applicationConnectedReady = function() {

    // getCategories(_scope.categoryCallback);


    // This needs to be abstracted out to be called by infinite scroller
    var params = {}, $container = $('tiles');

    params.serverConfig = {
      apiVersion: '2011-02-01',
      domainName: 'http://search-wts-search-dev-na35kiulnta6m26ht4bxpbh3cy',
      region: 'us-east-1'
    };

    params.requestParams = {
      rank: $container.data('rank') || '-item_date_donated',
      'bq': '(and%20item_system_status:1%20charity_public:1%20item_status:1)',
      'return-fields': 'item_id,item_img,item_name,item_price,item_sale_amount,user_id,user_first_name,user_last_name,user_img,charity_name,charity_img_ver,charity_handle',
      size: '30',
      start: $container.find('.tile').length - 1
    };

    serviceCall('getHomeProducts', '_scope.tileCallback', params);
  };

});

// Existing Implementation (Currently commented out at bottom)

wts.main = {
  init: function () {
    wts.main.wtsDropdown();
    wts.homepage.init();
  }
};

wts.main.wtsDropdown = function () {
  var $dropdowns = $('.wts-dropdown');

  $dropdowns.on({
    mouseenter: function () {
      $(this).find('.wts-dropdown-menu').slideDown();
    },
    mouseleave: function () {
      $(this).find('.wts-dropdown-menu').slideUp();
    }
  });

};

wts.homepage = {
  init: function () {
    wts.homepage.masonry();
    wts.homepage.infiniscroll.init();
  }
};

wts.homepage.masonry = function () {
  var $container = $('.tiles');

  $container.imagesLoaded(function () {
    $container.masonry({
      itemSelector: '.tile',
      // gutterWidth: 15,
      columnWidth: 241,
      isAnimated: true,
      isFitWidth: true,
      onResize: function (e, width) {
        $('.tile-menu-bar').animate({width: width}, 1000, function () {
          $(this).fadeIn();
        });
      }
    });
  });
};

wts.homepage.infiniscroll = {
  init: function () {

    // Set up event handlers
    this.setupEventHandlers();

    // Retrieve initial items
    this.getMoreItems();

    // Start listening for scroll event
    this.detectScrolling();

    // Populate Category List
    //setTimeout(this.populateCategories, 1000);
  },
  setupEventHandlers: function () {
    var $container = $('.tiles');
    $container.on({
      mouseenter: function () {
        $(this).find('.tile-details').show();
        if (!$(this).hasClass('parsed')) {
          try {
            FB.XFBML.parse($(this).get(0));
          } catch (err) {
            console.log(err);
          }
          $(this).addClass('parsed');
        }
        // $container.masonry('reload');
      },
      mouseleave: function () {
        $(this).find('.tile-details').hide();
        // $container.masonry('reload');
      }
    }, '.tile');


    $('.menu-tile').on('click', '.wts-dropdown-link', function (event) {
      event.preventDefault();
      $(this).toggleClass('active');
      $(this).next().slideToggle(400, function() {
        // Reload masonry
        $('.tiles').masonry('reload');
      });
    });

    $('.categories-dropdown a').on('click', function (event) {
      event.preventDefault();
      $(this).toggleClass('active');
      $('.category-menu').slideToggle(400, function() {
        // Reload masonry
        $('.tiles').masonry('reload');
      });
    });

    $('.category-menu').on('click', 'a', function (event) {
      event.preventDefault();
      var $container = $('.tiles'),
        $categorySelector = $('.category-selector'),
        $categoryMenu = $(this).parents('.category-menu');

      $categorySelector.text($(this).text()).addClass('selected').removeClass('active');
      $categoryMenu.slideToggle(400, function() {
        // Reload masonry
        $('.tiles').masonry('reload');
      }).find('a').removeClass('active');
      $(this).addClass('active');

      $container.data('category-id', $(this).data('category-id'));
      wts.homepage.infiniscroll.refreshItems();
    });

    $('.filter-selector').on('click', function (event) {
      event.preventDefault();
      $(this).toggleClass('active');
      $('.filter-menu').slideToggle();
    });

    $('.filter-menu').on('click', 'a', function (event) {
      event.preventDefault();
      var $container = $('.tiles'),
        $filterSelector = $('.filter-selector'),
        $filterMenu = $(this).parents('.filter-menu');

      $filterSelector.text($(this).text()).addClass('selected').removeClass('active');
      $filterMenu.slideToggle().find('a').removeClass('active');
      $(this).addClass('active');
      $('.filter-sort-by').fadeIn();

      $container.data('rank', $(this).data('rank'));
      wts.homepage.infiniscroll.refreshItems();

    });
  },
  populateCategories: function () {
    getCategories(function (data) {
      if (data) {
        var i, categoryLength, categories = data.vo,
          $categoryMenu = $('.category-menu'),
          categoryHTML = '<li><a href="#" data-category-id="-1" class="active">All Categories</a></li>';

        for (i = 0, categoryLength = categories.length; i < categoryLength; i = i + 1) {
          categoryHTML += '<li><a href="#" data-category-id="1">' + categories[i].name + '</a></li>';
        }
        $categoryMenu.html(categoryHTML);

        console.log(data);
      }
    });
  },
  refreshItems: function () {
    var $container = $('.tiles');

    $container.masonry('remove', $container.find('.tile').not('.menu-tile'));
    wts.homepage.infiniscroll.getMoreItems();
  },
  getMoreItems: function (inserted) {
    var $container = $('.tiles'), params = {};

    params.serverConfig = {
      apiVersion: '2011-02-01',
      domainName: 'http://search-wts-search-dev-na35kiulnta6m26ht4bxpbh3cy',
      region: 'us-east-1'
    };

    params.requestParams = {
      rank: $container.data('rank') || '-item_date_donated',
      'bq': '(and%20item_system_status:1%20charity_public:1%20item_status:1)',
      'return-fields': 'item_id,item_img,item_name,item_price,item_sale_amount,user_id,user_first_name,user_last_name,user_img,charity_name,charity_img_ver,charity_handle',
      size: '30',
      start: $container.find('.tile').length - 1
    };

    console.log('1');
    getHomeProducts(function (data) {
      // TODO: For charity link, need to get current domain and not use 'webthriftstore.com'
      var i, itemsLength, $newItems, newItemsHTML = '', item,
        imgPath = 'http://dhg8u48nhwyd0.cloudfront.net/item/', anonymousAvatar = 'img/avatar.jpg',
        json = JSON.parse(data.vo);

      console.log(json);
      if (json && (json.hits && json.hits.hit && json.hits.hit.length)) {
        for (i = 0, itemsLength = json.hits.hit.length; i < itemsLength; i = i + 1) {
          item = json.hits.hit[i].data;
          newItemsHTML += '<div class="tile"><div class="tile-image">' +
            '<a href="' + item.link + '"><img alt="" src="' + imgPath + item.item_img[0] + '"></a>' +
            '<div class="tile-details tile-header"><div class="avatar"><img src="' + (item.avatarSrc ? imgPath + item.avatarSrc : anonymousAvatar)  + '" alt=""></div>' +
            '<div class="donation-info"><p>Donated by: <strong><a href="/?action=search&ref=user&q_user_id=' + item.user_id + '">' + item.user_first_name + ' ' + item.user_last_name[0].substr(0,1) + '.</a></strong> <!--<em>' + item.donorLocation + '</em>--></p>' +
            '<a href="http://' + item.charity_handle + '.webthriftstore.com/"><img class="tile-charity" src="http://wts-media-dev.s3.amazonaws.com/application/' + item.charity_handle + '/small/logo.png" alt=""></a></div></div></div>' +
            '<h3 class="title"><a href="' + item.link + '">' + item.item_name[0] + '</a></h3>' +
            '<p class="price"><ins>$' + wts.util.numberFormat(item.item_price[0] / 100, 2) + '</ins> <!--<del> $' + item.retail + ' </del> <span>retail price</span>--></p>' +
            '<div class="tile-details tile-footer"><a href="#" class="tile-details-link">Details</a>' +
            '<ul class="tile-social"><li><a href="#" class="tile-love">24</a></li><li class="tile-like"><fb:like href="http://aspca.webthriftstore.com/shop/brand-new-linda-allard/11195" send="false" layout="button_count" width="47" show_faces="false"></fb:like></li><li><a href="#" class="tile-share">Share</a></li></ul></div></div>';
        }
        $newItems = $(newItemsHTML).css({ opacity: 0 });
        $newItems.imagesLoaded(function() {
          $container.append($newItems.animate({ opacity: 1 })).masonry('appended', $newItems, inserted);
          if (!inserted) {
            $container.masonry('reload');
          }
        });
      } else {
        // No more items
        console.log('no more items');
      }
    }, params);
  },
  detectScrolling: function () {
    $(window).scroll(function () {
      if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
        wts.homepage.infiniscroll.getMoreItems(true);
      }
    });
  }
};


wts.util = {};
wts.util.numberFormat = function (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://getsprink.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +     bugfix by: Howard Yeend
  // +    revised by: Luke Smith (http://lucassmith.name)
  // +     bugfix by: Diogo Resende
  // +     bugfix by: Rival
  // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
  // +   improved by: davook
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Jay Klehr
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Amir Habibi (http://www.residence-mixte.com/)
  // +     bugfix by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +      input by: Amirouche
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: number_format(1234.56);
  // *     returns 1: '1,235'
  // *     example 2: number_format(1234.56, 2, ',', ' ');
  // *     returns 2: '1 234,56'
  // *     example 3: number_format(1234.5678, 2, '.', '');
  // *     returns 3: '1234.57'
  // *     example 4: number_format(67, 2, ',', '.');
  // *     returns 4: '67,00'
  // *     example 5: number_format(1000);
  // *     returns 5: '1,000'
  // *     example 6: number_format(67.311, 2);
  // *     returns 6: '67.31'
  // *     example 7: number_format(1000.55, 1);
  // *     returns 7: '1,000.6'
  // *     example 8: number_format(67000, 5, ',', '.');
  // *     returns 8: '67.000,00000'
  // *     example 9: number_format(0.9, 0);
  // *     returns 9: '1'
  // *    example 10: number_format('1.20', 2);
  // *    returns 10: '1.20'
  // *    example 11: number_format('1.20', 4);
  // *    returns 11: '1.2000'
  // *    example 12: number_format('1.2000', 3);
  // *    returns 12: '1.200'
  // *    example 13: number_format('1 000,50', 2, '.', ' ');
  // *    returns 13: '100 050.00'
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    if (s[1]) {
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
  }
  return s[1].length ? s.join(dec) : s[0];
};


function applicationConnectedReady() {
  //wts.main.init();
}
