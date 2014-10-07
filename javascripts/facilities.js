
$( document ).ready(function() {
  var big_number_description = "Active retail or medical store licenses issued."
  facilitiesSource("http://data.denvergov.org/dataset/city-and-county-of-denver-marijuana-facilities");
  facilitiesCount(big_number_description);
  facilitiesDonut();
});

function facilitiesSource(url) {
  $("#facilities-source").attr('href', url);
}

function facilitiesCount(description) {
  d3.csv("data/facilities-big.csv", function(data) {
    $("#facilities-number").text(data[0].big);
    $("#facilities-number-strong").text(description);
  });
}

function facilitiesDonut() {
  var svg = dimple.newSvg("#facilities-donut", '100%', '100%');
  d3.csv("data/facilities-licenses.csv", function (data) {
    var myChart = new dimple.chart(svg, data);
    myChart.addMeasureAxis("p", "value");
    var ring = myChart.addSeries("label", dimple.plot.pie);
    
    // Tooltip
    ring.getTooltipText = function (e) {
      return [ e.aggField[0], formatPercent(e.piePct) ];
    };

    myChart.defaultColors = [
      new dimple.color("#b1dce8"),
      new dimple.color("#62b9d1"),
      new dimple.color("#2c7e95"),
      new dimple.color("#0f2a31")

    ]; 
    myChart.addLegend("0",20,"50%","100%","left");
    myChart.draw();
  });
}

// Closure
(function(){

  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number}      The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }

})();

function formatPercent(number){
  return (Math.round10(number * 100, -1)) + '%';
}