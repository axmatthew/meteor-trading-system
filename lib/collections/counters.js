// used for generating unique numbers, e.g. enquiryNum
Counters = new Mongo.Collection("counters");

getNextSequence = function(name) {
  Counters.update(name, {$inc: {seq: 1}});

  return Counters.findOne({_id: name}).seq;
};