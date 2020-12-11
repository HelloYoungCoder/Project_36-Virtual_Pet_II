// Project 36: Virtual Pet - II

//Create variables here
var database;
var dog, happyDog, foodA, foodStock;
var dogImg, happyDogImg;

//To create buttons
var feedPet, addFood;

//To access food class
var foodObj;

//Feeding status
var fedTime, lastFed;

//Load images for dog
function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/happyDogImg.png")
}

function setup() {
  createCanvas(700, 500);
  
  //Configure database
  database = firebase.database();

  //Create dog sprite
  dog = createSprite(350, 300);
  dog.addImage(dogImg);
  dog.scale = 0.25;

  //Ref: a specific location in your Database & used it for reading or writing data to that Database location.
  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  //DOM
  var title = createElement('h2');
  title.html("VIRTUAL PET - II");
  title.position(280, 70);

  feedFood = createButton("Click Here to Feed");
  feedFood.position(70, 150);
  feedFood.mousePressed(feedDog);
  feedFood.mouseReleased(changeImg);

  addFood = createButton("Click Here to Add Food");
  addFood.position(430, 150);
  addFood.mousePressed(addFoods);

  //To access food class
  foodObj = new Food();

}


function draw() {  

  background(106, 118, 138);

  drawSprites();

  textSize(15);
  fill("cream");
  textFont("Trebuchet MS");
  
  //To display food
  foodObj.display();
  
  //To access the feed time
  fedTime = database.ref('feed_time');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });
  
  //To display the last feed time
  if (lastFed !== undefined){

    var xPos, yPos;
    xPos = 520;
    yPos = 470;

    if (lastFed >= 12) {
      text("Last Feed : " + lastFed%12 + " PM", xPos, yPos);
    } else if(lastFed === 0) {
      text("Last Feed :  12 AM", xPos, yPos);
    } else {
      text("Last Feed : " + lastFed + " AM", xPos, yPos);
    }
  } 
}

//To read the food stock
function readStock(data) {
  foodServe = data.val();
  foodObj.updateFoodStock(foodServe);
}

//To add food in stock
function addFoods() {
  foodServe++;
  database.ref('/').update({
    'food': foodServe
  })
}

//To update food stock & last fed time
function feedDog() {
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    'food': foodObj.getFoodStock(),
    'feed_time': hour()
  });
}

//To change the dog image
function changeImg() {
  dog.addImage(dogImg);
}
