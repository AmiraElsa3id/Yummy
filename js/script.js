$(document).ready(function () {
    searchMeal(" ");
    $('.loading').fadeOut(500, () => {
        $('.loading').addClass("d-none")
    })
    $('.inner-loading').fadeOut(0)
})
let rowData;
async function searchMeal(mealName) {
    // www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    let data = await res.json();
    console.log(data);
    rowData = data.meals?data.meals.slice(0,20):data.meals;

    return rowData;
}
function displayMeal(arr) {
    $('#rowData').removeClass("d-none")
    if (arr != null) {
        let box = ``
        for (let i = 0; i < arr.length; i++) {
            box += `
    <div class="col-md-3">
                <div onclick="getMealById(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
    `
        }
        $('#rowData').html(box)
    }
    else {
        $('#rowData').html("")
    }

}
async function run() {
    await searchMeal(" ");
    displayMeal(rowData);
}
run();
function closeNav() {
    let navWidth = $('.nav-tab').outerWidth();
    $('.side-nav-menu').animate({ left: -navWidth + 'px' }, 400)
    $('.open-close-icon').addClass("fa-align-justify")
    $('.open-close-icon').removeClass("fa-x")
    for (let i = 0; i < $(".links li").length; i++) {
        $(".links li").animate({ top: "300px" }, 100);
    }
}
function openNav() {
    $('.side-nav-menu').animate({ left: 0 }, 300)
    $('.open-close-icon').removeClass("fa-align-justify")
    $('.open-close-icon').addClass("fa-x")
    for (let i = 0; i < $(".links li").length; i++) {
        $(".links li").eq(i).animate({ top: "0px" }, (i + 1) * 100);
    }

}
// closeNav();
$('.open-close-icon').click(function () {
    let sideNavLeft = $('.side-nav-menu').offset().left;
    if (sideNavLeft == 0) {
        // close nav
        closeNav();
    } else {
        openNav();
    }
})




async function getMealById(id) {
    $('.inner-loading').fadeIn(300)
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let data = await res.json();
    await displayMealDetails(data.meals[0]);
}

function displayMealDetails(data) {
    
    $(".mealDetailsContainer").removeClass("d-none")
    // $('#searchContainer').addClass('d-none');
    let recipes = ``;
    for (i = 0; i <= 20; i++) {
        if (data[`strIngredient${i}`] && data[`strMeasure${i}`]) {
            recipes += `
        <li class="alert alert-info m-2 p-1">${data[`strMeasure${i}`] + " " + data[`strIngredient${i}`]}</li>
        `
        }
    }
    let tags = data.strTags ? data.strTags.split(",") : "";
    let tagList = ``;
    for (i = 0; i < tags.length; i++) {
        tagList += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
        `
    }
    console.log(tags)
    // let tagList =tags.forEach(tag => {
    //     return'<li class="alert alert-danger m-2 p-1">tag</li>'
    // });
    let box = `
    <div class="col-md-4">
                <img class="w-100 rounded-3 mealPhoto" src=${data.strMealThumb} alt="">
                    <h2 class="my-3 mealName">${data.strMeal}</h2>
            </div>
            <div class="col-md-7">
                <h2 class="instruction">Instructions</h2>
                <p>${data.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${data.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${data.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${recipes}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagList}
                </ul>
                <a target="_blank" href="${data.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${data.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
            <div class=" position-absolute top-0 end-0 p-5">
            <i onclick="closeMealDetails()"class="fa-solid fa-x fa-2x text-light close-btn"></i></div>
    `;
    $('#rowData').addClass('d-none')
    $('#mealDetails').removeClass("d-none").html(box);
    $('.inner-loading').fadeOut(300)
}

function closeMealDetails() {
    $('.inner-loading').fadeIn(300)
    $('#mealDetails').addClass("d-none")
    $('#rowData').removeClass('d-none')
    $('.inner-loading').fadeOut(300)
    $('.mealDetailsContainer').addClass('d-none')
}
$('#search').click(function () {

    closeNav();
    closeMealDetails();
    $('#rowData').addClass('d-none');
    $('#searchContainer').removeClass('d-none');
    $('#searchContainer .name-search').val("");
    $('#searchContainer .letter-search').val("");
})
$('.name-search').keyup(async function () {
    let search = $(this).val().toLowerCase();
    rowData = await searchMeal(search);
    await displayMeal(rowData);

})


$('.letter-search').keyup(async function () {
    rowData = {}
    let search = $(this).val().toLowerCase();
    rowData = await searchMeal(search);
    await displayMeal(rowData);

})

async function searchByLetter(Letter) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${Letter}`);
    let data = await res.json();
    console.log(data);
    rowData = data.meals.slice(0,20);
    return rowData;
}

$('#category').click(async function () {
    closeNav();
    rowData = {};
    closeMealDetails();
    getCategories();

    $('#rowData').addClass('d-none');
    $('#searchContainer').addClass('d-none');

})
async function getCategories() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await res.json();
    console.log(data);
    rowData = data.categories.slice(0,20);
    displayCategory(rowData)
    return rowData;
}
function displayCategory(data) {
    console.log(data.length)
    if (data != null) {
        let box = ``;
        data.forEach(element => {
            box += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('Beef')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${element.strCategoryThumb}" alt="" >
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${element.strCategory}</h3>
                        <p>${element.strCategoryDescription}</p>
                    </div>
                </div>
        </div>
        `
        })
        $('#rowData').removeClass('d-none');
        $('#rowData').html(box);
    }
    else {
        $('#rowData').html('');
    }
    

}
async function getCategoryMeals(category) {
    $('.inner-loading').fadeIn(300)
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await res.json();
    console.log(data);
    rowData = data.meals.slice(0,20);
    displayMeal(rowData)
    $('.inner-loading').fadeOut(300)
    console.log(rowData.length)
    return rowData;
}
$('#area').click(async function () {
    closeNav();
    rowData = {};
    closeMealDetails();
    getArea();

    $('#rowData').addClass('d-none');
    // $('#searchContainer').addClass('d-none');

})
async function getArea() {
   
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await res.json();
    console.log(data);
    rowData = data.meals.slice(0,20);
    displayArea(rowData)
    return rowData;
}
function displayArea(data) {
    console.log(data.length)
    if (data != null) {
        let box = ``;
        data.forEach(element => {
            box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${element.strArea.toLowerCase()}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${element.strArea}</h3>
                </div>
        </div>
         `
        })
        $('#rowData').removeClass('d-none');
        $('#rowData').html(box);
    }
    else {
        $('#rowData').html('');
    }

}

async function getAreaMeals(area) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await res.json();
    console.log(data);
    rowData = data.meals.slice(0,20);
    displayMeal(rowData)
    return rowData;
}
$('#ingredients').click(async function () {
    closeNav();
    rowData = {};
    closeMealDetails();
    getIngrediant();

    $('#rowData').addClass('d-none');
    $('#searchContainer').addClass('d-none');

})

