const mongoose = require("mongoose")

var schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },    
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

schema.statics.create=async function(name, discountPercentage, description){
    let tag=await this.findOne({
        name: name
    });

    if(!tag){
        console.log("Tag not found. Creating anew.");
        tag=new this({
            name: name,
        })
    }

    tag.discountPercentage=discountPercentage;
    tag.description=description;
    await tag.save();
    return tag;
}

schema.statics.list=async function(page, limit){
    limit=limit||200;
    page=page||0;
    const tags=await this.find({});
    return tags;
}

schema.statics.fetch=async function(names){
    const tagdefs=await this.find({
        name: names
    });
    return tagdefs;
}

schema.statics.remove=async function(name){
    const deleteResponse=await this.deleteOne({
        name
    });
    console.log(deleteResponse);
    return true;
}

module.exports = mongoose.model("Tag", schema);
