const url = `http://localhost:3000/produtos`;

const listagem = document.getElementById('list');
const tabela = document.getElementById('produtos-list');

let produtos = [];

 function ObterDados() {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                console.log("ERRO HTTP : " + res.status);
                return;
            }
            return res.json();
        })
        .then(data => {
            produtos = data;
            if (listagem) {
                Listar(produtos);
            }
            if (tabela) {
                listarProdutosTabela();
            }
        })
}

window.addEventListener('load', () => {
    ObterDados();
});

function Listar(array) {
    if (!listagem) return; 
    let stx = "";
    array.forEach(pro => {
        stx += ` <div class="produto">
                    <img src="${pro.imagem}" alt="Camisa 1">
                    <div class="informacoes">
                        <h3>${pro.titulo}</h3><span class="preco">${pro.preco}</span>
                        <p>${pro.descricao}</p>
                        <p> qtd: <span class="quantidade">${pro.quantidade}</span> unidades</p>
                        <button class="btnComprar">Comprar</button>
                    </div>
                </div>`;
    })
    listagem.innerHTML = stx;
}


async function listarProdutosTabela() {
    const tabela = document.getElementById('produtos-list');
    if (!tabela) return; 
    let stx = "";
    produtos.forEach(produto => {
        stx += `<tr data-id="${produto.id}">
                    <td data-label="Título">${produto.titulo}</td>
                    <td data-label="Preço">R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                    <td data-label="Quantidade">${produto.quantidade}</td>
                </tr>`;
    })
    tabela.innerHTML = stx;
}




