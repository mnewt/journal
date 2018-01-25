function padTwo (number) {
  const ret = String(number);
  return ret.length === 1 ? '0' + ret : ret;
}

Date.prototype.formatYYYYddmm = function () {
  return `${this.getUTCFullYear()}-${padTwo(this.getUTCMonth())}-${padTwo(this.getUTCDate())}`;
}

var xhr = function() {
  var xhr = new XMLHttpRequest();
  return function( method, url, callback ) {
    xhr.onreadystatechange = function() {
      if ( xhr.readyState === 4 ) {
        callback( xhr.responseText );
      }
    };
    xhr.open( method, url );
    xhr.send();
  };
}();

function initLunr () {
  xhr('GET', '/index.json', function(index) {
    pagesIndex = JSON.parse(index);
    // declre lunr fields
    lunrIndex = lunr(function() {
      this.field('date', { boost: 20});
      this.field('title', { boost: 10 });
      this.field('tags', { boost: 10});
      this.field('content');
      this.ref('ref');
    });
    for (const post of pagesIndex) {
      lunrIndex.add(post);
    }
  });
}

function renderResults(results) {
  var html = '';
  if (results.length > 0) {
    for (const res of results) {
      html += `<li class="pure-menu-item"><a href="${res.ref}" class="pure-menu-link"><strong>${new Date(res.date).formatYYYYddmm()}</strong> - ${res.number} - ${res.content.slice(0,14)}...</a></li>`;
    }
  }
  resultList.innerHTML = html;
}

function search (query) {
  return lunrIndex.search(query).map(function(res) {
    return pagesIndex.filter(function(post) {
      return post.ref === res.ref;
    })[0];
  });
}

function searchEvent () {
  this.value.length > 2
    ? renderResults(search(this.value))
    : renderResults([]);
}

function searchToggle () {
  searchBox.style.display = searchBox.style.display === 'none' ? '' : 'none';
  searchInput.focus();
}

function initUI () {
  document.getElementById('search').addEventListener("keyup", searchEvent);
  document.getElementById('search-toggle').addEventListener("click", searchToggle);
}

function initSearch () {
  initLunr();
  initUI();
}

var pagesIndex, lunrIndex;
var searchBox = document.getElementById('search-box');
var searchInput = document.getElementById('search');
var resultList = document.getElementById('result-list');

initSearch();
