//client side & LOGS show up in browser console
new Vue({
    el: '#main', //el tells where our app will load
    data: {
        images: [] //[{}.{}]
    },
    mounted: function() { //mounted is a lifecycle method. when it is done loading and ready to go where the function will run. mounted is best place to do API calls.
        // console.log("running mounted");
        var app = this;
        axios.get('/images').then(images => {
            //every axios request has a corresponding app request in the server
            app.images = images.data.images; // same as this line "this.images = results.data.images;". This line is refering to empty images array from above.
            // console.log("results from GET /images", images);
            // console.log("results from GET /images", images.data.images);
            console.log("New Log",app.images);

            //attach this to our data.

            //create a v-for, loop through images and dispaly
        });
    }
});

//
//         methods: {
//     emph: function(e) {
//         e.target.style.color = 'tomato';
//         this.log('tomato');
//     },
//     deemph: function(e) {
//         e.target.style.color = 'tomato';
//         this.log('tomato');
//     },
// }
//
// setTimeout(function() {
//     myViewInstance.heading="Funky Chicken"
// })
// })();
