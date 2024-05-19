document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('commentForm');
  const commentContent = document.getElementById('commentContent');
  const commentList = document.getElementById('commentList');
  const articleId = document.getElementById('articleId').value;

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = commentContent.value.trim();
    if (content) {
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content, articleId })
        });

        if (response.ok) {
          const data = await response.json();
          displayComment(data.message);
          commentContent.value = '';
        } else {
          const error = await response.json();
          displayComment(error.message, true);
        }
      } catch (error) {
        console.error('Error:', error);
        console.error(error.stack);
        displayComment('An error occurred while submitting the comment.', true);
      }
    }
  });

  function displayComment(message, isError = false) {
    const li = document.createElement('li');
    li.textContent = message;
    li.style.color = isError ? 'red' : 'green';
    commentList.appendChild(li);
  }
});