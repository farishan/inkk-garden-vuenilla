// water_capacities
// wcm = wc multiplier
const _wcm = 2;
const _wcs = [ 
	{
		name: 'smaller',
		cap: 1*_wcm,
		value: 5
	},
	{
		name: 'small',
		cap: 2.333*_wcm,
		value: 3.666
	},
	{
		name: 'large',
		cap: 3.666*_wcm,
		value: 2.333
	},
	{
		name: 'larger',
		cap: 5*_wcm,
		value: 1
	}
];
// daily_growths
const _dgs = [ 
	{
		name: 'slower',
		growth: 5,
		value: 50
	},
	{
		name: 'slow',
		growth: 20,
		value: 35
	},
	{
		name: 'fast',
		growth: 35,
		value: 20
	},
	{
		name: 'faster',
		growth: 50,
		value: 5
	}
];

// multiplier
const _m = 100;
const _unit = 'Cookies';
// unsorted price list
var _upl = generatePriceList(_wcs, _dgs);
// sorted price list = final combinations
var _c = insertionSort(_upl);

const _route = '../assets/plants/';
// plants database
var _pdb = [
	{
		name: 'Flookie',
		images: [
			_route+'seed.png',
			_route+'flookie_bud.png',
			_route+'flookie.png',
		],
		desc: "Flookie is a common, small-sized plant and can be found mostly on tropical cookie islands. This plant produces cookies a lot in small amount."
	},
	{
		name: 'Giant Flookie',
		images: [
			_route+'seed.png',
			_route+'giant_flookie_bud.png',
			_route+'giant_flookie.png',
		],
		desc: "If you ever see a Flookie, this one is the taller version. Only can be found in lush tropical regions."
	},
	{
		name: 'Clovie',
		images: [
			_route+'seed.png',
			_route+'clovie_bud.png',
			_route+'clovie.png',
		],
		desc: "Clovie is a small-sized and pretty-enough plant to be a decoration on your bathroom."
	},
	{
		name: 'Plantie',
		images: [
			_route+'seed.png',
			_route+'plantie_bud.png',
			_route+'plantie.png',
		],
		desc: "Plantie is a small-sized and pretty-enough plant to be one of my girlfriend's favourite plant."
	},
	{
		name: 'Mushkie',
		images: [
			_route+'seed.png',
			_route+'mushkie_bud.png',
			_route+'mushkie.png',
		],
		desc: "Do not eat this plant. If eaten, this plant can mess up your gardening schedule. Even though it feels good."
	},
	{
		name: 'Kukweed',
		images: [
			_route+'seed.png',
			_route+'kukweed_bud.png',
			_route+'kukweed.png',
		],
		desc: "Kukweed is categorized as a swamp plants. Usually used by a Crocookiedile to hide."
	},
	{
		name: 'Wiscoonsie',
		images: [
			_route+'seed.png',
			_route+'wiscoonsie_bud.png',
			_route+'wiscoonsie.png',
		],
		desc: "Wiscoonsie plant can be found in northern region, surrounded by several Domesticated Turkey and Trumpeter Swan."
	},
	{
		name: 'Kuekalyptus',
		images: [
			_route+'seed.png',
			_route+'kuekalyptus_bud.png',
			_route+'kuekalyptus.png',
		],
		desc: "Kuekalyptus has leaves that collide with each other gracefully."
	},
	{
		name: 'Kuplar',
		images: [
			_route+'seed.png',
			_route+'kuplar_bud.png',
			_route+'kuplar.png',
		],
		desc: "The cookies that fell from Kuplar feels more delicious and filling."
	},
	{
		name: 'Alkaie',
		images: [
			_route+'seed.png',
			_route+'alkaie_bud.png',
			_route+'alkaie.png',
		],
		desc: "Alkaie is a water plant that needs water to keep it watery."
	},
	{
		name: 'Kudzu',
		images: [
			_route+'seed.png',
			_route+'kudzu_bud.png',
			_route+'kudzu.png',
		],
		desc: "Kudzu, also called Japanese arrowroot, is a group of plants in the genus Pueraria, in the pea family Fabaceae, subfamily Faboideae. They are climbing, coiling, and trailing perennial vines native to much of eastern Asia, Southeast Asia, and some Pacific islands. (*real description from Wikipedia)"
	},
	{
		name: 'Kumbu',
		images: [
			_route+'seed.png',
			_route+'kumbu_bud.png',
			_route+'kumbu.png',
		],
		desc: "Kumbu has a higher specific compressive strength and a specific tensile strength that rivals steel. The cookies of this plant feels unexpected hard."
	},
	{
		name: 'Acookia',
		images: [
			_route+'seed.png',
			_route+'acookia_bud.png',
			_route+'acookia.png',
		],
		desc: "Acookia is a large-sized plant and can be found mostly on middle-eastern region. Cookie Imp likes to climb this plant!"
	},
	{
		name: 'Katun',
		images: [
			_route+'seed.png',
			_route+'katun_bud.png',
			_route+'katun.png',
		],
		desc: "Soft leaves from Katun plant can make you more comfortable when gardening. The cookies also feels tender."
	},
	{
		name: 'Giant Sekuooia',
		images: [
			_route+'seed.png',
			_route+'giant_sekuooia_bud.png',
			_route+'giant_sekuooia.png',
		],
		desc: "Giant Sekuooia is preferred because of its large and strong shape. Very masculine plant."
	},
	{
		name: 'Anggrek',
		images: [
			_route+'seed.png',
			_route+'anggrek_bud.png',
			_route+'anggrek.png',
		],
		desc: "Anggrek is the plant of charm. Her beauty will make you want to eat more cookies!"
	}
];

var _plants = [];

function Plant(data){
	// generate with static data
	this.id = 0;
	this.position = 0;
	this.name = data.name;
	this.bought_at = {day: 0, period: 'day'};
	this.price = data.price;
	this.desc = data.desc;

	this.image = data.image;
	this.image_bud = data.image_bud;
	
	// 0 = seed
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

function insertionSort(arr){
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < i; j++) {
			if(arr[i].price < arr[j].price){
				var temp = arr.splice(i, 1);
				arr.splice(j, 0, temp[0]);
			}
		}
	}
	return arr;
}

function generatePriceList(a1, a2){
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
				category: wcn+' '+dgn,
				price: parseFloat(Math.round(wcv*dgv*_m*100)/100),
				cap: wc.cap,
				growth: dg.growth,
				unit: _unit
			}

			res.push(data);
		}
	}
	return res;
}

function generatePlant(){
	// generate final plant database
	for (var i = 0; i < _pdb.length; i++) {
		var p = _pdb[i];
		// generate with dynamic data
		var np = new Plant({
			name: p.name,
			image_bud: p.images[1],
			image: p.images[2],
			desc: p.desc,
			category: _c[i].category,
			price: _c[i].price,
			water_capacity: _c[i].cap,
			daily_growth: _c[i].growth
		});
		// console.log(np, _c[i].growth)
		_plants.push(np);
	}
}

generatePlant();