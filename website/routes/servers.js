const express = require("express");
const app = express.Router();

const { Permissions } = require("discord.js");

const Guilds = require("../../schemas/guildSchema");

app.get("/", async (req, res) => {
  if (!req.isAuthenticated())
    return res.redirect("/login?redirect=" + encodeURIComponent("/servers"));

  var guilds = [];

  for await (var guild of req.user.discord.guilds) {
    // console.log(guild.per)
    var perms = new Permissions(guild.permissions_new);

    if (perms.has([Permissions.FLAGS.MANAGE_GUILD])) {
      var g = Guilds.findOne({ id: guild.id });

      guilds.push(guild);
    }
  }

  var invite_link = client.generateInvite({
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

  res.render("servers", {
    user: req.user,
    auth: true,
    guilds,
    invite_link,
    bot: client,
  });
});

app.get("/:id/dashboard", async (req, res) => {
  var id = req.params.id;
  if (!req.isAuthenticated())
    return res.redirect(
      "/login?redirect=" + encodeURIComponent(`/${id}/dashboard`)
    );

  var g = req.user.discord.guilds.find((g) => g.id == id);
  if (!g) return res.redirect("/");

  var perms = new Permissions(g.permissions_new);

  if (!perms.has([Permissions.FLAGS.MANAGE_GUILD])) return res.redirect("/");

  var guild = await Guilds.findOne({ id: g.id });

  var url = client.generateInvite({
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

  res.status(200).render("serverdashboard", {
    bot: client,
    client,
    invite_link: url,
    user: req.user,
    auth: true,
    guild: g,
  });
});

module.exports = app;
