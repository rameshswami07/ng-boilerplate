/*global $ */
/**
 * Input Expected:
 * data = {
 *   rank: 'CONSTANT_NAME',
 *   name: 'Sorting Name (e.g. "Most Recently Donated")'
 * }
 *
 * Pseudocode:
 * <li ng-repeat="rank by ranks">
 *   <a href="#" data-rank="{{ rank.rank }}" {{ if (rank.rank === 'DATE_DONATED_DESCENDING') }} class="active" {{/if}}>{{ rank.name }}</a>
 * </li>
 *
 * Output:
 * data = {
 *   rank: 'CONSTANT_NAME'
 * }
 *
 */

// Constants Map
var RANKS = {
  MOST_LOVED: 'loved',
  CHARITY_NAME_ASCENDING: 'charity_name',
  CHARITY_NAME_DESCENDING: '-charity_name',
  DATE_DONATED_DESCENDING: '-item_date_donated',
  PRICE_ASCENDING: 'item_price',
  PRICE_DESCENDING: '-item-price'
};

var responseData = '';


/* EVENT HANDLERS */
// When clicking on the dropdown menu, toggle showing/hiding
// and apply 'active' class to the option selected
$('.filter-selector').on('click', function (event) {
  event.preventDefault();
  $(this).toggleClass('active');
  $('.filter-menu').slideToggle();
});


/* Detects clicks on anchors within the filter menu */
$('.filter-menu').on('click', 'a', function (event) {
  event.preventDefault();
  var $filterSelector = $('.filter-selector'),
    $filterMenu = $(this).parents('.filter-menu');

  /* UI Stuff */
  // Replaces the text for the filter dropdown with the text from the clicked item
  $filterSelector.text($(this).text())
    .addClass('selected')
    .removeClass('active');
  // Removes all 'active' classes
  $filterMenu.slideToggle().find('a').removeClass('active');
  // Sets the 'active' class on the clicked item
  $(this).addClass('active');
  // Show the 'Sort By:' text to the left of the sort dropdown
  $('.filter-sort-by').fadeIn();

  /* Set data for infinite scroller */
  responseData = $(this).data('rank');

  // NOTE: After setting, needs to tell masonry to reload, using this filtering
});
