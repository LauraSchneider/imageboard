//client side & LOGS show up in browser console
new Vue({
    el: '#main', //el tells where our app will load
    data: {
        images: [], //[{}.{}]
        formStuff: {
            username: '',
            description: '',
            title: '',
            file: void 0 //special way for images.
        }
    },
    methods: {
        handleChange: function(e) {
            this.formStuff.file = e.target.files[0]
        },
        // console.log("handleChange ran", this);
        handleSubmit: function(e) {
            e.preventDefault() //prevents refreshing upon submit button
            console.log("running handleSubmit");
            const formData = new FormData()
            formData.append('file', this.formStuff.file)
            formData.append('title', this.formStuff.title)
            formData.append('description', this.formStuff.description)
            formData.append('username', this.formStuff.username)

            axios.post('/upload', formData).then(results => {
                // console.log("upload was successful!!!", this);
                // console.log("upload was resulTs!!!", results);
                document.querySelector('input[type="file"]').value = '';
                this.formStuff.title = '';
                this.formStuff.description = '';
                this.formStuff.username = '';
                this.images.unshift(results.data.images);
                //this.images is from the array and results.data.images is the actual info object images
                //res.json info comes from express back to the info about new image
                //the image data will be in results.data.image
                //unshift (adds to beginner) the new image into this.images. ** everything that is inside of res.json gets added to data object in console broswer. so always use results.data.
            })
        }
    },

    mounted: function() { //mounted is a lifecycle method. when it is done loading and ready to go where the function will run. mounted is best place to do API calls.
        // console.log("running mounted");
        var app = this;
        console.log("THIS", this);
        axios.get('/images').then(images => {
            //every axios request has a corresponding app request in the server
            app.images = images.data.images; // same as this line "this.images = results.data.images;". This line is refering to empty images array from above.
            // console.log("results from GET /images", images);
            // console.log("results from GET /images", images.data.images);
            console.log("New Log", app.images);

            //attach this to our data.

            //create a v-for, loop through images and dispaly
        });
    }
});
