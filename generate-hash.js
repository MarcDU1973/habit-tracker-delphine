// generate-hash.js
const bcrypt = require("bcrypt")

const password = "meWK2rulez"   // hier dein gewünschtes Passwort einsetzen

async function run() {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  console.log("Benutzername: wk2")   // Beispiel
  console.log("Passwort:", password)
  console.log("Hash:", hash)
}

run()