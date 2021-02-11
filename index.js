const xhr = new XMLHttpRequest();
const url = "https://www.googleapis.com/books/v1/volumes?q=";

function notUn(item, qtd){
    if(typeof item == "undefined") return("?");

    else{
        if(item.length > qtd) return item.substring(0, qtd) + "...";
        else return item;
    }
}

function loadDetails(link){
    let autores = "";
    let loop  = true;

    document.querySelector("body").style = "justify-content: space-evenly";

    document.querySelector("footer").innerHTML = "<img src='imagens/loading.gif' width='100px'>";

    new Promise((resolve, reject) => {
        setTimeout(() => { 
            reject();
        }, 10000);
    }).catch(err => {
        if(loop == true) document.querySelector("footer").innerHTML = "<p><img src='imagens/error.png' width='50px'></p>";
    });

    fetch(link.id).then(res => res.json()).then(livros => {
        for(let j = 0; j < livros.volumeInfo.authors.length; j++){
            if(j == 0) autores = livros.volumeInfo.authors[j];
    
            else if(j > 0){
                if(j != (livros.volumeInfo.authors.length - 1)) autores += ", " + livros.volumeInfo.authors[j];
                else autores += " e " + livros.volumeInfo.authors[j];
            }
        }

        loop = false;

        document.querySelector("body").style = "justify-content: space-between";

        document.querySelector("footer").innerHTML = "<div class='container'><table><tr><td align='center'><img src='" + livros.volumeInfo.imageLinks.thumbnail + "'><br></td></tr><tr><td><br></td></tr><tr><td><b>Título:</b> " + notUn(livros.volumeInfo.title, 100) + "</td></tr><tr><td><b>Autores:</b> " + notUn(autores, 100) + "</td></tr><tr><td><b>Editora:</b> " + livros.volumeInfo.publisher + "</td></tr><tr><td><b>Publicação:</b> " + livros.volumeInfo.publishedDate + "</td></tr><tr><td><b>Páginas:</b> " + livros.volumeInfo.pageCount + "</td></tr><tr><td>&nbsp;<br></td></tr><tr><td style='text-align: center'><a href='"+ livros.volumeInfo.infoLink +"' target='_blank'>Saiba mais</a>&nbsp;&nbsp;&nbsp;<a href='"+ livros.accessInfo.webReaderLink +"' target='_blank'>Preview</a></td></tr></table></div>";
    });
}

function submitForm(){
    document.querySelector("body").style = "justify-content: space-evenly";
    let loop = true;

    new Promise((resolve, reject) => {
        setTimeout(() => { 
            reject();
        }, 10000);
    }).catch(err => {
        if(loop == true) document.querySelector("footer").innerHTML = "<p><img src='imagens/error.png' width='50px'></p>";
    });
    

    let titulo = document.getElementById("titulo").value; 
    let autor = document.getElementById("autor").value; 
    let assunto = document.getElementById("assunto").value;

    let params = "";

    if(titulo.length >= 1 || autor.length >= 1 || assunto.length >= 1){
        document.querySelector("footer").innerHTML = "<img src='imagens/loading.gif' width='100px'>";

        if(titulo.length >= 1) params +="+intitle:" + titulo;
        if(autor.length >= 1) params += "+inauthor:" + autor;
        if(assunto.length >= 1) params += "+subject:" + assunto;

        params += "&printType=books&orderBy=relevance";

        xhr.open("GET", url + params);

        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let livros = JSON.parse(this.responseText);
                let autores = "";

                loop = false;
                document.querySelector("footer").innerHTML = "";

                if(typeof livros.items != "undefined"){
                    for(let i = 0; i < 10; i++){
                        for(let j = 0; j < livros.items[i].volumeInfo.authors.length; j++){
                            if(j == 0) autores = livros.items[i].volumeInfo.authors[j];

                            else if(j > 0){
                                if(j != (livros.items[i].volumeInfo.authors.length - 1)) autores += ", " + livros.items[i].volumeInfo.authors[j];
                                else autores += " e " + livros.items[i].volumeInfo.authors[j];
                            }
                        }

                        document.querySelector("body").style = "justify-content: space-between";

                        document.querySelector("footer").innerHTML += "<div class='containerd'><table><tr><td rowspan='4'><img src='" + livros.items[i].volumeInfo.imageLinks.smallThumbnail + "' height='125px'></td><td rowspan='4'>&nbsp;</td><td><b>Título:</b> " + notUn(livros.items[i].volumeInfo.title, 65) + "</td></tr><tr><td><b>Autores:</b> " + notUn(autores, 35) + "</td></tr><tr><td><b>Editora:</b> " + notUn(livros.items[i].volumeInfo.publisher, 35) + "</td></tr><tr><td><b>Publicação:</b> " + notUn(livros.items[i].volumeInfo.publishedDate) + "</td></tr><tr><td align='center' colspan='3'><br><br><b><a href='#' id='"+ livros.items[i].selfLink +"' onclick='loadDetails(this)'>Detalhes</a></b></td></tr></table></div>";
                    }
                }

                else{
                    document.querySelector("footer").innerHTML = "<p><img src='imagens/404.png' width='50px'></p>";
                }
            }
        }

        xhr.send();
    }

    else{
        alert("Você não pode fazer uma pesquisa vazia!");
    }
}

document.getElementById("enviar").addEventListener("click", submitForm);
document.getElementById("titulo").onkeydown = function(e){ if(e.keyCode == 13) submitForm(); };
document.getElementById("autor").onkeydown = function(e){ if(e.keyCode == 13) submitForm(); };
document.getElementById("assunto").onkeydown = function(e){ if(e.keyCode == 13) submitForm(); };