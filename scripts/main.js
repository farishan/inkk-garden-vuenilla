// kongregateAPI.loadAPI(function(){
//   window.kongregate = kongregateAPI.getAPI();
//   // You can now access the Kongregate API with:
//   // kongregate.services.getUsername(), etc
//   // Proceed with loading your game...
// });

const _soundVolume = 0.1;
const _musicVolume = 0.5;

(function(){

const _timezoneInterval = 2; // seconds
const _collectingInterval = 100;
const _slots = 8*4;
const _priceCut = 40;

const _standard_cost = 1;
const _inked_cost = 2;
const _auto_cost = 5;

const plants = _plants;
const player = _player;

const _initialSlots = [
	null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null
]

const initialSlots = JSON.parse(JSON.stringify(_initialSlots))

const initialData = function(){
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
	}
}

var app = new Vue({
	el: '#app',
	data: initialData(),
	mounted(){
		// console.error('[BUG] autoCollect');

		document.getElementById('app').style.display = 'block';
		var self = this;

		window.addEventListener('click', function(e){
			self.slotsClickHandler();
		});

		this.setAudio();

		this.uniquingPlants(function(uniqued){
			self.player.plants = uniqued;
		});
	},
	methods: {
		alert(message, timeout){
			var self = this;
			this.alerted = true;
			this.message = message;
			setTimeout(function(){
				self.alerted = false;
				setTimeout(function(){
					self.message = '';
				}, timeout/2);
			}, timeout);
		},

		/* Audio */
		setAudio(){
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
			}
			
			for (var i = 0; i < buttons.length; i++) {
				var button = buttons[i];
				button.addEventListener('mouseover', function(){
					button.setAttribute('style', 'transform: scale(1.025)')
					hover.play();
				});
				button.addEventListener('mouseout', function(){
					button.setAttribute('style', 'transform: scale(1)')
					hover.play();
				});
				button.addEventListener('click', function(){
					click.play();
				});
			}
		},
		playAudio(type){
			if(type=='hover'){
				this.$refs.hover.play();
			}else{
				this.$refs.click.play();
			}
		},

		/* Gameplay */
		startGame(){
			var self = this;
			this.load(function(data){
				if(data){
					// console.log('continued game', data)
					self.alert('Welcome back!', 2000)
					self.player = data;
					for (var i = 0; i < self.player.plants.length; i++) {
						var p = self.player.plants[i];
						if(p.ready || p.progress === 100){
							self.collectingList.push(p);
						}
					}
					if(data.auto_collecting || data.collector){
						self.autoCollect();
					}
				}else{
					// console.log('new game');
					_player.plants = [_plants[0]]
					self.player = JSON.parse(JSON.stringify(_player));
					self.alert('Welcome to Inkk Garden. <br><br> <b>Click watering can icon</b> on <b>bottom left corner</b>, <br> and then <b>click a plant</b> to water it.', 5000);
				}
				self.page = 'garden';

				self.arrangePlants();
				self.startTimezone();
			});
		},
		arrangePlants(){
			var self = this;
			// console.log('arrange plants', self.player.plants);

			for (var i = 0; i < self.player.plants.length; i++) {
				var plant = self.player.plants[i];
				self.slots[plant.position] = plant;
			}

			for (var i = 0; i < self.slots.length; i++) {
				var slot = self.slots[i]
				if(slot){
					if(slot.position != i || slot.health == 0){
						// console.error('ALERT! nulling: ', self.slots[i])
						// console.error('because: ', slot.position, 'and', i, 'and dry count:', slot.health);
						self.slots[i] = null;
						self.isWatering = false;
						self.selectingAction = false;
					}
				}
			}
		},
		startTimezone(){
			var self = this;
			var hour = 0;
			this.timezoneInterval = setInterval(function(){
				if(hour == 2){
					hour = 0;
					self.checkPlants();
					self.player.day++;
				}
				
				if(hour == 0){
					self.player.period = 'day'
				}else{
					self.player.period = 'night'
				}

				hour++;
			}, _timezoneInterval/2*1000);
		},
		checkPlants(){
			var self = this;

			if(self.player.auto_watering){
				self.autoWatering();
			}

			if(self.player.collector && !self.player.auto_collecting){
				self.player.cookies--;
			}

			var noPlants = true;

			for (var i = 0; i < this.player.plants.length; i++) {
				var plant = this.player.plants[i];
				if(plant){

					noPlants = false;
					if(plant.water>0){
						if(plant.dry){
							plant.dry = false;
							plant.health = plant.default_health;
						}
						if(!plant.ready){
							photosynthesisProgress(plant);
						}else{
							plant.cookie_health--;
							if(plant.cookie_health==0){
								removeCookies(plant);
							}
						}
					}else{
						if(!plant.dry){
							plant.dry = true;
						}
						plant.water = 0;
						plant.health--;
						if(plant.health==0){
							removePlant(plant);
						}
					}

					if(plant.progress === 0){
						plant.ready = false;
					}else if(plant.progress === 100){
						plant.ready = true;
					}
				}
			}

			this.player.no_plants = noPlants;
			if(noPlants){
				this.isWatering = false;
				this.selectingAction = false;
			}

			function removePlant(plant){
				for (var i = 0; i < self.player.plants.length; i++) {
					var data = self.player.plants[i];
					if(plant.id == data.id){
						self.player.plants.splice(i, 1);
						self.player.dead_plants.push(plant);
					}
				}
				self.arrangePlants();
			}

			function removeCookies(plant){
				for (var i = 0; i < self.player.plants.length; i++) {
					var data = self.player.plants[i];
					if(plant.id == data.id){
						plant.progress = 0;
						plant.ready = false;
						plant.cookie_health = plant.default_cookie_health;
					}
				}
			}
		},
		uniquingPlants(callback){
			var self = this;
			var uniquedPlants = [];

			for (var i = 0; i < this.player.plants.length; i++) {
				var plant = this.player.plants[i];
				if(plant){
					plant = JSON.parse(JSON.stringify(plant));
					plant.id = 'plant'+(Math.ceil(Math.random()*100000)).toString()+i;
					uniquedPlants.push(plant);
				}else{
					uniquedPlants.push(null);
				}
			}

			callback(uniquedPlants);
		},
		
		/* Watering*/
		getWateringCan(type){
			if(type == 'standard'){
				// this.$refs.wateringCan
				// this.$refs.inkedWateringCan
				this.isWatering = true;
				window.addEventListener('mousemove', mousemoveHandler, true);
			}else if(type == 'inked'){
				this.isWatering = true;
				this.player.cookies -= 10;
				window.addEventListener('mousemove', mousemoveHandler, true);
			}
		},
		watering(plant){
			var wc;
			if(plant.dry){
				// console.log('watering:', plant)

				setTimeout(function(){
					plant.water = plant.water_capacity;
					plant.dry = false;
					plant.health = plant.default_health;
				}, 500);
			}else{
				plant.water = plant.water_capacity;
				if(!this.player.auto_watering){
					if(this.player.watering_can == 'inked'){
						this.player.cookies-=this.inkedCost;
					}else{
						this.player.cookies-=this.standardCost;
					}
				}else{
					this.player.cookies-=this.autoCost;
				}
			}

			if(this.player.watering_can == 'standard'){
				wc = this.$refs.wateringCan;
				this.isWatering = false;
				if(wc){
					wc.setAttribute('style', "transform: none");
				}
				window.removeEventListener('mousemove', mousemoveHandler, true);
			}else if(this.player.watering_can == 'inked'){
				wc = this.$refs.inkedWateringCan;
			}
		},
		stopWatering(type){
			this.isWatering = false;
			var wc;

			if(type=='standard'){
				wc = this.$refs.wateringCan;
			}else if(type=='inked'){
				wc = this.$refs.inkedWateringCan;
			}

			window.removeEventListener('mousemove', mousemoveHandler, true);
			wc.setAttribute('style', "transform: none");
			window.removeEventListener('mousemove', mousemoveHandler, true);
		},
		autoWatering(){
			var self = this;
			for (var i = 0; i < self.player.plants.length; i++) {
				var plant = self.player.plants[i];
				self.watering(plant);
				// plant.water = plant.water_capacity;
				// plant.dry = false;
				// plant.health = 28;
			}
		},
		toggleSprinkler(){
			this.player.auto_watering = !this.player.auto_watering;
		},
		toggleCollector(){
			this.player.auto_collecting = !this.player.auto_collecting;
			if(this.player.auto_collecting){
				this.autoCollect();
			}else{
				clearInterval(this.collectingInterval);
			}
		},

		/* Collecting */
		collecting(e, plant, key){
			// console.log('collecting ', plant.id)
			var self = this;
			if(e){
				e.preventDefault();
				e.stopPropagation();
			}

			var cookies = Math.floor(convertPrice(random(true, 15, 20), plant.price));
			this.player.cookies += cookies;

			if(this.player.auto_collecting){
				this.player.cookies -= 5/100*cookies
			}

			// console.log('get '+cookies+' cookies from '+plant.id);

			// PLANT PROCESSING
			plant.ready = false;
			plant.progress = 0;
			plant.cookie_health = plant.default_cookie_health;
			for (var j = 0; j < self.collectingList.length; j++) {
				var data = self.collectingList[j];
				if(data.id == plant.id){
					// console.log(j, 'remove '+plant.id+'/'+data.id+' from collecting list')
					self.collectingList.splice(j, 1);
				}
			}
		},
		autoCollect(){
			var self = this;
			this.collectingInterval = setInterval(function(){
				if(self.collectingList.length>0){
					// console.log('auto collecting..', self.collectingList);
					if(self.collectingList[0]){
						self.collecting(null, self.collectingList[0], self.collectingList[0].key);

						// var c = self.$refs.collector;
						// if(c){
						// 	c.setAttribute('style', 'animation: spin .1s ease-in-out');
						// 	c.setAttribute('style', 'animation: none');
						// }
					}
				}
			}, _collectingInterval);
		},

		/* Save and Load*/
		save(){
			var self = this;
			this.alert('saving...', 1000);
			var data = JSON.stringify(this.player);
			localStorage.setItem('inkk-garden-data', data);

			// kongregate.stats.submit('Cookies', this.player.cookies);
			// kongregate.stats.submit('Days', this.player.day);

			setTimeout(function(){
				self.alert('saved', 1000);
			}, 1000);
		},
		load(callback){
			var data;
			if(localStorage.getItem('inkk-garden-data')){
				var raw = localStorage.getItem('inkk-garden-data');
				data = JSON.parse(raw);
			}else{
				data = null;
			}
			callback(data);
		},
		deleteSavedData(){
			localStorage.removeItem('inkk-garden-data');
			clearInterval(this.timezoneInterval);
			player.plants = [_plants[0]]
			Object.assign(this.$data, initialData())
			this.slots = JSON.parse(JSON.stringify(_initialSlots))
			// this.$data = initialData();
		},
		importData(){
			this.importedData = null;
			this.importedData = lzw_encode(JSON.stringify(app.player));
			this.isImported = true;
		},
		copyImportedData(){
			document.getElementById('importedData').select();
			document.execCommand('copy');
			this.alert('Copied to clipboard', 2000);
		},
		exportData(){
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
		buy(item, e){
			if(e){
				e.stopPropagation();
			}else{

			}
			var self = this;
			var player = this.player;
			
			if(item=='inked-watering-can'){
				if(player.cookies >= 5000){
					this.isWatering = false;
					player.watering_can = 'inked';
					player.cookies -= 5000;
				}else{
					this.alert('not enough cookies', 2000);
				}
			}

			else if(item=='cookie-imp'){
				if(player.cookies >= 5000){
					this.player.collector = item;
					this.player.auto_collecting = true;
					player.cookies -= 5000;
					this.autoCollect();
				}else{
					this.alert('not enough cookies', 2000);
				}
			}

			else if(item=='water-sprinkler'){
				if(player.cookies >= 10000){
					this.player.sprinkler = item;
					this.player.auto_watering = true;
					player.cookies -= 10000;
				}else{
					this.alert('not enough cookies', 2000);
				}
			}

			else{
				var plant = item;
				var day = this.player.day;
				var period = this.player.period;

				self.alert('+ '+item.name+' seed bought', 1000);
				if(player.cookies>=plant.price && player.plants.length<_slots){
					// console.log('buying: ', plant)
					player.cookies -= plant.price;

					var wrapped = JSON.parse(JSON.stringify(plant))
					wrapped.id = 'inkk'+(Math.ceil(Math.random()*100000)).toString();
					wrapped.bought_at.day = day;
					wrapped.bought_at.period = period;

					var selectedSlot = null;
					var filled = false;
					for (var i = 0; i < self.slots.length; i++) {
						if(i==0 && !self.slots[0]){
							// masukin ke 0
							selectedSlot = i;
							filled = true;
						}else if(!self.slots[i] && !filled){
							selectedSlot = i;
							filled = true;
						}
					}
					wrapped.position = selectedSlot;
					// console.log(wrapped)

					player.plants.push(wrapped);
					self.arrangePlants();
					selectedSlot = null;
					filled = false;
				}else{
					if(player.cookies<plant.price){
						this.alert('not enough cookies', 2000);
					}else if(player.plants.length>=_slots){
						this.alert('your garden is full', 2000);
					}
				}
			}
		},
		sell(data){
			var plant = data.plant;
			var index = data.key;

			var convertedPrice = convertPrice(100-_priceCut, plant.price);
			this.player.cookies += convertedPrice;

			for (var i = 0; i < this.player.plants.length; i++) {
				var p = this.player.plants[i];
				if(p && plant && p.id == plant.id){
					this.player.plants.splice(i, 1);
					this.slots[index] = null;
				}
			}
		},
		showDetail(plant){
			var self = this;
			if(plant=='collector'){
				this.selectedShopItem = plant;
			}else{
				this.selectedPlant = plant;
			}
		},

		/* Click Handler*/
		potClickHandler(e, plant, key){
			e.stopPropagation();
			var self = this;

			if(!this.isWatering){
				this.selectingAction = true;
				this.selectedSlot = {
					plant: plant,
					key: key
				};
				var tooltip = self.$refs.actionTooltip;

				var x = e.clientX;
				var y = e.clientY-40;

				if(x>650){
					x-=120;
				}
				if(y>400){
					y-=200;
				}
				tooltip.setAttribute('style', "transform: translate3d("+x+"px,"+y+"px,0px)")
			}else{
				this.player.manual_watering++;
				if(this.player.manual_watering == 100){
					alert('You have achieved and achievement!')
				}
				this.watering(plant);
			}
		},
		slotClickHandler(key, slot){
			var self = this;
			if(!slot){
				// console.log(key, slot)
			}
		},
		slotsClickHandler(e){
			var self = this;
			this.selectingAction = false;
			var tooltip = self.$refs.actionTooltip;
		},
		slotDropHandler(e){
			this.stopWatering(this.player.watering_can);
			slotDropHandler(e, this)
		}
	},
	watch: {
		page(page){
			if(this.isWatering){
				this.stopWatering(this.player.watering_can)
			}
			if(page == 'shop'){
				this.player.shop_visited++;
			}
		},
		player: {
			handler(val){
				var self = this;
				if(this.latestCookies==0){
					this.latestCookies = val.cookies
				}else if(this.latestCookies != val.cookies){
					if(this.latestCookies<val.cookies){
						var dif = val.cookies - this.latestCookies;
						this.cookieChange = '+ '+Math.floor(dif).toString();
					}else{
						var dif = this.latestCookies - val.cookies ;
						this.cookieChange = '- '+Math.floor(dif).toString();
					}
					this.latestCookies = val.cookies;

					self.isBubbling = true;
					setTimeout(function(){
						self.cookieChange = null;
						self.isBubbling = false;
					}, 500)
				}
			},
			deep: true
		}
	},
	filters: {
		percent(plant){
			return Math.floor(plant.water/plant.water_capacity*100);
		},
		sellCut(price){
			return convertPrice(100-_priceCut, price);
		},
		format(val){
			return (val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
		}
	}
});
	
function photosynthesisProgress(plant){
	if(plant.progress<100 && !plant.ready){
		if(!app.player.auto_watering){
			plant.water--;
		}
		plant.progress+= random(true, plant.daily_growth-5, plant.daily_growth);
		
		checkProgress(plant);
		// console.log(plant.name + ' progress: ' + plant.progress)
	}else{
		checkProgress(plant);
	}

	function checkProgress(plant){
		if(plant.stage === 2 && plant.progress >= 100){
			plant.progress = 100;
			setToReady(plant);
		}else if(plant.stage < 2 && plant.progress >= 100){
			plant.stage++;
			plant.progress = 0;
		}else{

		}
	}

	function setToReady(plant){
		var ada = false;
		for (var i = 0; i < app.collectingList.length; i++) {
			var p = app.collectingList[i];
			if(p.id == plant.id){
				ada = true;
			}
		}
		if(!ada){
			app.collectingList.push(plant);
		}

		if(!plant.ready){
			plant.ready = true;
			// console.log(plant.id + ' ready to collect.')
		}
	}
}

function mousemoveHandler(e){
	var wc;
	if(app.player.watering_can=='standard'){
		wc = app.$refs.wateringCan;
	}else if(app.player.watering_can=='inked'){
		wc = app.$refs.inkedWateringCan;
	}else{}

	var x = e.clientX;
	var y = e.clientY-600;
	if(x>730){
		x=730;
	}
	if(x<0){
		x=0;
	}
	if(y<-535){
		y=-535
	}
	if(y>-5){
		y=-5;
	}
	if(wc){
		wc.setAttribute('style', "transform: translate3d("+x+"px,"+y+"px,0px)");
	}
}

})();

function mute(target, data){
	if(target == 'm'){
		var bgm = data;
		console.dir(bgm)
		if(bgm.paused){
			bgm.play();
		}else{
			bgm.pause();
		}
	}else{
		if(document.getElementById('hover').volume == 0){
			document.getElementById('hover').volume = _soundVolume;
			document.getElementById('click').volume = _soundVolume;
		}else{
			document.getElementById('hover').volume = 0;
			document.getElementById('click').volume = 0;
		}
	}
}

function openNewWindow(){
	window.open(window.location.href,'targetWindow',
                                   `toolbar=no,
                                    location=no,
                                    status=no,
                                    menubar=no,
                                    scrollbars=yes,
                                    resizable=yes,
                                    width=802,
                                    height=602`);
 return false;
}