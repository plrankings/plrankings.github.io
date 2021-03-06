let limit = 15;
var dtable;
var active_rankings = 5;
var position_points = [];

$(document).ready( function () {

    configPoints();

    dtable = createDataTable();

    setSearch(dtable);

    setRankingsFilters();

    configLogoFilters();

    updateAverages();

    ScrollReveal().reveal('section');
} );

function configPoints() {
    for (p=limit; p>0; p--) {
        position_points.push(parseInt(1.5**p));
    }
}

function createDataTable() {
    return $('#rankings-table').DataTable({
            paging: false,
            searching: true, 
            ordering: false,
            info: false,
            responsive: true,
            autoWidth: false
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
        });
    } else {
        language_columns.each(function() {
            $(this).addClass('invisible-text');
        });
    }
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
            if (active_rankings!=5) {
                language_columns.each(function() {
                    $(this).removeClass('invisible-text');
                });
            } else {
                language_columns.each(function() {
                    $(this).addClass('invisible-text');
                });                
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
    let table_lines = [];
    let lines = $("#rankings-table > tbody > tr").length;
    let columns = [3,4,5,6,7];
    let avg_column = 8;
    for (l=1; l<=lines; l++) {
        let sum = 0;
        let sum_factor = 0;
        let count = 0;
        $(`#rankings-table > tbody > tr:nth-child(${l}) > td:nth-child(1)`).html('#');
        for (var c=0; c<columns.length; c++) {
            $(`#rankings-table > tbody > tr:nth-child(${l}) > td:nth-child(${columns[c]}) > span`).each(function(){
                if ($(this).is(":visible")) {
                    let position = $(this).html().trim();
                    if (isNaN(Number(position))) {
                        position = limit;
                    }
                    count++;
                    position = Number(position);
                    sum += position;
                    sum_factor += position_points[position-1];
                }
            });
        }
        let averageDisplay = '-';
        let averageNum = limit;
        if (count>0) {
            averageNum = sum/count;
            let averageFixed2 = averageNum.toFixed(2);
            averageDisplay = averageFixed2.indexOf('.00')>0 ? averageNum : averageFixed2; 
        }
        $(`#rankings-table > tbody > tr:nth-child(${l}) > td:nth-child(${avg_column}) > b`).html(averageDisplay);

        table_lines.push({average:averageNum, sum_factor:sum_factor, tr: $(`#rankings-table > tbody > tr:nth-child(${l})`).html()});

        table_lines.sort((a,b) => ( (a.average - b.average) || (b.sum_factor - a.sum_factor) )); 
    }

    sortTable(table_lines);
    
}


function sortTable(table_lines) {
    let table_body = $(`#rankings-table > tbody`);
    table_body.html('');
    for (l=0; l<table_lines.length; l++) {
        table_body.append(`<tr>${table_lines[l].tr}</tr>`);
        $(`#rankings-table > tbody > tr:nth-child(${l+1}) > td:nth-child(1)`).html(`<b>${l+1}</b>`);        
    }
}