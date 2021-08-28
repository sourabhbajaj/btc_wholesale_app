const Router = require("koa-router");
const Tag=require("../models/Tag");
const router=new Router({
    prefix:"/rest"
});

router.get("/", async (ctx)=>{
    ctx.body=await Tag.list();
});

router.get("/fetch", async (ctx)=>{
    let tags=ctx.request.query.tags||"";
    tags=tags.split(",");
    if(tags.length==0){
        ctx.body=[];
        return;
    }
    let tagDefs=await Tag.fetch(tags);
    ctx.body=tagDefs;
})


router.post("/", async (ctx)=>{
    let tag=await Tag.create(ctx.request.body.name, ctx.request.body.discountpercentage, ctx.request.body.description);    
    ctx.body=tag;
});

router.del("/", async (ctx)=>{
    await Tag.remove(ctx.request.body.name);
    ctx.body={
        success:true
    };
});

module.exports=router;