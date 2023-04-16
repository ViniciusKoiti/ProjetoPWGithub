
const form = document.querySelector("form");
form.addEventListener('submit', function(event){
    event.preventDefault();
    const urlDoGithub = document.querySelector("#repositorio").value;
    const dataInicial = document.querySelector("#dataInicial").value;
    const dataFinal = document.querySelector("#dataFinal").value;
    const repositorio = trataUrl(urlDoGithub);

    console.log("teste");
    buscarCommits(repositorio, dataInicial, dataFinal);
});

function buscarCommits(repositorio, dataInicial, dataFinal){
    const url = `https://api.github.com/repos/${repositorio}/commits?since=${dataInicial}&until=${dataFinal}`
    fetch(url).then(response => response.json()).then(
        commits => {
        preparaDados(commits);
        sendDadosParaApi(commits);
        }
            );    
}

function sendDadosParaApi(result){
    let donoRepositorio = "";
    let commits = [];
    let repositorio = [];
    result.forEach(commit => {
        donoRepositorio = commit.author.login;
        const commitData = getCommit(commit);
        commits.push(...commitData);
        repositorio = getRepositorio(commit,commitData);
    })

    setCommits(repositorio,commits);
    
    montaJsonUser(donoRepositorio,repositorio);

    fetch("http://localhost:8080/user", setBodyInPost(montaJsonUser(donoRepositorio,repositorio)))
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error('Erro na solicitação');
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function setBodyInPost(bodyUser){
    return  {
        method: 'POST',
        headers:{
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyUser)
    };   
}

function setCommits(repositorio,commits){
    repositorio[0].commits = commits;
}

function getRepositorio(commit,commits){
    const nomeRepositorio = getNomeRepositorio(commit);
    const nomeUrl = document.querySelector("#repositorio").value;
    const initDate = document.querySelector("#dataInicial").value;
    const finalDate = document.querySelector("#dataFinal").value;
    
    return [montaJsonRepositorio(nomeRepositorio,nomeUrl,initDate,finalDate,commits)];
}

function getCommit(result){
    let commits = [];
    const author = result.commit.author.name;
    const data = result.commit.author.date;
    const comment = result.commit.message;
    let commit = montaJsonCommit(author,data,comment);
    commits.push(commit);
    return commits;
}

function montaJsonUser(nome,repositorio){    
    return {
        "name":nome,
        "repositories":repositorio
    }
}

function montaJsonRepositorio(nomeRepositorio,nomeUrl,initDate,finalDate,commits){
    return { 
        "name":nomeRepositorio,
        "link":nomeUrl,
        "initDate":initDate,
        "finalDate":finalDate,
    }
}

function montaJsonCommit(author,data,comment){
    return {
        "author":author,
        "data":data,
        "comment":comment
    }
}

function getNomeRepositorio(commit){
    let arrayDaUrl = commit.html_url.split('/');
    let repositorioGithub = arrayDaUrl[4];
    console.log(repositorioGithub);
    return repositorioGithub;
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
    console.log(commitsPorDia);
    
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
