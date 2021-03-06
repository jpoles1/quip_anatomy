$(document).ready(function() {
  $('thead th').each(function(col) {
    $(this).hover(
        function() { $(this).addClass('focus'); },
        function() { $(this).removeClass('focus'); }
    );
    $(this).click(function() {
      if ($(this).is('.desc')) {
        $(this).removeClass('desc');
        $(this).addClass('asc selected');
        sortOrder = -1;
      }
      else {
        $(this).addClass('desc selected');
        $(this).removeClass('asc');
        sortOrder = 1;
      }
      $(this).siblings().removeClass('asc selected');
      $(this).siblings().removeClass('desc selected');
      var arrData = $('table').find('tbody >tr:has(td)').get();
      arrData.sort(function(b, a) {
        var val1 = $(a).children('td').eq(col).children('a').eq(0).attr("dfsort_key")
        var val1 = val1 ? val1 : Number($(a).children('td').eq(col).text())
        var val2 = $(b).children('td').eq(col).children('a').eq(0).attr("dfsort_key")
        var val2 = val2 ? val2 : Number($(b).children('td').eq(col).text())
        if($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val1-val2 : val2-val1;
        else
           return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
      });
      $('tbody').html("");
      console.log($('tbody').html())
      $.each(arrData, function(index, row) {
        $('tbody').append(row);
      });
    });
  });
});
