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
        
       /* const year = $('#year').value();
        const make = $('#make').value();
        const model = $('#model').value();
        const loc = $('#loc').value(); */

        const params = {
            year : '&year=' + $('#year').val(),
            make : '&make=' +  $('#make').val(),
            model : '&model=' + $('#model').val(),
            loc : '&zip=' + $('#loc').val()
        }
        //setURL(params);
       getResults(params);
    })
}

function getResults(params){
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
    let filters = '&radius=200&car_type=used&start=0&rows=50&sort_order=asc'
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
    $('.numberResults').html(`Search Results (${ResponseJson.listings.length})`);
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