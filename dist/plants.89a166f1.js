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
})({"scripts/plants.js":[function(require,module,exports) {
// water_capacities
// wcm = wc multiplier
var _wcm = 2;
var _wcs = [{
  name: 'smaller',
  cap: 1 * _wcm,
  value: 5
}, {
  name: 'small',
  cap: 2.333 * _wcm,
  value: 3.666
}, {
  name: 'large',
  cap: 3.666 * _wcm,
  value: 2.333
}, {
  name: 'larger',
  cap: 5 * _wcm,
  value: 1
}]; // daily_growths

var _dgs = [{
  name: 'slower',
  growth: 5,
  value: 50
}, {
  name: 'slow',
  growth: 20,
  value: 35
}, {
  name: 'fast',
  growth: 35,
  value: 20
}, {
  name: 'faster',
  growth: 50,
  value: 5
}]; // multiplier

var _m = 100;
var _unit = 'Cookies'; // unsorted price list

var _upl = generatePriceList(_wcs, _dgs); // sorted price list = final combinations


var _c = insertionSort(_upl);

var _route = '../assets/plants/'; // plants database

var _pdb = [{
  name: 'Flookie',
  images: [_route + 'seed.png', _route + 'flookie_bud.png', _route + 'flookie.png'],
  desc: "Flookie is a common, small-sized plant and can be found mostly on tropical cookie islands. This plant produces cookies a lot in small amount."
}, {
  name: 'Giant Flookie',
  images: [_route + 'seed.png', _route + 'giant_flookie_bud.png', _route + 'giant_flookie.png'],
  desc: "If you ever see a Flookie, this one is the taller version. Only can be found in lush tropical regions."
}, {
  name: 'Clovie',
  images: [_route + 'seed.png', _route + 'clovie_bud.png', _route + 'clovie.png'],
  desc: "Clovie is a small-sized and pretty-enough plant to be a decoration on your bathroom."
}, {
  name: 'Plantie',
  images: [_route + 'seed.png', _route + 'plantie_bud.png', _route + 'plantie.png'],
  desc: "Plantie is a small-sized and pretty-enough plant to be one of my girlfriend's favourite plant."
}, {
  name: 'Mushkie',
  images: [_route + 'seed.png', _route + 'mushkie_bud.png', _route + 'mushkie.png'],
  desc: "Do not eat this plant. If eaten, this plant can mess up your gardening schedule. Even though it feels good."
}, {
  name: 'Kukweed',
  images: [_route + 'seed.png', _route + 'kukweed_bud.png', _route + 'kukweed.png'],
  desc: "Kukweed is categorized as a swamp plants. Usually used by a Crocookiedile to hide."
}, {
  name: 'Wiscoonsie',
  images: [_route + 'seed.png', _route + 'wiscoonsie_bud.png', _route + 'wiscoonsie.png'],
  desc: "Wiscoonsie plant can be found in northern region, surrounded by several Domesticated Turkey and Trumpeter Swan."
}, {
  name: 'Kuekalyptus',
  images: [_route + 'seed.png', _route + 'kuekalyptus_bud.png', _route + 'kuekalyptus.png'],
  desc: "Kuekalyptus has leaves that collide with each other gracefully."
}, {
  name: 'Kuplar',
  images: [_route + 'seed.png', _route + 'kuplar_bud.png', _route + 'kuplar.png'],
  desc: "The cookies that fell from Kuplar feels more delicious and filling."
}, {
  name: 'Alkaie',
  images: [_route + 'seed.png', _route + 'alkaie_bud.png', _route + 'alkaie.png'],
  desc: "Alkaie is a water plant that needs water to keep it watery."
}, {
  name: 'Kudzu',
  images: [_route + 'seed.png', _route + 'kudzu_bud.png', _route + 'kudzu.png'],
  desc: "Kudzu, also called Japanese arrowroot, is a group of plants in the genus Pueraria, in the pea family Fabaceae, subfamily Faboideae. They are climbing, coiling, and trailing perennial vines native to much of eastern Asia, Southeast Asia, and some Pacific islands. (*real description from Wikipedia)"
}, {
  name: 'Kumbu',
  images: [_route + 'seed.png', _route + 'kumbu_bud.png', _route + 'kumbu.png'],
  desc: "Kumbu has a higher specific compressive strength and a specific tensile strength that rivals steel. The cookies of this plant feels unexpected hard."
}, {
  name: 'Acookia',
  images: [_route + 'seed.png', _route + 'acookia_bud.png', _route + 'acookia.png'],
  desc: "Acookia is a large-sized plant and can be found mostly on middle-eastern region. Cookie Imp likes to climb this plant!"
}, {
  name: 'Katun',
  images: [_route + 'seed.png', _route + 'katun_bud.png', _route + 'katun.png'],
  desc: "Soft leaves from Katun plant can make you more comfortable when gardening. The cookies also feels tender."
}, {
  name: 'Giant Sekuooia',
  images: [_route + 'seed.png', _route + 'giant_sekuooia_bud.png', _route + 'giant_sekuooia.png'],
  desc: "Giant Sekuooia is preferred because of its large and strong shape. Very masculine plant."
}, {
  name: 'Anggrek',
  images: [_route + 'seed.png', _route + 'anggrek_bud.png', _route + 'anggrek.png'],
  desc: "Anggrek is the plant of charm. Her beauty will make you want to eat more cookies!"
}];
var _plants = [];

function Plant(data) {
  // generate with static data
  this.id = 0;
  this.position = 0;
  this.name = data.name;
  this.bought_at = {
    day: 0,
    period: 'day'
  };
  this.price = data.price;
  this.desc = data.desc;
  this.image = data.image;
  this.image_bud = data.image_bud; // 0 = seed
  // 1 = budding
  // 2 = producing

  this.stage = 0;
  this.progress = 0;
  this.growth_rate = 0;
  this.daily_growth = data.daily_growth;
  this.ready = false;
  this.cookie_health = 21;
  this.default_cookie_health = 21;
  this.water = data.water_capacity;
  this.water_capacity = data.water_capacity;
  this.dry = false;
  this.health = 21;
  this.default_health = 21;
}

function insertionSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < i; j++) {
      if (arr[i].price < arr[j].price) {
        var temp = arr.splice(i, 1);
        arr.splice(j, 0, temp[0]);
      }
    }
  }

  return arr;
}

function generatePriceList(a1, a2) {
  var res = [];

  for (var i = 0; i < a1.length; i++) {
    // water capacity
    var wc = a1[i];
    var wcv = a1[i].value;
    var wcn = a1[i].name;

    for (var j = 0; j < a2.length; j++) {
      // daily growth
      var dg = a2[j];
      var dgv = a2[j].value;
      var dgn = a2[j].name;
      var data = {
        category: wcn + ' ' + dgn,
        price: parseFloat(Math.round(wcv * dgv * _m * 100) / 100),
        cap: wc.cap,
        growth: dg.growth,
        unit: _unit
      };
      res.push(data);
    }
  }

  return res;
}

function generatePlant() {
  // generate final plant database
  for (var i = 0; i < _pdb.length; i++) {
    var p = _pdb[i]; // generate with dynamic data

    var np = new Plant({
      name: p.name,
      image_bud: p.images[1],
      image: p.images[2],
      desc: p.desc,
      category: _c[i].category,
      price: _c[i].price,
      water_capacity: _c[i].cap,
      daily_growth: _c[i].growth
    }); // console.log(np, _c[i].growth)

    _plants.push(np);
  }
}

generatePlant();
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
},{}]},{},["../../../../../home/farishan/.nvm/versions/node/v12.4.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/plants.js"], null)
//# sourceMappingURL=/plants.89a166f1.js.map