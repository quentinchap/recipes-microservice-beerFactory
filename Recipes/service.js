import { getBottlingSugar } from 'beerutilities';
const request = require('request');
import Recipe from './model';



module.exports = {
  getBrewDogRecipe: async function(per_page,page)
  {
      let url = "https://api.punkapi.com/v2/beers?per_page="+per_page+"&page="+page;
      console.log(url);
      return new Promise((resolve, reject) => {
        setTimeout( () => request.get({
            url: url
          }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve( JSON.parse(body));
            } else {
                // S'il y a une erreur envoyer error
                console.log(error);
                reject(error);
            }
          }),1000);
      });
  },
  
  isRecipeValid: function(recipe){
    if(!recipe.ingredients || !recipe.ingredients.malt || recipe.ingredients.malt.length === 0
       || !recipe.ingredients.hops || recipe.ingredients.hops.length === 0 
       || recipe.ingredients.yeast === null || !recipe.method
       || !recipe.method.fermentation
       )
      {
        return false;
      }
    return true;
  },
  
  updateBrewdogRecipe: async function()
  {
    let page = 1;
    let per_page = 80;
    let recipesCpy= [];
    let lastRecipes = [];
    let lastGet = 0;
    let isComplete = false;


    console.log("update ref");

    return new Promise(async (resolve, reject) => {
      while(!isComplete)
      {
        isComplete = true;
        try
        {
          lastRecipes = await this.getBrewDogRecipe(per_page,page)
        }
        catch(error)
        {
          reject(error);
        }
        recipesCpy = [...recipesCpy,...lastRecipes];
        if(lastRecipes.length >= 80)
        {
          isComplete = false;
        }
        page +=1;
      }
      for(let b in recipesCpy){
        recipesCpy[b].src ='brewdog';
        recipesCpy[b].boil_time = (recipesCpy[b].method.fermentation.value <= 15)? 90:60;
        recipesCpy[b].isValid = this.isRecipeValid(recipesCpy[b]);
    
        var query = {id: recipesCpy[b].id},
            update = recipesCpy[b],
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document
        Recipe.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) return;

            // do something with the document
        });
      }


      resolve(recipesCpy.length+" recipes saved.");
    })
  },
  
  getByPage: async function(page,per_page) {
    var start = (parseInt(page) - 1) * parseInt(per_page)
    console.log(start,per_page);

    let result = await Recipe.find({})
        .where({isValid:true})
        .skip( start )
        .limit( parseInt(per_page) );
    return result;     
  },
  getById: async function(id) {
    let result = await Recipe.find({id: id})
    return result;     
  }
}