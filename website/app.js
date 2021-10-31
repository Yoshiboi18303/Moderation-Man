console.log("Activating website...");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const { getCommands } = require("../utils");
const { Webhook } = require("@top-gg/sdk");
const webhook = new Webhook(process.env.WEBHOOK_AUTH);
const { MessageEmbed, WebhookClient } = require("discord.js");
const ms = require("ms");

const passport = require("passport");
const passportDiscord = require("passport-discord");

const session = require("express-session");
const mongo = require("connect-mongo");

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
    voted: User.voted,
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

app.get(["/", "/home"], (req, res) => {
  var link = client.generateInvite({
    scopes: ["applications.commands", "bot"],
    permissions: [
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "MANAGE_CHANNELS",
      "MANAGE_GUILD",
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "MANAGE_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "USE_EXTERNAL_EMOJIS",
      "MENTION_EVERYONE",
      "CHANGE_NICKNAME",
      "MANAGE_ROLES",
      "MANAGE_EMOJIS_AND_STICKERS",
      "USE_APPLICATION_COMMANDS",
    ],
  });
  res
    .status(200)
    .render("index", { link, auth: req.isAuthenticated(), user: req.user });
});

app.get(["/cmds", "/commands"], (req, res) => {
  const commands = getCommands();
  res.status(200).render("commands", { commands });
});

app.get("/info", (req, res) => {
  var info = {
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
  };
  res.status(200).send(info);
});

app.get(["/developer", "/dev"], async (req, res) => {
  var user = await client.users.fetch("697414293712273408");
  var fhg = await client.users.fetch("482326304381730826");
  res.status(200).render("developer", { users: [user, fhg] });
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
  res.status(200).render("vote", { bot, links, voteRewards });
});

app.get("/privacy", (req, res) => {
  res.status(200).render("privacy");
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
              `Thank you so much for voting for **${bot.username}**!`
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

app.listen(port);
console.log(`${client.user.username} website is listening on port ${port}!`);
