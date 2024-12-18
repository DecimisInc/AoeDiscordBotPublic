// Welcome to https://pylon.bot! You can use this editor to write custom code that Pylon will execute!
// Be sure to check out the documentation here: https://pylon.bot/docs/reference/index.html
// For help, join our Discord server: https://discord.gg/6DbcNPz
//
// This is the default script, that shows off some examples. Feel free to obliterate all this and start
// from scratch if you know what you're doing!
//
// **FAQ**:
//  - Q: How do I publish my script
//    A: Just press Ctrl + S, and it's published instantly.
//  - Q: What's that black box at the bottom of the editor do?
//    A: That's the console, you can log stuff to it, to help you develop your scripts, just use `console.log()`.
//       Additionally, if your script throws an error, it'll be logged there in real time!
//  - Q: So, I can basically write any code that I want here?
//    A: Yup! Pylon provides an isolated sandbox that runs your script safely. There are some memory and
//       execution time limits you'll have to be aware of. Check out: https://pylon.bot/docs/dev-limits

// Here's an example of how to use the built in command handler.
const commands = new discord.command.CommandGroup({
  defaultPrefix: '!', // You can customize your default prefix here.
});

// A simple command, !ping -> Pong!
commands.raw('ping', (message) => message.reply('pong!'));

// Another example, fetching some data from the web, using the `fetch` function.
commands.raw('catfact', async (message) => {
  // We're going to fetch a fact from the cat-fact API.
  const req = await fetch('https://catfact.ninja/fact');
  // Parse the request's JSON body:
  const data = await req.json();
  // Reply to the command with the random cat fact. It's very important we call `await` here,
  // as this will keep the command handler running until the message is sent. You can also reply
  // with rich embeds, to make your message replies look awesome!
  await message.reply(
    new discord.Embed({
      title: '😺 A random cat fact 🐈',
      color: 0x00ff00,
      description: data['fact'],
      footer: {
        text: 'powered by https://catfact.ninja',
      },
    })
  );
});

// Example of console logging the message:
commands.raw('log', async (message) => {
  console.log(message);
});

// What about commands that have arguments? Let's build a kick command that will kick a user and
// specify a reason in chat.
commands.on(
  // You can also customize your command a bit further, for example, you can limit who can call the
  // command by using filters. In this case, we only want the kick command to be usable
  // by server admins.
  // For more, see: https://pylon.bot/docs/reference/modules/discord.command.filters.html
  { name: 'kick', filters: discord.command.filters.isAdministrator() },
  // You can specify your arguments here like this. There are many argument types
  // to pick from, see: https://pylon.bot/docs/reference/interfaces/discord.command.icommandargs.html
  (ctx) => ({
    member: ctx.guildMember(),
    reason: ctx.textOptional(),
  }),
  // This function will then be called when the command is issued. It will have the message,
  // as the first argument, and the arguments you've specified as the second argument.
  // For more, see: https://pylon.bot/docs/reference/classes/discord.command.commandgroup.html#on
  async (message, { member, reason }) => {
    await message.reply(
      `Cya, ${member.toMention()} - you're kicked because ${reason}!`
    );
    // TODO: uncomment this to actually have the bot kick someone.
    // await member.kick({reason});
    await message.reply(`JK!`);
  }
);

// Here's an example of sub-commands. We'll do a quick and easy "tag" system, leveraging
// the Pylon Key Value store, which we'll use as a database to store tags to their values.
// For more on the KV Store, check out: https://pylon.bot/docs/reference/classes/pylon.kvnamespace.html

// A key value store is per server. Let's create one now, and call it "tags".
const tagsKv = new pylon.KVNamespace('tags');

// Let's now register a `"tag"` command. The thought is we should be able to do:
// !tag set <key: string> <value: text> - In order to set a tag.
// !tag delete <key: string> - In order to delete a tag. Only usable by people who can manage messages.
// !tag <key: string> - In order to retrieve a tag.
commands.subcommand('tag', (subcommand) => {
  subcommand.on(
    'set',
    (ctx) => ({
      // At this point you may be wondering what the difference between "string" and "text" is.
      // Basically, "string" captures an argument delimited by spaces, and "text" will capture the rest
      // of the message. So our usage of `!tag set pylon Pylon is a pretty cool bot`, will capture,
      // "pylon" as the key, and "Pylon is a pretty cool bot" as the value.
      key: ctx.string(),
      value: ctx.text(),
    }),
    async (message, { key, value }) => {
      // Save the tag to the database.
      await tagsKv.put(key, value);
      // Reply to the user to say we've saved their tag. We're also using the `allowedMentions` feature here,
      // to make sure thet the message won't mention anyone, for example, if they made the tag key "@everyone",
      // it wouldn't ping everyone with `allowedMentions: {}`.
      await message.reply({
        content: `Alright, I've saved the tag for **${key}**!`,
        allowedMentions: {},
      });
    }
  );

  subcommand.on(
    // This one is pretty self explanatory, once you've got the hang of commands. Here we're building a command
    // that is only usable by people with the MANGE_MESSAGES permission.
    { name: 'delete', filters: discord.command.filters.canManageMessages() },
    (ctx) => ({ key: ctx.string() }),
    async (message, { key }) => {
      // Delete the tag from the database.
      await tagsKv.delete(key);
      // Reply with a confirmation message.
      await message.reply({
        content: `Alright, I've deleted the tag for **${key}**!`,
        allowedMentions: {},
      });
    }
  );

  // And finally, let's have a default command handler, for if the command was neither "set" or "delete".
  subcommand.default(
    (ctx) => ({ key: ctx.string() }),
    async (message, { key }) => {
      // Retrieve the tag from the database. We are using `.get<string>(...)` as we have stored a string
      // in the database before.
      const value = await tagsKv.get<string>(key);

      if (value == null) {
        // If the value is null, that means that the tag did not exist in the database.
        await message.reply({
          content: `Unknown tag: **${key}**`,
          allowedMentions: {},
        });
      } else {
        // Otherwise, let's send back the tag value. Again, we're using `allowedMentions: {}` here
        // to ensure that the bot sending the tag is not able to ping anyone!
        await message.reply({ content: value, allowedMentions: {} });
      }
    }
  );
});

// Finally, an example of "raw" message handling, without using the command handler.
// Here, we're checking to see if the message contains the string "ayy", and if it does,
// we'll reply with "lmao".
discord.on('MESSAGE_CREATE', async (message) => {
  if (message.content.toLowerCase().includes('ayy')) {
    await message.reply('lmao');
  }
});

// There are many, many more events you can listen for with Pylon. For more, check out:
// https://pylon.bot/docs/reference/modules/discord.html#on

// This marks the end of the default script. From here, you can customize Pylon however you want.
// The possibilities are literally endless. If you encounter bugs, need help, or want to share what
// you've built. Join the Pylon discord. The invite link is here: https://discord.gg/6DbcNPz
