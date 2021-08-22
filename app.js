const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect("mongodb+srv://admin-ante:Antekralj1324@cluster0.frorl.mongodb.net/benzinskaDB", { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);


///////////////////////////////// Schemas for admin, users, products /////////////////////////////////

//////// ADMIN SCHEMA AND MODEL ////////////

const userSchema = new mongoose.Schema({
  ime: String,
  username: String,
  password: String,
  role: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


///////////// SCHEMA AGREGATI ////////////////

const agregatiSchema = {
  ime: String,
  stanje: Number,
  cijena: Number
};

const Agregati = mongoose.model("Agregati", agregatiSchema);

const plin = new Agregati ({
  ime: "UNP",
  stanje: 200,
  cijena: 100
});

// plin.save();

////////////////////////************** SCHEMA PROIZVODI *********////////////////////

const proizvodiSchema = {
  ime: String,
  stanje: Number
};

const Proizvod = mongoose.model("Proizvod", proizvodiSchema);

const proizvod = new Proizvod({
  ime: "Filteri",
  stanje: 10000
});

// proizvod.save();

//////////////////////********SCHEMA FORUM KOMENTARI *******////////////////

const forumSchema = {
  ime: String,
  komentar: String
};

const Forum = mongoose.model("Forum", forumSchema);

/////////////*****************RASPORED SCHEMA *****************//////

const rasporedSchema = {
  prva: String,
  druga: String,
  treca: String
};

const Ponedjeljak = mongoose.model("Ponedjeljak", rasporedSchema);
const Utorak = mongoose.model("Utorak", rasporedSchema);
const Srijeda = mongoose.model("Srijeda", rasporedSchema);
const Cetvrtak = mongoose.model("Cetvrtak", rasporedSchema);
const Petak = mongoose.model("Petak", rasporedSchema);
const Subota = mongoose.model("Subota", rasporedSchema);
const Nedjelja = mongoose.model("Nedjelja", rasporedSchema);



/////////////////////////////////// ADMIN LOGIN ///////////////////////////
//////////////*************ADMIN REGISTER**********/////////////
// User.register({username: "admin", role: "admin"}, "PASSWORD", function(err, user) {
//   if (err) {
//     console.log(err);
//   } else {
//     passport.authenticate("local") (req, res, function() {
//         res.redirect("/");
//     });
//   }
// });


app.get("/", function(req, res) {
  res.render("home");
})

app.get("/admin", provjeraAdmina, benzinCheck, dizelCheck, plinCheck, unpCheck, renderAdminPage);
function provjeraAdmina(req, res, next) {
  if(req.isAuthenticated() && req.user.role === "admin") {
    next();
  }else {
    res.redirect("/");
  }
};


function benzinCheck (req, res, next) {
  Agregati.find({"ime": {$ne: null}}, function(err, pronadenoStanje){
      res.locals.stanjeBenzina = pronadenoStanje[0].stanje;
      next();
  });
};

function dizelCheck (req, res, next) {
  Agregati.find({"ime": {$ne: null}}, function(err, pronadenoStanje){
      res.locals.stanjeDizela = pronadenoStanje[1].stanje;
      next();
  });
};

function plinCheck (req, res, next) {
  Agregati.find({"ime": {$ne: null}}, function(err, pronadenoStanje){
      res.locals.stanjePlina = pronadenoStanje[2].stanje;
      next();
  });
};

function unpCheck (req, res, next) {
  Agregati.find({"ime": {$ne: null}}, function(err, pronadenoStanje){
      res.locals.stanjeUNP = pronadenoStanje[3].stanje;
      next();
  });
};

function renderAdminPage(req,res) {
  res.render("adminPage");
};


app.post("/admin", function(req, res){

  const user = new User ({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local") (req, res, function() {
          res.redirect("/admin");
      });
    }
  });

});




//////////////////////////// *****CRUDS FOR ADMIN***** ///////////////////////////

//////////////////////////****** PROIZVODI + PROIZVOD POSTOVI *******/////////////
app.get("/proizvodi", function(req, res){
  if (req.isAuthenticated() && req.user.role === "admin"){

    Proizvod.find(function(err, proizvod){
      if (!err) {
        res.render("proizvodi", {proizvod: proizvod});
      } else {
        console.log(err);
        res.redirect("/");
      }
    });
  }else {
    res.redirect("/");
  }
});

