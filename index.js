$(document).ready(function () {

  let allTabs = document.getElementsByClassName("tab");
  const tab1 = document.getElementsByClassName("tab-1")[0];
  const tab2 = document.getElementsByClassName("tab-2")[0];
  const tab3 = document.getElementsByClassName("tab-3")[0];
  let tabContents = document.getElementsByClassName("tab-content");
  let rrIndex = document.getElementById("rrIndex");
  let rrFullRecipe = document.getElementById("rrFullRecipe");
  let rrRecipeBox = document.getElementById("rrRecipeBox");

  /* page tabs */
  tab1.classList.add("activeButton");

  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].addEventListener("click", function () {
      for (let i = 0; i < allTabs.length; i++) {
        tabContents[i].classList.remove("active-tab");
        allTabs[i].classList.remove("activeButton");
      }
      tabContents[i].classList.add("active-tab"); /* add class to current tab content */
      allTabs[i].classList.add("activeButton"); /* add class to current tab */
      tab3.style.boxShadow = "none";
    });
  } /* end page tabs */

  let searchIngredients = document.getElementById("searchIngredients"); /* text field */
  let searchFood = document.getElementById("searchFood"); /* text field */
  let submit = document.getElementById("submit");
  let resultsBox = document.getElementById("results");
  let groceryListContainer = document.getElementById("groceryListContainer");

  getRecipe(); /* preload some search results */

  submit.addEventListener("click", getRecipe); /* search button */

  /* Pull in info from API */
  function getRecipe() {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://recipe-puppy.p.rapidapi.com/?i=" + searchIngredients.value + "&q=" + searchFood.value,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
        "x-rapidapi-key":  recipePuppyAPI
      }
    }

    $.ajax(settings).done(function (response) {
      displayRecipes(response);
    });
  } /* end of getRecipe function */

  /* 1st Tab - "Looking for a Recipe?" */
  function displayRecipes(searchedIngredients) {
    let answer = searchedIngredients;
    let newAnswer = JSON.parse(answer);

    resultsBox.innerHTML = ""; /* clear previous food result boxes */

    /* create food blocks */
    for (let i = 0; i < newAnswer.results.length; i++) {
      let recipeListing = document.createElement("div");
      recipeListing.classList.add("food-block");
      recipeListing.innerHTML = "<div class='food-image'></div>";
      resultsBox.append(recipeListing);

      /* insert food background image ('background-size' property is set to 'cover' so each food image will be the same size) */
      $(".food-image").eq($(this).index()).css({
        "background-image": "url('" + newAnswer.results[i].thumbnail + "')"
      });

      /* insert food title, recipe link, and 'add to grocery list' button into each food block */
      recipeListing.innerHTML += "<div class='food-title-and-link'><span class='food-title'>" + newAnswer.results[i].title + "</span><br>" + "<a href='" + newAnswer.results[i].href + "' target='_blank'>Full Recipe</a> <div class='add-to-grocery-list'><img class='plus-sign' src='images/addTo.svg'><span id='addGlistWords'>Add Ingredients to Grocery List</span></div></div>";

      /* adding ingredients to grocery list */
      let currentGroceryItem = document.getElementsByClassName("add-to-grocery-list")[i];

      currentGroceryItem.addEventListener("click", function () {
        /* split ingredients list returned from API and create individual bullets */
        let splitIngredientsList = newAnswer.results[i].ingredients.split(",");
        let bulletedList = "";

        /* create bulleted list */
        for (let i = 0; i < splitIngredientsList.length; i++) {
          bulletedList += "<div class='ingredient-list-entry'><span>&#8226; </span>" + splitIngredientsList[i] + "<input class='quantity-field' placeholder='QTY' type='text'><img class='remove-ingredient' src='images/xCloseButton.svg'></div>";
        }

        /* add bulleted list to grocery list page and link the dish title to its web page  */
        groceryListContainer.innerHTML += "<div class='grocery-list-entry'><strong>" + "<a href='" + newAnswer.results[i].href + "' target='_blank'>" + newAnswer.results[i].title + "</a>" + ":</strong><br>" + bulletedList + "<br><span class='remove-item'>remove item</span></div>";

        /* grocery cart tab glows when items are added */
        tab3.style.boxShadow = "0px -2px 5px 0px rgba(255,255,255,1)";

        /* grocery cart tab bounces for 1 second when items are added */
        tab3.classList.add("tab-bounce");
        setTimeout(function() { 
          tab3.classList.remove("tab-bounce") 
        }, 1000);

        /* removing items from a grocery list */
        let removeItem = document.getElementsByClassName("remove-item");
        removeItemOrIngredient(removeItem);

        /* removing ingredients from a grocery list */
        let removeIngredientItem = document.getElementsByClassName("remove-ingredient");
        removeItemOrIngredient(removeIngredientItem);

      }); /* end click event */
    } /* end of for loop */
  } /* end of displayRecipe fx */

  /* function for removing grocery items or ingredients from the list */
  function removeItemOrIngredient(itemToBeRemoved) {
    for (let i = 0; i < itemToBeRemoved.length; i++) {
      itemToBeRemoved[i].addEventListener("click", function () {
        if (itemToBeRemoved[i].classList.contains("remove-ingredient")) {
          $('.ingredient-list-entry').eq(i).fadeOut(400); /* remove ingredient */
        } else {
          $('.grocery-list-entry').eq(i).fadeOut(400); /* remove grocery item */
        }
      });
    }
  }

  /* download/print PDF of grocery list (print settings specified in CSS print media query) */
  let exportPDF = document.getElementById("exportPDF");

  exportPDF.addEventListener("click", printPage);

  /* function for printing the screen */
  function printPage() {
    window.print();
  }

  /* massive array of R + R Recipe objects ********************************************************/
  let newRRlist;
  let goLeft;
  let goRight;

  let rrRecipeList = [

    {
      recipePic: "images/frenchOnionSoup.jpg",
      recipeName: "French Onion Soup",
      servings: "Serves 12-16",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>3 large sweet onions, sliced thin</li>",
        "<li class='recipeILines'>3 tbsp Stonewall Kitchen Extra Virgin Olive Oil</li>",
        "<li class='recipeILines'>5 cups (42 oz.) beef broth</li>",
        "<li class='recipeILines'>1/2 tsp salt</li>",
        "<li class='recipeILines'>1/2 tsp pepper</li>",
        "<li class='recipeILines'>3/4 cup Stonewall Kitchen Roasted Onion Jam</li>",
        "<li class='recipeILines'>1 loaf French bread cut into 1 inch slices, toasted</li>",
        "<li class='recipeILines'>4-6 oz Gruyere, Swiss or Provolone cheese, grated</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Over medium heat, warm oil in a large stockpot or Dutch oven.</li>",
        "<li class='recipeDirLines'>2. Add onions and cook for 15 minutes, stirring occasionally, until lightly browned.</li>",
        "<li class='recipeDirLines'>3. Reduce heat to low and let simmer, stirring occasionally.</li>",
        "<li class='recipeDirLines'>4. Cook for 35-45 minutes until  &nbsp;are a deep golden brown.</li>",
        "<li class='recipeDirLines'>5. And Roasted Garlic Onion Jam, broth, salt and pepper and bring to boil. Reduce heat to low and simmer for 20-25 minutes.</li>",
        "<li class='recipeDirLines'>6. Ladle soup into 4 heat proof bowls. Top with toasted bread slices and grated cheese.</li>",
        "<li class='recipeDirLines'>7. Broil 2-3 minutes until cheese is bubbly and browned.</li>",
        "<li class='recipeDirLines'>8. Garnish, if desired, with fresh chives, parsley or thyme.</li></ul>"
      ],
      recipeSource: "<u>Source:</u> Stonewall Kitchen"
    },

    {
      recipePic: "images/porkchopMarsala.jpg",
      recipeName: "Pork Chops Marsala",
      servings: "Serves 8",
      prepTime: "<u>Prep Time:</u> 10 minutes",
      cookTime: "<u>Cook Time:</u> 35 minutes",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>3/4 cup Italian bread crumbs</li>",
        "<li class='recipeILines'>1/2 cup flour</li>",
        "<li class='recipeILines'>1/2 cup grated Parmesan cheese</li>",
        "<li class='recipeILines'>8 boneless pork chops, cut 1/2 inch thick</li>",
        "<li class='recipeILines'>1/4 cup olive oil</li>",
        "<li class='recipeILines'>1-1/2 cups Marsala wine or apple juice</li>",
        "<li class='recipeILines'>1-1/2 tbsp Butter</li>",
        "<li class='recipeILines'>2 (8-oz.) pkg. sliced fresh mushrooms</li>",
        "<li class='recipeILines'>1/4 cup chopped fresh Italian parsley</li>",
        "<li class='recipeILines'>Freshly grated Parmesan cheese (optional)</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Stir together bread crumbs, flour, 1/2 cup Parmesan cheese, and salt and pepper to taste; dredge pork chops in mixture.</li>",
        "<li class='recipeDirLines'>2. In a large skillet over medium-high heat, brown pork chops in hot oil. Cook in batches for 3 to 5 minutes on each side or until done; reserve drippings in skillet. Remove from skillet; keep warm.</li>",
        "<li class='recipeDirLines'>3. Add wine and butter to skillet, stirring to loosen browned particles. Add mushrooms and bring to a boil; reduce heat and simmer 15 minutes or until tender. Serve over pork; sprinkle with parsley. Top with freshly grated Parmesan cheese, if desired.</li></ul>"
      ],
      perServing: [
        "<u>Per Serving:</u></br>549 calories, 19g carbohydrates, 42g protein, 30g fat, 1g fiber, 122mg cholesterol, 454mg sodium"
      ],
      recipeSource: "<u>Source:</u> Shop Rite"
    },

    {
      recipePic: "images/chickenSorrento.jpg",
      recipeName: "Chicken Sorrento",
      servings: "Serves 4",
      cookTime: "<u>Cook Time:</u> 15 minutes",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>4 boneless, skinless chicken breast halves (about 5 oz each)</li>",
        "<li class='recipeILines'>1/4 tsp salt</li>",
        "<li class='recipeILines'>1/8 tsp pepper</li>",
        "<li class='recipeILines'>2 tsp olive oil</li>",
        "<li class='recipeILines'>1 bottle (8 oz) creamy Italian dressing</li>",
        "<li class='recipeILines'>1 bag (16 oz) frozen stir-fry vegetable blend</li>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Sprinkle chicken with salt and pepper.</li>",
        "<li class='recipeDirLines'>2. Heat the oil in a large nonstick skillet over medium-high heat. Add Chicken; cook 2 minutes on each side, or until golden.</li>",
        "<li class='recipeDirLines'>3. Pour dressing on chicken; turn to coat. Cover, reduce heat and simmer 5 minutes.</li>",
        "<li class='recipeDirLines'>4. Add frozen vegetables, cover and cook 5 minutes, or until chicken is cooked through and vegetables are crisp-tender.</li></ul>"
      ],
      perServing: [
        "<u>Per Serving:</u></br>409 calories, 15g carbohydrates, 35g protein, 22g fat (3g sat fat), 3g fiber, 82mg cholesterol, 748mg sodium"
      ],
      recipeSource: "<u>Source:</u> Women's Day"
    },

    {
      recipePic: "images/blackenedSkirtSteak.jpg",
      recipeName: "Blackened skirt steak with cheddar-sage mashed potatoes",
      servings: "Serves 4",
      prepTime: "<u>Prep Time:</u> 4 minutes",
      cookTime: "<u>Cook Time:</u> 10 minutes",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>1 tsp pepper</li>",
        "<li class='recipeILines'>1 tsp paprika</li>",
        "<li class='recipeILines'>1 tsp garlic powder</li>",
        "<li class='recipeILines'>1/2 tsp dried thyme</li>",
        "<li class='recipeILines'>1/4 tsp salt</li>",
        "<li class='recipeILines'>1 lb skirt steak, cut into 4 equal pieces</li>",
        "<li class='recipeILines'>1 tbsp oil</li>",
        "<li class='recipeILines'>1-1/3 cups milk</li>",
        "<li class='recipeILines'>1 tsp dried sage</li>",
        "<li class='recipeILines'>2-2/3 cups frozen mashed potatoes</li>",
        "<li class='recipeILines'>1/2 cup shredded cheddar</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Combine pepper, paprika, garlicpowder, thyme and salt. Rub mixture on steak. Heat oil in large skillet over high heat. Add steak; cook 2 minutes on each side for medium-rare.</li>",
        "<li class='recipeDirLines'>2. Meanwhile, make Cheddar-sage Potatoes: Heat milk and sage in a medium saucepan over medium-high heat. Stir in frozen potatoes and cook, stirring occasionally. 4 minutes or until hot. Remove from heat: stir in cheese.</li></ul>"
      ],
      perServing: [
        "<u>Per Serving:</u></br>475 calories, 25g carbohydrates,30g protein, 27g fat (11g sat fat), 2g fiber, 94mg cholesterol, 714mg sodium"
      ],
      recipeSource: "<u>Source:</u> Women's Day"
    },

    {
      recipePic: "images/oatmealRaisinCookies.jpg",
      recipeName: "Vanishing Oatmeal Raisin Cookies",
      cookTime: "<u>Bake Time:</u> 10-12 minutes",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>1/2 lb (2 sticks) Softened Butter</li>",
        "<li class='recipeILines'>1 cup firmly packed brown sugar</li>",
        "<li class='recipeILines'>1/2 cup granulated sugar</li>",
        "<li class='recipeILines'>2 eggs</li>",
        "<li class='recipeILines'>1 tsp vanilla</li>",
        "<li class='recipeILines'>1-1/2 cups All-purpose flour</li>",
        "<li class='recipeILines'>1 tsp baking soda</li>",
        "<li class='recipeILines'>1 tsp ground cinnamon</li>",
        "<li class='recipeILines'>1/2 tsp salt</li>",
        "<li class='recipeILines'>3 cups Quaker Oats</li>",
        "<li class='recipeILines'>1 cup raisins</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Mix butter and sugar.</li>",
        "<li class='recipeDirLines'>2. Add eggs and vanilla.</li>",
        "<li class='recipeDirLines'>3. Beat well in mixer.</li>",
        "<li class='recipeDirLines'>4. Add flour, baking soda, cinnamon and salt.</li>",
        "<li class='recipeDirLines'>5. Beat well in mixer.</li>",
        "<li class='recipeDirLines'>6. Add oats and raisins.</li>",
        "<li class='recipeDirLines'>7. Place spoon size balls of dough on cookie sheet.</li>",
        "<li class='recipeDirLines'>8. Cook in oven for 10-12 minutes at 350&#176;F.</li>",
        "<li class='recipeDirLines'>9. Let cool for 1 minute before serving.</li></ul>"
      ],
      recipeSource: "<u>Source:</u> Quaker Oats"
    },

    {
      recipePic: "images/beefMushroomStew.jpg",
      recipeName: "Steak and Mushroom Stew",
      servings: "Serves 6-8",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>6 oz thick-cut bacon, diced</li>",
        "<li class='recipeILines'>3-1/2 - 4 lb chuck roast, cut into 1 inch cubes</li>",
        "<li class='recipeILines'>Kosher salt</li>",
        "<li class='recipeILines'>Freshly ground pepper</li>",
        "<li class='recipeILines'>2 small onions, diced</li>",
        "<li class='recipeILines'>2 carrots, peeled and diced</li>",
        "<li class='recipeILines'>2 celery stalks, diced</li>",
        "<li class='recipeILines'>3 garlic cloves, minced</li>",
        "<li class='recipeILines'>1 tbsp tomato paste</li>",
        "<li class='recipeILines'>3/4 lb cremini mushrooms, sliced</li>",
        "<li class='recipeILines'>1 tbsp veal demi-glace</li>",
        "<li class='recipeILines'>3 tbsp Dijon Mustard</li>",
        "<li class='recipeILines'>1-1/2 cups beef broth</li>",
        "<li class='recipeILines'>1/4 cup finely chopped fresh flat leaf parsley</li>",
        "<li class='recipeILines'>Creme fraiche mashed potatoes</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. In a stovetop-safe insert of slow cooker over medium-high heat, cook bacon 10-11 minutes.</li>",
        "<li class='recipeDirLines'>2. Drain on paper towels. Pour Bacon fat into a bowl.</li>",
        "<li class='recipeDirLines'>3. Season beef with salt and pepper. Return insert to medium-high heat; warm 2 Tbsp bacon fat. Brown beef in batches 8-10 minutes; transfer to bowl.</li>",
        "<li class='recipeDirLines'>4. Reduce heat to medium; warm 1 Tbsp bacon fat. Cook onions, carrots and celery 10 minutes.</li>",
        "<li class='recipeDirLines'>5. Add garlic and tomato paste; cook 1 minute.</li>",
        "<li class='recipeDirLines'>6. Add mushrooms, saute 10-12 minutes.</li>",
        "<li class='recipeDirLines'>7. Stir in demi-glace, mustard, beef, bacon, broth, salt and pepper.</li>",
        "<li class='recipeDirLines'>8. Bring to simmer; transfer insert to slow-cooker base. Cover and cook on high 4 hours.</li>",
        "<li class='recipeDirLines'>9. Skim off fat. Stir in parsley.</li>",
        "<li class='recipeDirLines'>10. Serve with creme fraiche mashed potatoes.</li></ul>"
      ],
    },

    {
      recipePic: "images/tilapiaQuesadillaWedges.jpg",
      recipeName: "Tilapia Quesadilla Wedges",
      servings: "Serves 8",
      prepTime: "<u>Prep Time:</u> 20 minutes",
      cookTime: "<u>Cook Time:</u> 15 minutes",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>3/4 cup flour</li>",
        "<li class='recipeILines'>1 tbsp ground cumin</li>",
        "<li class='recipeILines'>1 tbsp chili powder</li>",
        "<li class='recipeILines'>1 tsp cayenne or ground pepper</li>",
        "<li class='recipeILines'>1-1/2 lbs tilapia fillets</li>",
        "<li class='recipeILines'>2 eggs, lightly beaten</li>",
        "<li class='recipeILines'>1/4 cup olive oil</li>",
        "<li class='recipeILines'>2/3 cup chopped tomatoes</li>",
        "<li class='recipeILines'>2 tbsp fresh lime juice</li>",
        "<li class='recipeILines'>8 flour tortillas (8-inch)</li>",
        "<li class='recipeILines'>2 cups shredded Monterey Jack cheese with jalapenos (8 oz)</li>",
        "<li class='recipeILines'>Salsa, sour cream (optional)</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Combine flour, cumin, chili powderand cayenne in a pie plate. Dip fillets in eggs, then coat in flour mixture.</li>",
        "<li class='recipeDirLines'>2. In a large skillet, saute fillets inhot oil over medium-high heat 4 to 6 minutes per side or until fish flakes easily with a fork. Drain on paper towels; flake fish.</li>",
        "<li class='recipeDirLines'>3. Combine fish, tomatoes and lime juice in a medium bowl. Place fish mixture on the center of each tortilla; sprinkle with cheese. Fold tortilla over to completely enclose filling.</li>",
        "<li class='recipeDirLines'>4. Coat a large skillet with nonstick cooking spray. Cook 1 or 2 quesadillas at time on medium-high heat 2 to 3 minutes per side until crisp and lightly browned.</li>",
        "<li class='recipeDirLines'>5. Cut each quesadilla into thirds. Serve warm with salsa and sour cream, if desired.</li></ul>"
      ],
      perServing: [
        "<u>Per Serving:</u></br>675 calories, 37g carbohydrates,77g protein, 24g fat (8g sat fat),1g fiber, 140mg cholesterol, 665mg sodium, 0g omega3"
      ]
    },


    {
      recipePic: "images/crustyGarlicBread.jpg",
      recipeName: "Crusty Garlic Bread",
      servings: "Makes 10 slices",
      prepTime: "<u>Prep Time:</u> 15 minutes",
      cookTime: "<u>Cook Time:</u> 10-15 minutes",
      RRingredients: ["<ul class='recipeI'><li class='recipeIHeader'><u>Ingredients:</u></li>",
        "<li class='recipeILines'>2 cloves garlic, minced</li>",
        "<li class='recipeILines'>1 tsp chopped fresh parsley</li>",
        "<li class='recipeILines'>2 tsp dried thyme</li>",
        "<li class='recipeILines'>3/4 tsp dried marjoram</li>",
        "<li class='recipeILines'>1/2 tsp paprika</li>",
        "<li class='recipeILines'>2 small loaves (4 oz) Italian or French bread</li></ul>"
      ],
      directions: [
        "<ul class='recipeDir'><li class='recipeDHeader'><u>Directions:</u></li>",
        "<li class='recipeDirLines'>1. Preheat oven to 350&#176;F. In a small bowl, combine the garlic an oil; mix well.</li>",
        "<li class='recipeDirLines'>2. In another small bowl, combine parsley, thyme, marjoram and paprika. Add Parmesan; mix well.</li>",
        "<li class='recipeDirLines'>3. Cut each loaf crosswise into diagonal slices, without cutting all the way through. Brush cut sides of slices with garlic oil. Sprinkle herb mixture between slices. Wrap each loaf in foil place on a baking sheet.</li>",
        "<li class='recipeDirLines'>4. Bake until heated through, about 10-15 minutes. Unwrap loaves and place them on a bread board or in a basket. Serve Immediately.</li></ul>"
      ],
      perServing: "<u>Per Serving:</u></br> 72 calories (20% from fat), 12g carbohydrates, 2g protein, 1g fat, 0g fiber, 0g cholesterol, 139mg sodium",
    }
  ];

  /* function for 'R + R Recipes' tab ************************************************/
  recipeIndexPage(rrRecipeList);

  function recipeIndexPage(list) {

    newRRlist = list;

    for (let i = 0; i < newRRlist.length; i++) {
      let ourListing = document.createElement("div");
      ourListing.classList.add("food-block2"); /* create food blocks on the second tab */
      ourListing.innerHTML = "<div class='food-image2'></div>";
      rrIndex.append(ourListing);

      /* insert food background image ('background-size' property is set to 'cover' so each food image will be the same size) */
      $(".food-image2").eq($(this).index()).css({
        "background-image": "url('" + newRRlist[i].recipePic + "')"
      });

      /* insert food title, recipe link, and 'add to grocery list' button */
      ourListing.innerHTML += "<div class='food-title-and-link2'><span class='food-title2'>" + newRRlist[i].recipeName + "</span><br><span class='recipeBookmark'>Full Recipe</span></div>";

    }

    let fullRecipeLink = document.getElementsByClassName("recipeBookmark");


    /* create links to full recipes */
    for (let i = 0; i < fullRecipeLink.length; i++) {
      fullRecipeLink[i].addEventListener("click", function () {
        displayRecipeSlide(i);
      });
    }

    /* R + R Full Recipe slider ********************************************************/

    function displayRecipeSlide(number) {
      rrRecipeBox.style.display = 'block' /* display slider */
      rrIndex.style.display = 'none' /* hide individual food blocks */
      for (let i = 0; i < FullRecipePage.length; i++) {
        if (number !== i) {
          FullRecipePage[i].style.display = 'none'
        } else {
          FullRecipePage[i].style.display = 'block'
        }
      }
    }

    const goLeft = document.getElementById("goLeft");
    const goRight = document.getElementById("goRight");

    goLeft.addEventListener("click", goToTheLeft);
    goRight.addEventListener("click", goToTheRight);

    FullRecipePage = document.getElementsByClassName("FullRecipePage");

    let currentSlide = 0;

    function goToTheLeft() {
      currentSlide = currentSlide - 1;
      if (currentSlide < 0) {
        currentSlide = FullRecipePage.length - 1;
      }
      displayRecipeSlide(currentSlide);
    }

    function goToTheRight() {
      currentSlide = currentSlide + 1
      if (currentSlide > FullRecipePage.length - 1) {
        currentSlide = 0;
      }
      displayRecipeSlide(currentSlide);
    }

  }

  function recipeStructure(justArecipe) {
    let currentPage = 0;
    let FullRecipePage = document.getElementsByClassName("FullRecipePage")[0];
    let FullRecipeImage = document.getElementsByClassName("FullRecipeImage")[0];
    let FullRecipeTitle = document.getElementsByClassName("FullRecipeTitle")[0];
    let FullRecipeServesNum = document.getElementsByClassName("FullRecipeServesNum")[0];
    let FullRecipePrepTime = document.getElementsByClassName("FullRecipePrepTime")[0];
    let FullRecipeCookTime = document.getElementsByClassName("FullRecipeCookTime")[0];
    let FullRecipeIngredients = document.getElementsByClassName("FullRecipeIngredients")[0];
    let FullRecipeDirections = document.getElementsByClassName("FullRecipeDirections")[0];
    let FullRecipePerServing = document.getElementsByClassName("FullRecipePerServing")[0];
    let FullRecipeSource = document.getElementsByClassName("FullRecipeSource")[0];

    /* Loop through all recipes and print the information for each one */
    for (let i = 0; i < justArecipe.length; i++) {
      let indyRecipe = document.createElement("div");
      rrFullRecipe.append(indyRecipe);
      indyRecipe.classList.add("FullRecipePage");
      indyRecipe.id = i;

      let indyImage = document.createElement("div");
      indyImage.style.backgroundColor = "#0f0f0f";
      indyRecipe.append(indyImage);
      indyImage.classList.add("FullRecipeImage");
      indyImage.style.backgroundImage = "url(" + justArecipe[i].recipePic + ")";
      indyImage.style.backgroundPosition = "center";
      indyImage.style.backgroundRepeat = "no-repeat";
      indyImage.style.backgroundSize = "cover";

      let indyTitle = document.createElement("div");
      indyTitle.style.color = "#772001";
      indyRecipe.append(indyTitle);
      indyTitle.classList.add("FullRecipeTitle");
      indyTitle.innerHTML = justArecipe[i].recipeName;

      let indyServesNum = document.createElement("div");
      indyServesNum.style.color = "#772001";
      indyRecipe.append(indyServesNum);
      indyServesNum.classList.add("FullRecipeServesNum");
      if (justArecipe[i].servings) {
        indyServesNum.innerHTML = justArecipe[i].servings;
      } else {
        indyServesNum.style.display = "none";
      };

      let indyPrep = document.createElement("div");
      indyPrep.style.color = "#772001";
      indyRecipe.append(indyPrep);
      indyPrep.classList.add("FullRecipePrepTime");
      if (justArecipe[i].prepTime) {
        indyPrep.innerHTML = justArecipe[i].prepTime;
      } else {
        indyPrep.style.display = "none";
      }

      let indyCook = document.createElement("div");
      indyCook.style.color = "#772001";
      indyRecipe.append(indyCook);
      indyCook.classList.add("FullRecipeCookTime");
      if (justArecipe[i].cookTime) {
        indyCook.innerHTML = justArecipe[i].cookTime;
      } else {
        indyCook.style.display = "none";
      }

      for (let j = 0; j < justArecipe[i].RRingredients.length; j++) {
        let indyIngred = document.createElement("div");
        indyIngred.style.color = "#772001";
        indyRecipe.append(indyIngred);
        indyIngred.classList.add("FullRecipeIngredients");
        indyIngred.innerHTML += justArecipe[i].RRingredients[j];
      }

      for (let k = 0; k < justArecipe[i].directions.length; k++) {
        let indyDir = document.createElement("div");
        indyDir.style.color = "#772001";
        indyRecipe.append(indyDir);
        indyDir.classList.add("FullRecipeDirections");
        indyDir.innerHTML += justArecipe[i].directions[k];
      }

      let indyCalc = document.createElement("div");
      indyCalc.style.color = "#772001";
      indyRecipe.append(indyCalc);
      indyCalc.classList.add("FullRecipePerServing");
      if (justArecipe[i].perServing) {
        indyCalc.innerHTML = justArecipe[i].perServing;
      } else {
        indyCalc.style.display = "none";
      }

      let indySource = document.createElement("div");
      indySource.style.color = "#772001";
      indyRecipe.append(indySource);
      indySource.classList.add("FullRecipeSource");
      if (justArecipe[i].recipeSource) {
        indySource.innerHTML = justArecipe[i].recipeSource;
      } else {
        indySource.style.display = "none";
      }

      let pdfButton = document.createElement("div");
      pdfButton.innerHTML = "Export / Print PDF";
      indyRecipe.append(pdfButton);
      pdfButton.classList.add("rrPDFbutton");
      let rrPDFbutton = document.getElementsByClassName("rrPDFbutton");
      pdfButton.addEventListener("click", printPage); /* fire print page function */
    };

    /* slider back button */
    let backButton = document.getElementById("back-button");

    backButton.addEventListener("click", goBack);

    function goBack() {
      rrRecipeBox.style.display = 'none';
      rrIndex.style.display = 'flex';
    }

    function hideAllRecipes() {
      rrRecipeBox.style.display = 'none'
    }

    window.onload = hideAllRecipes();
  }

  recipeStructure(rrRecipeList)

}); /* end of getRecipe fx */
