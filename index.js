const server = require("./server");

const port = process.env.PORT || 5325;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
