var livros = [];

class Livro {

  constructor(titulo, autor, editora, genero, prateleira, coluna) {
      this.titulo = titulo;
      this.autor = autor;
      this.editora = editora;
      this.genero = genero;
      this.prateleira = prateleira;
      this.coluna = coluna;

  }

  toMap() {
      return {
          titulo: this.titulo,
          autor: this.autor,
          editora: this.editora,
          genero: this.genero,
          prateleira: this.prateleira,
          coluna: this.coluna,
      };
  }
}




function submitForm() {
  // Capturando valor dos campos
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const editora = document.getElementById('editora').value;
  const genero = document.getElementById('genero').value;
  const prateleira = document.getElementById('prateleira').value;
  const coluna = document.getElementById('coluna').value;

  const livro = new Livro(titulo, autor, editora, genero, prateleira, coluna);

  livros.unshift(livro.toMap());

  salvarDados(livros);

  // Limpar os campos do formulário
  document.getElementById('titulo').value = "";
  document.getElementById('autor').value = "";
  document.getElementById('editora').value = "";
  document.getElementById('genero').value = "";
  document.getElementById('prateleira').value = "";
  document.getElementById('coluna').value = "";





}

function salvarDados(livros) {
    if (livros.length === 0) {
       
    } else {
        let listaCarregadaLivros = carregarDados(); 
        listaCarregadaLivros = livros.concat(listaCarregadaLivros); // Combina as listas sem aninhamento
       
        localStorage.setItem('Livro', JSON.stringify(listaCarregadaLivros));
    }
}





function carregarDados() {
    
    const listaRecuperadaString = localStorage.getItem("Livro");

    if (listaRecuperadaString === null) {
        
        return [];
    } else {
       
        return JSON.parse(listaRecuperadaString);
    }
}




document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('telaConsulta')) {
        exibirLivros();            
    } else if (document.getElementById('telaEmprestimo')) {
        exibirLivrosEmprestado();   
    }
});



function exibirLivros() {
    const listaLivros = carregarDados();
    const containerLista = document.getElementById("listaLivros");
    console.log('exibirLivros');
    containerLista.innerHTML = "";



    if (listaLivros.length === 0) {
        containerLista.innerHTML = "<h1>Nenhum livro encontrado</h1>";
    } else {
        listaLivros.forEach((livro, index) => {
            const livroElement = document.createElement("div");
            livroElement.classList.add("item-lista");
            livroElement.innerHTML = `
                <div>
                    <p class="livro-info"><strong>Título:</strong> ${livro.titulo}</p>
                    <p class="livro-info"><strong>Autor:</strong> ${livro.autor}</p>
                </div>
                <div class="icon-container">
                    <i class="fas fa-handshake" onclick="emprestarLivro(${index})"></i>
                    <i class="fas fa-trash-alt" onclick="excluirLivro(${index})"></i>
                  
                </div>
            `;
            containerLista.appendChild(livroElement);
        });
    }
}

// Funções para edição e exclusão (são placeholders por enquanto)
function editarLivro(index) {
    alert(`Editar livro de índice: ${index}`);
}



function excluirLivro(index) {
    if(!confirm("Deseja excluir este livro")){
        return;
      }


    let listaLivros = carregarDados();
   
   

    // Remove o livro na posição especificada
    listaLivros.splice(index, 1);

  

    // Salva a lista atualizada de volta ao localStorage
    localStorage.setItem('Livro', JSON.stringify(listaLivros));

    // Atualiza a exibição dos livros na página
    exibirLivros();
}


function emprestarLivro(index) {

  if(!confirm("Deseja emprestar este livro")){
    return;
  }

    let listaLivros = carregarDados();
    let livro = listaLivros[index];
    salvarEmprestado(livro);
    excluirLivro(index);  // Remove o livro da lista original após emprestar

    // Atualiza a exibição dos livros emprestados
    exibirLivrosEmprestado();
}


function salvarEmprestado(livro) {
    let listaCarregadaLivros = carregarLivrosEmprestado(); 
    console.log('Adicionando livro emprestado:', livro);
    listaCarregadaLivros.unshift(livro); 
    localStorage.setItem('Emprestado', JSON.stringify(listaCarregadaLivros));
}



function carregarLivrosEmprestado() {
    console.log('Método carregarLivrosEmprestado');
    const listaRecuperadaEmprestado = localStorage.getItem("Emprestado");
    
    if (listaRecuperadaEmprestado === null) {
        console.log('Nenhum livro emprestado encontrado');
        return [];
    } else {
        console.log('Livros emprestados carregados');
        return JSON.parse(listaRecuperadaEmprestado);
    }
}


function exibirLivrosEmprestado() {
    console.log('Chamada para exibirLivrosEmprestado');
    const listaLivrosEmprestado = carregarLivrosEmprestado();
    console.log('Livros carregados:', listaLivrosEmprestado);
    const containerLista = document.getElementById("listaLivrosEmprestado");
   
    containerLista.innerHTML = "";

    if (listaLivrosEmprestado.length === 0) {
        containerLista.innerHTML = "<h1>Nenhum livro emprestado encontrado</h1>";
    } else {
        listaLivrosEmprestado.forEach((livro, index) => {
            const livroElement = document.createElement("div");
            livroElement.classList.add("item-lista");
            livroElement.innerHTML = `
                <div>
                    <p class="livro-info"><strong>Título:</strong> ${livro.titulo}</p>
                    <p class="livro-info"><strong>Autor:</strong> ${livro.autor}</p>
                </div>
                <div class="icon-container">
                    <i class="fas fa-sync-alt" onclick="devolver(${index})"></i>
                    
                </div>
            `;
            containerLista.appendChild(livroElement);
        });
    }
}




function devolver(index) {
    
    if(!confirm("Deseja devolver este livro")){
        return;
      }


    let listaLivrosEmprestado = carregarLivrosEmprestado();
    
    // Obtém o livro a ser devolvido
    let livroEmprestado = listaLivrosEmprestado[index];

    // Carrega a lista de livros originais
    let listaLivros = carregarDados();
    
    // Adiciona o livro devolvido à lista original
    listaLivros.unshift(livroEmprestado);
    
    // Remove o livro da lista de emprestados
    listaLivrosEmprestado.splice(index, 1);
    
    // Atualiza o localStorage com as listas atualizadas
    localStorage.setItem('Livro', JSON.stringify(listaLivros));
    localStorage.setItem('Emprestado', JSON.stringify(listaLivrosEmprestado));
    
    // Atualiza a exibição das listas (se necessário)
    if (document.getElementById('telaConsulta')) {
        exibirLivros();            
    } else if (document.getElementById('telaEmprestimo')) {
        exibirLivrosEmprestado();   
    }
}




