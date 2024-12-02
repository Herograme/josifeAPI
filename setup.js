const { exec } = require("child_process");

// Lista de comandos para executar
const commands = [
  "npm install", // Instalar dependências
  "npx puppeteer browsers install chrome", // Instalar Chrome para Puppeteer
  //"npm run build" // Rodar o build do projeto
];

// Função para executar os comandos sequencialmente
function runCommandsSequentially(commands) {
  if (commands.length === 0) {
    console.log("Todos os comandos foram executados!");
    return;
  }

  const command = commands.shift(); // Pega o próximo comando
  console.log(`Executando: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o comando: ${command}`);
      console.error(error.message);
      return;
    }

    console.log(`Saída: ${stdout}`);
    if (stderr) {
      console.error(`Avisos: ${stderr}`);
    }

    // Executa o próximo comando na fila
    runCommandsSequentially(commands);
  });
}

// Inicia a execução dos comandos
runCommandsSequentially([...commands]);