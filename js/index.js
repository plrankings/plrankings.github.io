var dtable;

$(document).ready( function () {
    dtable = createDataTable();

    setSearch(dtable);

    groupFirstColumns();

    setRankingsFilters();

} );

function createDataTable() {
    return $('#rankings-table').DataTable({
            "paging": false,
            "searching": true, 
            "ordering": false,
            "info": false
            });
}

function setSearch() {
    $('#search').keyup(function() {
        searchInTable();
    });
}

function searchInTable() {
    let value = $('#search').val();
    dtable.search( value ).draw();
        var language_columns = $("[id='language_column']");
        if (value.length>0 && language_columns.length%3!=0) {
          language_columns.each(function() {
            $(this).removeClass('invisible-text');
            unGroupFirstColumns();
          });
        } else {
          language_columns.each(function() {
            $(this).addClass('invisible-text');
            groupFirstColumns();
          });
        }
}

function groupFirstColumns() {
  // 2,3,4 - 6,7,8 ...
  let group = 1;
  for (l=2; l<(4*20); l++) {
    if (group++ == 4) {
      group = 1;
      continue;
    }
    $(`tbody > tr:nth-child(${l}) > th`).css("border-color","transparent");
  }
}

function unGroupFirstColumns() {
  $(`tbody > tr > th`).css("border-top","1px solid #dee2e6");
}

function setRankingsFilters() {
    $("[data-ranking-filter]").each(function() {
        let link = $(this);
        link.css('cursor','pointer');

        let is_filter = link.attr('data-ranking-filter')=='true';

        if (!is_filter) {
            link.hide();
        } 

        link.click(function() {
            if (is_filter) {
                $('#search').val(link.prev().html().trim());
            } else {
                $('#search').val('');
            }
            searchInTable();
            displayFilters(!is_filter);
        })
    });
}

function displayFilters(filter) {
    $(`[data-ranking-filter='${filter}']`).each(function() {
        $(this).show();
    });
    $(`[data-ranking-filter='${!filter}']`).each(function() {
        $(this).hide();
    });    
}

