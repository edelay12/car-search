window.onload = function(){
    this.console.log('Site load successful')
    watchUser();


}
//store

/*const headers = {
    'host' : 'marketcheck-prod.apigee.net',
}*/
const key = 'vA4BcNYyp4rFjWdgi1qEKuxZ2AKffyzF';


function watchUser(){
    $('.mainSearch').on('submit', function(e){
        e.preventDefault();
        watchFilters();
       /* const year = $('#year').value();
        const make = $('#make').value();
        const model = $('#model').value();
        const loc = $('#loc').value(); */

        const params = {
            year : '&year=' + $('#year').val(),
            make : '&make=' +  $('#make').val(),
            model : '&model=' + $('#model').val(),
            loc : '&zip=' + $('#loc').val(),
            distance : '&radius=' + 200,
            city : '&city=' + $('#city').val(),
            state : '&state=' + $('#state').val(),
            
        } 
        //setURL(params);
       getResults(params);
    })
}

function getResults(params){
    if($('#loc').val() == undefined || 0 || ''){
        delete params.loc;
    }
    const url = setURL(params);
    
    fetch(url)
    .then(Response => { 
        if(Response.ok) {
            return Response.json();
        }
        throw new Error(Response.statusText)
    })
    .then(ResponseJson => {
        console.log(ResponseJson);
        displayResults(ResponseJson);
    })
    .catch(err => {
       // $('.list').empty();
       // $('#js-error').text(err);
    });
}

function setURL(params){
    console.log(params);
    let apiSearch = 'https://marketcheck-prod.apigee.net/v1/search?api_key=' +key;
    let filters = `&start=0&rows=50&sort_order=asc`
    let url = userOptions() + filters;

    function userOptions(){
        for (let option in params){
            apiSearch += params[option];
        }
        
        return apiSearch;
    }
   
    console.log(url)
return url;
}

function displayResults(ResponseJson){
    $('.results').empty();
    console.log(ResponseJson.listings.length);
    range_disp.value = '200';
    $('.numberResults').html(`Search Results <mark class="number">(${ResponseJson.listings.length})</mark>`);
    for (let i = 0; i < ResponseJson.listings.length; i++){
        let j = ResponseJson.listings[i];
        const DATA = {
            title : j.heading,
            price : j.price,
            imgsrc : j.media.photo_links.length == 0 ? 'Assets/nophoto.png' : j.media.photo_links[0],
            trim : j.build.trim,
            engine : j.build.engine,
            color : j.exterior_color,
            vin : j.vin,
            dealer : j.dealer.name,
            miles : j.miles,
            dealerWeb : j.vdp_url,
            
            /*function(test) {
                console.log(j)
                if (ResponseJson.listings[i].media.photo_links.length > 0){

                    this.imgsrc = j.media.photo_links[0];
                    
                }else{
                    this.imgsrc = 'Assets/nophoto.png';
                }
                
                */
            }
    
        
        $('.results').append(`<li class="resultFrame">
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
           <h3 class="miles">${DATA.miles}</h3>
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
   <button onclick="location.href='${DATA.dealerWeb}';" class="dealership">Contact Dealer</button>
               <h1 class="price">$${DATA.price} </h1>
</section>
       </li>`);
   

    }

}

function updateSlider(){
    range_disp.value = rangeSlider.value;
    
}

function watchFilters(url){
    $('.filter_form').on('submit', function(e){
        e.preventDefault();
    
        let newParams = {
            year : '&year=' + $('#year').val(),
            make : '&make=' +  $('#make').val(),
            model : '&model=' + $('#model').val(),
            loc : '&zip=' + $('#loc').val(),

            bodyTypes : getBodyTypes(),
            distance : '&radius=' + $('#range_disp').val(),
            priceRange : getPrice(),
            milesRange : getMiles(),
            condition : '&car_type=' + getType(),
        }
        console.log(newParams);
        getResults(newParams);
    })

function getBodyTypes(){
    let type = '&body_type=';
    //(!check if option checked)
    $('input[name="bodytype"]:checked').each(function() {
        type += this.value + ',';
     }); 

     let string = type.substring(0, type.length - 1);
        return string;
     }

function getType(){
    let selected = $('input[name="condition"]:checked').val();
    
    if(!selected){
        return 'used';
    }

    console.log(selected)
    return selected;
}

function getMiles() {
    let min = null;
    let max = null;
    if($('.minMiles').val() == '' || null || undefined) {
        min =0;
    } else {
        min = $('.minMiles').val();
    }

    if($('.maxMiles').val() == '' || null || undefined) {
        max =10000000;
    } else {
        max = $('.maxMiles').val();
    }
    return `&miles_range=${min}-${max}`;
}

function getPrice() {
    let min = null;
    let max = null;

    console.log('this is min'+$('.minPrice').val())
    if($('.minPrice').val() == '' || null || undefined) {
        min =0;
    } else {
        min = $('.minPrice').val();
    }

    if($('.maxPrice').val() == '' || null || undefined) {
        max =10000000;
    } else {
        max = $('.maxPrice').val();
    }
    return `&price_range=${min}-${max}`;
}

}

function updateFilters(url){
   // new url = https://marketcheck-prod.apigee.net/v1/search?api_key=vA4BcNYyp4rFjWdgi1qEK…fined-undefined%car_type=used&car_type=used&start=0&rows=50&sort_order=asc
  // https://marketcheck-prod.apigee.net/v1/search?api_key=vA4BcNYyp4rFjWdgi1qEKuxZ2AKffyzF&year=2014&make=ford&model=focus&zip=63367&body_type&radius=150&price_range=-&miles_range=undefined-undefined%car_type=used&car_type=used&start=0&rows=50&sort_order=asc
}

function filtersValidator(params){
let val = params;
    for (let key in val){
        if(/*!val[key]*/ val[key] == null) {
            delete val[key];
        }     
    }
    console.log(val)
}

function validator(e){
    if (e.val() == '') return null;
    else return e.val();
}