async function getIngrediant() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let data = await res.json();
    console.log(data);
    rowData = data.meals.slice(0,20);
    displayIngrediant(rowData)
    return rowData;
}


async function getIngredientsMeals(Ingrediant) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingrediant}`);
    let data = await res.json();
    console.log(data);
     rowData = await data.meals.slice(0,20);
    await displayMeal(rowData)
    return rowData;
}
async function displayIngrediant(data) {
    if (await data != null) {
        let desc;
        // console.log(data.strDescription)
        // desc = data.strDescription ? data.strDescription.split(" ").slice(0,20).join(" "):'No Description';
        let box = ``;
        data.forEach(element => {
            desc = element.strDescription ? element.strDescription.split(" ").slice(0,20).join(" "):'No Description';
            box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${element.strIngredient.toLowerCase()}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${element.strIngredient}</h3>
                        <p>${desc}</p>
                </div>
        </div>
         `
        })
        $('#rowData').removeClass('d-none');
        $('#rowData').html(box);
    }
    else {
        $('#rowData').html('');
    }

}
$('#contactUs').click(async function () {
    closeNav();
    rowData = {};
    $('#rowData').html();
    closeMealDetails();
    showContacts() ;
    // $('#rowData').addClass('d-none');
    $('#searchContainer').addClass('d-none');

})

function showContacts() {
    $('#rowData').html (`<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `) 
    submitBtn = $("#submitBtn")


    $("#nameInput").focus( () => {
        nameInputFocused = true
    })

    $("#emailInput").focus( () => {
        emailInputFocused = true
    })

    $("#phoneInput").focus( () => {
        phoneInputFocused = true
    })

    $("#ageInput").focus( () => {
        ageInputFocused = true
    })

    $("#passwordInput").focus( () => {
        passwordInputFocused = true
    })

    $("#repasswordInput").focus( () => {
        repasswordInputFocused = true
    })
}



let nameInputFocused = false;
let emailInputFocused = false;
let phoneInputFocused = false;
let ageInputFocused = false;
let passwordInputFocused = false;
let repasswordInputFocused = false;


function inputsValidation() {
    if (nameInputFocused) {
        if (nameValidation()) {
            $("#nameAlert").removeClass("d-block").addClass( "d-none")

        } else {
            $("#nameAlert").removeClass("d-none").addClass("d-block")

        }
    }
    if (emailInputFocused) {

        if (emailValidation()) {
            $("#emailAlert").removeClass("d-block").addClass( "d-none")
        } else {
            $("#emailAlert").removeClass("d-none").addClass("d-block")

        }
    }

    if (phoneInputFocused) {
        if (phoneValidation()) {
            $("#phoneAlert").removeClass("d-block").addClass( "d-none")
        } else {
            $("#phoneAlert").removeClass("d-none").addClass("d-block")

        }
    }

    if (ageInputFocused) {
        if (ageValidation()) {
            $("#ageAlert").removeClass("d-block").addClass( "d-none")
        } else {
            $("#ageAlert").removeClass("d-none").addClass("d-block")

        }
    }

    if (passwordInputFocused) {
        if (passwordValidation()) {
            $("#passwordAlert").removeClass("d-block").addClass( "d-none")
        } else {
            $("#passwordAlert").removeClass("d-none").addClass("d-block")

        }
    }
    if (repasswordInputFocused) {
        if (repasswordValidation()) {
            $("#repasswordAlert").removeClass("d-block").addClass( "d-none")
        } else {
            $("#repasswordAlert").removeClass("d-none").addClass("d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttr("disabled")
    } else {
        submitBtn.attr("disabled", "disabled")
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test($("#nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val()))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val()))
}

function repasswordValidation() {
    return $("#repasswordInput").val() ==$("#passwordInput").val()
}