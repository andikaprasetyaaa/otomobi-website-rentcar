const express = require('express');
const router = express.Router();
const Car = require('../models/carModel');
const multer = require('multer');
const fs = require('fs')


//img upload
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
});

const upload = multer({
    storage: storage
}).single('image')


//pages
router.get('/', (req, res) => {
    res.render('landing-page', {
        layout: 'main-layout',
        title: 'Welcome'
    })
});
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        layout: 'main-layout',
        title: 'Dashboard'
    })
});


//auth
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main-layout',
        title: 'Login'
    })
});
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'main-layout',
        title: 'Register'
    })
});

router.get('/test', (req, res) => {
    Car.find()
    .then(cars => {
        res.render('test', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    })
    .catch(err => console.log(err))

});

//cars
router.get('/cars-list', (req, res) => {
    Car.find()
        .then(cars => {
            res.render('cars-list', {
                layout: 'main-layout',
                title: 'List of Cars',
                cars: cars
            })
        })
        .catch(err => console.log(err))

});
router.get('/add-car', (req, res) => {
    res.render('add-car', {
        layout: 'main-layout',
        title: 'Add New Car'
    })
});


router.post('/add-car', upload, (req, res) => {

    const car = new Car({
        name: req.body.make + ' ' + req.body.model, 
        make: req.body.make,
        model: req.body.model,
        price: req.body.price,
        year: req.body.year,
        fuel: req.body.fuel,
        transmission: req.body.transmission,
        mile: req.body.mile,
        color: req.body.color,
        image: req.file.path.replace(/\\/g, '').substring('publicuploads'.length)
    });

    //new method

    car.save()
        .then(() => {
            console.log('Saved to database')
            res.redirect('/cars-list');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/add-car');
        });
});

router.get('/edit-car/:id', async (req, res) => {

    const id = req.params.id

    try {
        const car = await Car.findById(id);

        if (car) {
            res.render('edit-car', {
                layout: 'main-layout',
                title: 'Edit Car',
                car: car
            })
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/edit-car/:id', upload, (req, res) => {
    let id = req.params.id
    let new_image = ''

    if (req.file) {
        new_image = req.file.path.replace(/\\/g, '').substring('publicuploads'.length)
        try {
            fs.unlinkSync('./public/uploads/' + req.body.old_image)
        } catch (err) {
            console.log(err)
        }
    } else {
        new_image = req.body.old_image
    }

    const car = new Car({
        _id: id,
        name: req.body.make + ' ' + req.body.model, 
        make: req.body.make,
        model: req.body.model,
        price: req.body.price,
        year: req.body.year,
        fuel: req.body.fuel,
        transmission: req.body.transmission,
        mile: req.body.mile,
        color: req.body.color,
        image: new_image
    });

    Car.findByIdAndUpdate(id, car, { new: true })
        .then(car => {
            if (car) {
                res.redirect('/cars-list')
            } else {

                console.log('Document not found');
            }
        }).catch(err => console.log(err))

})

router.get('/delete-car/:id', (req, res) => {
    const id = req.params.id

    Car.findByIdAndRemove(id)
        .then(car => {
            if (car) {
                fs.unlinkSync('./public/uploads/' + car.image)
                res.redirect('/cars-list')
            } else {
                console.log('Document not found');
            }
        }).catch(err => console.log(err))
})

router.get('/about-us', (req, res) => {
    res.render('about-us', {
        layout: 'main-layout',
        title: 'About Us'
    })
});

router.get('/contact-us', (req, res) => {
    res.render('contact', {
        layout: 'main-layout',
        title: 'Contact Us'
    })
});

router.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'main-layout',
        title: 'Contact Us'
    })
});

router.post('/search', (req, res) => {
    const search = req.body.search.toLowerCase()
    Car.find({ name: { $regex: search, $options: 'i' } }).then(cars => {
        res.render('cars-list', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})

router.get('/table', (req, res) => {
    Car.find().sort('name')
        .then(cars => {
            res.render('table', {
                layout: 'main-layout',
                title: 'Table of Cars',
                cars: cars
            })
        })
        .catch(err => console.log(err))
})

router.get('/filtered-table', (req, res) => {
    Car.find().sort('name')
        .then(cars => {
            res.render('filtered-table', {
                layout: 'main-layout',
                title: 'Table of Cars',
                cars: cars
            })
        })
        .catch(err => console.log(err))
})

router.post('/sortby-name', (req, res) => {
    const sortParam = req.body.sortName
    Car.find().sort(sortParam == 1 ? { 'name': 1 } : { 'name': -1 }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})
router.post('/sortby-make', (req, res) => {
    const sortParam = req.body.sortMake
    Car.find({ make: { $regex: sortParam, $options: 'i' } }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})

router.post('/sortby-price', (req, res) => {
    const sortParam = req.body.sortPrice
    Car.find().sort(sortParam == 1 ? { 'price': -1 } : { 'price': 1 }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})

router.post('/sortby-year', (req, res) => {
    const sortParam = req.body.sortYear
    Car.find().sort(sortParam == 1 ? { 'year': -1 } : { 'year': 1 }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})
router.post('/sortby-mile', (req, res) => {
    const sortParam = req.body.sortMile
    Car.find().sort(sortParam == 1 ? { 'mile': 1 } : { 'mile': -1 }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})

router.post('/sortby-color', (req, res) => {
    const sortParam = req.body.sortColor
    Car.find({ color: { $regex: sortParam, $options: 'i' } }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})
router.post('/sortby-transmission', (req, res) => {
    const sortParam = req.body.sortTransmission
    Car.find({ transmission: { $regex: sortParam, $options: 'i' } }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})
router.post('/sortby-fuel', (req, res) => {
    const sortParam = req.body.sortFuel
    Car.find({ fuel: { $regex: sortParam, $options: 'i' } }).then(cars => {
        res.render('filtered-table', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))

})

router.post('/sort-make', (req, res) => {
    const sortParam = req.body.sortMake
    Car.find({ make: { $regex: sortParam, $options: 'i' } }).then(cars => {
        res.render('filtered', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))
})
router.post('/sort-transmission', (req, res) => {
    const sortParam = req.body.sortTransmission
    Car.find({ transmission: { $regex: sortParam, $options: 'i' } }).then(cars => {
        res.render('filtered', {
            layout: 'main-layout',
            title: 'List of Cars',
            cars: cars
        })
    }).catch(err => console.log(err))
})

router.post('/sort-price', (req, res) => {
    const sortParam = req.body.sortPrice
    if (sortParam == 'asc') {
        Car.find().sort({ 'price': -1 }).then(cars => {
            res.render('filtered', {
                layout: 'main-layout',
                title: 'List of Cars',
                cars: cars
            })
        }).catch(err => console.log(err))
    } else if (sortParam == 'dsc') {
        Car.find().sort({ 'price': 1 }).then(cars => {
            res.render('filtered', {
                layout: 'main-layout',
                title: 'List of Cars',
                cars: cars
            })
        }).catch(err => console.log(err))
    }

})

router.get('/filtered', (req, res) => {
    Car.find().sort('name')
        .then(cars => {
            res.render('filtered', {
                layout: 'main-layout',
                title: 'List of Cars',
                cars: cars
            })
        })
        .catch(err => console.log(err))
})

module.exports = router;