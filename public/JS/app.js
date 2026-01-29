const url = `http://localhost:3000/produtos`;

const btn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const icon = document.getElementById('ToogleIcon');
const listagem = document.getElementById('list');

let produtos = [];

btn.addEventListener('click', () => {
    nav.classList.toggle('active');
    icon.innerHTML = nav.classList.contains('active') ? '✖' : '☰';
});

const links = document.querySelectorAll('.nav-links li');

links.forEach(link => {
    link.addEventListener('click', () =>{
         nav.classList.remove('active');
    })
})



function ObterDados(){
   fetch(url)
   .then(res => {
        if(!res.ok){
            console.log("ERRO HTTP : " + res.status);
            return;
        }
        return res.json();
   })
   .then(data => {
        produtos = data;
        console.log(produtos);
        Listar(produtos);
   })
   .catch(erro => console.error("Erro ao buscar produtos:", erro));
}

function Listar(produtos){
    let stx ="";
    produtos.forEach(pro => {
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

window.addEventListener('load',ObterDados);

