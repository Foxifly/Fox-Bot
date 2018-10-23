module.exports = {
  tacoShells: ["soft corn shell", "hard corn shell", "soft flour shell", "hard flour shell"],
  tacoMeats: ["chorizo", "grilled chicken", "shredded chicken", "carnitas", "pork", "veggie", "steak", "carne asada", "beef", "shredded beef"],
  tacoCheeses: ["feta", "swiss", "cheddar", "ricotta", "Mozzarella", "spicy cheddar", "monterey jack"],
  tacoToppings: ["lettuce", "sour cream", "tomato", "spicy salsa", "mild salsa", "pico", "white rice", "brown rice", "avocado", "guacamole"],
  tacoString: "",
  tacoBuilder: function () {
    const shell = this.tacoShells[Math.floor(Math.random() * this.tacoShells.length)],
      meat = this.tacoMeats[Math.floor(Math.random() * this.tacoMeats.length)],
      cheese = this.tacoCheeses[Math.floor(Math.random() * this.tacoCheeses.length)],
      topping = this.tacoToppings[Math.floor(Math.random() * this.tacoToppings.length)];
    this.tacoString = `Here's your ${shell} ${meat} taco with ${cheese} cheese and ${topping}!`;
  },

  burgerBun: ["a sesame seed bun", "a ciabatta roll", "a pretzel roll", "a onion bun", "sliced bread", "an english mufin", "a brioche bun"],
  burgerMeat: ["turkey", "beef", "veggie", "steak"],
  burgerCheese: ["cheddar", "colby", "feta", "swiss", "provolone", "monterey jack", "american"],
  burgerCondiments: ["ketchup", "mustard", "mayo"],
  burgerVeggies: ["lettuce", "tomato", "onions", "avocado", "pickles"],
  burgerString: "",
  burgerBuilder: function () {
    const bun = this.burgerBun[Math.floor(Math.random() * this.burgerBun.length)],
      meat = this.burgerMeat[Math.floor(Math.random() * this.burgerMeat.length)],
      cheese = this.burgerCheese[Math.floor(Math.random() * this.burgerCheese.length)],
      condiments = this.burgerCondiments[Math.floor(Math.random() * this.burgerCondiments.length)],
      veggies = this.burgerVeggies[Math.floor(Math.random() * this.burgerVeggies.length)];
    this.burgerString = `Here's your ${meat} buger on a ${bun} with ${cheese} cheese, ${condiments}, and ${veggies}!`;
  },

  pizzaSize: ["small", "medium", "large", "extra large"],
  pizzaCrust: ["stuffed", "thin", "thick", "thin and crispy", "deep dish", "original"],
  pizzaCrustSeasoning: ["garlic butter", "toasted parmesan", "butter", "asiago", "sesame seed", "ranch", "cajun"],
  pizzaSauce: ["extra marinara", "light marinara", "no sauce", "marinara", "creamy garlic parmesan", "extra creamy garlic parmesan", "light creamy garlic parmesan"],
  pizzaCheese: ["extra cheese", "no cheese", "cheese"],
  pizzaMeats: ["pepperoni", "italian sausage", "sausage", "meatball", "ham", "bacon", "grilled chicken", "beef", "pork"],
  pizzaVeggies: ["mushrooms", "spinach", "onions", "black olives", "green olives", "green bell peppers", "red bell peppers", "banana peppers", "pineapple", "tomatoes", "jalepeños"],
  pizzaString: "",
  pizzaBuilder: function () {
    const size = this.pizzaSize[Math.floor(Math.random() * this.pizzaSize.length)],
      crust = this.pizzaCrust[Math.floor(Math.random() * this.pizzaCrust.length)],
      seasoning = this.pizzaCrustSeasoning[Math.floor(Math.random() * this.pizzaCrustSeasoning.length)],
      sauce = this.pizzaSauce[Math.floor(Math.random() * this.pizzaSauce.length)],
      cheese = this.pizzaCheese[Math.floor(Math.random() * this.pizzaCheese.length)],
      meat = this.pizzaMeats[Math.floor(Math.random() * this.pizzaMeats.length)],
      veggie = this.pizzaVeggies[Math.floor(Math.random() * this.pizzaVeggies.length)];
    this.pizzaString = `Here's your ${size} ${crust} crust pizza with ${sauce}, ${cheese}, ${meat}, and ${veggie}!`;
  },

  pastaNoodles: ["fettuccine", "spaghetti", "rigatoni", "angel hair", "cavatappi", "rotini", "linguine"],
  pastaSauce: ["creamy spinach and artichoke", "creamy asiago garlic", "creamy mushroom", "traditional marinara", "five cheese marinara", "traditional meat sauce", "alfredo"],
  pastaMeat: ["garden veggies", "meatballs", "italian sausage", "crispy chicken", "grilled chicken", "crispy shrimp", "grilled shrimp"],
  pastaString: "",
  pastaBuilder: function () {
    const noodles = this.pastaNoodles[Math.floor(Math.random() * this.pastaNoodles.length)],
      sauce = this.pastaSauce[Math.floor(Math.random() * this.pastaSauce.length)],
      meat = this.pastaMeat[Math.floor(Math.random() * this.pastaMeat.length)];
    this.pastaString = `Here's your ${noodles} pasta noodles with a ${sauce} sauce and ${meat} and cheese on top!`;
  },

  sandwichBread: ["a flatbread", "wheat bread", "white bread", "whole grain bread", "toasted white bread", "toasted wheat bread", "toasted flatbread", "toasted whole grain bread"],
  sandwichMeat: ["chicken", "turkey", "tuna", "roast beef", "chicken salad", "egg salad", "ham", "salami", "pepperoni", "corned beef"],
  sandwichUpgrade: ["avocado", "guacamole", "bacon"],
  sandwichCondiment: ["mayo", "mustard", "ketchup", "pickles", "ranch"],
  sandwichTopping: ["lettuce", "tomato", "cucumber", "green peppers", "banana peppers", "onions"],
  sandwichString: "",
  sandwichBuilder: function () {
    const bread = this.sandwichBread[Math.floor(Math.random() * this.sandwichBread.length)],
      meat = this.sandwichMeat[Math.floor(Math.random() * this.sandwichMeat.length)],
      upgrade = this.sandwichUpgrade[Math.floor(Math.random() * this.sandwichUpgrade.length)],
      condiment = this.sandwichCondiment[Math.floor(Math.random() * this.sandwichCondiment.length)],
      topping = this.sandwichTopping[Math.floor(Math.random() * this.sandwichTopping.length)];
    this.sandwichString = `Here's your ${meat} sandwich on ${bread}. I also added ${upgrade}, ${condiment}, and ${topping}`;
  },

  bowlMeat: ["chicken", "steak", "barbacoa", "carnitas", "sofritas", "veggie", "chorizo"],
  bowlRice: ["white cilantro rice", "brown cilantro rice", "no rice"],
  bowlBeans: ["black beans", "pinto beans", "no beans"],
  bowlTopping: ["guacamole", "queso", "fresh tomato salsa", "roasted chili corn salsa", "spicy salsa", "sour cream", "fajita veggies", "cheese", "romaine lettuce"],
  bowlString: "",
  bowlBuilder: function () {
    const meat = this.bowlMeat[Math.floor(Math.random() * this.bowlMeat.length)],
      rice = this.bowlRice[Math.floor(Math.random() * this.bowlRice.length)],
      beans = this.bowlBeans[Math.floor(Math.random() * this.bowlBeans.length)],
      topping = this.bowlTopping[Math.floor(Math.random() * this.bowlTopping.length)];
    this.bowlString = `Here's your burrito bowl with ${meat}, ${rice}, ${beans}, and ${topping}`;
  }

}