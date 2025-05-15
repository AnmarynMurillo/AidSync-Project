// Cargar comentarios almacenados al cargar la página
document.addEventListener('DOMContentLoaded', loadComments);

function loadComments() {
  const commentsList = document.getElementById('comments-list');
  const comments = JSON.parse(localStorage.getItem('comments')) || [];

  commentsList.innerHTML = '';
  comments.forEach(comment => {
    const commentElement = createCommentElement(comment.name, comment.content, comment.timestamp, comment.replies);
    commentsList.appendChild(commentElement);
  });
}

function addComment() {
  const name = document.getElementById('name').value;
  const content = document.getElementById('content').value;

  if (name && content) {
    const timestamp = new Date().toLocaleString();
    const comment = { name, content, timestamp, replies: [] };
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));

    const commentsList = document.getElementById('comments-list');
    const commentElement = createCommentElement(name, content, timestamp, []);
    commentsList.appendChild(commentElement);

    // Limpiar los campos del formulario
    document.getElementById('name').value = '';
    document.getElementById('content').value = '';
  }
}

function addReply(commentIndex) {
  const name = document.getElementById(`reply-name-${commentIndex}`).value;
  const content = document.getElementById(`reply-content-${commentIndex}`).value;

  if (name && content) {
    const timestamp = new Date().toLocaleString();
    const reply = { name, content, timestamp };
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments[commentIndex].replies.push(reply);
    localStorage.setItem('comments', JSON.stringify(comments));

    const repliesList = document.getElementById(`replies-list-${commentIndex}`);
    const replyElement = createReplyElement(name, content, timestamp);
    repliesList.appendChild(replyElement);

    // Limpiar los campos del formulario de respuesta
    document.getElementById(`reply-name-${commentIndex}`).value = '';
    document.getElementById(`reply-content-${commentIndex}`).value = '';
  }
}

function createCommentElement(name, content, timestamp, replies) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';

  const commentName = document.createElement('h3');
  commentName.textContent = name;

  const commentContent = document.createElement('p');
  commentContent.textContent = content;

  const commentTime = document.createElement('time');
  commentTime.textContent = timestamp;

  const replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  const replyNameInput = document.createElement('input');
  replyNameInput.type = 'text';
  replyNameInput.placeholder = 'Your Name';
  replyNameInput.id = `reply-name-${name}`;

  const replyContentInput = document.createElement('textarea');
  replyContentInput.placeholder = 'Your Reply';
  replyContentInput.id = `reply-content-${name}`;

  const replyButton = document.createElement('button');
  replyButton.textContent = 'Reply';
  replyButton.onclick = () => addReply(name);

  replyForm.appendChild(replyNameInput);
  replyForm.appendChild(replyContentInput);
  replyForm.appendChild(replyButton);

  const repliesList = document.createElement('div');
  repliesList.className = 'replies';
  repliesList.id = `replies-list-${name}`;
  replies.forEach(reply => {
    const replyElement = createReplyElement(reply.name, reply.content, reply.timestamp);
    repliesList.appendChild(replyElement);
  });

  commentDiv.appendChild(commentName);
  commentDiv.appendChild(commentContent);
  commentDiv.appendChild(commentTime);
  commentDiv.appendChild(replyForm);
  commentDiv.appendChild(repliesList);

  return commentDiv;
}

function createReplyElement(name, content, timestamp) {
  const replyDiv = document.createElement('div');
  replyDiv.className = 'comment reply';

  const replyName = document.createElement('h3');
  replyName.textContent = name;

  const replyContent = document.createElement('p');
  replyContent.textContent = content;

  const replyTime = document.createElement('time');
  replyTime.textContent = timestamp;

  replyDiv.appendChild(replyName);
  replyDiv.appendChild(replyContent);
  replyDiv.appendChild(replyTime);

  return replyDiv;
}
const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Create the user icon
    const userIcon = document.getElementById('userIcon');
    const initial = user.username.charAt(0).toUpperCase();

    userIcon.textContent = initial;
    userIcon.title = user.username; // Set the title to show the username on hover
}