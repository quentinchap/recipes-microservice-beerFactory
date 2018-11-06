var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  isValid: Boolean,
  abv:  Number,
  attenuation_level: String,
  boil_time: Number,
  boil_volume:{
    value: Number,
    unit: String
  },
  conditioning:{
    bottling: {
      carbonatation: Number,
      fermetation: {
        duration: {
          value: Number,
          unit: String
        }, 
        temperature:{
          duration: {
            value: Number,
            unit: String
          }
        }
      },
      refinement: {
        duration: {
            value: Number,
            unit: String
          }, 
          temperature:{
              value: Number,
              unit: String
        }
      }
    },
  },
  brewers_tips: String,
  contributed_by: String,
  ebc: Number,
  first_brewed: String,
  food_pairing: [String],
  ibu: Number,
  id: String,
  image_url: String,
  ingredients: {
    hops: [ 
      { 
        add: String,
        amount: { 
          unit: String,
          value: Number,
        },
        attribute: String,
        name: String,
      }
    ],
    malt: [
      {
        name: String,
        amount: { 
          unit: String,
          value: Number,
        },
      }
    ],
    yeast: String
  },
  method: {
    fermentation: {
      temp:{ 
            unit: String,
            value: Number,
          }
    },
    mash_temp: [{
      duration: Number,
      temp:{ 
          unit: String,
          value: Number,
        }
    }]
  },
  name: String,
  ph: Number,
  srm: Number,
  tagline: String,
  target_fg: Number,
  target_og: Number,
  src: String,
  volume: {
      unit: String,
      value: Number,
  }
});

RecipeSchema.index({ name: 1, id:1, type: -1 });
let Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;