const categoriesContainer = document.getElementById("categories-container");
const mobileNavbar = document.getElementById("mobile-navbar");

const loadCategories = async()=>{
    const response = await fetch("https://news-api-fs.vercel.app/api/categories")
    const data = await response.json();
    displayCategories(data.categories)
}

const displayCategories = (categories)=>{
    // console.log(data)
    categories.forEach(category => {
        categoriesContainer.innerHTML += `
            <li class="cursor-pointer text-lg mr-2 hover:border-b-4 hover:border-red-600">${category.title}</li> `
    });

    categories.forEach(category => {
        mobileNavbar.innerHTML += `
            <li class="cursor-pointer block text-lg ml-4 mb-3 list-none">${category.title}</li>
        `
    });
    
}

loadCategories();