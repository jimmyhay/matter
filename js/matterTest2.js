var objects = [];
var Engine, World, Bodies;
var currentObj = null;

$(document).ready(function() {
	var canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');

  canvas.width = window.innerWidth; //document.width is obsolete
  canvas.height = window.innerHeight; //document.height is obsolete

	paper.setup(canvas);

	var background = new paper.Path.Rectangle(new paper.Point(0,0), new paper.Size(paper.view.size.width, paper.view.size.height));

	background.fillColor = '#ffc8c8';

	// module aliases
	Engine = Matter.Engine;
	World = Matter.World;
	Bodies = Matter.Bodies;

	// paper objects
	objects.push(createNewBox(100,100));

	// create an engine
	var engine = Engine.create();

	//var boxB = Bodies.rectangle(450, 50, 80, 80, {friction: 0});
	//var circleA = Bodies.circle(250, 50, 80);
	//var ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight-5, window.innerWidth, 10, { isStatic: true, friction: 0});
	var panel1 = Bodies.rectangle(window.innerWidth/2+50, 190, 400, 10, { isStatic: true, friction: 0, angle:.3});
	var panel2 = Bodies.rectangle(window.innerWidth/2+400, 500, 400, 10, { isStatic: true, friction: 0, angle:-.5});
	var panel3 = Bodies.rectangle(0, 305, 400, 10, { isStatic: true, friction: 0, angle:.5});
	var rod1 = Bodies.circle(window.innerWidth/2, window.innerHeight/2, 100, {isStatic: true, friction: 0});
	var leftWall = Bodies.rectangle(5, window.innerHeight/2, 10, window.innerHeight, { isStatic: true, friction: 0});
	var rightWall = Bodies.rectangle(window.innerWidth-5, window.innerHeight/2, 10, window.innerHeight, { isStatic: true, friction: 0});

	//var paperGround = new paper.Path.Rectangle(new paper.Point(0, window.innerHeight-10), new paper.Size(window.innerWidth, 10));
	var paperPanel1 = new paper.Path.Rectangle(new paper.Point(window.innerWidth/2-200+50, 190-5), new paper.Size(400, 10));
	var paperPanel2 = new paper.Path.Rectangle(new paper.Point(window.innerWidth/2-200+400, 500-5), new paper.Size(400, 10));
	var paperPanel3 = new paper.Path.Rectangle(new paper.Point(-200, 300), new paper.Size(400, 10));
	var paperRod1 = new paper.Path.Circle(new paper.Point(window.innerWidth/2, window.innerHeight/2), 100);
	var paperLeft = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(10, window.innerHeight));
	var paperRight = new paper.Path.Rectangle(new paper.Point(window.innerWidth-10, 0), new paper.Size(10, window.innerHeight));

	paperPanel1.rotate(.3*(180/Math.PI));
	paperPanel2.rotate(-.5*(180/Math.PI));
	paperPanel3.rotate(0.5*(180/Math.PI));

	paperRod1.selected = paperPanel1.selected = paperPanel2.selected=paperPanel3.selected=paperLeft.selected = paperRight.selected = false;
	paperRod1.fillColor = paperPanel1.fillColor = paperPanel2.fillColor=paperPanel3.fillColor=paperLeft.fillColor = paperRight.fillColor = '#ff0000';

	// add all of the bodies to the world
	World.add(engine.world, [panel1, panel2,panel3, rod1, leftWall, rightWall]);

	for (var i=0;i<objects.length;i++) {
		World.add(engine.world, objects[i].matterBody);
	}

	// run the engine
	Engine.run(engine);

	paper.view.onMouseDrag = function(event) {
		var newObj = createNewBox(event.point.x,event.point.y);

		objects.push(newObj);
		World.add(engine.world, newObj.matterBody);
		currentObj.position = new paper.Point(event.point.x,event.point.y);
	}

	paper.view.onMouseDown = function(event) {
		var newObj = createNewBox(event.point.x,event.point.y);
		newObj.applyMatrix = false;
		objects.push(newObj);
		currentObj = newObj;
		currentObjScale = 1;
	}

	paper.view.onMouseUp = function(event) {
		mouseDown = false;
		currentObj.matterBody = Bodies.circle(event.point.x, event.point.y, currentObj.bounds.height/2, {friction: .8, restitution: 1});
		World.add(engine.world, currentObj.matterBody);
		currentObj = null;
	}

	paper.view.onFrame = function (event) {
		var object;
		var newRot;

		console.log(engine.world.bodies.length);
		for (var i=0;i<objects.length;i++) {
			object = objects[i];

			if (object != currentObj) {
				object.position = new paper.Point(object.matterBody.position.x, object.matterBody.position.y);
				object.newRot = (object.matterBody.angle * (180/Math.PI)) - object.prevRot;
				object.rotate(object.newRot);
				object.prevRot = (object.matterBody.angle * (180/Math.PI));
			}

			if (object.position.y > window.innerHeight+object.bounds.height/2) {
				Matter.Composite.remove(engine.world, object.matterBody)
				object.remove();
				objects.splice(i, 1);
				i--;
			}
		}

		if (currentObj) {
			if (currentObj.bounds.height < 160) {
				currentObj.scale(1.025);
				//Matter.Body.setPosition(currentObj.matterBody, {x:event.point.x,y:event.point.y});
				//Matter.Body.scale(currentObj.matterBody, 1.1, 1.1);
			}
		}
	}
});

function createNewBox(posX, posY) {
	var point = new paper.Point(posX, posY);
	var size = Math.ceil(Math.random() * 30);
	var path = new paper.Path.Circle(point, size);
	//path.rotation = 130;
	//path.selected = true;
	path.fillColor = '#ffff00';
	//path.strokeWidth = 2;
	//path.strokeColor = 'red';
	path.prevRot = 0;
	path.matterBody = Bodies.circle(point.x, point.y, size, {friction: .8, restitution: 1});

	return path;
}
