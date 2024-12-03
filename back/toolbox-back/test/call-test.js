import Mocha from "mocha";

const mocha = new Mocha();
mocha.suite.emit("pre-require", global, "nofile", mocha);
import { appTests } from "./test.js";
appTests();

let testRunner = mocha.run();

process.on("exit", (code) => {
  process.exit(testRunner.stats.failures > 0);
});
