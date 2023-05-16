Document.addEventListener('DOMContentLoaded', () => {
    const listElement = document.getElementById('list');
    const showPanelElement = document.getElementById('show-panel');
  
    // Fetch list of books and display their titles
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
  
          // Show book details when clicked
          li.addEventListener('click', () => {
            displayBookDetails(book);
          });
  
          listElement.appendChild(li);
        });
      });
  
    // Display book details
    function displayBookDetails(book) {
      showPanelElement.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnail}" alt="Book Thumbnail">
        <p>${book.description}</p>
        <ul id="users-liked"></ul>
        <button id="like-button">${book.users.includes(currentUserId) ? 'UNLIKE' : 'LIKE'}</button>
      `;
  
      const usersLikedElement = document.getElementById('users-liked');
      book.users.forEach(user => {
        const userLi = document.createElement('li');
        userLi.textContent = user.username;
        usersLikedElement.appendChild(userLi);
      });
  
      const likeButton = document.getElementById('like-button');
      likeButton.addEventListener('click', () => {
        toggleLikeBook(book);
      });
    }
  
    // Toggle like status of a book
    function toggleLikeBook(book) {
      const currentUserId = 1; // Replace with the actual current user ID
  
      if (book.users.includes(currentUserId)) {
        // User already liked the book, remove from list
        book.users = book.users.filter(user => user.id !== currentUserId);
      } else {
        // User hasn't liked the book, add to list
        book.users.push({ id: currentUserId, username: 'pouros' });
      }
  
      // Update the book on the server
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: book.users })
      })
      .then(response => response.json())
      .then(updatedBook => {
        displayBookDetails(updatedBook);
      })
      .catch(error => {
        console.error('Error updating book:', error);
      });
    }
  });
