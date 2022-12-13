const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
// mongoose.set('strictQuery', true);
const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);
// todo
app.route("/articles")
    .get(
        function (req, res) {
            Article.find(function (err, foundArticles) {
                if (!err) {
                    res.send(foundArticles);
                } else {
                    res.send(err);
                }
            });
        }
    )
    .post(
        function (req, res) {

            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });

            newArticle.save(function (err) {
                if (!err) {
                    res.send("Successfully added a new article.");
                } else {
                    res.send(err);
                }
            });
        }
    )
    .delete(
        function (req, res) {
            Article.deleteMany(function (err) {
                if (!err) {
                    res.send("successfully deleted!")
                } else {
                    res.send(err);
                }
            });
        }
    )
// app.get("/articles", function (req, res) {
//     Article.find(function (err, foundArticles) {
//         if (!err) {
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.post('/articles', function (req, res) {

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save(function (err) {
//         if (!err) {
//             res.send("Successfully added a new article.");
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.delete('/articles', function (req, res) {
//     Article.deleteMany(function (err) {
//         if (!err) {
//             res.send("successfully deleted!")
//         } else {
//             res.send(err);
//         }
//     });
// });

// Article A specific methods
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ "title": req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("did not find a matching article.");
            }
        });
    })
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully updated!")
                } else {
                    res.send(err);
                }
            }
        )
    })
    .patch(function (res, req) {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Successfully patched!");
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("successfully deleted the corresponding record!")
                } else {
                    res.send(err);
                }
            }
        )
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
