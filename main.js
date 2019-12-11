window.onload = function() {
  this.console.log("Site load successful");
  watchUser();
  this.newSearch();
  $('.resultsPage').hide();
};
//store
const key = "PtZ8Py1E8bb6pgchRvtZhV606nLNE2zA";
let start = 0;
let row = 25;
let currentParams = null;
let currentPage = 1;
let currentSearch = {
    userYear : null,
    userMake : null,
    userModel : null,
    userLoc : location,
}
let userPrice = null;
let userMiles = null;
let userType = null;
let userBody = null
let userTrims = null;
let distance = 200;

function watchUser() {
  $(".mainSearch").on("submit", function(e) {
    e.preventDefault();
    currentPage = 1;
    start = 0;
    row = 25;
    currentSearch.userYear = $('#year');
    currentSearch.userMake = $('#make') ;
    currentSearch.userModel = $('#model');
    currentSearch.userLoc = $('.city');
   


    getCordinates($('.city'));
    updateSearchBar();
    filterToggle();
  });
}

function setParams(cordinates) { 
    const params = {
        year: "&year=" + currentSearch.userYear.val(),
        make: "&make=" + currentSearch.userMake.val(),
        model: "&model=" + currentSearch.userModel.val(),
        distance: "&radius=" + 200,
        loc: cordinates
      };
      currentParams = params;
  watchFilters(cordinates);
  getResults(params);
}


function getResultsRetry(params, n) {

    const url = setURL(params);
  fetch(url)
    .then(Response => {
      if (Response.ok) {
        return Response.json();
      }
    
      throw new Error(Response.statusText);
    })
    .then(ResponseJson => {
      console.log(ResponseJson);
      displayResults(ResponseJson);
    })
    .catch(err => {
        console.log(err)
      if (n == 1) throw error;
          console.log('caught error')
          $('.results').empty();
          $('.results').append(`<h1>Server Error: Trying again</h1>`);
          return getResultsRetry(params, n - 1);
     
      $('#js-error').text('Server Error: Please try your search again in a few seconds');

    });
}


function getResults(params, n) {
  const url = setURL(params);
  fetch(url)
    .then(Response => {
      if (Response.ok) {
        return Response.json();
      }
    
      throw new Error(Response.statusText);
    })
    .then(ResponseJson => {
      console.log(ResponseJson);
      displayResults(ResponseJson);
      $('.resultsPage').show();
      $('.mainPage').hide();
    })
    .catch(err => {
        console.log(err)
      $('.results').empty();
      $('#js-error').text('Server Error: Please try your search again in a few seconds');

    });
}

function setURL(params) {
  console.log(params);
  let apiSearch =
    "https://marketcheck-prod.apigee.net/v1/search?api_key=" + key;
  let rows = `&start=${start}&rows=${row}`;
  let sort = `&sort_order=asc`;
  let url = userOptions() + rows + sort;

  function userOptions() {
    for (let option in params) {
      apiSearch += params[option];
    }

    return apiSearch;
  }

  console.log(url);
  return url;
}

function displayResults(ResponseJson) {
  $(".results").empty();
  console.log(ResponseJson.listings.length);
$('#range_disp').text(distance); 
  $(".numberResults").html(
    `Search Results <mark class="number">(${ResponseJson.num_found})</mark>`
  );
  for (let i = 0; i < ResponseJson.listings.length; i++) {
    let j = ResponseJson.listings[i];
    const DATA = {
      title: j.heading,
      price: j.price,
      imgsrc:
        j.media.photo_links.length == 0
          ? "Assets/nophoto.png"
          : j.media.photo_links[0],
      trim: j.build.trim,
      engine: j.build.engine,
      color: j.exterior_color == undefined ? "Not Available" : j.exterior_color,
      vin: j.vin,
      dealer: j.dealer.name,
      miles: j.miles,
      dealerWeb: j.vdp_url
    };

    $(".results").append(`<li class="resultFrame">
        <section class="pictureContainer">
               <img class="image" src="${DATA.imgsrc}" />
       </section>        
      <section class="details">
       <div class='titleContainer'>
           <h1 class="title">${DATA.title}</h1>
        </div>
        <div class="rows">
       <section class="row row1">
           <label for="miles">miles:</label>
           <h3 class="miles">${formatNumber(DATA.miles, "miles")}</h3>
           <label for="trim">Trim:</label>
           <h3 class="trim">${DATA.trim} </h3>
       </section>
       <section class="row row2">
           <label for="engine">Engine:</label>
           <h3 class="engine">${DATA.engine}</h3>
           <label for="color">Color:</label>
           <h3 class="color">${DATA.color}</h3>
       </section>
       <section class="row row3">
           <label for="vin">VIN #:</label>
           <h3 class="vin">${DATA.vin}</h3>
           <label for="dealer">Dealership:</label>
           <h3 class="dealer">${DATA.dealer}</h3>
       </section>
       </div>
   </section>
   <section class="links">
   <button onclick="location.href='${
     DATA.dealerWeb
   }';" class="dealership">Contact Dealer</button>
               <h1 class="price">${formatNumber(DATA.price, "price")} </h1>
</section>
       </li>`);
  }
  if (ResponseJson.num_found > 25){
  $(".results").append(
    `<li><section class="pageSection">
    <div class="button-container"> 
    <button class="pagePrev">Previous Page(icon)</button>
    <label for='current-page' class='pageNumber'>Page: ${currentPage}</label>
   <button class="pageNext">Next Page(icon)</button>
</div>
</section></li>`
  );
  }
  setTrims(ResponseJson);
  watchPages();
}

