/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.42212603437301083, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2714229365940243, 500, 1500, "01_01_https://www.blazedemo.com/"], "isController": false}, {"data": [0.46837744998989694, 500, 1500, "02_01_https://www.blazedemo.com/reserve.php"], "isController": false}, {"data": [0.48041789164216714, 500, 1500, "04_01_https://www.blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.48041789164216714, 500, 1500, "04_PurchaseFlight"], "isController": true}, {"data": [0.2714229365940243, 500, 1500, "01_Home"], "isController": true}, {"data": [0.46837744998989694, 500, 1500, "02_FindFlights_ListFlights"], "isController": true}, {"data": [0.4751853377265239, 500, 1500, "03_ChooseThisFlight_Form"], "isController": true}, {"data": [0.4751853377265239, 500, 1500, "03_01_https://www.blazedemo.com/purchase.php"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40075, 0, 0.0, 1504.6668496568998, 253, 6766, 1322.0, 3051.9000000000015, 3697.9500000000007, 5724.0, 257.2785927519019, 1544.323354692967, 184.16045279547717], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["01_01_https://www.blazedemo.com/", 10141, 0, 0.0, 1708.8453801400262, 542, 6766, 1370.0, 3261.0, 4077.8999999999996, 5844.639999999999, 65.1044843193272, 302.44389209105066, 37.638529997111036], "isController": false}, {"data": ["02_01_https://www.blazedemo.com/reserve.php", 9898, 0, 0.0, 1409.1772075166723, 253, 6412, 1107.0, 2958.1000000000004, 3823.0499999999993, 5479.0, 64.03902641011375, 460.8071290768429, 44.589534660848074], "isController": false}, {"data": ["04_01_https://www.blazedemo.com/confirmation.php", 9524, 0, 0.0, 1392.0064048719025, 256, 6359, 1047.0, 2955.5, 3806.5, 5467.25, 61.71311565701401, 348.34214140267096, 52.853908624220004], "isController": false}, {"data": ["04_PurchaseFlight", 9524, 0, 0.0, 1392.009134817307, 256, 6359, 1047.0, 2955.5, 3806.5, 5467.25, 61.71311565701401, 348.34214140267096, 52.853908624220004], "isController": true}, {"data": ["01_Home", 10141, 0, 0.0, 1708.8569174637596, 542, 6766, 1370.0, 3261.0, 4077.8999999999996, 5844.639999999999, 65.1044843193272, 302.44389209105066, 37.638529997111036], "isController": true}, {"data": ["02_FindFlights_ListFlights", 9898, 0, 0.0, 1409.1806425540533, 253, 6413, 1107.0, 2958.1000000000004, 3823.0499999999993, 5479.0, 64.0386120869807, 460.8041477221263, 44.58924617308153], "isController": true}, {"data": ["03_ChooseThisFlight_Form", 9712, 0, 0.0, 1386.9339991762736, 258, 6314, 1085.0, 2937.100000000002, 3729.050000000001, 5297.090000000006, 62.87223574498939, 412.5380530128437, 46.66276619913317], "isController": true}, {"data": ["03_01_https://www.blazedemo.com/purchase.php", 9712, 0, 0.0, 1386.930704283359, 258, 6314, 1085.0, 2937.100000000002, 3729.050000000001, 5297.090000000006, 62.87304978312941, 412.54339434841717, 46.663370365200365], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40075, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
