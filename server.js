const app = require("./src/app");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try{
    await connectDB();

    app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
  } catch(error){
    console.error("Falied to start server", error.message);
  }
}


startServer();

