// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/main.js":[function(require,module,exports) {
// kongregateAPI.loadAPI(function(){
//   window.kongregate = kongregateAPI.getAPI();
//   // You can now access the Kongregate API with:
//   // kongregate.services.getUsername(), etc
//   // Proceed with loading your game...
// });
var _soundVolume = 0.1;
var _musicVolume = 0.5;

(function () {
  var _timezoneInterval = 2; // seconds

  var _collectingInterval = 100;

  var _slots = 8 * 4;

  var _priceCut = 40;
  var _standard_cost = 1;
  var _inked_cost = 2;
  var _auto_cost = 5;
  var plants = _plants;
  var player = _player;
  var _initialSlots = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  var initialSlots = JSON.parse(JSON.stringify(_initialSlots));

  var initialData = function initialData() {
    return {
      page: 'main-menu',
      plants: plants,
      player: player,
      timezoneInterval: null,
      collectingInterval: null,
      latestCookies: 0,
      cookieChange: null,
      isBubbling: false,
      slots: initialSlots,
      slotsIsEmpty: true,
      selectingAction: false,
      selectedSlot: {},
      isWatering: false,
      standardCost: _standard_cost,
      inkedCost: _inked_cost,
      autoCost: _auto_cost,
      collectingList: [],
      emptySlotClicked: false,
      message: '',
      alerted: false,
      isImported: false,
      isExporting: false,
      importedData: '',
      exportedData: '',
      audio: {},
      buttons: [],
      selectedPlant: null,
      selectedShopItem: null,
      selectedWatercan: null,
      confirmToDelete: false
    };
  };

  var app = new Vue({
    el: '#app',
    data: initialData(),
    mounted: function mounted() {
      // console.error('[BUG] autoCollect');
      document.getElementById('app').style.display = 'block';
      var self = this;
      window.addEventListener('click', function (e) {
        self.slotsClickHandler();
      });
      this.setAudio();
      this.uniquingPlants(function (uniqued) {
        self.player.plants = uniqued;
      });
    },
    methods: {
      alert: function alert(message, timeout) {
        var self = this;
        this.alerted = true;
        this.message = message;
        setTimeout(function () {
          self.alerted = false;
          setTimeout(function () {
            self.message = '';
          }, timeout / 2);
        }, timeout);
      },

      /* Audio */
      setAudio: function setAudio() {
        this.$refs.bgm.volume = _musicVolume;
        var buttons = document.querySelectorAll('button');
        this.buttons = buttons;
        var hover = this.$refs.hover;
        hover.volume = _soundVolume;
        var click = this.$refs.click;
        click.volume = _soundVolume;
        this.audio = {
          hover: hover,
          click: click
        };

        for (var i = 0; i < buttons.length; i++) {
          var button = buttons[i];
          button.addEventListener('mouseover', function () {
            button.setAttribute('style', 'transform: scale(1.025)');
            hover.play();
          });
          button.addEventListener('mouseout', function () {
            button.setAttribute('style', 'transform: scale(1)');
            hover.play();
          });
          button.addEventListener('click', function () {
            click.play();
          });
        }
      },
      playAudio: function playAudio(type) {
        if (type == 'hover') {
          this.$refs.hover.play();
        } else {
          this.$refs.click.play();
        }
      },

      /* Gameplay */
      startGame: function startGame() {
        var self = this;
        this.load(function (data) {
          if (data) {
            // console.log('continued game', data)
            self.alert('Welcome back!', 2000);
            self.player = data;

            for (var i = 0; i < self.player.plants.length; i++) {
              var p = self.player.plants[i];

              if (p.ready || p.progress === 100) {
                self.collectingList.push(p);
              }
            }

            if (data.auto_collecting || data.collector) {
              self.autoCollect();
            }
          } else {
            // console.log('new game');
            _player.plants = [_plants[0]];
            self.player = JSON.parse(JSON.stringify(_player));
            self.alert('Welcome to Inkk Garden. <br><br> <b>Click watering can icon</b> on <b>bottom left corner</b>, <br> and then <b>click a plant</b> to water it.', 5000);
          }

          self.page = 'garden';
          self.arrangePlants();
          self.startTimezone();
        });
      },
      arrangePlants: function arrangePlants() {
        var self = this; // console.log('arrange plants', self.player.plants);

        for (var i = 0; i < self.player.plants.length; i++) {
          var plant = self.player.plants[i];
          self.slots[plant.position] = plant;
        }

        for (var i = 0; i < self.slots.length; i++) {
          var slot = self.slots[i];

          if (slot) {
            if (slot.position != i || slot.health == 0) {
              // console.error('ALERT! nulling: ', self.slots[i])
              // console.error('because: ', slot.position, 'and', i, 'and dry count:', slot.health);
              self.slots[i] = null;
              self.isWatering = false;
              self.selectingAction = false;
            }
          }
        }
      },
      startTimezone: function startTimezone() {
        var self = this;
        var hour = 0;
        this.timezoneInterval = setInterval(function () {
          if (hour == 2) {
            hour = 0;
            self.checkPlants();
            self.player.day++;
          }

          if (hour == 0) {
            self.player.period = 'day';
          } else {
            self.player.period = 'night';
          }

          hour++;
        }, _timezoneInterval / 2 * 1000);
      },
      checkPlants: function checkPlants() {
        var self = this;

        if (self.player.auto_watering) {
          self.autoWatering();
        }

        if (self.player.collector && !self.player.auto_collecting) {
          self.player.cookies--;
        }

        var noPlants = true;

        for (var i = 0; i < this.player.plants.length; i++) {
          var plant = this.player.plants[i];

          if (plant) {
            noPlants = false;

            if (plant.water > 0) {
              if (plant.dry) {
                plant.dry = false;
                plant.health = plant.default_health;
              }

              if (!plant.ready) {
                photosynthesisProgress(plant);
              } else {
                plant.cookie_health--;

                if (plant.cookie_health == 0) {
                  removeCookies(plant);
                }
              }
            } else {
              if (!plant.dry) {
                plant.dry = true;
              }

              plant.water = 0;
              plant.health--;

              if (plant.health == 0) {
                removePlant(plant);
              }
            }

            if (plant.progress === 0) {
              plant.ready = false;
            } else if (plant.progress === 100) {
              plant.ready = true;
            }
          }
        }

        this.player.no_plants = noPlants;

        if (noPlants) {
          this.isWatering = false;
          this.selectingAction = false;
        }

        function removePlant(plant) {
          for (var i = 0; i < self.player.plants.length; i++) {
            var data = self.player.plants[i];

            if (plant.id == data.id) {
              self.player.plants.splice(i, 1);
              self.player.dead_plants.push(plant);
            }
          }

          self.arrangePlants();
        }

        function removeCookies(plant) {
          for (var i = 0; i < self.player.plants.length; i++) {
            var data = self.player.plants[i];

            if (plant.id == data.id) {
              plant.progress = 0;
              plant.ready = false;
              plant.cookie_health = plant.default_cookie_health;
            }
          }
        }
      },
      uniquingPlants: function uniquingPlants(callback) {
        var self = this;
        var uniquedPlants = [];

        for (var i = 0; i < this.player.plants.length; i++) {
          var plant = this.player.plants[i];

          if (plant) {
            plant = JSON.parse(JSON.stringify(plant));
            plant.id = 'plant' + Math.ceil(Math.random() * 100000).toString() + i;
            uniquedPlants.push(plant);
          } else {
            uniquedPlants.push(null);
          }
        }

        callback(uniquedPlants);
      },

      /* Watering*/
      getWateringCan: function getWateringCan(type) {
        if (type == 'standard') {
          // this.$refs.wateringCan
          // this.$refs.inkedWateringCan
          this.isWatering = true;
          window.addEventListener('mousemove', mousemoveHandler, true);
        } else if (type == 'inked') {
          this.isWatering = true;
          this.player.cookies -= 10;
          window.addEventListener('mousemove', mousemoveHandler, true);
        }
      },
      watering: function watering(plant) {
        var wc;

        if (plant.dry) {
          // console.log('watering:', plant)
          setTimeout(function () {
            plant.water = plant.water_capacity;
            plant.dry = false;
            plant.health = plant.default_health;
          }, 500);
        } else {
          plant.water = plant.water_capacity;

          if (!this.player.auto_watering) {
            if (this.player.watering_can == 'inked') {
              this.player.cookies -= this.inkedCost;
            } else {
              this.player.cookies -= this.standardCost;
            }
          } else {
            this.player.cookies -= this.autoCost;
          }
        }

        if (this.player.watering_can == 'standard') {
          wc = this.$refs.wateringCan;
          this.isWatering = false;

          if (wc) {
            wc.setAttribute('style', "transform: none");
          }

          window.removeEventListener('mousemove', mousemoveHandler, true);
        } else if (this.player.watering_can == 'inked') {
          wc = this.$refs.inkedWateringCan;
        }
      },
      stopWatering: function stopWatering(type) {
        this.isWatering = false;
        var wc;

        if (type == 'standard') {
          wc = this.$refs.wateringCan;
        } else if (type == 'inked') {
          wc = this.$refs.inkedWateringCan;
        }

        window.removeEventListener('mousemove', mousemoveHandler, true);
        wc.setAttribute('style', "transform: none");
        window.removeEventListener('mousemove', mousemoveHandler, true);
      },
      autoWatering: function autoWatering() {
        var self = this;

        for (var i = 0; i < self.player.plants.length; i++) {
          var plant = self.player.plants[i];
          self.watering(plant); // plant.water = plant.water_capacity;
          // plant.dry = false;
          // plant.health = 28;
        }
      },
      toggleSprinkler: function toggleSprinkler() {
        this.player.auto_watering = !this.player.auto_watering;
      },
      toggleCollector: function toggleCollector() {
        this.player.auto_collecting = !this.player.auto_collecting;

        if (this.player.auto_collecting) {
          this.autoCollect();
        } else {
          clearInterval(this.collectingInterval);
        }
      },

      /* Collecting */
      collecting: function collecting(e, plant, key) {
        // console.log('collecting ', plant.id)
        var self = this;

        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        var cookies = Math.floor(convertPrice(random(true, 15, 20), plant.price));
        this.player.cookies += cookies;

        if (this.player.auto_collecting) {
          this.player.cookies -= 5 / 100 * cookies;
        } // console.log('get '+cookies+' cookies from '+plant.id);
        // PLANT PROCESSING


        plant.ready = false;
        plant.progress = 0;
        plant.cookie_health = plant.default_cookie_health;

        for (var j = 0; j < self.collectingList.length; j++) {
          var data = self.collectingList[j];

          if (data.id == plant.id) {
            // console.log(j, 'remove '+plant.id+'/'+data.id+' from collecting list')
            self.collectingList.splice(j, 1);
          }
        }
      },
      autoCollect: function autoCollect() {
        var self = this;
        this.collectingInterval = setInterval(function () {
          if (self.collectingList.length > 0) {
            // console.log('auto collecting..', self.collectingList);
            if (self.collectingList[0]) {
              self.collecting(null, self.collectingList[0], self.collectingList[0].key); // var c = self.$refs.collector;
              // if(c){
              // 	c.setAttribute('style', 'animation: spin .1s ease-in-out');
              // 	c.setAttribute('style', 'animation: none');
              // }
            }
          }
        }, _collectingInterval);
      },

      /* Save and Load*/
      save: function save() {
        var self = this;
        this.alert('saving...', 1000);
        var data = JSON.stringify(this.player);
        localStorage.setItem('inkk-garden-data', data); // kongregate.stats.submit('Cookies', this.player.cookies);
        // kongregate.stats.submit('Days', this.player.day);

        setTimeout(function () {
          self.alert('saved', 1000);
        }, 1000);
      },
      load: function load(callback) {
        var data;

        if (localStorage.getItem('inkk-garden-data')) {
          var raw = localStorage.getItem('inkk-garden-data');
          data = JSON.parse(raw);
        } else {
          data = null;
        }

        callback(data);
      },
      deleteSavedData: function deleteSavedData() {
        localStorage.removeItem('inkk-garden-data');
        clearInterval(this.timezoneInterval);
        player.plants = [_plants[0]];
        Object.assign(this.$data, initialData());
        this.slots = JSON.parse(JSON.stringify(_initialSlots)); // this.$data = initialData();
      },
      importData: function importData() {
        this.importedData = null;
        this.importedData = lzw_encode(JSON.stringify(app.player));
        this.isImported = true;
      },
      copyImportedData: function copyImportedData() {
        document.getElementById('importedData').select();
        document.execCommand('copy');
        this.alert('Copied to clipboard', 2000);
      },
      exportData: function exportData() {
        var exportedData = lzw_decode(this.exportedData);
        this.player = null;
        this.player = JSON.parse(exportedData);
        this.page = 'garden';
        this.importedData = null;
        this.exportedData = null;
        this.isImported = false;
        this.isExporting = false;
        this.arrangePlants();
      },

      /* Buy and Sell */
      buy: function buy(item, e) {
        if (e) {
          e.stopPropagation();
        } else {}

        var self = this;
        var player = this.player;

        if (item == 'inked-watering-can') {
          if (player.cookies >= 5000) {
            this.isWatering = false;
            player.watering_can = 'inked';
            player.cookies -= 5000;
          } else {
            this.alert('not enough cookies', 2000);
          }
        } else if (item == 'cookie-imp') {
          if (player.cookies >= 5000) {
            this.player.collector = item;
            this.player.auto_collecting = true;
            player.cookies -= 5000;
            this.autoCollect();
          } else {
            this.alert('not enough cookies', 2000);
          }
        } else if (item == 'water-sprinkler') {
          if (player.cookies >= 10000) {
            this.player.sprinkler = item;
            this.player.auto_watering = true;
            player.cookies -= 10000;
          } else {
            this.alert('not enough cookies', 2000);
          }
        } else {
          var plant = item;
          var day = this.player.day;
          var period = this.player.period;
          self.alert('+ ' + item.name + ' seed bought', 1000);

          if (player.cookies >= plant.price && player.plants.length < _slots) {
            // console.log('buying: ', plant)
            player.cookies -= plant.price;
            var wrapped = JSON.parse(JSON.stringify(plant));
            wrapped.id = 'inkk' + Math.ceil(Math.random() * 100000).toString();
            wrapped.bought_at.day = day;
            wrapped.bought_at.period = period;
            var selectedSlot = null;
            var filled = false;

            for (var i = 0; i < self.slots.length; i++) {
              if (i == 0 && !self.slots[0]) {
                // masukin ke 0
                selectedSlot = i;
                filled = true;
              } else if (!self.slots[i] && !filled) {
                selectedSlot = i;
                filled = true;
              }
            }

            wrapped.position = selectedSlot; // console.log(wrapped)

            player.plants.push(wrapped);
            self.arrangePlants();
            selectedSlot = null;
            filled = false;
          } else {
            if (player.cookies < plant.price) {
              this.alert('not enough cookies', 2000);
            } else if (player.plants.length >= _slots) {
              this.alert('your garden is full', 2000);
            }
          }
        }
      },
      sell: function sell(data) {
        var plant = data.plant;
        var index = data.key;
        var convertedPrice = convertPrice(100 - _priceCut, plant.price);
        this.player.cookies += convertedPrice;

        for (var i = 0; i < this.player.plants.length; i++) {
          var p = this.player.plants[i];

          if (p && plant && p.id == plant.id) {
            this.player.plants.splice(i, 1);
            this.slots[index] = null;
          }
        }
      },
      showDetail: function showDetail(plant) {
        var self = this;

        if (plant == 'collector') {
          this.selectedShopItem = plant;
        } else {
          this.selectedPlant = plant;
        }
      },

      /* Click Handler*/
      potClickHandler: function potClickHandler(e, plant, key) {
        e.stopPropagation();
        var self = this;

        if (!this.isWatering) {
          this.selectingAction = true;
          this.selectedSlot = {
            plant: plant,
            key: key
          };
          var tooltip = self.$refs.actionTooltip;
          var x = e.clientX;
          var y = e.clientY - 40;

          if (x > 650) {
            x -= 120;
          }

          if (y > 400) {
            y -= 200;
          }

          tooltip.setAttribute('style', "transform: translate3d(" + x + "px," + y + "px,0px)");
        } else {
          this.player.manual_watering++;

          if (this.player.manual_watering == 100) {
            alert('You have achieved and achievement!');
          }

          this.watering(plant);
        }
      },
      slotClickHandler: function slotClickHandler(key, slot) {
        var self = this;

        if (!slot) {// console.log(key, slot)
        }
      },
      slotsClickHandler: function slotsClickHandler(e) {
        var self = this;
        this.selectingAction = false;
        var tooltip = self.$refs.actionTooltip;
      },
      slotDropHandler: function (_slotDropHandler) {
        function slotDropHandler(_x) {
          return _slotDropHandler.apply(this, arguments);
        }

        slotDropHandler.toString = function () {
          return _slotDropHandler.toString();
        };

        return slotDropHandler;
      }(function (e) {
        this.stopWatering(this.player.watering_can);
        slotDropHandler(e, this);
      })
    },
    watch: {
      page: function page(_page) {
        if (this.isWatering) {
          this.stopWatering(this.player.watering_can);
        }

        if (_page == 'shop') {
          this.player.shop_visited++;
        }
      },
      player: {
        handler: function handler(val) {
          var self = this;

          if (this.latestCookies == 0) {
            this.latestCookies = val.cookies;
          } else if (this.latestCookies != val.cookies) {
            if (this.latestCookies < val.cookies) {
              var dif = val.cookies - this.latestCookies;
              this.cookieChange = '+ ' + Math.floor(dif).toString();
            } else {
              var dif = this.latestCookies - val.cookies;
              this.cookieChange = '- ' + Math.floor(dif).toString();
            }

            this.latestCookies = val.cookies;
            self.isBubbling = true;
            setTimeout(function () {
              self.cookieChange = null;
              self.isBubbling = false;
            }, 500);
          }
        },
        deep: true
      }
    },
    filters: {
      percent: function percent(plant) {
        return Math.floor(plant.water / plant.water_capacity * 100);
      },
      sellCut: function sellCut(price) {
        return convertPrice(100 - _priceCut, price);
      },
      format: function format(val) {
        return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }
    }
  });

  function photosynthesisProgress(plant) {
    if (plant.progress < 100 && !plant.ready) {
      if (!app.player.auto_watering) {
        plant.water--;
      }

      plant.progress += random(true, plant.daily_growth - 5, plant.daily_growth);
      checkProgress(plant); // console.log(plant.name + ' progress: ' + plant.progress)
    } else {
      checkProgress(plant);
    }

    function checkProgress(plant) {
      if (plant.stage === 2 && plant.progress >= 100) {
        plant.progress = 100;
        setToReady(plant);
      } else if (plant.stage < 2 && plant.progress >= 100) {
        plant.stage++;
        plant.progress = 0;
      } else {}
    }

    function setToReady(plant) {
      var ada = false;

      for (var i = 0; i < app.collectingList.length; i++) {
        var p = app.collectingList[i];

        if (p.id == plant.id) {
          ada = true;
        }
      }

      if (!ada) {
        app.collectingList.push(plant);
      }

      if (!plant.ready) {
        plant.ready = true; // console.log(plant.id + ' ready to collect.')
      }
    }
  }

  function mousemoveHandler(e) {
    var wc;

    if (app.player.watering_can == 'standard') {
      wc = app.$refs.wateringCan;
    } else if (app.player.watering_can == 'inked') {
      wc = app.$refs.inkedWateringCan;
    } else {}

    var x = e.clientX;
    var y = e.clientY - 600;

    if (x > 730) {
      x = 730;
    }

    if (x < 0) {
      x = 0;
    }

    if (y < -535) {
      y = -535;
    }

    if (y > -5) {
      y = -5;
    }

    if (wc) {
      wc.setAttribute('style', "transform: translate3d(" + x + "px," + y + "px,0px)");
    }
  }
})();

function mute(target, data) {
  if (target == 'm') {
    var bgm = data;
    console.dir(bgm);

    if (bgm.paused) {
      bgm.play();
    } else {
      bgm.pause();
    }
  } else {
    if (document.getElementById('hover').volume == 0) {
      document.getElementById('hover').volume = _soundVolume;
      document.getElementById('click').volume = _soundVolume;
    } else {
      document.getElementById('hover').volume = 0;
      document.getElementById('click').volume = 0;
    }
  }
}
},{}],"../../../../../home/farishan/.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49730" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../home/farishan/.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/main.js"], null)
//# sourceMappingURL=/main.d8ebb8d6.js.map