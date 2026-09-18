#!/usr/bin/env node
const store = require("./lib/store");
const config = require("./lib/config");

const [command, ...rest] = process.argv.slice(2);

function printNotes(emptyMessage, formatNote) {
  const notes = store.all();
  if (notes.length === 0) {
    console.log(emptyMessage);
    return;
  }
  for (const note of notes) {
    console.log(formatNote(note));
  }
}

function main() {
  switch (command) {
    case "add": {
      const text = rest.join(" ").trim();
      if (!text) {
        console.log("Usage: notes add <text>");
        return;
      }
      const note = store.add(text);
      console.log(`Added note #${note.id}: ${note.text}`);
      break;
    }
    case "list": {
      printNotes("No notes yet. Add one with: notes add <text>", (note) => `#${note.id}  ${note.text}`);
      break;
    }
    case "review": {
      printNotes("No notes to review.", (note) => `Reviewing #${note.id}: ${note.text}`);
      break;
    }
    case "count": {
      const count = store.all().length;
      console.log(`You have ${count} note${count === 1 ? "" : "s"}.`);
      break;
    }
    case "delete": {
      const id = Number(rest[0]);
      const ok = store.remove(id);
      console.log(ok ? `Deleted note #${id}` : `No note #${id} found`);
      break;
    }
    default:
      console.log("Commands: add <text> | list | review | count | delete <id>");
      console.log(`(Session locks after ${config.SESSION_TIMEOUT_MINUTES} minutes of inactivity.)`);
  }
}

main();
