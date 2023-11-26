//* todo yapılacaklar projesi 


//! ToUI   = arayuze ekleme class name
//! check  =  control etmek class name

//! e.preventdefault(); = baska bir sayfaya gitmemesi icin
//! e.target = kulanıcının bastıgı yeri alma, input icindeki degeri alma

/* */

//Tum elementerli secme

let form = document.querySelector("#todoAddForm");
let addInput = document.querySelector("#todoName");
let todoList = document.querySelector(".list-group");
let firstCardBody = document.querySelectorAll(".card-body")[0];
let secondCardBody = document.querySelectorAll(".card-body")[1];
let ClearButton = document.querySelector("#clearButton");
let filerInput = document.querySelector("#todoSearch");
let todos = [];

runEvents();

function runEvents() {

    form.addEventListener("submit", addTodo); //? buttona basıldı mı addTodo metoduna git
    document.addEventListener("DOMContentLoaded", pageLoaded); //? sayfa yenilendiginde calısacak metod
    secondCardBody.addEventListener("click", removeTodoUI);
    ClearButton.addEventListener("click", allTodosEveryWhere)
    filerInput.addEventListener("keyup", filter);

}

function pageLoaded() {
    checkTodosFromStorage(); //? todoları storage den alıyor
    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })

}

function filter(e) {

    let filterValue = e.target.value.toLowerCase().trim(); //? inputa girlen degeri al kucuk harfe cevir bosluk temizle
    let todolistesi = document.querySelectorAll(".list-group-item");

    if (todolistesi.length > 0) { //? todo icinde deger varmı ona gore flite yapacak

        todolistesi.forEach(function (todo) {
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) { //? girilen deger todo icindeki degeri iceriyor mu 
                todo.setAttribute("style","display: block");
            }
            else{
                todo.setAttribute("style","display: none !important");  //? boostrapın kodu onceilk bizim kod calısması icin inportant ediyoruz.

            }
        })
    }else{
        showAlert("warning","Yapılacaklar listesi boş");
    }

}


function allTodosEveryWhere() {
    let todoListesi = document.querySelectorAll(".list-group-item");
    if (todoListesi.length > 0) {
        //ekrandan temizleme
        todoListesi.forEach(function (todo) {
            todo.remove();

        })
        //storage den silme
        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos));
        showAlert("success", "başarılı bir sekilde silme islemi gerceklesti");
    } else {
        //sileinecek todo yoksa uyar
        showAlert("warning", "silmek icin en az bir todo olmalıdır.")
    }
}

function removeTodoUI(e) {

    // console.log(e.target);  //? tıklanılan eventi getiriyor.
    //secilene gore silme
    if (e.target.className == "fa fa-remove") { //? kulanıcının bastıgı etiket fa fa ise 
        //ekrandan silme
        let todo = e.target.parentElement.parentElement; //? todo icon iki ust kapsayıcısına cık li al todo icine at remove et
        todo.remove();
        //storage'den silme
        removeTodoToStorage(todo.textContent);

        showAlert("success", "Todo Basarılı bir sekilde silinmistir.")
    }

}

function removeTodoToStorage(removeTodo) {

    checkTodosFromStorage(); //? guncel todokları al
    todos.forEach(function (todo, index) { //? storagelerde don todosunu ve indexini al
        if (removeTodo == todo) { //? storgedeki deger dısarıdan gelen deger esit mi ?
            todos.splice(index, 1); //? storage den aldıgın arrayı, 1 tane deger sil
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos)); //? guncel degeri de getir en son
}

function addTodo(e) {

    let inputText = addInput.value.trim(); //? inputun value boslukları siliyor inputText icine at
    if (inputText == null || inputText == "") { //? input null ve bos gecilemez.
        showAlert("warning", "Bos gecilemez!")
    } else {
        //Arayuze ekleme 
        addTodoToUI(inputText); //? metodu cagır inputTexti ver

        //storage ye ekleme 
        addTodoStorage(inputText);

        //alert ile uyarı verme
        showAlert("success", "todo listesi eklendi"); //? 2 tip parametre alıyor 1-tip, 2-mesaj alıyor.

    }
    // e.preventdefault();

}

function addTodoToUI(newTodo) { //? input da ki deger newTodo da, asagıda olusturulan element ile ekleniyor.

    /*
        <li class="list-group-item d-flex justify-content-between">Todo 1
            <a href="#" class="delete-item">
                <i class="fa fa-remove"></i>
            </a>
        </li>
    */

    let li = document.createElement("li"); //? li-a-i html elemnterini oluşturduk
    li.className = "list-group-item d-flex justify-content-between"
    li.textContent = newTodo;

    let a = document.createElement("a");
    a.href = "#";
    a.className = "delete.item";

    let i = document.createElement("i");
    i.className = "fa fa-remove";

    a.appendChild(i); //! appendchiled = ile neyin icinde gosterilecegi, ilk kapsayıcı adı gelecek
    li.appendChild(a);
    todoList.appendChild(li);

    addInput.value = ""; //? ekleme sonrası input temizle
}


function addTodoStorage(newTodo) {
    checkTodosFromStorage();
    todos.push(newTodo); //? olan dizenin icine yeni gelen degeri ekle
    localStorage.setItem("todos", JSON.stringify(todos)); //? guncel halini yazdır ekrana
}

function checkTodosFromStorage() { //? local storage de "todos" adında deger varmı , (kontrolun amacı eski veri gitmemesi)
    if (localStorage.getItem("todos") == null) {
        todos = [] //? storage ici bos ise bos dizi ile baslat
    } else {
        todos = JSON.parse(localStorage.getItem("todos")); //? deger varsa al ve todosun icine at 
    }
}

function showAlert(type, message) { //? 2 tane metod name ile de kulanılıyor araya , atarak
    /*
    <div class="alert alert-warning" role="alert">
        This is a warning alert—check it out!
    </div>
    */

    let div = document.createElement("div");
    div.className = "alert alert-" + type; //? type den gelen degere gore alert degisiyor
    div.textContent = message; //? message'den gelen degere gore yazdır

    firstCardBody.appendChild(div);

    setTimeout(function () { //? 2.5s sonra function calıstır
        div.remove(); //? alert cıktıktan 2.5s sonra kaldır
    }, 2500);
}