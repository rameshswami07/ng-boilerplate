/*global $ */
/**
 * Input Expected:
 * data = {
 *   display_rank: int,
 *   id: int,
 *   name: 'string',
 *   tree_parent: int
 * }
 *
 * Output:
 * data = {
 *   categoryId: int
 * }
 *
 */

var dummyData = [{"id":33,"name":"Women","tree_parent":1,"display_rank":1},{"id":49,"name":"Men","tree_parent":1,"display_rank":2},{"id":15,"name":"Accessories","tree_parent":33,"display_rank":3},{"id":18,"name":"Children","tree_parent":1,"display_rank":4},{"id":16,"name":"Baby","tree_parent":18,"display_rank":5},{"id":37,"name":"Clothing","tree_parent":33,"display_rank":6},{"id":39,"name":"Art & Collectibles","tree_parent":1,"display_rank":7},{"id":4,"name":"Bags","tree_parent":1,"display_rank":8},{"id":42,"name":"DVDs & Videos","tree_parent":25,"display_rank":10},{"id":45,"name":"Boys","tree_parent":18,"display_rank":11},{"id":43,"name":"Gift Certificates/ Tickets","tree_parent":1,"display_rank":11},{"id":9,"name":"Bath","tree_parent":40,"display_rank":12},{"id":13,"name":"Books & Magazines","tree_parent":1,"display_rank":13},{"id":41,"name":"Electronics","tree_parent":1,"display_rank":14},{"id":10,"name":"Houses","tree_parent":2,"display_rank":15},{"id":8,"name":"Apartment","tree_parent":2,"display_rank":16},{"id":27,"name":"Bed","tree_parent":40,"display_rank":17},{"id":7,"name":"Vacation Home","tree_parent":2,"display_rank":18},{"id":5,"name":"Health & Beauty","tree_parent":1,"display_rank":20},{"id":40,"name":"Household","tree_parent":1,"display_rank":21},{"id":25,"name":"Media","tree_parent":1,"display_rank":22},{"id":14,"name":"Music","tree_parent":25,"display_rank":24},{"id":12,"name":"Pets","tree_parent":1,"display_rank":25},{"id":17,"name":"Toys & Games","tree_parent":1,"display_rank":26},{"id":3,"name":"Transportation","tree_parent":1,"display_rank":27},{"id":46,"name":"Girls","tree_parent":18,"display_rank":27},{"id":19,"name":"Handbags","tree_parent":4,"display_rank":28},{"id":23,"name":"Video Game Software","tree_parent":25,"display_rank":29},{"id":22,"name":"Sports & Outdoors","tree_parent":1,"display_rank":31},{"id":20,"name":"Everything Else","tree_parent":1,"display_rank":32},{"id":2,"name":"Real Estate","tree_parent":1,"display_rank":33},{"id":26,"name":"Decorative","tree_parent":40,"display_rank":34},{"id":21,"name":"Furniture","tree_parent":40,"display_rank":35},{"id":36,"name":"Aircraft","tree_parent":3,"display_rank":36},{"id":35,"name":"Boats & PWC","tree_parent":3,"display_rank":37},{"id":31,"name":"Cars","tree_parent":3,"display_rank":38},{"id":34,"name":"Motorcycles","tree_parent":3,"display_rank":39},{"id":47,"name":"Kitchen","tree_parent":40,"display_rank":40},{"id":32,"name":"Trucks","tree_parent":3,"display_rank":41},{"id":38,"name":"Jewelry","tree_parent":33,"display_rank":42},{"id":24,"name":"Lighting","tree_parent":40,"display_rank":43},{"id":11,"name":"Shoes","tree_parent":33,"display_rank":44},{"id":48,"name":"Unused","tree_parent":1,"display_rank":45},{"id":6,"name":"Luggage & Backpacks","tree_parent":4,"display_rank":46},{"id":50,"name":"Accessories","tree_parent":49,"display_rank":47},{"id":51,"name":"Clothing","tree_parent":49,"display_rank":48},{"id":52,"name":"Shoes","tree_parent":49,"display_rank":49}];

var i, categoryLength;


