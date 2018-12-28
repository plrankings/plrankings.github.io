var dtable;
var active_rankings = 4;

$(document).ready( function () {
    dtable = createDataTable();

    setSearch(dtable);

    //groupFirstColumns();

    setRankingsFilters();

    configLogoFilters();

} );

function createDataTable() {
    return $('#rankings-table').DataTable({
            paging: false,
            searching: true, 
            ordering: false,
            info: false,
            responsive: true
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
            //unGroupFirstColumns();
        });
    } else {
        language_columns.each(function() {
            $(this).addClass('invisible-text');
            //groupFirstColumns();
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

function configLogoFilters() {
    let img_disabled = 'img-disabled';  
    let rankings_list = [];

    $(`.top-div img`).each(function() {
        let img = $(this);
        
        let ranking_name = img.attr('title').split(' ')[0].toLowerCase();
        rankings_list.push(ranking_name);

        img.click(function() {
            if ($(this).hasClass(img_disabled)) { // enable it
                $(this).removeClass(img_disabled);
                active_rankings++;
                rankings_list.push(ranking_name);
            } 
            else {  // disable it
                if (rankings_list.length>1) {
                    $(this).addClass(img_disabled);    
                    active_rankings--;
                    rankings_list = rankings_list.filter(r => r!=ranking_name);
                }
            }

            let language_columns = $("[id='language_column']");
            if (active_rankings!=4) {
                language_columns.each(function() {
                    $(this).removeClass('invisible-text');
                });
                //unGroupFirstColumns();
            } else {
                language_columns.each(function() {
                    $(this).addClass('invisible-text');
                });                
                //groupFirstColumns();
            }

            let rankings_columns = $('#rankings-table > tbody > tr > td[data-ranking], #rankings-table > thead > tr > th[data-ranking]');
            rankings_columns.each(function(){
                if (rankings_list.indexOf($(this).attr('data-ranking').trim())<0) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });

            updateAverages();

        });
    });
    
}

function updateAverages() {
    let lines = $("#rankings-table > tbody > tr").length;
    let columns = [2,3,4,5];
    let avg_column = 6;
    for (l=1; l<=lines; l++) {
        let sum = 0;
        let count = 0;
        for (var c=0; c<columns.length; c++) {
            $(`#rankings-table > tbody > tr:nth-child(${l}) > td:nth-child(${columns[c]}) > span`).each(function(){
                if ($(this).is(":visible")) {
                    count++;
                    sum += Number($(this).html());
                }
            });
        }
        $(`#rankings-table > tbody > tr:nth-child(${l}) > td:nth-child(${avg_column}) > b`).html((sum/count));
    }
}


function sortTable() {
    dtable.order( [ 5, 'asc' ], [ 0, 'asc' ] ).draw();
}