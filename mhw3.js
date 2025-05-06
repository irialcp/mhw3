let lastScroll = 0;

const header = document.querySelector("#header");

const scrollThreshold = 10;
const headerHeight = header.offsetHeight;
let tricking = false;

window.addEventListener("scroll", function() {
    if(!tricking){
        window.requestAnimationFrame(function() {
            const currentScroll = window.scrollY;

            if (currentScroll < lastScroll && currentScroll > scrollThreshold) {
                header.style.top = "0";
            }
            else if (currentScroll > lastScroll && currentScroll > headerHeight) {
                header.style.top = `-${headerHeight}px`;
            }

            if ( currentScroll < scrollThreshold ) {
                header.style.top = "0";
            }


            lastScroll = currentScroll;
            tricking = false;
        });
        tricking = true;
    }
});


const menuButton = document.querySelector("#menu_button");
const menuWrap = document.querySelector("#wrapper");
const menuClose = document.querySelector("#close");
const chatButton = document.querySelector("#chat_button");
const chatContainer = document.querySelector("#chat_container");

const inputButton = document.querySelector(".input_button");
const inputClose = document.querySelector(".inputClose");
const inputWrap = document.querySelector(".wrapper2");

const overlay = document.querySelector(".overlay");


function setupToggle(button, target, overlay, className = "active") {
    button.addEventListener("click", () => {
      target.classList.toggle(className);
      if (overlay) {
        overlay.classList.toggle(className);
      }
    });
}

setupToggle(menuButton, menuWrap, overlay);
setupToggle(inputButton, inputWrap, overlay);
setupToggle(chatButton, chatContainer, overlay);

  

function closeOnClickOutside(triggerElements, target, overlay, className = "active") {
    document.addEventListener("click", (e) => {
      let clickInside = false;
  
      for (let i = 0; i < triggerElements.length; i++) {
        if (triggerElements[i] && triggerElements[i].contains(e.target)) {
          clickInside = true;
          break;
        }
      }
      if (target && target.contains(e.target)) {
        clickInside = true;
      }
  
      if (!clickInside) {
        target.classList.remove(className);
        if (overlay) {
          overlay.classList.remove(className);
        }
      }
    });
}

closeOnClickOutside([menuButton, menuClose], menuWrap, overlay);
closeOnClickOutside([inputButton, inputClose], inputWrap, overlay);
closeOnClickOutside([chatButton], chatContainer, overlay);

  


const productImages = document.querySelectorAll('.product-card__image img');

for (let i = 0; i < productImages.length; i++) {
  const image = productImages[i];
  const originalSrc = image.src;
  const altSrc = image.dataset.alt;

  image.addEventListener('mouseenter', function () {
    image.src = altSrc;
  });

  image.addEventListener('mouseleave', function () {
    image.src = originalSrc;
  });
}

const products = document.querySelectorAll('.product-card__image');

for (let i = 0; i < products.length; i++) {
  const product = products[i];

  product.addEventListener('mouseenter', function () {
    if (!product.querySelector('.hover-info')) {
      const hoverDiv = document.createElement('div');
      hoverDiv.classList.add('hover-info');

      const text = product.dataset.text || 'Scopri di più';
      hoverDiv.textContent = text;

      product.appendChild(hoverDiv);
    }
  });

  product.addEventListener('mouseleave', function () {
    const hoverDiv = product.querySelector('.hover-info');
    if (hoverDiv) {
      hoverDiv.remove();
    }
  });
}

const textarea = document.getElementById('user_input');
textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});


const OPENAI_KEY = "secret";

function appendMessage(sender, message) {
    const botDiv = document.getElementById("chat_messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.textContent = message;
    botDiv.appendChild(msgDiv);
    botDiv.scrollTop = botDiv.scrollHeight; 
}

async function sendMessage() {
  const userInput = document.getElementById("user_input");
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage('user', message);
  userInput.value = "";

  try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_KEY}`
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: message }],
              max_tokens: 150,
              temperature: 0.7
          })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content;
      appendMessage('bot', botReply);

  } catch (error) {
      console.error("Errore API:", error);
      appendMessage('bot', "Errore nella chiamata API.");
  }
}

const bottone = document.getElementById('image_button');
const imageMenuWrap = document.querySelector("#parkour_images_menu");

bottone.addEventListener('click', () => {
    imageMenuWrap.classList.toggle("active");
    if (overlay) {
        overlay.classList.toggle("active");
    }
    
    cercaImmaginiParkour();
});

const UNSPLASH_KEY = "secret";

function cercaImmaginiParkour() {
    fetch('https://api.unsplash.com/search/photos?query=parkour&per_page=5', {
        headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore nella chiamata a Unsplash');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('parkour_images');
        container.innerHTML = ''; 
        for (let i = 0; i < data.results.length; i++) {
            const foto = data.results[i];
            const img = document.createElement('img');
            img.src = foto.urls.small;
            img.alt = foto.alt_description;
            container.appendChild(img);
        }
    })
    .catch(error => {
        console.error('Errore API Unsplash:', error);
    });
}
closeOnClickOutside([bottone], imageMenuWrap, overlay);









