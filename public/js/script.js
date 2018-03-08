//-------------------CLIENT SIDE & LOGS IN BROWSER console--------------

Vue.component('modal-component', {
    template: '#modal-template',
    props: ['selectedImageID'],
    data: function() {
        return {
            id: '',
            image: '',
            username: '',
            title: '',
            description: '',
            comment: []
        };
    },

    methods: {
        postComment: function(e) {
            e.preventDefault();
            var that = this;

            axios.post('/comments', {
                comment: this.comment.comment,
                username: this.comment.username,
                id: this.selectedImageID
            }).then(function(results) {
                that.comment.unshift(results.data.results);

                console.log("CLIENT SIDE", that.comment);
            }); //results in here is from res.json(results) from db.postComment and GOES in then function
        }
    },

    mounted: function() {
        var self = this; //when we go inside functions & use 'this' it doesn't work so we need to save it in a variable.
        axios.get("/modal/" + this.selectedImageID).then(function(resp) {
            // console.log("JuST LOgGGING in browser script", results);
            const {id, image, username, title, description} = resp.data.results[0];
            self.id = id;
            self.image = image;
            self.username = username;
            self.title = title;
            self.description = description;
            // console.log("THIS", self);

        });
        //image id is what the user clicked on

    }
});

new Vue({
    el: '#main', //el tells where our app will load
    data: {
        images: [], // [{}.{}]
        formStuff: {
            username: '',
            description: '',
            title: '',
            file: void 0 //special way for images.
        },
        selectedImageID: null
        // selectedImage: location.hash.slice(1) || null - class notes

    },
    methods: {
        handleChange: function(e) {
            this.formStuff.file = e.target.files[0];
        },

        handleSubmit: function(e) {
            e.preventDefault(); //prevents refreshing upon submit button
            // console.log("running handleSubmit");
            const formData = new FormData();
            formData.append('file', this.formStuff.file);
            formData.append('title', this.formStuff.title);
            formData.append('description', this.formStuff.description);
            formData.append('username', this.formStuff.username);

            axios.post('/upload', formData).then(function(results) {
                // console.log("upload was successful!!!", this);
                // console.log("upload was resulTs!!!", results);
                document.querySelector('input[type="file"]').value = '';
                this.formStuff.title = '';
                this.formStuff.description = '';
                this.formStuff.username = '';
                this.images.unshift(results.data.images);
                //this.images is from the array and results.data.images is the actual info object images. This line of code makes the images show up right away after hitting submit.
                //res.json info comes from express and gives back the info about new image
                //the image data will be in results.data.image
                //unshift (adds to beginning of array) the new image into this.images.
                //** everything that is inside of res.json gets added to data object in console broswer...so always use results.data.
            });
        },
        showImage: function(selectedImageID) {
            this.selectedImageID = selectedImageID;
            //left this.selectedImageID is null and setting it equal to image.id from image being clicked on
        }
    },

    mounted: function() { //mounted is a lifecycle method. when html is done loading, mounted is ready to go where the function will run. mounted is best place to do API calls.
        var app = this;
        axios.get('/images').then(function(images) {
            //every axios request has a corresponding app request in the server
            app.images = images.data.images; // same as this line "this.images = results.data.images;". This line is refering to empty images array from above.
            // console.log("results from GET /images", images);
            // console.log("results from GET /images", images.data.images);
            // console.log("New Log", app.images);

            //window.addEventListener('hashchange', function() {
            // app.selectedImage = location.hash.slice(1);

        });
    }
});
