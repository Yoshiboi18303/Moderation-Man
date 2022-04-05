console.log("Activating website...");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const { getCommands } = require("../utils");
const { Webhook } = require("@top-gg/sdk");
const webhook = new Webhook(process.env.TOPGG_WEBHOOK_AUTH);
const { MessageEmbed, WebhookClient } = require("discord.js");
const ms = require("ms");
const { Webhook: WH } = require("infinity-bots");
const iblwh = new WH(process.env.IBL_WEBHOOK_AUTH);
const cookieParser = require("cookie-parser");

const passport = require("passport");
const passportDiscord = require("passport-discord");

const session = require("express-session");
const mongo = require("connect-mongo");

var cYear = new Date(Date.now()).getFullYear();

const main_vote_webhook = new WebhookClient({
  id: "902375507499298847",
  token: process.env.VOTE_WEBHOOK_TOKEN,
});
const test_vote_webhook = new WebhookClient({
  id: "902377723589169213",
  token: process.env.TEST_VOTE_WEBHOOK_TOKEN,
});

// Users
const bot = client.users.cache.get("891070722074611742");
const owner = client.users.cache.get(config.bot.owner);

// Models
const Users = require("../schemas/userSchema");

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: mongo.create({
      mongoUrl: process.env.MONGO_CS,
      ttl: 86400 * 2, // 2 days
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
// app.use(cookieParser())

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  var User = await Users.findOne({ id: user.id });
  if (!user)
    user = new Users({
      id: user.id,
    });

  done(null, {
    id: user.id,
    discord: user,
    // voted: User.voted,
    blacklisted: User.blacklisted,
  });
});

passport.use(
  new passportDiscord.Strategy(
    {
      clientID: "891070722074611742",
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/login/callback",
      scope: ["identify", "guilds"],
      prompt: "none",
    },
    (access, refresh, profile, done) => {
      process.nextTick(() => {
        done(null, profile);
      });
    }
  )
);

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views/`);
app.set("etag", false);

app.use(require("nocache")());

app.use("/static", express.static("website/static"));

app.use("/login", require("./routes/login"));
app.use("/servers", require("./routes/servers"));
// app.use("/cookies", require("./routes/cookies"));

app.get(["/", "/home"], (req, res) => {
  var link = "https://discord.com/api/oauth2/authorize?client_id=891070722074611742&permissions=8&scope=bot%20applications.commands"
  res.status(200).render("index", {
    link,
    auth: req.isAuthenticated(),
    user: req.user,
    cYear,
  });
});

app.get(["/cmds", "/commands"], (req, res) => {
  const commands = getCommands();
  res.status(200).render("commands", { commands, cYear });
});

app.get("/info", (req, res) => {
  var guilds = client.guilds.cache.size
  var users = client.users.cache.size

  res.status(200).render("info", {
    info: {
      guilds,
      users,
      creationDate: new Date(client.user.createdAt)
    },
    moment,
    client,
  })
});

app.get(["/developer", "/dev"], async (req, res) => {
  var user = await client.users.fetch("697414293712273408");
  var fhg = await client.users.fetch("482326304381730826");
  res.status(200).render("developers", { users: [user, fhg], cYear });
});

app.get(["/features", "/feats"], (req, res) => {
  res.status(200).render("features", { bot });
});

app.get("/invited", (req, res) => {
  if (!req.query.referral) return res.redirect("/");
  res.status(200).render("invited", { bot, owner });
});

app.get("/vote", (req, res) => {
  var links = [
    `https://top.gg/bot/${bot.id}/vote`,
    `https://infinitybotlist.com/bots/${bot.id}/vote`,
  ];
  res.status(200).render("vote", { bot, links, voteRewards, cYear });
});

app.get("/privacy", (req, res) => {
  res.status(200).render("privacy");
});

app.get("/rules", (req, res) => {
  res.status(200).render("rules", { cYear });
});

app.post(
  "/topggvoteresolve",
  webhook.listener(async (vote) => {
    if (vote.type == "test") {
      const new_test_vote_embed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle("__New Test Vote!__")
        .setDescription(`<@${vote.user}> voted for **${bot.username}**!`);
      await test_vote_webhook.send({
        embeds: [new_test_vote_embed],
      });
    } else {
      const new_vote_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("__New Vote!__")
        .setDescription(`<@${vote.user}> voted for **${bot.username}**!`);
      await main_vote_webhook.send({
        embeds: [new_vote_embed],
      });
      Users.findOne({ id: vote.user }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new Users({
            id: vote.user,
            voted: true,
            vote_timeout: ms("1d"),
          });
          data.save();
          const embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Thanks for voting")
            .setDescription(
              `Thank you so much for voting for **${
                bot.username
              }**!\nYou have earned: **${voteRewards.join(", ")}**!`
            );
          if (data.dmable) {
            client.users.cache.get(vote.user).send({
              embeds: [embed],
            });
          } else {
            return;
          }
        } else {
          data = await Users.findOneAndUpdate(
            {
              id: vote.user,
            },
            {
              $set: {
                voted: true,
                vote_timeout: ms("1d"),
              },
            }
          );
          data.save();
          const embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Thanks for voting")
            .setDescription(
              `Thank you so much for voting for **${
                bot.username
              }**!\nYou have earned **${voteRewards.join(", ")}**`
            );
          if (data.dmable) {
            client.users.cache.get(vote.user).send({
              embeds: [embed],
            });
          } else {
            return;
          }
        }
      });
    }
  })
);

app.post(
  "/iblvoteres",
  iblwh.hookListener(async (vote) => {
    if (vote.type == "test") {
      const new_test_vote_embed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle("__New Test Vote!__")
        .setDescription(`<@${vote.userID}> voted for **${bot.username}**!`);
      await test_vote_webhook.send({
        embeds: [new_test_vote_embed],
      });
    } else {
      const new_vote_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("__New Vote!__")
        .setDescription(`<@${vote.userID}> voted for **${bot.username}**!`);
      await main_vote_webhook.send({
        embeds: [new_vote_embed],
      });
      Users.findOne({ id: vote.userID }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new Users({
            id: vote.userID,
            voted: true,
            vote_timeout: ms("1d"),
          });
          data.save();
          const embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Thanks for voting")
            .setDescription(
              `Thank you so much for voting for **${
                bot.username
              }**!\nYou have earned: **${voteRewards.join(", ")}**!`
            );
          if (data.dmable) {
            client.users.cache.get(vote.userID).send({
              embeds: [embed],
            });
          } else {
            return;
          }
        } else {
          data = await Users.findOneAndUpdate(
            {
              id: vote.userID,
            },
            {
              $set: {
                voted: true,
                vote_timeout: ms("1d"),
              },
            }
          );
          data.save();
          const embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Thanks for voting")
            .setDescription(
              `Thank you so much for voting for **${
                bot.username
              }**!\nYou have earned **${voteRewards.join(", ")}**`
            );
          if (data.dmable) {
            client.users.cache.get(vote.userID).send({
              embeds: [embed],
            });
          } else {
            return;
          }
        }
      });
    }
  })
);

app.post("/voteresolve", async (vote) => {
  console.log(vote);
});

app.listen(port);
console.log(
  `${
    client.ready ? client.user.username : "Moderation Man"
  } website is listening on port ${port}!\n\n--------------------------------------------------------------\n`
);
