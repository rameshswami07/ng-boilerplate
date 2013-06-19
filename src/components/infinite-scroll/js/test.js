getItems = function () {

  var params = {};
  params.serverConfig = {
    apiVersion: '2011-02-01',
    domainName: 'http://search-wts-search-dev-na35kiulnta6m26ht4bxpbh3cy',
    region: 'us-east-1'
  };

  params.requestParams = {
    rank: '-item_date_donated',
    'bq': '(and%20item_system_status:1%20charity_public:1%20item_status:1)',
    'return-fields': 'item_id,item_img,item_name,item_price,item_sale_amount,user_id,user_first_name,user_last_name,user_img,charity_name,charity_img_ver,charity_handle',
    size: '30',
    start: '0'
  };

  getHomeProducts(function (data) {
    var items = JSON.parse(data.vo);
    console.error(items.length + ' Items');
  }, params);
};

getCats = function () {
  getCategories(function (data) {
    var categories = data.vo;
    console.error(categories.length + ' Categories');
  });
};

function applicationConnectedReady() {

  // Get Categories
  getCats();

  // Get Items
  getItems();

}
