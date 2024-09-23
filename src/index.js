import express, { json, urlencoded } from "express";

const server = express();
const PORT = 3000;  // 0 for auto choose address

server.use(json());
server.use(urlencoded({extended:true}));

server.get('/', (req, res) => {
    res.status(201).send("Hello!")
})

const listener = server.listen(PORT, function(err) {
    console.log(`Listening on http://localhost:${listener.address().port}`);
});