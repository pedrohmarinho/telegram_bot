// Telegram bot
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/classificar/, (message) => {
  const chatId = message.chat.id;
  bot.sendMessage(chatId, "Envie uma imagem para eu classificá-la!");

  bot.on("photo", (photoMessage) => handlePhoto(photoMessage));
});

// Sashido
const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/r6BBk-hiN/"
});

model.classify({
  imageUrl: "https://media-blog.sashido.io/content/images/2020/09/SashiDo_Dog.jpg",
}).then((predictions) => {
  console.log("Predictions:", predictions);
}).catch((e) => {
  console.log("ERROR", e);
}); 

// Functions handlePhoto e classifyImage
function handlePhoto(message) {
    const chatId = message.chat.id;
    const photoId = message.photo ? message.photo[message.photo.length - 1].file_id : null;
  
    if (!photoId) {
      return bot.sendMessage(chatId, "Nenhuma foto encontrada para classificação.");
    }
  
    bot.downloadFile(photoId, "./src/image").then(async (imagePath) => {
      try {
        const fileName = imagePath.split("/").pop();
        const serverAddress = server.getAddress();
  
        const imageUrl = `${serverAddress}/image/${fileName}`;
        bot.sendMessage(chatId, "Classificando imagem...");
  
        const predictionResult = await classifyImage(imageUrl);
        server.removeFile(fileName);
  
        bot.sendMessage(chatId, `Na imagem contém um ${predictionResult.class}`);
      } catch (error) {
        console.log("error", error);
        bot.sendMessage(chatId, `Erro ao classificar a imagem`);
      }
    }).catch((error) => {
      console.log("error", error);
      bot.sendMessage(chatId, "Erro ao baixar a imagem para classificação.");
    });
  }
  
  async function classifyImage(imageUrl) {
    try {
      const predictions = await model.classify({ imageUrl });
      const highConfidencePrediction = predictions.find(prediction => prediction.score > 0.5);
      return highConfidencePrediction;
    } catch (error) {
      throw new Error("Erro ao classificar a imagem");
    }
  }
  