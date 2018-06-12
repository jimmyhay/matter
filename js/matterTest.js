var objects = [];
var Engine, World, Bodies;

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
	var ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight-5, window.innerWidth, 10, { isStatic: true, friction: 0});
	var leftWall = Bodies.rectangle(5, window.innerHeight/2, 10, window.innerHeight, { isStatic: true, friction: 0});
	var rightWall = Bodies.rectangle(window.innerWidth-5, window.innerHeight/2, 10, window.innerHeight, { isStatic: true, friction: 0});

	var paperGround = new paper.Path.Rectangle(new paper.Point(0, window.innerHeight-10), new paper.Size(window.innerWidth, 10));
	var paperLeft = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(10, window.innerHeight));
	var paperRight = new paper.Path.Rectangle(new paper.Point(window.innerWidth-10, 0), new paper.Size(10, window.innerHeight));

	paperGround.selected = paperLeft.selected = paperRight.selected = false;
	paperGround.fillColor = paperLeft.fillColor = paperRight.fillColor = '#ff0000';

	// add all of the bodies to the world
	World.add(engine.world, [ground, leftWall, rightWall]);

	for (var i=0;i<objects.length;i++) {
		World.add(engine.world, objects[i].matterBody);
	}

	// run the engine
	Engine.run(engine);

	paper.view.onMouseDrag = function(event) {
		var newObj = createNewBox(event.point.x,event.point.y);

		objects.push(newObj);

		World.add(engine.world, newObj.matterBody);
	}

	paper.view.onFrame = function (event) {
		var object;
		var newRot;

		for (var i=0;i<objects.length;i++) {
			object = objects[i];
			//console.log(object.matterBody.position);
			object.position = new paper.Point(object.matterBody.position.x, object.matterBody.position.y);
			//if (object.rotation != object.matterBody.angle * (180/Math.PI)) object.rotation = object.matterBody.angle * (180/Math.PI);
			//console.log(object.prevRot - object.matterBody.angle * (180/Math.PI));
			object.newRot = (object.matterBody.angle * (180/Math.PI)) - object.prevRot;
			//console.log((object.matterBody.angle * (180/Math.PI)));
			//console.log(object.newRot);
			//console.log(object.newRot);
			object.rotate(object.newRot);
			object.prevRot = (object.matterBody.angle * (180/Math.PI));
			//object.rotate(object.matterBody.angle * (180/Math.PI));
		}
	}
});

function createNewBox(posX, posY) {
	var point = new paper.Point(posX, posY);
	var size = Math.ceil(Math.random() * 100);
	var path = new paper.Path.Circle(point, size);
	//path.rotation = 130;
	path.selected = true;
	path.fillColor = '#ffff00';
	//path.strokeWidth = 2;
	//path.strokeColor = 'red';
	path.prevRot = 0;
	path.matterBody = Bodies.circle(point.x, point.y, size, {friction: .8, restitution: 1});

	return path;
}
