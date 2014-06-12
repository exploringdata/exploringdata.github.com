// year with currently most comprehensive dataset, no newer donations data yet
var year = 2010,
  defaultlimit = 20,
  doLimit = true,
  scatterLimit = 50,
  format = d3.format(',r'),
  relation = 'norelate',
  iselect,
  donors,
  reldonors,
  recipients,
  relrecipients,
  scatterrelation,
  maxreceived,
  maxdonated,
  geocountries;

var getSortedCountryLinks = function(cid) {
  return donations[year].filter(function(d){
    return ('undefined' !== typeof countryinfo[d.source]
      && 'undefined' !== typeof countryinfo[d.target]
      && (cid == d.source || cid == d.target)) ? true : false
  }).sort(function(a, b) {return b.usd - a.usd})
};

var showLinks = function(cid) {
  var l = getSortedCountryLinks(cid);
  if (l.length) {
    maxamount = l[0].usd;
    drawlinks(l, maxamount)
  }
};

// scale link using max aid amount given or received
var scaleLink = function(link, maxamount) {
  var lscale = d3.scale.linear().domain([0, maxamount]).range([.1, 5]);
  return lscale(link.usd);
};

// show aid data for country
var showCountry = function(d) {
  var modal = $('#country-aid')
  var clinks = getSortedCountryLinks(d.id);
  // determine if country is donor or recipient by larges amount source
  var type = (clinks[0].source == d.id) ? 'donor' : 'recipient';
  var heading = 'Aid given: ' + d.properties.name;
  if ('recipient' == type) {
    var heading = 'Aid received: ' + d.properties.name;
  }
  modal.find('h3').text(heading)
  var ranking = [];
  $.each(clinks, function(idx, item) {
    var label = item.target;
    if ('recipient' == type) {
      var label = item.source
    }
    ranking.push({
      label: label,
      val: item.usd,
      formatval: formatDollar(item.usd),
      title: countryinfo[label].name + ' (' + label + '): ' + format(item.usd),
    })
  });

  bar('#country-aid-chart', ranking);
  modal.modal('show');
}

// format us dollar values
var formatDollar = function(val) {
  var scale = 1000000;
  if(val < 1 /100) {
    val = d3.round(val, 3);
  } else {
    val = d3.round(val, 2);
  }
  if (val > scale) {
    val = d3.round(val / scale, 0)
    val += 'M';
  }
  return val;
};

// data structure for scatterplot
var spdata = function(xdata, key) {
  var data = [];
  for (i in xdata) {
    var country = xdata[i];
    var x = country.val;
    var iso = country.label;
    if (countrystats[year].hasOwnProperty(iso) && countrystats[year][iso].hasOwnProperty(key)) {
      data.push({
        'title': countryinfo[iso].name,
        'label': iso,
        'x': x,
        'y': countrystats[year][iso][key]
      });
      if ((doLimit && (data.length == defaultlimit)) || data.length == scatterLimit) break;
    }
  }
  return data
};

// returns a function that is takes relation into account
var getQuantize = function() {
  return function(d) {
    var val;
    var rel = 1;
    var maxval = 10; //RdBu 0 = red, 10 = blue
    if ('undefined' !== typeof countrystats[year][d.id]) {
      if (relation && 'norelate' != relation) {
        // if relation can't be calculated return null to not colorite country
        if (!countrystats[year][d.id].hasOwnProperty(relation)) return null;
        rel = countrystats[year][d.id][relation]
      }
      if ('undefined' !== typeof countrystats[year][d.id]['received']) {
        // scale min between 0 (max received) and 4 (min received)
        val = 4 - 4 * countrystats[year][d.id]['received'] / rel / maxreceived
      }
      else if ('undefined' !== typeof countrystats[year][d.id]['donated']) {
        // scale max between 6 (min donated) and 10 (max donated)
        val = 6 + 4 * countrystats[year][d.id]['donated'] / rel / maxdonated
      }
    }
    if (null == val) return null;
    return 'q' + parseInt(~~val) + '-11';
  }
};

// for aid rankings
var aidRanking = function(items, infix) {
  var ranking = [];
  $.each(items, function(idx, item){
    var formatval = formatDollar(item.val);
    ranking.push({
      label: item.label,
      val: item.val,
      title: countryinfo[item.label].name + ' (' + item.label + ') - ' + infix + format(item.val),
      formatval: formatval
    })
  });
  return ranking;
};

