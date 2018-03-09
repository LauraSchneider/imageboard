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
                that.comment.comment = '',
                that.comment.username = '',
                that.comment.selectedImageID = '';
                // console.log("CLIENT SIDE", that.comment);
            }); //results in here is from res.json(results) from db.postComment and GOES in then function
        },
        closeModal: function() {
            this.$emit('close')
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
            self.comment = resp.data.data;

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

            var there = this;

            axios.post('/upload', formData).then(function(results) {
                // console.log("upload was successful!!!", this);
                // console.log("upload was resulTs!!!", results);
                console.log("Pay Attention", there);
                document.querySelector('input[type="file"]').value = '';
                there.formStuff.title = '';
                there.formStuff.description = '';
                there.formStuff.username = '';
                there.images.unshift(results.data.images);
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
        },
        modalShut: function() {
            this.selectedImageID = null;
        },
        morePics: function() {
            var what = this;
            let lastImageID = this.images[this.images.length - 1].id;
            //the last image id show on the browser. e.g if 10 pics in database, then showing only first 4 pics in database (id10, id9, id8, id7), so next ones should be id6 image onwards.

            console.log("LAST IMAGE", lastImageID);
            axios.get('/scroll/' + lastImageID).then(function(results) {
                for (let item = 0; item < results.data.results.length; item++) {
                    what.images.push(results.data.results[item])
                }

            });
        }
    },

    mounted: function() { //mounted is a lifecycle method. when html is done loading, mounted is ready to go where the function will run. mounted is best place to do API calls.
        var app = this;
        // window.addEventListener('scroll', function() {
        //
        //      app.selectedImage = location.hash.slice(1);
        //     console.log("every time we scroll");
        // });

        axios.get('/images').then(function(images) {
            //every axios request has a corresponding app request in the server
            app.images = images.data.images; // same as this line "this.images = results.data.images;". This line is refering to empty images array from above.
            // console.log("results from GET /images", images);
            // console.log("results from GET /images", images.data.images);
            // console.log("New Log", app.images);

        });
    }
});
