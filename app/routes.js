const fetch = require("node-fetch")

module.exports = function (app, passport, db) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    //__________store page routes_____________________

    //jewelery
    app.get('/jewelery', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
        const storeJson = await storeResult.json()
        // console.log(storeJson);

        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('jewelery.ejs', { inventory: storeJson })
    })
    //electronics
    app.get('/electronics', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
        const storeJson = await storeResult.json()
        // console.log(storeJson);
        const cartResult = await db.collection('cart').find().toArray()
        console.log("this is cartResult from the get in electronics route", cartResult);
        console.log("this is cartResult[0] from the get in electronics route", cartResult[0]);
        console.log("this is cartResult[0].item from the get in electronics route", cartResult[0].item);
        console.log("this is cartResult[0]['item'] from the get in electronics route", cartResult[0]["item"]);


        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('electronics.ejs', { inventory: storeJson, miniCart: cartResult })
    })
    //womens
    app.get('/women', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
        const storeJson = await storeResult.json()
        // console.log(storeJson);

        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('womens.ejs', { inventory: storeJson })
    })

    //mens
    app.get('/men', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
        const storeJson = await storeResult.json()
        // console.log(storeJson);

        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('mens.ejs', { inventory: storeJson })
    })

    // PROFILE SECTION =========================


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout(() => {
            console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // message board routes ===============================================================

    //________Cart features start___________________________
    app.get('/cart', async (req, res) => {

        const cartResult = await db.collection('cart').find().toArray()
        res.render('cart.ejs', { cart: cartResult })
    })

    app.post('/cartAdd', (req, res) => {
        // console.log("this is req.body.storeItemName: ", req.body.storeItemName);
        // console.log("this is req.body.storeItemIdVal: ", req.body.storeItemIdVal);
        console.log("this is req.body.item: ", req.body.item);
        console.log("this is req.body.itemID: ", req.body.itemID);


        db.collection('cart').insertOne({ item: req.body.item, id: req.body.itemID, inCart: true }, (err, result) => {
            if (err) return console.log(err)
            console.log('added to cart!')
            res.redirect('back');// need to reload whatever page you are currently on
            //res.redirect('/')
        })
    })


    app.delete('/cartRemove', (req, res) => {
        console.log(req.body);
        //need to use object id here
        db.collection('cart').findOneAndDelete({ task: req.body.task }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('item deleted from cart!')
        })
    })

    app.get('/checkout', async (req, res) => {

        //see if i can calculate total price of all items here if theres time.
        const cartResult = await db.collection('cart').find().toArray()
        res.render('checkout.ejs', { cart: cartResult })
    })

    //________Cart features end___________________________

    //https://jsonplaceholder.typicode.com/todos/     //testing api

    //Mark helped me with turning this into an async call
    //useing async await
    app.get('/inventory', async (req, res) => {
        const storeResult = await fetch("https://fakestoreapi.com/products") //later on put grocery api here
        const storeJson = await storeResult.json()
        // console.log(storeJson);

        //const result = await db.collection('cart').find().toArray() //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
        res.render('inventory.ejs', { inventory: storeJson })
    })


    //update
    app.put('/messages', (req, res) => {
        db.collection('todolist')
            .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
                $set: {
                    thumbUp: req.body.thumbUp + 1
                }
            }, {
                    sort: { _id: -1 },
                    upsert: true
                }, (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                })
    })

    //create
    app.post('/todotask', (req, res) => {
        db.collection('todolist').insertOne({ task: req.body.task, priority: req.body.priority, completed: false }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/')
        })
    })


    //change value of check
    app.put('/completetask', (req, res) => {
        db.collection('todolist')
            .findOneAndUpdate({ task: req.body.task }, {
                $set: {
                    // thumbUp: req.body.thumbUp + 1
                    completed: true
                }
            }, {
                    sort: { _id: -1 },
                    upsert: true
                }, (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                })
    })

    //delete

    app.delete('/deletetask', (req, res) => {
        console.log(req.body);

        db.collection('todolist').findOneAndDelete({ task: req.body.task }, (err, result) => {
            if (err) return res.send(500, err)
            res.send('Message deleted!')
        })
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/inventory', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/inventory', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/inventory');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
