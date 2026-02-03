
const url = `http://localhost:3000/produtos`;

const listagem = document.getElementById('list');
const tabela = document.getElementById('produtos-list');
const formulario = document.getElementById('cadProdutos');
const formularioAlterar = document.getElementById('alterar-produtos');
const botaoAbrirModal = document.querySelectorAll('.abrir-modal');
const botaoFecharModal = document.querySelectorAll('.fechar-modal');
const BotaoCancelarAlteracao = document.getElementById('cancelarAlteracao');
const botaoExcluir = document.getElementById('botaoExcluir');
const botaoCancelarExclusao = document.getElementById('cancelarExclusao');

let produtos = [];
let ProdutoSelecionado = null;

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

function ObterDadosLinhaTabela(idTabela) {
    const tabela = document.getElementById(idTabela);
    tabela.addEventListener('click', event => {
        const linha = event.target.closest('tr');
        if (!linha) return;
        const trs = tabela.querySelectorAll('tr');
        trs.forEach(linha => linha.classList.remove('active'));
        linha.classList.add('active');
        const dadosLinhaId = linha.dataset.id;
        ProdutoSelecionado = produtos.find(produto => (produto.id === dadosLinhaId));

    })
}

window.addEventListener('load', () => {
    ObterDados();
    if (tabela) {
        ObterDadosLinhaTabela('produtos-list');
    }
});

if (BotaoCancelarAlteracao) {
    BotaoCancelarAlteracao.addEventListener('click', () => {
        ResetarFormulario(formularioAlterar, tabela)
        const modal = BotaoCancelarAlteracao.closest('dialog');
        modal.close();
    })
}

botaoAbrirModal.forEach(btn => {
    btn.addEventListener('click', () => {
        let modal = null;
        if (btn.id === 'alterar') {
            if (!ProdutoSelecionado) {
                Alertar('notAlterarouDeletar', "Selecione uma produto para alteração");
                return;
            }
            modal = document.getElementById('modal-1');
            PreencherFormulario(ProdutoSelecionado);
            modal.showModal();
        }

        if (btn.id === 'deletar') {
            if (!ProdutoSelecionado) {
                Alertar('notAlterarouDeletar', "Selecione uma produto para exclusão");
                return;
            }
            modal = document.getElementById('modal-2');
            modal.showModal();
        }
    });
});


botaoFecharModal.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('dialog');
        ResetarFormulario(formulario, tabela);
        modal.close();
    });
});

function ResetarFormulario(formulario, tabela) {
    formulario.reset();
    ProdutoSelecionado = null;
    tabela.querySelectorAll('tr').forEach(tr => tr.classList.remove('active'));
}

function Alertar(id, string) {
    const span = document.getElementById(id);
    span.innerText = string;
    setTimeout(() => {
        span.innerText = "";
    }, 5000);
}



function ObterDadosLinhaTabela(idTabela) {
    const tabela = document.getElementById(idTabela);
    tabela.addEventListener('click', event => {
        const linha = event.target.closest('tr');
        if (!linha) return;
        tabela.querySelectorAll('tr').forEach(linha => linha.classList.remove('active'));

        linha.classList.add('active');
        const dadosLinhaId = linha.dataset.id;

        ProdutoSelecionado = produtos.find(produto => (produto.id === dadosLinhaId));
        console.log(ProdutoSelecionado);

    })
}



function PreencherFormulario(ProdutoSelecionado) {
    if (!ProdutoSelecionado) return;
    document.getElementById('alterar-titulo').value = ProdutoSelecionado.titulo;
    document.getElementById('alterar-descricao').value = ProdutoSelecionado.descricao;
    document.getElementById('alterar-detalhe').value = ProdutoSelecionado.detalhe;
    document.getElementById('alterar-preco').value = ProdutoSelecionado.preco;
    document.getElementById('alterar-quantidade').value = ProdutoSelecionado.quantidade;
}

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
        stx += `<tr data-id=${produto.id}>
                    <td data-label="Título">${produto.titulo}</td>
                    <td data-label="Preço">R$ ${produto.preco}</td>
                    <td data-label="Quantidade">${produto.quantidade}</td>
                </tr>`;
    })
    tabela.innerHTML = stx;
}

