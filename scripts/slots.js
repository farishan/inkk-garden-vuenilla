// ===========

function potDragStartHandler(e){
	var data = {
		id: e.target.id.split('_')[0],
		position: e.target.id.split('_')[1],
		sender: e.target.id
	}
	e.dataTransfer.setData('pot', JSON.stringify(data));
	// console.log('move this:',e.dataTransfer.getData('pot'))
}
function slotDropHandler(e, app){
	if(app){
		e.preventDefault();

		// get data
		var raw = e.dataTransfer.getData("pot")
		data = JSON.parse(raw);

	  	// get target (position)
	  	var target;

	  	if(e.target.id){
	  		target = e.target.id.split('_')[1];
	  	}else{
	  		target = e.target.parentNode.id.split('_')[1];
	  	}

	  	if(!app.slots[target]){
			  // if target position is empty
		  	var newId = [data.id, data.position];
		  	var newElement = document.getElementById(newId.join('_'));

		  	renderSlots();
		}else{

			// get plant yg mau dipindah
			var firstPlant;
			for (var i = 0; i < app.slots.length; i++) {
				var p = app.slots[i];
				if(p){
					if(p.id == data.id){
						firstPlant = p;
					}
				}
			}
			
			// get plant yg mau ditumpuk
			var secondPlant = app.slots[target];

			if(firstPlant && secondPlant && firstPlant.id!=secondPlant.id){
				switchPlant(firstPlant, secondPlant);
			}
		}

		function switchPlant(a, b){
			var temp;
			temp = a.position;
			a.position = b.position;
			b.position = temp;
			app.arrangePlants();
		}

		function renderSlots(){
			// find plant yang mau dichange positionnya
			for (var i = 0; i < app.player.plants.length; i++) {
				var plant = app.player.plants[i];
				if(data.id==plant.id){
					if(target){
						plant.position = target;
					}
				}
			}

			// re-arrange plants
			// e.target.appendChild(target_element);
			app.arrangePlants();
		}
	}
}
function allowDrop(e){
	e.preventDefault();
}

// ===========