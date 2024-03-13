const express = require('express');
const router = express.Router();
const path=require("path")
const { v4: uuidv4 } = require('uuid');
const Contact=require("../model/contact");

router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"));
});


 //add contact from contact.html

// router.post("/addcontact",(req,res)=>{
//    console.log(req.body);
//     res.redirect("/getcontacts");
// })

//now store in database using promise then
router.post("/addcontact",(req,res)=>{
    console.log(req.body);
    const {name, email, phone}=req.body;
    const obj={
        id: uuidv4(),
        name,
        email,
        phone,
        isShow:true
    }

    //add to database
    // Contact.create(obj).then(()=>{
    //     res.redirect("/getcontacts");
    //     console.log("contact added successfully");
    // }).catch((err)=>{
    //     console.log(err);
    // })

    //instead use save
    const contact=new Contact(obj);
    contact.save().then(()=>{
        res.redirect("/getcontacts");
        console.log("contact added successfully");
    }).catch((err)=>{
        console.log(err);
    })

}
);


// //get contacts from database
// router.get("/getcontacts",(req,res)=>{
//     Contact.find({isShow:true}).then((contacts)=>{
//         console.log(contacts);
//         res.render("contact",{contacts});
//     }).catch((err)=>{
//         console.log(err);
//     })
     

// })
router.get("/getcontacts", (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 2; // Default to 10 contacts per page

    Contact.find({ isShow: true })
        .sort({ name: 1 }) // Sorting by name in ascending order (use -1 for descending order)
        .skip((page - 1) * limit)
        .limit(limit)
        .then((contacts) => {
            Contact.countDocuments({ isShow: true }).then((count) => {
                const totalContacts = count;
                const totalPages = Math.ceil(totalContacts / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;
                const nextPage = hasNextPage ? page + 1 : null;
                const prevPage = hasPrevPage ? page - 1 : null;

                // Calculate the page range
                const pageRangeStart = nextPage - 1 == -1 ? totalPages : nextPage - 1;
                const pageRangeEnd = totalPages;

                res.render("contact", {
                    contacts,
                    totalContacts,
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage,
                    pageRangeStart,
                    pageRangeEnd,
                    limit
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});



//add contact from addcontact.html
router.get("/addcontact",(req,res)=>{
    res.render("addcontact");
}
);


//update contact
router.get("/updatecontact/:id",(req,res)=>{
    console.log(req.params.id);
    Contact.findOne({id:req.params.id}).then((contact)=>{
        console.log(contact);
        res.render("updatecontact",{contact});
    }).catch((err)=>{
        console.log(err);
    })
}
);


//update contact from updatecontact.html
router.post("/updatecontact",(req,res)=>{
    console.log(req.body);
    const {id, name, email, phone}=req.body;
    Contact.updateOne({id:id},{
        name,
        email,
        phone
    }).then(()=>{
        res.redirect("/getcontacts");
        console.log("contact updated successfully");
    }).catch((err)=>{
        console.log(err);
    })

}
);
router.get("/deletecontact/:id",(req,res)=>{
    console.log(req.params.id);
    Contact.updateOne({id:req.params.id},{
        isShow:false
    }).then(()=>{
        res.redirect("/getcontacts");
        console.log("contact deleted successfully");
    }).catch((err)=>{
        console.log(err);
    })
}
);

module.exports = router;