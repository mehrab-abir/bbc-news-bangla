const categoriesContainer = document.getElementById("categories-container");
const newsContainer = document.getElementById("newsContainer");

const loadCategories = async()=>{

    try {
        const response = await fetch("https://news-api-fs.vercel.app/api/categories")
        const data = await response.json();
        displayCategories(data.categories)
    } catch (error) {
        console.log("Error: ",error);
    }
    
}

const loadCategoriesMobile = async()=>{

    try {
        const response = await fetch("https://news-api-fs.vercel.app/api/categories")
        const data = await response.json();
        displayCategoriesMobile(data.categories)
    } catch (error) {
        console.log("Error: ",error);
    }
    
}

const displayCategories = (categories)=>{
    // console.log(data)
    categories.forEach(category => {
        categoriesContainer.innerHTML += `
            <li id="${category.id}" class="cursor-pointer text-lg mr-2 hover:border-b-4 hover:border-red-600 list-item">${category.title}</li> `
    });


    //active category
    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item =>{
        
        //main page's category will have 'active' indicator by default
        if(item.id === 'main'){
            item.classList.add('active')
        }

        item.addEventListener('click',(event)=>{
            listItems.forEach(li => li.classList.remove('active'))

            const activeCategory = event.target;
            activeCategory.classList.add('active');

            loadCategoryData(event.target.id) //after clicking on a news category
        })
    })
}

loadCategories();
loadCategoriesMobile();

//for mobile device ===========================================================

//mbile nav
const menuSwicth = document.getElementById("mobileMenuSwitch");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuSwicth.addEventListener('click',function(){
    mobileMenu.classList.remove('-translate-x-full');
})
menuCloseBtn.addEventListener('click',function(){
    mobileMenu.classList.add('-translate-x-full');
})

const bookmarkBtnMobile = document.getElementById("bookmarkBtnMobile");
bookmarkBtnMobile.addEventListener('click',function(){
    mobileMenu.classList.add('-translate-x-full');
})

const categoriesContainerMobile = document.getElementById("categories-container-mobile");

const displayCategoriesMobile = (categories) =>{
    categories.forEach(category => {
        categoriesContainerMobile.innerHTML += `
            <li id="${category.id}" class="mt-3 text-lg border-b border-gray-500 py-3 pl-2 mobile-list-item"><a href="#">${category.title}</a></li>`
    });

    const mobileListItems = document.querySelectorAll('.mobile-list-item');

    mobileListItems.forEach(item =>{
        item.addEventListener('click',(event)=>{
            event.preventDefault();

            loadCategoryData(event.currentTarget.id) //after clicking on a news category

            mobileMenu.classList.add('-translate-x-full');
        })
    })
}

loadCategoryData('main'); //news of main page will be loaded and displayed by default, right after the script runs

function loadCategoryData(id){
    fetch(`https://news-api-fs.vercel.app/api/categories/${id}`)
    .then(res => {
        return res.json()
    })
    .then(data => displayCategoryData(data.articles))
    .catch(err => {
        newsContainer.innerHTML = `
                <div class="col-span-3 px-6 py-16 border border-gray-500 text-center mt-16">
                    <h1 class="text-xl text-red-600">Something went wrong!!</h1>
                    <p>Please try a different one</p>
                </div>
                `
        console.log("Error loading category data: ",err)
    })
}

function displayCategoryData(articles){

    if(articles.length == 0){
        newsContainer.innerHTML = `
            <div class="col-span-3 px-6 py-16 border border-gray-500 text-center mt-16">
                <h1 class="text-xl text-red-600">No News available in this category right now</h1>
                <p>Please try a different one</p>
            </div>
        `
        return;
    }

    newsContainer.innerHTML = '';

    articles.forEach(article =>{
        newsContainer.innerHTML += `
            <div class="newsCard border border-gray-400 px-3 py-2 rounded-lg">
                <div>
                    <img src="${article.image.srcset[8].url}"/>
                </div>
                <h1 class="text-lg font-bold mt-2">${article.title}</h1>
                <p class="text-sm mt-1">${article.time}</p>
                <div class="btns mt-3">
                    <button class="btn btn-default mt-2" id="${article.id}">Bookmark</button>
                    <button class="btn btn-default mt-2" id="${article.id}">View Details</button>
                </div>
            </div>
        `
    })
}

//adding bookmark
const bookmarkContainer = document.getElementById("bookmarks");
let bookmarks = [];

newsContainer.addEventListener('click',function(event){
    if(event.target.innerText === "Bookmark"){
        handleBookmark(event)
    }
})

newsContainer.addEventListener('click',function(event){
    if(event.target.innerText === "View Details"){
        newsDetails(event)
    }
})

function handleBookmark(event){

    const newsTitle = event.target.parentNode.parentNode.children[1].innerText;
    const newsId = event.target.id;

    const bookmark = {
        title : newsTitle,
        id : newsId
    }
            
    let exist = bookmarks.find(bookmark => bookmark.id === newsId);

    if(!exist){
        bookmarks.push(bookmark);
    }
    else{
        alert("This news already added to bookmark");
    }

    showBookMarks(bookmarks);

}

const showBookMarks = (bookmarks)=>{
    bookmarkContainer.innerHTML = '';

    bookmarks.forEach(bookmark => {
        const newBookmark = document.createElement('div');

        newBookmark.innerHTML = `
            <div class="p-3 mt-2 border-b border-gray-500">
                <h1 class="text-lf font-semibold">${bookmark.title}</h1>
                <button class="btn mt-2" id="${bookmark.id}">Delete</button>
            </div>
        `
        bookmarkContainer.appendChild(newBookmark)
    })

    const bookmarkCounter = document.querySelector('.bookmarkCounter');
    bookmarkCounter.innerText = bookmarks.length;
}

const detailsModal = document.getElementById("detailsModal");
const modalBox = document.querySelector(".modal-box");

const newsDetails =(event)=>{

    const newsId = event.target.id;
    
    fetch(`https://news-api-fs.vercel.app/api/news/${newsId}`)
    .then(res => res.json())
    .then(data => showNewsDetails(data.article))
    .catch(error => console.log("Error: ",error))
}

const showNewsDetails = (articles)=>{
    detailsModal.showModal();

    modalBox.innerHTML = `
        <img src="${articles.images[0].url}"/>
        <h1 class="text-lg font-bold">${articles.title}</h1>
        <span class="text-sm mt-2 text-gray-500">${articles.timestamp}</span>
        <p class="py-4">${articles.content.join('')}</p>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
        </div>
    `
}

//delete bookmark
bookmarkContainer.addEventListener('click',function(event){
    if(event.target.innerText === "Delete"){
        deleteBookmark(event);
    }
})

const deleteBookmark = (event)=>{ 
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== event.target.id);
    bookmarks = updatedBookmarks;
    showBookMarks(bookmarks);
}






