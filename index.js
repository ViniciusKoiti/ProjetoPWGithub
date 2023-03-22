const form = document.querySelector("form");
form.addEventListener('submit', function(event){
    event.preventDefault();
    // const urlDoGithub = document.querySelector("#repositorio").value;
    // const dataInicial = document.querySelector("#dataInicial").value;
    // const dataFinal = document.querySelector("#dataFinal").value;
    // const repositorio = trataUrl(urlDoGithub);


    
    const dataInicial = "2019-01-01";
    const dataFinal = "2023-01-01";
    const repositorio = trataUrl("https://github.com/frankwco/loja");
    
    buscarCommits(repositorio, dataInicial, dataFinal);
});

function buscarCommits(repositorio, dataInicial, dataFinal){
    const url = `https://api.github.com/repos/${repositorio}/commits?since=${dataInicial}&until=${dataFinal}`
    fetch(url).then(response => response.json()).then(
        commits => preparaDados(commits)
                
            );    
}


function preparaDados(commits){
    const commitsPorDia = {};
    commits.forEach(element => {
        const dataCommit = element.commit.author.date.substr(0,10);
        const authorCommit = element.commit.author.name;
        const messageCommit = element.commit.message;
        if(commitsPorDia[dataCommit]){
            commitsPorDia[dataCommit].quantidade++;
        }else{
            commitsPorDia[dataCommit] = {quantidade:1, data:dataCommit,author:authorCommit,message:messageCommit};
        }
    });
    
    const commitsPordiaArray = Object.keys(commitsPorDia).map(dataCommit=>{
        return {data:dataCommit, quantidade:commitsPorDia[dataCommit].quantidade,author:commitsPorDia[dataCommit].author,message:commitsPorDia[dataCommit].message};
    })


    criaTabela(commitsPordiaArray);
} 
function criaTabela(dados) {
    const tabela = document.querySelector("#tabela-dados");
    
    // Cria as colunas da tabela
    const colunaData = document.createElement("td");
    const colunaQuantidade = document.createElement("td");
    const colunaAuthor = document.createElement("td");
    const colunaMessagem = document.createElement("td");
    // Adiciona o conteúdo das colunas do cabeçalho
    colunaData.textContent = "Data";
    colunaQuantidade.textContent = "Quantidade";
    colunaAuthor.textContent = "Autor";
    colunaMessagem.textContent = "Messagem";
  
    // Adiciona as colunas ao cabeçalho da tabela
    const cabecalho = document.createElement("tr");
    cabecalho.appendChild(colunaData);
    cabecalho.appendChild(colunaQuantidade);
    cabecalho.appendChild(colunaAuthor);
    cabecalho.appendChild(colunaMessagem);
    tabela.appendChild(cabecalho);
  
    // Adiciona as linhas com os dados na tabela
    dados.forEach((commit) => {
      const linha = document.createElement("tr");
  
      const celulaData = document.createElement("td");
      celulaData.textContent = commit.data;
      linha.appendChild(celulaData);
  
      const celulaQuantidade = document.createElement("td");
      celulaQuantidade.textContent = commit.quantidade;
      linha.appendChild(celulaQuantidade);
  
      const colunaAuthor = document.createElement("td");
      colunaAuthor.textContent = commit.author; // Substitua "outroDado" pelo nome do outro dado que você deseja adicionar à tabela
      linha.appendChild(colunaAuthor);

      const colunaMessagem = document.createElement("td");
      colunaMessagem.textContent = commit.message;
      linha.appendChild(colunaMessagem);
  
      tabela.appendChild(linha);
    });
  }

function trataUrl(url){

    let arrayDaUrl = url.split('/');

    let usuarioGithub = arrayDaUrl[3];
    let repositorioGithub = arrayDaUrl[4];

    
    
    return usuarioGithub + "/" + repositorioGithub;
}