function updateSlider() {
  range_disp.value = rangeSlider.value;
}

function watchFilters(cordinates) {
  $(".filter_form").on("submit", function(e) {
    e.preventDefault();
    currentPage = 1;
    start = 0;
    row = 25;

    let newParams = {
      year: "&year=" + currentSearch.userYear.val(),
      make: "&make=" + currentSearch.userMake.val(),
      model: "&model=" + currentSearch.userModel.val(),
      loc: cordinates,
      trim: getTrims(),
      bodyTypes: getBodyTypes(),
      distance: "&radius=" + $("#range_disp").val(),
      priceRange: getPrice(),
      milesRange: getMiles(),
      condition: "&car_type=" + getType()
    };

    currentParams = newParams;
    distance = $("#range_disp").val();
    console.log(newParams);
    getResultsRetry(newParams);
    updateSearchBar();
  });

  function getTrims() {
    let trim = "&trim=";
    let select = '';
    //(!check if option checked)
    $('input[name="trimoption"]:checked').each(function() {
      select += ' '+ this.value + ",";
      trim += this.value + ",";
    });

    let string = trim.substring(0, trim.length - 1);
    userTrims = select.substring(0, trim.length - 1);
    return string;
  }

  function getBodyTypes() {
    let type = "&body_type=";
    let type1 = 'body type: '
    //(!check if option checked)
    $('input[name="bodytype"]:checked').each(function() {
        type1 += this.value + ", ";
      type += this.value + ",";
    });
    userBody = type1.substring(0, type1.length - 2);
    let fullstring = type.substring(0, type.length - 1);
    console.log('this is fullstring' + fullstring)
    return fullstring;
  }

  function getType() {
    let selected = $('input[name="condition"]:checked').val();

    if (!selected) {
      return "used";
    }

    console.log(selected);
    userType = selected;
    return selected;
  }

  function getMiles() {
    let min = null;
    let max = null;
    if ($(".minMiles").val() == "" || null || undefined) {
      min = 0;
    } else {
      min = $(".minMiles").val();
    }

    if ($(".maxMiles").val() == "" || null || undefined) {
      max = 10000000;
    } else {
      max = $(".maxMiles").val();
    }
    userMiles = `${min}-${max}`
    return `&miles_range=${min}-${max}`;
  }

  function getPrice() {
    let min = null;
    let max = null;

    console.log("this is min" + $(".minPrice").val());
    if ($(".minPrice").val() == "" || null || undefined) {
      min = 0;
    } else {
      min = $(".minPrice").val();
    }

    if ($(".maxPrice").val() == "" || null || undefined) {
      max = 10000000;
    } else {
      max = $(".maxPrice").val();
    }
    userPrice = `${min}-${max}`
    return `&price_range=${min}-${max}`;
  }
}

function setTrims(ResponseJson) {
    $('.trims').empty();
  let trims = [];
  console.log(" trims ran");
  for (let i = 0; i < ResponseJson.listings.length; i++) {
    let t = ResponseJson.listings[i].build.trim;
    if (t !== undefined || " ") trims.push(t);
  }
  trimsUnique = Array.from(new Set(trims));
  trimsUnique.forEach(function(item, index) {
    $(".trims").append(
      `<li class="trimSelect">
            <input name="trimoption" type="checkbox" id="trim_option_${index}" value="${item}" />
            <label for="trim_option_${index}" >${item}</label>
        </li>`
    );
  });
}
/*
function updateFilters(url){
   // new url = https://marketcheck-prod.apigee.net/v1/search?api_key=vA4BcNYyp4rFjWdgi1qEK…fined-undefined%car_type=used&car_type=used&start=0&rows=50&sort_order=asc
  // https://marketcheck-prod.apigee.net/v1/search?api_key=vA4BcNYyp4rFjWdgi1qEKuxZ2AKffyzF&year=2014&make=ford&model=focus&zip=63367&body_type&radius=150&price_range=-&miles_range=undefined-undefined%car_type=used&car_type=used&start=0&rows=50&sort_order=asc
}

function filtersValidator(params){
let val = params;
    for (let key in val){
        if(val[key] == null) {
            delete val[key];
        }     
    }
    console.log(val)
}

function validator(e){
    if (e.val() == '') return null;
    else return e.val();
}*/