app.post("/sokovi", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Sokovi"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/sokovi", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Sokovi"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/alkohol", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Alkohol"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/voda", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Voda"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/cips", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Cips"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/smoki", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Smoki"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/stapici", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Stapici"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/keksi", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Keksi"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/cigarete", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Cigarete"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/duhan", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Duhan"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/filteri", function(req, res) {
  const stanje = req.body.stanje;

  Proizvod.updateMany({ime:"Filteri"}, {stanje: stanje}, function(err){
    if (!err){
      res.redirect("/proizvodi");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////RASPOREDS/////////////////////////

app.get("/raspored",checkUsersAdmin, findUsersAdmin, noviPonedjeljakAdmin, noviUtorakAdmin, noviSrijedaAdmin, noviCetvrtakAdmin, noviPetakAdmin, noviSubotaAdmin, noviNedjeljaAdmin, renderFormAdmin);
function checkUsersAdmin(req, res, next){
if (req.isAuthenticated() && req.user.role === "admin"){
    next();
  }else{
    res.redirect("/");
  }
};
function findUsersAdmin(req, res, next) {

    User.find({"ime": {$ne: null}}, function(err, foundUsers){
      if(!err){
        res.locals.foundUsers = foundUsers;
        next();
      }
    });
  };

function noviPonedjeljakAdmin(req, res, next) {
    Ponedjeljak.find({}, function(err, dani){
      if(!err){
        res.locals.dani = dani;
        next();
      }
    });
};

function noviUtorakAdmin(req, res, next) {
    Utorak.find({}, function(err, daniUtorak){
      if(!err){
        res.locals.daniUtorak = daniUtorak;
        next();
      }
    });
};

function noviSrijedaAdmin(req, res, next) {
    Srijeda.find({}, function(err, daniSrijeda){
      if(!err){
        res.locals.daniSrijeda = daniSrijeda;
        next();
      }
    });
};

function noviCetvrtakAdmin(req, res, next) {
    Cetvrtak.find({}, function(err, daniCetvrtak){
      if(!err){
        res.locals.daniCetvrtak = daniCetvrtak;
        next();
      }
    });
};

function noviPetakAdmin(req, res, next) {
    Petak.find({}, function(err, daniPetak){
      if(!err){
        res.locals.daniPetak = daniPetak;
        next();
      }
    });
};

function noviSubotaAdmin(req, res, next) {
    Subota.find({}, function(err, daniSubota){
      if(!err){
        res.locals.daniSubota = daniSubota;
        next();
      }
    });
};

function noviNedjeljaAdmin(req, res, next) {
    Nedjelja.find({}, function(err, daniNedjelja){
      if(!err){
        res.locals.daniNedjelja = daniNedjelja;
        next();
      }
    });
};

function renderFormAdmin(req, res) {
  res.render("raspored");
};




app.post("/raspored", ponedjeljak, utorak, srijeda, cetvrtak, petak, subota, nedjelja, redirectForm);
function ponedjeljak(req, res, next) {
  const pon1 = req.body.pon1;
  const pon2 = req.body.pon2;
  const pon3 = req.body.pon3;
  Ponedjeljak.updateMany({}, {prva: pon1, druga: pon2, treca: pon3}, function(err){
    next();

  });
};

function utorak(req, res, next) {
  const uto1 = req.body.uto1;
  const uto2 = req.body.uto2;
  const uto3 = req.body.uto3;
  Utorak.updateMany({}, {prva: uto1, druga: uto2, treca: uto3}, function(err){
    next();

  });
};

function srijeda(req, res, next) {
  const sri1 = req.body.sri1;
  const sri2 = req.body.sri2;
  const sri3 = req.body.sri3;
  Srijeda.updateMany({}, {prva: sri1, druga: sri2, treca: sri3}, function(err){
    next();

  });
};

function cetvrtak(req, res, next) {
  const cet1 = req.body.cet1;
  const cet2 = req.body.cet2;
  const cet3 = req.body.cet3;
  Cetvrtak.updateMany({}, {prva: cet1, druga: cet2, treca: cet3}, function(err){
    next();

  });
};

function petak(req, res, next) {
  const pet1 = req.body.pet1;
  const pet2 = req.body.pet2;
  const pet3 = req.body.pet3;
  Petak.updateMany({}, {prva: pet1, druga: pet2, treca: pet3}, function(err){
    next();

  });
};

function subota(req, res, next) {
  const sub1 = req.body.sub1;
  const sub2 = req.body.sub2;
  const sub3 = req.body.sub3;
  Subota.updateMany({}, {prva: sub1, druga: sub2, treca: sub3}, function(err){
    next();

  });
};

function nedjelja(req, res, next) {
  const ned1 = req.body.ned1;
  const ned2 = req.body.ned2;
  const ned3 = req.body.ned3;
  Nedjelja.updateMany({}, {prva: ned1, druga: ned2, treca: ned3}, function(err){
    next();

  });
};

function redirectForm(req, res) {
  res.redirect("/raspored");
};


/////////////////////////////////////////////////////////////////
//////////////////********* AGREGATI ADMIN ****///////////////////

app.get("/agregati", function(req, res) {
  if (req.isAuthenticated() && req.user.role === "admin"){

    Agregati.find(function(err, foundUsers) {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("agregati", {userWithStanjeAndCijena: foundUsers});
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

////////////***** AGREGATI POST FORME ********////////////

app.post("/benzin", function(req, res) {
  const stanje = req.body.stanje;
  const cijena = req.body.cijena;

  Agregati.updateMany({ime:"Benzin"}, {stanje: stanje, cijena: cijena}, function(err){
    if (!err){
      res.redirect("/agregati");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/dizel", function(req, res) {
  const stanje = req.body.stanje;
  const cijena = req.body.cijena;

  Agregati.updateMany({ime:"Disel"}, {stanje: stanje, cijena: cijena}, function(err){
    if (!err){
      res.redirect("/agregati");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/plin", function(req, res) {
  const stanje = req.body.stanje;
  const cijena = req.body.cijena;

  Agregati.updateMany({ime:"plin"}, {stanje: stanje, cijena: cijena}, function(err){
    if (!err){
      res.redirect("/agregati");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

app.post("/unp", function(req, res) {
  const stanje = req.body.stanje;
  const cijena = req.body.cijena;

  Agregati.updateMany({ime:"UNP"}, {stanje: stanje, cijena: cijena}, function(err){
    if (!err){
      res.redirect("/agregati");
    } else {
      res.send("Nesto je poslo po krivu. Probajte ponovno.");
    }
  });
});

////////////////////////////////////////////////////////////


//////////////////////////********** FORUM GET AND POST ********///////////////
app.get("/forum", function(req, res) {
  if (req.isAuthenticated()){
    Forum.find({"komentar": {$ne: null}}, function(err, foundUsers) {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("forum", {userSaKomentarom: foundUsers});
        }
      }
    });

  } else {
    res.redirect("/");
  }
});

app.post("/forum", function(req, res) {
  const noviKomentar = new Forum({
    ime: req.user.username,
    komentar: req.body.komentar
  });
  noviKomentar.save();

  res.redirect("forum");
});


app.get("/kreiraj", function(req, res) {
  if (req.isAuthenticated() && req.user.role === "admin"){
    res.render("kreiraj");
  } else {
    res.redirect("/");
  }
});

app.post("/kreiraj", function(req, res) {
  User.register({username: req.body.username, role:"user", ime: req.body.fName}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local") (req, res, function() {
          res.redirect("/kreiraj");
      });
    }
  });
});

app.get("/statistika", function(req, res) {

  if (req.isAuthenticated() && req.user.role === "admin") {

  User.find({"ime": {$ne: null}}, function(err, foundUsers){
    res.render("statistika", {foundUsers: foundUsers});
  });
}else {
  res.redirect("/");
}
});

app.post("/deleteDjelatnik", function(req, res) {
  User.deleteOne({ime: req.body.button}, function(err) {
    res.redirect("/statistika");
  });
});



////////////////////*********** CRUDS FOR USER *****************/////////////

app.get("/djelatnik", function(req, res) {
  if (req.isAuthenticated() && req.user.role === "user"){
    res.render("userHomePage", {loggedUser: req.user._id});
  } else {
    res.redirect("/");
  }
});

////////////// LOGIN ZA USERA /////////////

app.post("/user", function(req, res){
  const user = new User ({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local") (req, res, function() {
          res.redirect("/djelatnik");
      });
    }
  });
});

app.get("/djelatnik/proizvodi", function(req, res) {
  if (req.isAuthenticated() && req.user.role === "user"){
    Proizvod.find(function(err, proizvod){
      if (!err) {
        res.render("proizvodiUser", {proizvod: proizvod});
      } else {
        console.log(err);
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

///////////////////******************* DJELATNIK RASPORED *********************////////////////////////

app.get("/djelatnik/raspored",checkUsers, findUsers, noviPonedjeljak, noviUtorak, noviSrijeda, noviCetvrtak, noviPetak, noviSubota, noviNedjelja, renderForm);
function checkUsers(req, res, next){
if (req.isAuthenticated() && req.user.role === "user"){
    next();
  }else{
    res.redirect("/");
  }
};
function findUsers(req, res, next) {

    User.find({"ime": {$ne: null}}, function(err, foundUsers){
      if(!err){
        res.locals.foundUsers = foundUsers;
        next();
      }
    });
  };

function noviPonedjeljak(req, res, next) {
    Ponedjeljak.find({}, function(err, dani){
      if(!err){
        res.locals.dani = dani;
        next();
      }
    });
};

function noviUtorak(req, res, next) {
    Utorak.find({}, function(err, daniUtorak){
      if(!err){
        res.locals.daniUtorak = daniUtorak;
        next();
      }
    });
};

function noviSrijeda(req, res, next) {
    Srijeda.find({}, function(err, daniSrijeda){
      if(!err){
        res.locals.daniSrijeda = daniSrijeda;
        next();
      }
    });
};

function noviCetvrtak(req, res, next) {
    Cetvrtak.find({}, function(err, daniCetvrtak){
      if(!err){
        res.locals.daniCetvrtak = daniCetvrtak;
        next();
      }
    });
};

function noviPetak(req, res, next) {
    Petak.find({}, function(err, daniPetak){
      if(!err){
        res.locals.daniPetak = daniPetak;
        next();
      }
    });
};

function noviSubota(req, res, next) {
    Subota.find({}, function(err, daniSubota){
      if(!err){
        res.locals.daniSubota = daniSubota;
        next();
      }
    });
};

function noviNedjelja(req, res, next) {
    Nedjelja.find({}, function(err, daniNedjelja){
      if(!err){
        res.locals.daniNedjelja = daniNedjelja;
        next();
      }
    });
};

function renderForm(req, res) {
  res.render("rasporedUser");
};
/////////////////////////////////////////////////////////////////////////

/////////////////////////****************** DJELATNIK PRODAJA *********************///////////////////////

app.get("/djelatnik/prodaja", function(req, res){
  if (req.isAuthenticated() && req.user.role === "user") {
  res.render("prodajaUser");
} else {
  res.redirect("/");
}
});



/////////////////////////**************** POST CRUDOVI PRODAJA DJELATNIK *******************//////////////////////

app.post("/sokoviProdaja", function(req, res){
  const prodano = req.body.prodanoSokova;

  Proizvod.findOne({ime: "Sokovi"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Sokovi"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/alkoholProdaja", function(req, res){
  const prodano = req.body.Prodano_Alkohola;

  Proizvod.findOne({ime: "Alkohol"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Alkohol"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/vodaProdaja", function(req, res){
  const prodano = req.body.Prodano_Vode;

  Proizvod.findOne({ime: "Voda"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Voda"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/cipsProdaja", function(req, res){
  const prodano = req.body.Prodano_Cipsa;

  Proizvod.findOne({ime: "Cips"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Cips"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/smokiProdaja", function(req, res){
  const prodano = req.body.Prodano_Smokija;

  Proizvod.findOne({ime: "Smoki"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Smoki"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/stapiciProdaja", function(req, res){
  const prodano = req.body.Prodano_Stapica;

  Proizvod.findOne({ime: "Stapici"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Stapici"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/keksiProdaja", function(req, res){
  const prodano = req.body.Prodano_Keksa;

  Proizvod.findOne({ime: "Keksi"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Keksi"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/cigareteProdaja", function(req, res){
  const prodano = req.body.Prodano_Cigareta;

  Proizvod.findOne({ime: "Cigarete"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Cigarete"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/duhanProdaja", function(req, res){
  const prodano = req.body.Prodano_Duhana;

  Proizvod.findOne({ime: "Duhan"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Duhan"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/filteriProdaja", function(req, res){
  const prodano = req.body.Prodano_Filtera;

  Proizvod.findOne({ime: "Filteri"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Proizvod.updateMany({ime:"Filteri"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/benzinProdaja", function(req, res){
  const prodano = req.body.Prodano_Benzin;

  Agregati.findOne({ime: "Benzin"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Agregati.updateMany({ime:"Benzin"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/diselProdaja", function(req, res){
  const prodano = req.body.Prodano_Disel;

  Agregati.findOne({ime: "Disel"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Agregati.updateMany({ime:"Disel"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/plinProdaja", function(req, res){
  const prodano = req.body.Prodano_Plin;

  Agregati.findOne({ime: "plin"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Agregati.updateMany({ime:"plin"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

app.post("/unpProdaja", function(req, res){
  const prodano = req.body.Prodano_UNP;

  Agregati.findOne({ime: "UNP"}, function(err, pronadenProizvod){
        const x = pronadenProizvod.stanje;
if (x>=prodano){
    Agregati.updateMany({ime:"UNP"}, {stanje: x - prodano}, function(err){
      if (!err){
        res.redirect("/djelatnik/prodaja");
      } else {
        res.redirect("/");
      }
    });
  }else {
    res.send("Nedovoljna kolicina na stanju.")
  }
});
});

///////////////////////////////////////////////////////////////////////////////////////////


app.get("/djelatnik/agregati", function(req, res) {
  if (req.isAuthenticated() && req.user.role === "user"){

    Agregati.find(function(err, foundUsers) {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("agregatiUser", {users: foundUsers});
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

////////////////************PROFIL OD USERA*****************////////////////
////////////////*********** PROVJERA RADNIH SATI************////////////////

app.get("/djelatnik/:id",
provjeraLogiranogUsera, findUserName,
 ponedjeljakPrva, ponedjeljakDruga, ponedjeljakTreca,
  utorakPrva, utorakDruga, utorakTreca,
  srijedaPrva, srijedaDruga, srijedaTreca,
  cetvrtakPrva, cetvrtakDruga, cetvrtakTreca,
  petakPrva, petakDruga, petakTreca,
  subotaPrva, subotaDruga, subotaTreca,
  nedjeljaPrva, nedjeljaDruga, nedjeljaTreca,
 placa,ispisRadnihSati,renderProfil);

function provjeraLogiranogUsera(req, res, next) {
  if(req.isAuthenticated() && req.user.role === "user"){
    next();
  } else {
    res.redirect("/")
  }
};

function findUserName(req, res, next){
  const id = req.params.id;

  User.findOne({_id: id}, function(err, foundUser) {
    if(!err) {
      res.locals.foundUser = foundUser.ime;
      next();
    } else {
      res.send("Djelatnik s tim imenom ne postoji.")
    }
  });
};

let foundUser = 0;

function ponedjeljakPrva(req, res, next) {
  Ponedjeljak.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function ponedjeljakDruga(req, res, next) {
  Ponedjeljak.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function ponedjeljakTreca(req, res, next) {
  Ponedjeljak.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function utorakPrva(req, res, next) {
  Utorak.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function utorakDruga(req, res, next) {
  Utorak.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function utorakTreca(req, res, next) {
  Utorak.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function srijedaPrva(req, res, next) {
  Srijeda.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function srijedaDruga(req, res, next) {
  Srijeda.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function srijedaTreca(req, res, next) {
  Srijeda.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function cetvrtakPrva(req, res, next) {
  Cetvrtak.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function cetvrtakDruga(req, res, next) {
  Cetvrtak.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function cetvrtakTreca(req, res, next) {
  Cetvrtak.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function petakPrva(req, res, next) {
  Petak.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function petakDruga(req, res, next) {
  Petak.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function petakTreca(req, res, next) {
  Petak.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function subotaPrva(req, res, next) {
  Subota.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function subotaDruga(req, res, next) {
  Subota.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function subotaTreca(req, res, next) {
  Subota.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function nedjeljaPrva(req, res, next) {
  Nedjelja.findOne({prva: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function nedjeljaDruga(req, res, next) {
  Nedjelja.findOne({druga: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};

function nedjeljaTreca(req, res, next) {
  Nedjelja.findOne({treca: req.user.ime}, function(err, user){
    if(user) {
      foundUser = foundUser + 1;
        next();
    } else {
      next();
    }
  });
};



function ispisRadnihSati(req, res, next) {
  res.locals.radniSati = foundUser * 8;
  next();
};

function placa(req, res, next) {
  res.locals.placa = (foundUser * 8) * 25;
  next();
}

function renderProfil(req, res){
  console.log(foundUser);
  res.render("statistikaUser");
};

////////////////////////////////////////////


app.post("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});







let port = process.env.PORT;
if (port == null || port =="") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
