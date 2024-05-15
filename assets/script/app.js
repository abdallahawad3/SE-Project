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