// for indicator rankings
var indicatorRanking = function(items, indicator) {
  var ranking = [], val, formatval;
  $.each(items, function(idx, item) {
    if ('undefined' !== typeof countrystats[year][item.label][indicator]) {
      val = countrystats[year][item.label][indicator];
      formatval = format(val);
    } else {
      val = 0;
      formatval = 'NA';
    }
    ranking.push({
      label: item.label,
      val: val,
      title: countryinfo[item.label].name + ' (' + item.label + '): ' + formatval,
      formatval: formatval
    })
  });
  return ranking;
};

// sort descending by val property
var sdesc = function(a, b) {return b.val - a.val};

// get values divided by relation
var getRelation = function(unrelated, relation, sortorder) {
  var related = [];
  $.each(unrelated, function(idx, item){
    if (countrystats[year][item.label].hasOwnProperty(relation)) {
      related.push({
        val: item.val / countrystats[year][item.label][relation],
        label: item.label
      })
    }
  });
  if (sortorder == 'desc')
    related = related.sort(sdesc);
  return related;
};

var setAidRelations = function(source, target) {
  reldonors = source;
  relrecipients = target;
  maxdonated = reldonors[0].val;
  maxreceived = relrecipients[0].val;
};

var setRelations = function(source, target) {
  if ('norelate' == relation) {
    setAidRelations(source.slice(), target.slice());
  } else {
    setAidRelations(getRelation(donors, relation, 'desc'), getRelation(recipients, relation, 'desc'));
  }
  if (!scatterrelation) {
    scatterrelation = iselect.find('option:first')[0].value;
  }
};

var donorBars = function(text) {
  var r = doLimit ? reldonors.slice(0, getLimit()) : reldonors.slice();
  bar('#aiddonors', aidRanking(r, 'Aid donated in USD: ' + text + ': '));
  bar('#donorstransparency', indicatorRanking(r, 'aidtransparency'));
}

var recipientBars = function(text) {
  var r = doLimit ? relrecipients.slice(0, getLimit()) : relrecipients.slice();
  bar('#aidrecipients', aidRanking(r, 'Aid received in USD: ' + text + ': '));
  bar('#recipientstransparency', indicatorRanking(r, 'IQ.CPA.TRAN.XQ'));
}

var showGraphs = function(text) {
  donorBars(text);
  recipientBars(text);
  scatterplot('#aidrelations', spdata(relrecipients, scatterrelation));
};

var getLimit = function(){
  if (doLimit) return defaultlimit;
  return 0;
};

/********** main program flow **********/

(function() {

// lists of donors and recipients sorted by aid sums descending
donors = ranks[year]['donated'].reverse();
recipients = ranks[year]['received'].reverse();

// copy values not reference to array
reldonors = donors.slice();
relrecipients = recipients.slice();

// these values are overwritten when calculating relations and are reset when
// showing totals
maxdonated = reldonors[0].val;
maxreceived = relrecipients[0].val;

// load geo data and draw map
d3.json('/json/world-countries.json', function(error, json) {
  geocountries = json.features;
  drawmap(geocountries, getQuantize(), showLinks);
  drawlegend();
});

// fill indicators select lists
iselect = $('#indicators');
$.each(indicators, function(i) {
  if ('global' == indicators[i].type)
    iselect.append('<option value="' + indicators[i].id + '">' + indicators[i].label + '</option')
});
// additional indicators
iselect.append('<option value="userrequests">Google User Data Requests</option');

// set relations and show graphs
setRelations(donors, recipients);
showGraphs($('.active .relate').text());

/***** events *****/

// indicator selection
iselect.change(function(e) {
  e.preventDefault();
  scatterrelation = $(this).val();
  scatterplot('#aidrelations', spdata(relrecipients, scatterrelation));
});

// calculate relations and redraw graphs
$('.relate').click(function(e){
  e.preventDefault();
  $('.relate').parent('li').removeClass('active');
  $(this).parent('li').attr('class', 'active');
  relation = this.id;
  setRelations(donors, recipients);
  showGraphs(this.innerHTML);
  drawmap(geocountries, getQuantize(), showLinks);
});

// expand / reduce bar charts
$('.menulimit').click(function(e) {
  e.preventDefault();
  var b = $(this);
  b.addClass('disabled');
  if ('expand' == b.attr('id')) {
    $('#reduce').removeClass('disabled');
    doLimit = false;
  } else {
    $('#expand').removeClass('disabled');
    doLimit = true;
  }
  showGraphs($('li.active a.relate').text());
});

})();
