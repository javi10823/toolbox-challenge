import express from "express";
import router from "./src/routes/files.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use("/files", router);

app.listen(PORT, () => {
  console.log(`Challenge app listening on port ${PORT}!`);
});
