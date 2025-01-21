const express = require('express')
const app = express()
const PORT = 3000;

app.use(express.json());


const items= [
    { id: 1, name: "banana" },
    { id: 2, name: "apple" }
];

let counter = 4

// POST request (adding new item)
app.post('/additem', (req,res)=>{
    const name = req.body;
    const addedItems = name.map(item => ({ id: idCounter++, name: item.name }));
    items.push(...addedItems)
    res.send(addedItems);
    res.status(200).json({
        success:true,
        message:"item is created"
    })
})

// Search and filter items by name
app.get('/items/search', (req, res) => {
    const name = req.query.name?.toLowerCase();
    if (!name) return res.status(400).send('Query parameter "name" is required');

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(name));
    res.send(filteredItems);
});

app.get('/items', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    res.send({
        success: true,
        message: "Items retrieved successfully",
        data: paginatedItems,
        page,
        limit,
        totalItems: items.length,
        totalPages: Math.ceil(items.length / limit)
    });
});


// get all items
app.get('/getallitems',(req,res)=>{
    res.send(items)
    res.status(200).json({
        success:true,
        message:"all items listed"
    })
})


// get by id
app.get('/items/:id',(req,res)=>{
    const item = items.find(i => i.id === +req.params.id);
    res.send(item)
    res.status(200).json({
        success:true,
        message:"getting item using id"
    })
})

// update item
app.put('/items/:id',(req,res)=>{
    const item = items.find(i => i.id === +req.params.id);

    const { name } = req.body;
    item.name = name
    res.send(item)
    res.status(200).json({
        success:true,
        message:"item updated"
    })
})

// delete item
app.delete('/items/:id',(req,res)=>{
    const item = items.find(i => i.id === +req.params.id);

    const deletedItem = items.splice(item, 1);
    res.send(deletedItem);
    res.status(200).json({
        success:true,
        message:"item is deleted"
    })
})

app.listen(PORT, () => console.log(`Server running on 3000`));