function AdicionarProduto() {

    const obj = {

        "titulo": document.getElementById('titulo').value.trim(),
        "descricao": document.getElementById('descricao').value.trim(),
        "detalhe": document.getElementById('detalhe').value.trim(),
        "preco": Number(document.getElementById('preco').value.trim()),
        "quantidade": Number(document.getElementById('quantidade').value.trim()),
    }
    if (!obj.titulo || !obj.descricao || !obj.preco || !detalhe || !obj.quantidade) {
        Alertar('notCadastro', "Preencha todos os campos antes de prosseguir");
        return;
    }

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    })
    .then(res => {
            if (!res.ok) {
                console.log(`Erro http: ${res.status}`);
                return;
            }
            return res.json();
    })
    .then(data => {
            alert("produto cadastrado com sucesso");
            formulario.reset();
            ObterDados();
    })
    .catch(e => {
            throw new Error(e.message)

    });
}
if (formularioAlterar) {
    formularioAlterar.addEventListener('submit', event => {
        event.preventDefault();
        AlterarProdutos(ProdutoSelecionado.id);
    })
}

function AlterarProdutos(id) {

    const obj = {

        "titulo": document.getElementById('alterar-titulo').value.trim(),
        "descricao": document.getElementById('alterar-descricao').value.trim(),
        "detalhe": document.getElementById('alterar-detalhe').value.trim(),
        "preco": Number(document.getElementById('alterar-preco').value.trim()),
        "quantidade": Number(document.getElementById('alterar-quantidade').value.trim()),
    }

    if (!obj.titulo || !obj.descricao || !obj.preco || !detalhe || !obj.quantidade) {
        Alertar('notCadastro', "Preencha todos os campos antes de prosseguir");
        return;
    }
    fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(obj)
    })
        .then(res => {
            if (!res.ok) {
                console.log(`Erro http ${res.status}`);
                return;
            }
            return res.json();
        })
        .then(data => {
            console.log('Produtos Alterado com sucesso');


        });
    ResetarFormulario(formularioAlterar, tabela);
    alert("produto Alterado com sucesso");
    document.getElementById('modal-1').close();
    ObterDados();
}


function Deletar(id) {
    fetch(`${url}/${id}`, {
        method: "DELETE",
    })
    ProdutoSelecionado = null;
    alert("produto deletado com sucesso");
    ObterDados();
}

if(botaoExcluir){
botaoExcluir.addEventListener('click', () => {
    Deletar(ProdutoSelecionado.id);
    tabela.querySelectorAll('tr').forEach(e => e.classList.remove('active'));
    const modal = document.getElementById('modal-2');
    modal.close();
});
}
if(botaoCancelarExclusao){
botaoCancelarExclusao.addEventListener('click', () => {
    tabela.querySelectorAll('tr').forEach(e => e.classList.remove('active'));
    ProdutoSelecionado = null;
    const modal = document.getElementById('modal-2');
    modal.close();
});
}


const search =  document.getElementById('pesquisar');
search.addEventListener('click', () => {
    const texto =  document.getElementById('searchBar').value.trim();
    let filtrar = produtos.filter(p => p.titulo.toUpperCase().includes(texto.toUpperCase()));
    Listar(filtrar);
});

document.getElementById('limpar').addEventListener('click', () => {
    document.getElementById('formularioPesquisa').reset();
    Listar(produtos);
})
const categorias = document.querySelector('.categorias');
if(categorias) {
categorias.addEventListener('click', event => {
    const li = event.target.closest('li');
    if(!li) return;
    const cat =  li.dataset.cat;
    const filtrado = produtos.filter( p => p.categoria.toUpperCase() === cat.toUpperCase());
    Listar(filtrado);
    });

}




