const socket = io();

const homeView = document.querySelector("#homeView");
const chatView = document.querySelector("#chatView");
const endedView = document.querySelector("#endedView");
const createRoomForm = document.querySelector("#createRoomForm");
const roomTitle = document.querySelector("#roomTitle");
const creatorName = document.querySelector("#creatorName");
const joinDialog = document.querySelector("#joinDialog");
const joinForm = document.querySelector("#joinForm");
const joinName = document.querySelector("#joinName");
const chatTitle = document.querySelector("#chatTitle");
const roomStatus = document.querySelector("#roomStatus");
const peopleList = document.querySelector("#peopleList");
const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const imageInput = document.querySelector("#imageInput");
const imagePreview = document.querySelector("#imagePreview");
const previewImg = document.querySelector("#previewImg");
const removeImageBtn = document.querySelector("#removeImageBtn");
const copyInviteBtn = document.querySelector("#copyInviteBtn");
const endRoomBtn = document.querySelector("#endRoomBtn");

let roomId = getRoomId();
let mySocketId = null;
let selectedImage = null;

function getRoomId() {
  const match = window.location.pathname.match(/^\/room\/([^/]+)$/);
  return match ? match[1] : null;
}

function creatorTokenKey(id) {
  return `one-time-chat.creator.${id}`;
}

function nameKey() {
  return "one-time-chat.name";
}

function show(view) {
  homeView.classList.toggle("hidden", view !== "home");
  chatView.classList.toggle("hidden", view !== "chat");
  endedView.classList.toggle("hidden", view !== "ended");
}

function inviteUrl() {
  return `${window.location.origin}/room/${roomId}`;
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function addSystemMessage(text) {
  const item = document.createElement("div");
  item.className = "system";
  item.textContent = text;
  messages.appendChild(item);
  scrollToBottom();
}

function addMessage(message) {
  const mine = message.senderId === mySocketId;
  const item = document.createElement("article");
  item.className = `message${mine ? " mine" : ""}`;

  if (!mine) {
    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = message.senderName;
    item.appendChild(sender);
  }

  if (message.image) {
    const image = document.createElement("img");
    image.src = message.image.dataUrl;
    image.alt = message.image.name || "Shared image";
    item.appendChild(image);
  }

  if (message.text) {
    const body = document.createElement("div");
    body.className = "body";
    body.textContent = message.text;
    item.appendChild(body);
  }

  const time = document.createElement("div");
  time.className = "time";
  time.textContent = formatTime(message.sentAt);
  item.appendChild(time);

  messages.appendChild(item);
  scrollToBottom();
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function renderPeople(users) {
  peopleList.innerHTML = "";

  users.forEach((user) => {
    const person = document.createElement("span");
    person.className = "person";
    person.textContent = user.isCreator ? `${user.name} - creator` : user.name;
    peopleList.appendChild(person);
  });

  roomStatus.textContent = `${users.length} online`;
}

function joinRoom(name) {
  const creatorToken = localStorage.getItem(creatorTokenKey(roomId));

  socket.emit("join-room", { roomId, name, creatorToken }, (response) => {
    if (!response?.ok) {
      show("ended");
      return;
    }

    localStorage.setItem(nameKey(), name);
    chatTitle.textContent = response.room.title;
    endRoomBtn.classList.toggle("hidden", !response.isCreator);
    show("chat");
    messages.innerHTML = "";
    response.messages.forEach(addMessage);

    if (response.messages.length === 0) {
      addSystemMessage("Room is live. Nothing has been saved yet.");
    }
  });
}

async function createRoom(event) {
  event.preventDefault();

  const response = await fetch("/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: roomTitle.value })
  });

  const data = await response.json();
  localStorage.setItem(creatorTokenKey(data.room.id), data.creatorToken);
  localStorage.setItem(nameKey(), creatorName.value.trim() || "Creator");
  window.location.href = data.roomPath;
}

function askToJoin() {
  const savedName = localStorage.getItem(nameKey()) || "Guest";
  joinName.value = savedName;

  if (localStorage.getItem(creatorTokenKey(roomId))) {
    joinRoom(savedName);
    return;
  }

  joinDialog.showModal();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleImageChoice() {
  const file = imageInput.files[0];
  if (!file) return;

  if (!/^image\/(png|jpe?g|gif|webp)$/i.test(file.type) || file.size > 3 * 1024 * 1024) {
    alert("Choose a PNG, JPG, GIF, or WebP image under 3 MB.");
    imageInput.value = "";
    return;
  }

  const dataUrl = await fileToDataUrl(file);
  selectedImage = {
    name: file.name,
    type: file.type,
    dataUrl
  };
  previewImg.src = dataUrl;
  imagePreview.classList.remove("hidden");
}

function clearImage() {
  selectedImage = null;
  imageInput.value = "";
  previewImg.removeAttribute("src");
  imagePreview.classList.add("hidden");
}

function sendMessage(event) {
  event.preventDefault();
  const text = messageInput.value.trim();

  if (!text && !selectedImage) return;

  socket.emit("send-message", { text, image: selectedImage }, (response) => {
    if (!response?.ok) {
      alert(response?.error || "Message could not be sent.");
      return;
    }

    messageInput.value = "";
    clearImage();
  });
}

function endRoom() {
  const creatorToken = localStorage.getItem(creatorTokenKey(roomId));
  socket.emit("end-room", { roomId, creatorToken }, (response) => {
    if (!response?.ok) {
      alert(response?.error || "Room could not be ended.");
    }
  });
}

async function copyInvite() {
  try {
    await navigator.clipboard.writeText(inviteUrl());
    copyInviteBtn.textContent = "Copied";
    setTimeout(() => {
      copyInviteBtn.textContent = "Copy link";
    }, 1400);
  } catch {
    prompt("Copy this invite link:", inviteUrl());
  }
}

createRoomForm.addEventListener("submit", createRoom);
joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  joinDialog.close();
  joinRoom(joinName.value.trim() || "Guest");
});
messageForm.addEventListener("submit", sendMessage);
imageInput.addEventListener("change", handleImageChoice);
removeImageBtn.addEventListener("click", clearImage);
copyInviteBtn.addEventListener("click", copyInvite);
endRoomBtn.addEventListener("click", endRoom);

messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = `${messageInput.scrollHeight}px`;
});

socket.on("connect", () => {
  mySocketId = socket.id;
});

socket.on("new-message", addMessage);
socket.on("presence", renderPeople);
socket.on("system-message", addSystemMessage);
socket.on("room-ended", () => {
  if (roomId) {
    localStorage.removeItem(creatorTokenKey(roomId));
  }
  show("ended");
});

if (roomId) {
  fetch(`/api/rooms/${roomId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Room not found");
      return response.json();
    })
    .then(({ room }) => {
      chatTitle.textContent = room.title;
      askToJoin();
    })
    .catch(() => show("ended"));
} else {
  show("home");
}
