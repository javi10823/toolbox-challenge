import express from "express";
import router from "./src/routes/files.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/files", router);

app.listen(PORT, () => {
  console.log(`Challenge app listening on port ${PORT}!`);
});
