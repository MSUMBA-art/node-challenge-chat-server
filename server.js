const express = require("express");
const cors = require("cors");
const { text } = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json);
app.use(express.urlencoded({ extended: true }));

const welcomeMessage = {
  id: 0,
  from: "Alexander",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.post("/messages", (req, res) => {
  const newMessage = {
    id: "",
    ...req.body,
  };
  if (
    !newMessage.from ||
    newMessage.from === "" ||
    !newMessage.text ||
    newMessage.text === ""
  ) {
    return res.status(400).json({ msg: "Please text a message!" });
  }
  messages.push(newMessage);
  messages.forEach((msg, index) => (msg.id = index + 1));
  res.json(messages);
});

// Getting all messages

app.get("/messages", (req, res) => res.send(messages));

// searching messages

app.get("/messages/search", (req, res, next) => {
  const text = req.query.text;

  if (text) {
    const searchMsg = messages.filter((msg) => {
      return msg.text.toLowerCase().includes(text.toLowerCase());
    });
    res.send(searchMsg);
  } else {
    res.send([]);
  }
});

// Getting a message by Id
const messageId = (req) => (message) => message.id === parseInt(req.params.id);
app.get("/messages:id", (req, res) => {
  const foundMsg = messages.some(messageId(req));

  if (foundMsg) {
    res.json(messages.filter(messageId(req)));
  } else {
    res.status(400).json({ msg: `No message with the Id: ${req.params.id}` });
  }
});

// Delete a message by id
app.delete("/messages/:id", (req, res) => {
  const deleteMsg = messages.some(messageId(req));

  if (deleteMsg) {
    res.json({
      msg: `Message deleted with id: ${req.params.id}`,
      messages: messages.filter((message) => !messageId(req)(message)),
    });
  } else {
    res.status(400).json({ msg: `No message with the id: ${req.params.id}` });
  }
});

/*app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests !");
});*/

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
//app.listen(process.env.PORT);
