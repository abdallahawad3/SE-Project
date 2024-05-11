// DOM elements
let posts = document.getElementById("posts");
// const baseUrl = "https://tarmeezacademy.com/api/v1/"
const addPostBtn = document.getElementById("add-post");
const updatePostButton = document.getElementById("update-post");
const deletePostButton = document.getElementById("deletePostBtn");
// Pagination and loading variables //
let lastPage;
let isLoading = false;
let currentPage = 1;
// Initial setup and data fetch
fetchAllPosts(currentPage);

// Event listener for scroll events
window.addEventListener("scroll", () => {
  // Check if the user has reached the end of the page
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  // Trigger data fetch when conditions are met
  if (endOfPage && currentPage < lastPage && !isLoading) {
    isLoading = true;

    // Display a loading indicator to inform the user
    showLoadingIndicator();

    fetchAllPosts(currentPage)
      .then(() => {
        isLoading = false;
        currentPage += 1;
        // Hide the loading indicator on successful data fetch
        hideLoadingIndicator();
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        isLoading = false;
        // Display an error message to the user
        showErrorMessage("Failed to fetch data. Please check your internet connection.");
      });
  }
});

// Create a function that retrieves all data and then passes it to the displayAllPosts() function.
async function fetchAllPosts(page) {
  try {
    let request = fetch(`${baseUrl}posts?limit=10&page=${page}`);
    let response = await request;
    let data = await response.json();
    lastPage = data.meta.last_page;
    displayAllPosts(data.data)
  } catch (error) {

    console.log(error);
  }
}
function displayAllPosts(object) {
    let temp = "";
    let currentUser = JSON.parse(window.localStorage.getItem("user"));
    let editButtonContent = ``;
  
    object.forEach(element => {
      if (currentUser !== null && currentUser.id !== null && currentUser.id === element.author.id) {
        editButtonContent = `
          <button class = "btn btn-secondary p-1 px-2" onclick="editPost('${encodeURIComponent(JSON.stringify(element))}')" >EDIT</button>
          <button class = "btn btn-danger p-1 px-2" onclick = "deletePost('${encodeURIComponent(JSON.stringify(element))}')">Delete</button>
        `
      } else {
        editButtonContent = ``;
      }
      temp = `
      <div class="card col-12 col-lg-9 mx-auto shadow-lg mb-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <div onclick = "showUserPosts(${element.author.id})">
          <img src="${typeof element.author.profile_image === 'string' ? element.author.profile_image : 'https://placehold.co/50'}" alt="User image">
          <span class="fw-bold">${typeof element.author.username == 'string' ? element.author.username : "UserName"}</span>
        </div>
        <div>
          ${editButtonContent}
        </div>
      </div>
      <div class="card-body" onclick="postClicked(${element.id})">
        <div class="card-image">
          <img class="w-100" src="${typeof element.image == 'string' ? element.image : "https://placehold.co/600x400"}"
            alt="main image">
        </div>
        <div class="card-info border-bottom">
          <h6 class="text-black-50 mt-1">${element.created_at}</h6>
          <h5>${typeof element.title == 'string' ? element.title : "title"}</h5>
          <p>${typeof element.body == 'string' ? element.body : "text of body"}</p>
        </div>
  
        <div class="card-tags mt-2 d-flex align-items-center gap-3">
              <div class="comments d-flex align-items-center gap-1">
                <i class="bi bi-pen"></i>
                <p class="mb-0">
                  <span>(${element.comments_count}) </span>Comments
                </p>
              </div>
            </div>
      </div>
    </div>
      `
      posts.innerHTML += temp;
    });
  
  };

  // Event listener for the addPostBtn click
addPostBtn.addEventListener("click", () => {
    // Retrieving values from input fields
    let title = document.getElementById("tittle").value;
    let body = document.getElementById("body-for-post").value;
    let image = document.getElementById("formimage").files[0];
    // Calling the addNewPost function with the provided data
    addNewPost(title, body, image);
  });
