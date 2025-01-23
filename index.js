const express = require('express')
const app = express()
const PORT = 3000;
const Todo = require('./models/model')

app.use(express.json());

// connect database (mongodb)

const dbconnect = require('./database/database')
dbconnect()

// let counter = 4

// POST request (adding new item)
app.post('/additem', async (req,res)=>{
    const {title, description} = req.body;
    const response = await Todo.create({title:title, description:description});
    // items.push(...addedItems)
    // res.send(addedItems);
    res.status(200).json({
        success:true,
        message:"item is created"
    })
})

// batch add items
app.post("/items/batch", async(req,res)=>{
    const items = await Todo.insertMany(req.body);
    res.status(200).json({
        success: true,
        message: "items are created",
        data: items
    })
})

// Search and filter items by name
app.get('/items/search', (req, res) => {
    const name = req.query.name?.toLowerCase();
    if (!name) return res.status(400).send('Query parameter "name" is required');

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(name));
    res.send(filteredItems);
});

app.get('/items',async (req, res) => {
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;

    // const startIndex = (page - 1) * limit;
    // const paginatedItems = items.slice(startIndex, startIndex + limit);

    // res.send({
    //     success: true,
    //     message: "Items retrieved successfully",
    //     data: paginatedItems,
    //     page,
    //     limit,
    //     totalItems: items.length,
    //     totalPages: Math.ceil(items.length / limit)
    // });
    const { page = 1, limit = 10, search = '', category } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        if (category) {
            query.category = category;
        }

        const items = await Item.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Item.countDocuments(query);

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            items,
        });
});


// get all items
app.get('/getallitems',(req,res)=>{
    const todos = Todo.find({});
    // res.send(items)
    res.status(200).json({
        success:true,
        message:"all items listed"
    })
})


// get by id
app.get('/items/:id',(req,res)=>{
    // const item = items.find(i => i.id === +req.params.id);
    const todo = Todo.findById(req.params.id);
    // res.send(item)
    res.status(200).json({
        success:true,
        message:"getting item using id"
    })
})

// update item
app.put('/items/:id',(req,res)=>{
    // const item = items.find(i => i.id === +req.params.id);

    const {id} =  req.params;
    const {title, description} = req.body;
    const todo = Todo.findByIdAndUpdate(
        {_id: id},
        {title, description, updateAt:Date.now()},
       )

    // const { name } = req.body;
    // item.name = name
    // res.send(item)
    res.status(200).json({
        success:true,
        message:"item updated"
    })
})

// delete item
app.delete('/items/:id',(req,res)=>{
    // const item = items.find(i => i.id === +req.params.id);
    const {id} = req.params;
    Todo.findByIdAndDelete(id);

    // const deletedItem = items.splice(item, 1);
    // res.send(deletedItem);
    res.status(200).json({
        success:true,
        message:"item is deleted"
    })
})

app.listen(PORT, () => console.log(`Server running on 3000`));