/* Google maps API */
function initialize() {
  let input = document.getElementById("city");
  let input2 = document.getElementById("cityNewSearch");
  new google.maps.places.Autocomplete(input);
  new google.maps.places.Autocomplete(input2);
}

function getCordinates(loc) {
  let key = "&key=AIzaSyCjXkvTRurb_9IJ_lh5H2omegvpiPeZFGk";
  let params = loc
    .val()
    .split(" ")
    .join("+");
  let url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + params + key;

    //fetch location with Google places API
  fetch(url)
    .then(Response => {
      if (Response.ok) {
        return Response.json();
      }
      throw new Error(Response.statusText);

    })
    .then(ResponseJson => {
      console.log(ResponseJson);
      let lat = ResponseJson.results[0].geometry.location.lat;
      let lng = ResponseJson.results[0].geometry.location.lng;
      cordinates = `&latitude=${lat}&longitude=${lng}`;
      setParams(cordinates);
    })
    .catch(function(err) {
        console.log(err)
      $('.results').empty();
      $('#js-error').text('Server Error: Please try your search again in a few seconds');
    });
}

function watchPages() {
  $(".pageNext").on("click", function(e) {
    console.log("nextPage");
    updateResultsNext();
  });
  $(".pagePrev").on("click", function(e) {
    console.log("prevPage");
    updateResultsPrev();
  });
}

function updateResultsNext() {
  start += 25;
  currentPage++;
  console.log("new start =" + start);
  getResultsRetry(currentParams);
  $(".displayArea").scrollTo(".resultsLegend");
}

function updateResultsPrev() {
  if (start > 0) {
    start -= 25;
    currentPage--;
    console.log("prev start =" + start);
    getResultsRetry(currentParams);
    $(".displayArea").scrollTo(".resultsLegend");
  }
}

// formate price and miles
function formatNumber(number, format) {
  if (!number) {
    return "not available";
  }
  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return format == "miles" ? parts.join(".") : "$" + parts.join(".");
}

//scroll to top of results
jQuery.fn.scrollTo = function(elem, speed) {
  $(this).animate(
    {
      scrollTop:
        $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
    },
    speed == undefined ? 400 : speed
  );
  return this;
};


//updating search bar
function updateSearchBar() {
        let userSearch = {
      userBuild : currentSearch.userYear.val() + ' ' + currentSearch.userMake.val() + ' ' + currentSearch.userModel.val(),
      location : currentSearch.userLoc.val(),
        trim :userTrims,
      distance1 :'radius: ' +distance,
      priceRange :userPrice,
      milesRange:userMiles,
      body_type:userBody,
      condition:userType
        }

     for (let i in userSearch) {
         console.log(i +'is =' + userSearch[i]);

         switch (userSearch[i]){
            case null:
                delete userSearch[i];
            case '':
                delete userSearch[i];
            case '0-10000000': 
            delete userSearch[i];

            case 'body type':
            delete userSearch[i];
         }
        }
       
        //set current params
             
console.log(userSearch)

        $(".labels").empty();
    let values = Object.values(userSearch);
    console.log(values)
    for (let i = 0; i < values.length; i++){
            $(".labels")
              .append(`<li class="filterFrame"><span class="filterLabel">${values[i]}</span>
              </li>`);
          
    }
    clearValues();
}
function clearValues(){
    userPrice = null;
userMiles = null;
userType = null;
userBody = null
userTrims = null;
}

function filterToggle() {
  $(".filterToggle").on("click", function() {
    $(".filtersArea").toggleClass("on");
    $(".displayArea").toggleClass("on");
    $(".filterToggle").toggleClass("on");
  });
}

function newSearch(){
    $('.newSearch, #newSearchSubmit, .labels').on('click', function(){
        $('.newSearchPage').toggleClass('on');
        
    })

    $(".newSearchForm").on("submit", function(e) {
        e.preventDefault();
        currentPage = 1;
        start = 0;
        row = 25;
        currentSearch.userYear = $('#yearNewSearch');
        currentSearch.userMake = $('#makeNewSearch') ;
        currentSearch.userModel = $('#modelNewSearch');
        currentSearch.userLoc = $('.cityNewSearch');

        getCordinates($('.cityNewSearch'));
        updateSearchBar();
    })
}