const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { someLimit } = require("async");
const { get } = require("http");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const datenbankName = __dirname + "/daten/snet.db";
const hostname = "0.0.0.0";
const port = 8080;

const datenbank = new sqlite3.Database(datenbankName, function (error) {
  if (error) {
    return console.error(error.message);
  }
  console.log("Verbindung zu " + datenbankName + " hergestellt.");
});

app.set("views", __dirname + "/view");

app.use(cors());
app.use(express.json());

//SQL

//USERS*****************************************************************************
/* TABLE users (id AUTOINCREMENT, email TEXT, username TEXT, password TEXT) */
//die Raute für users GET
app.get("/users", function (req, res) {
  let userData = JSON.stringify(req.body);
  let db_user = JSON.parse(userData);
  console.log("input login = " + db_user);

  let sqlStatement = "SELECT * FROM users";

  datenbank.all(sqlStatement, function (error, rows) {
    if (error) {
      return console.error(error.message);
    }
    let db_user = JSON.stringify(rows);
    console.log("output login= " + db_user);
    res.send(db_user);
  });
});

// die Route für users POST
app.post("/users", function (req, res) {
  let id = req.params.id;

  //request json data
  let userData = JSON.stringify(req.body);
  let data = JSON.parse(userData);
  let username = data.username;
  let email = data.email;
  let password = data.password;
  let user = [id, username, email, password];
  let sqlStatement =
    "INSERT INTO users (  id, username, email, password) VALUES ( ?, ?, ?, ?)";
  let sqlget = "SELECT * FROM users WHERE email = ?";

  datenbank.run(sqlStatement, user, function (error, row) {
    if (error) {
      return console.error(error.message);
    }
    return row;
  });

  datenbank.get(sqlget, user[2], function (error, row) {
    if (error) {
      return console.error(error.message);
    }
    let data = JSON.stringify(row);
    res.send(data);
  });
});

//die Raute für users.id PUT
app.put("/users/:id", function (req, res) {
  let userData = JSON.stringify(req.body);
  let data = JSON.parse(userData);
  let id = req.params.id;
  let username = data.username;
  let email = data.email;

  let sqlStatement = "UPDATE users SET username = ?, email = ? WHERE (id = ?)";
  let user = [username, email, id];
  console.log(user);
  datenbank.run(sqlStatement, user, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(user);
});

// die Raute für users.id GET
app.get("/users/:id", function (req, res) {
  let id = req.params.id;
  let sqlStatement = "SELECT * FROM users WHERE id = ?";

  datenbank.get(sqlStatement, id, function (error, row) {
    if (error) {
      return console.error(error.message);
    }
    let data = JSON.stringify(row);
    res.send(data);
  });
});

//die Raoute für users DELETE
app.delete("/users/:id", function (req, res) {
  let id = req.params.id;

  let sqlStatement = "DELETE FROM users WHERE id = ?";

  datenbank.run(sqlStatement, id, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(id);
});

//POSTS*************************************************************************
/* TABLE posts (id AUTOINCREMENT, user_id NUMBER, content TEXT, likes NUMBER) */

// die Route für posts POST
app.post("/posts", function (req, res) {
  let id = req.params.id;
  //request json data
  let userData = JSON.stringify(req.body);
  let data = JSON.parse(userData);
  let user_id = data.user_id;
  let content = data.content;
  let likes = data.likes;
  let post = [id, user_id, content, likes];
  console.log(post);
  let sqlStatement =
    "INSERT INTO posts (  id, user_id, content, likes) VALUES ( ?, ?, ?, ?)";

  datenbank.run(sqlStatement, post, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(post);
});

// die Raute für posts.id GET
app.get("/posts", function (req, res) {
  let id = req.params.id;
  let sqlStatement = "SELECT * FROM posts";
  datenbank.all(sqlStatement, id, function (error, rows) {
    if (error) {
      return console.error(error.message);
    }
    let all_posts = JSON.stringify(rows);
    res.send(all_posts);
  });
});

//die Raute für posts.id PUT (like)
app.put("/posts/:id", function (req, res) {
  let userData = JSON.stringify(req.body);
  let data = JSON.parse(userData);
  let id = req.params.id;
  let likes = data.likes;
  let like = [likes, id];

  let sqlStatement = "UPDATE posts SET likes = ? WHERE (id = ?)";
  datenbank.run(sqlStatement, like, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(like);
});

//die Raoute für post.id DELETE
app.delete("/posts/:id", function (req, res) {
  let id = req.params.id;
  let sqlStatement = "DELETE FROM posts WHERE id = ?";
  datenbank.run(sqlStatement, id, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(id);
});

//COMMENTS***********************************************************************
/* TABLE comments (id AUTOINCREMENT, user_id NUMBER, post_id NUMBER,
   content TEXT, username TEXT) */

// die Route für comments POST
app.post("/comments", function (req, res) {
  //request json data
  let userData = JSON.stringify(req.body);
  let data = JSON.parse(userData);
  let id = req.params.id;
  let user_id = data.user_id;
  let post_id = data.post_id;
  let content = data.content;
  let username = data.username;
  let comment = [id, user_id, post_id, content, username];
  console.log(comment);
  let sqlStatement =
    "INSERT INTO comments (  id, user_id, post_id, content, username) VALUES ( ?, ?, ?, ?, ?)";

  datenbank.run(sqlStatement, comment, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(comment);
});

// die Raute für comments GET
app.get("/comments", function (req, res) {
  let id = req.params.id;
  let sqlStatement = "SELECT * FROM comments";

  datenbank.all(sqlStatement, id, function (error, rows) {
    if (error) {
      return console.error(error.message);
    }
    let item = JSON.stringify(rows);
    res.send(item);
  });
});

app.delete("/comments/:id", function (req, res) {
  let id = req.params.id;

  let sqlStatement = "DELETE FROM comments WHERE id = ?";

  datenbank.run(sqlStatement, id, function (error) {
    if (error) {
      return console.error(error.message);
    }
  });
  res.send(id);
});

//SERVER************************************************************************
const server = app.listen(port, hostname, function () {
  console.log(
    "Der Server läuft auf " +
      server.address().address +
      ":" +
      server.address().port
  );
});
