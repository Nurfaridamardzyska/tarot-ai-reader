// app.js

// 0. Konfigurasi direktori gambar
const IMAGE_DIR = 'images';

// 1. Utility: slugify nama kartu → three_of_pentacles
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// 2. State global
let tarotDeck = [];
let selectedReadingType = 1;
let shuffledCards = [];
let selectedCards = [];

// 3. Elemen DOM
const readingOptions   = document.querySelectorAll('.reading-option');
const shuffleButton    = document.getElementById('shuffle-button');
const cardsArea        = document.getElementById('cards-area');
const resultContainer  = document.getElementById('result-container');
const resultContent    = document.getElementById('result-content');
const newReadingButton = document.getElementById('new-reading');
const questionInput    = document.getElementById('question');

// 4. Load data dari tarot.json
fetch('tarot.json')
  .then(res => res.json())
  .then(data => { tarotDeck = data; })
  .catch(err => console.error('Gagal load tarot.json:', err));

// 5. Event Listeners
readingOptions.forEach(option => {
  option.addEventListener('click', () => {
    readingOptions.forEach(btn => btn.classList.remove('active'));
    option.classList.add('active');
    selectedReadingType = parseInt(option.getAttribute('data-cards'), 10);
  });
});
shuffleButton.addEventListener('click', setupReading);
newReadingButton.addEventListener('click', resetReading);

// 6. Fungsi utama

function setupReading() {
  if (!questionInput.value.trim()) {
    alert('Silakan masukkan pertanyaan atau fokus untuk pembacaan Anda terlebih dahulu.');
    return;
  }
  shuffledCards = shuffleCards(tarotDeck);
  renderCards(selectedReadingType);
  shuffleButton.style.display = 'none';
}

function shuffleCards(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCardImagePath(card) {
  if (card.image) {
    let imgName = card.image.replace(/^(major_arcana_|minor_arcana_)/, '');
    const majorMap = {
      'fool': 'the_fool',
      'magician': 'the_magician',
      'priestess': 'priestess',
      'high_priestess': 'priestess',
      'empress': 'the_empress',
      'emperor': 'the_emperor',
      'hierophant': 'the_hierophant',
      'lovers': 'the_lovers',
      'chariot': 'the_chariot',
      'strength': 'strength',
      'hermit': 'the_hermit',
      'fortune': 'wheel_of_fortune',
      'justice': 'justice',
      'hanged': 'the_hanged_man',
      'death': 'death',
      'temperance': 'temperance',
      'devil': 'the_devil',
      'tower': 'the_tower',
      'star': 'the_star',
      'moon': 'the_moon',
      'sun': 'the_sun',
      'judgement': 'judgement',
      'world': 'the_world'
    };
    if (majorMap[imgName]) {
      imgName = majorMap[imgName];
    }
    return `${IMAGE_DIR}/${imgName}.png`;
  }
  return `${IMAGE_DIR}/${slugify(card.name)}.png`;
}

function renderCards(count) {
  cardsArea.innerHTML = '';
  selectedCards = [];

  for (let i = 0; i < count; i++) {
    const card = shuffledCards[i];
    const imgSrc = getCardImagePath(card);

    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = i;
    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <img
            src="${imgSrc}"
            alt="${card.name}"
            class="w-full h-44 object-contain rounded-md"
            loading="lazy"
          />
          <h3 class="mt-2 text-center text-xs sm:text-sm font-semibold text-white px-1 leading-tight">${card.name}</h3>
        </div>
      </div>
    `;
    cardEl.addEventListener('click', () => flipCard(cardEl, card));
    cardsArea.appendChild(cardEl);
  }
}

function flipCard(cardEl, cardObj) {
  if (!cardEl.classList.contains('flipped')) {
    cardEl.classList.add('flipped');
    const isUpright = Math.random() < 0.5;
    selectedCards.push({ ...cardObj, isUpright });
    if (selectedCards.length === selectedReadingType) {
      setTimeout(generateReading, 800);
    }
  }
}

// --- Manajemen API Key & Modal ---
const apiBtn        = document.getElementById('api-btn');
const apiIndicator  = document.getElementById('api-indicator');
const apiBtnText    = document.getElementById('api-btn-text');
const apiModal      = document.getElementById('api-modal');
const apiKeyInput   = document.getElementById('api-key-input');
const closeApiModal = document.getElementById('close-api-modal');
const saveApiKeyBtn = document.getElementById('save-api-key');
const clearApiKeyBtn= document.getElementById('clear-api-key');

const DEFAULT_API_KEY = '';

function getStoredApiKey() {
  return localStorage.getItem('tarot_gemini_api_key') || DEFAULT_API_KEY;
}

function updateApiStatusUI() {
  const key = getStoredApiKey();
  if (key) {
    apiIndicator.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#4ade80;display:inline-block;flex-shrink:0;box-shadow:0 0 8px #4ade80;';
    apiBtnText.textContent = 'AI Aktif ✨';
  } else {
    apiIndicator.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#facc15;display:inline-block;flex-shrink:0;';
    apiBtnText.textContent = 'Atur AI';
  }
}

apiBtn.addEventListener('click', () => {
  apiKeyInput.value = getStoredApiKey();
  apiModal.classList.remove('hidden');
});

closeApiModal.addEventListener('click', () => {
  apiModal.classList.add('hidden');
});

apiModal.addEventListener('click', (e) => {
  if (e.target === apiModal) apiModal.classList.add('hidden');
});

saveApiKeyBtn.addEventListener('click', () => {
  const val = apiKeyInput.value.trim();
  if (val) {
    localStorage.setItem('tarot_gemini_api_key', val);
    alert('✅ Gemini API Key berhasil disimpan! Jawaban kini akan dianalisis langsung oleh AI.');
  }
  updateApiStatusUI();
  apiModal.classList.add('hidden');
});

clearApiKeyBtn.addEventListener('click', () => {
  localStorage.removeItem('tarot_gemini_api_key');
  apiKeyInput.value = '';
  updateApiStatusUI();
  alert('Gemini API Key telah dihapus.');
});

updateApiStatusUI();

async function callGeminiAPI(question, readingType, cards) {
  const apiKey = getStoredApiKey();
  if (!apiKey) return null;

  const positionsMap = {
    1: ['Pesan Utama'],
    3: ['Masa Lalu / Fondasi', 'Masa Sekarang / Situasi Saat Ini', 'Masa Depan / Arah Perkembangan'],
    5: ['Situasi Saat Ini', 'Tantangan / Hambatan', 'Masa Lalu / Akar Masalah', 'Masa Depan / Potensi Hasil', 'Saran & Aspirasi Batin']
  };

  const positions = positionsMap[readingType] || cards.map((_, i) => `Posisi ${i + 1}`);

  const cardDetails = cards.map((c, i) => {
    const orientation = c.isUpright ? 'Tegak (Upright)' : 'Terbalik (Reversed)';
    const baseMeaning = c.isUpright ? c.upright : c.reversed;
    return `- [${positions[i]}]: ${c.name} (${orientation}) -> Makna Arketipe: ${baseMeaning}`;
  }).join('\n');

  const prompt = `Anda adalah seorang Master Tarot Reader yang bijaksana, empatik, intuitif, dan suportif.
Seorang penanya datang membawa pertanyaan yang sangat penting baginya.

Pertanyaan Penanya:
"${question}"

Jenis Pembacaan:
${readingType === 1 ? 'Kartu Tunggal' : readingType === 3 ? 'Tiga Kartu (Masa Lalu, Sekarang, Masa Depan)' : 'Pembacaan Celtic Cross (5 Kartu)'}

Kartu Tarot yang Terbuka:
${cardDetails}

TUGAS ANDA:
1. Hubungkan secara LANGSUNG dan MENDALAM antara arti kartu-kartu di atas dengan PERTANYAAN PENANYA ("${question}").
2. Jelaskan setiap kartu secara padat, bernas, dan to-the-point (2-3 kalimat per kartu) agar seluruh kartu tersampaikan lengkap.
3. Berikan saran praktis dan rangkuman bimbingan yang menguatkan di bagian akhir.

Format respons dalam HTML terstruktur yang elegan:
- Gunakan tag <p class="mb-4 text-textLight leading-relaxed"> untuk paragraf pembuka.
- Gunakan tag <div class="mb-4 p-4 bg-background/60 rounded-xl border border-secondary/40 text-textLight"> untuk masing-masing kartu, dengan judul kartu <h4 class="font-bold text-tertiary mb-1">.
- Sertakan bagian <div class="mt-6 p-5 bg-gradient-to-br from-primary/40 to-secondary/30 rounded-xl border border-secondary text-textLight"> berisi <h3 class="font-bold text-white text-lg mb-2">✨ Saran & Rangkuman Bimbingan</h3>.
- HANYA keluarkan tag HTML valid tanpa membungkusnya dalam kode markdown \`\`\`html.`;

  // Model Gemini yang aktif
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2500
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          text = text.replace(/^```html\s*/i, '').replace(/```$/i, '').trim();
          return text;
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn(`Gemini (${model}) failed:`, errData);
      }
    } catch (err) {
      console.warn(`Request error (${model}):`, err);
    }
  }

  return null;
}

async function generateReading() {
  const question = questionInput.value.trim();
  const apiKey = getStoredApiKey();

  resultContainer.style.display = 'block';
  resultContainer.scrollIntoView({ behavior: 'smooth' });

  if (apiKey) {
    resultContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 space-y-4">
        <div class="w-12 h-12 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white text-lg font-medium animate-pulse text-center">
          🔮 AI sedang membaca energi kartu & menyelaraskan dengan pertanyaan Anda...
        </p>
        <p class="text-xs text-textLight">Menganalisis: "${question}"</p>
      </div>
    `;

    try {
      const aiHTML = await callGeminiAPI(question, selectedReadingType, selectedCards);
      if (aiHTML) {
        resultContent.innerHTML = `
          <div class="mb-4 pb-3 border-b border-secondary/30 flex items-center justify-between">
            <span class="text-sm text-green-400 flex items-center gap-1.5 font-medium">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              Jawaban Dianalisis oleh AI
            </span>
          </div>
          ${aiHTML}
        `;
        return;
      }
    } catch (e) {
      console.error('Error generating AI reading:', e);
    }
  }

  // Fallback jika tidak ada API key atau API gagal
  let readingHTML = '';
  if (selectedReadingType === 1) {
    readingHTML = generateSingleCardReading(question, selectedCards[0]);
  } else if (selectedReadingType === 3) {
    readingHTML = generateThreeCardReading(question, selectedCards);
  } else {
    readingHTML = generateCelticCrossReading(question, selectedCards);
  }

  const promptBanner = !apiKey ? `
    <div class="mb-6 p-4 bg-gradient-to-r from-secondary/40 to-tertiary/20 rounded-xl border border-secondary flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-white">✨ Ingin jawaban yang lebih cerdas, mendalam & nyambung?</p>
        <p class="text-xs text-textLight">Masukkan Gemini API Key gratis Anda untuk tafsir yang 100% personal.</p>
      </div>
      <button onclick="document.getElementById('api-btn').click()" class="px-4 py-2 bg-tertiary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all shrink-0">
        Pasang API Key
      </button>
    </div>
  ` : '';

  resultContent.innerHTML = promptBanner + readingHTML;
}

function resetReading() {
  selectedCards = [];
  shuffledCards = [];
  cardsArea.innerHTML = '';
  resultContainer.style.display = 'none';
  shuffleButton.style.display = 'inline-block';
  readingOptions.forEach(btn => btn.classList.remove('active'));
  questionInput.value = '';
}

// --- Rule-based text generators ---

function generateSingleCardReading(question, card) {
  const meaning = card.isUpright ? card.upright : card.reversed;
  const starters = [
    `Kartu "${card.name}" menunjukkan bahwa `,
    `Dengan "${card.name}", energi utama yang muncul adalah `,
    `"${card.name}" muncul sebagai jawaban atas pertanyaan Anda, ini berarti `,
  ];
  const insights = [
    `Anda sedang berada dalam fase yang berhubungan dengan ${meaning}.`,
    `Energi ${meaning} sangat kuat dalam situasi Anda.`,
    `Penting untuk memperhatikan aspek ${meaning} dalam hidup Anda.`,
  ];
  const advices = [
    `Cobalah untuk menerima energi ini dan biarkan ia membimbing Anda.`,
    `Pertimbangkan bagaimana Anda dapat menerapkan kualitas ini dalam situasi Anda saat ini.`,
    `Refleksikan bagaimana aspek ini mungkin memengaruhi keputusan Anda ke depan.`,
  ];
  const starter = randomPick(starters);
  const insight = randomPick(insights);
  const advice  = randomPick(advices);

  return `
    <p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>
    <p class="mb-3">${starter}${insight}</p>
    <p class="mb-3">${advice}</p>
    <p>Kartu ini membawa pesan bahwa ${generateUniqueInsight(meaning)}.</p>
  `;
}

function generateThreeCardReading(question, cards) {
  const positions = ['Masa Lalu','Masa Sekarang','Masa Depan'];
  let html = `<p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>`;
  html += `<p class="mb-4">Pembacaan 3 kartu Anda mewakili perjalanan masa lalu, sekarang, dan masa depan:</p>`;

  cards.forEach((card, idx) => {
    const posText = generatePositionalInsight(card, positions[idx]);
    html += `
      <div class="mb-4 p-3 bg-background bg-opacity-30 rounded-lg">
        <p class="font-semibold text-white"><strong>${positions[idx]} – ${card.name} (${card.isUpright ? 'Upright' : 'Reversed'}):</strong></p>
        <p>${posText}</p>
      </div>`;
  });

  html += `
    <div class="mt-6 p-4 bg-primary bg-opacity-20 rounded-lg">
      <p class="font-semibold text-white mb-2"><strong>Rangkuman:</strong></p>
      <p>${generateThreeCardSummary(cards)}</p>
    </div>`;
  return html;
}

function generateCelticCrossReading(question, cards) {
  const positions = ['Situasi Saat Ini','Tantangan','Masa Lalu','Masa Depan','Aspirasi'];
  let html = `<p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>`;
  html += `<p class="mb-4">Pembacaan Celtic Cross memberikan pandangan mendalam tentang situasi Anda:</p>`;

  cards.forEach((card, idx) => {
    const pos = positions[idx] || `Posisi ${idx+1}`;
    const posText = generatePositionalInsight(card, pos);
    html += `
      <div class="mb-4 p-3 bg-background bg-opacity-30 rounded-lg">
        <p class="font-semibold text-white"><strong>${pos} – ${card.name} (${card.isUpright ? 'Upright' : 'Reversed'}):</strong></p>
        <p>${posText}</p>
      </div>`;
  });

  html += `
    <div class="mt-6 p-4 bg-primary bg-opacity-20 rounded-lg">
      <p class="font-semibold text-white mb-2"><strong>Rangkuman:</strong></p>
      <p>${generateCelticCrossSummary(cards)}</p>
    </div>`;
  return html;
}

// --- Helper insight generators ---

function generateUniqueInsight(meaning) {
  const firstMeaning = meaning.split(',')[0].trim();
  const opts = [
    `Fokuskan diri pada penguatan ${firstMeaning} untuk membuka jalan terbaik ke depan.`,
    `Waktunya untuk menyelaraskan diri dengan energi ${firstMeaning} secara sadar dan tenang.`,
    `Menemukan ketenangan batin dalam hal ${firstMeaning} akan memberikan kejernihan berpikir.`,
    `Percayalah pada proses ini dan jadikan ${firstMeaning} sebagai kompas tindakan Anda.`,
  ];
  return randomPick(opts);
}

function generatePositionalInsight(card, pos) {
  const m = (card.isUpright ? card.upright : card.reversed).split(',')[0].trim();
  switch (pos) {
    case 'Masa Lalu':
    case 'Masa Lalu / Fondasi':
      return `Pondasi masa lalu Anda dipengaruhi oleh tema "${m}", yang secara tak langsung menjadi pelajaran penting untuk situasi hari ini.`;
    case 'Masa Sekarang':
    case 'Masa Sekarang / Situasi Saat Ini':
    case 'Situasi Saat Ini':
      return `Saat ini fokus energi Anda berada di sekitar "${m}". Luangkan waktu untuk mencerna dinamika ini sebelum melangkah.`;
    case 'Masa Depan':
    case 'Masa Depan / Arah Perkembangan':
      return `Arah masa depan menunjukkan potensi kemunculan energi "${m}". Persiapkan sikap terbaik Anda untuk menyambutnya.`;
    case 'Tantangan':
    case 'Tantangan / Hambatan':
      return `Hambatan yang mungkin terasa mengganjal berkaitan dengan "${m}". Hadapi dengan kepala dingin.`;
    case 'Aspirasi':
    case 'Saran & Aspirasi Batin':
      return `Dorongan terdalam dari diri Anda menginginkan terwujudnya "${m}" demi kedamaian dan kepuasan batin.`;
    default:
      return `Aspek "${m}" menjadi titik penting yang perlu Anda perhatikan dalam konteks posisi ini.`;
  }
}

function generateThreeCardSummary(cards) {
  const themes = cards.map(c => (c.isUpright ? c.upright : c.reversed).split(',')[0].trim());
  return `Perjalanan ini memperlihatkan transisi yang bermakna: dimulai dari pengalaman seputar <em>${themes[0]}</em>, Anda saat ini diajak memproses <em>${themes[1]}</em>, guna membuka gerbang menuju <em>${themes[2]}</em> di masa depan. Tetaplah percaya diri dan ambil hikmah dari setiap tahapannya.`;
}

function generateCelticCrossSummary(cards) {
  const mainThemes = cards.slice(0, 3).map(c => (c.isUpright ? c.upright : c.reversed).split(',')[0].trim()).join(', ');
  return `Secara keseluruhan, pembacaan ini menyoroti tema utama seputar <em>${mainThemes}</em>. Kendalikan hal-hal yang berada di bawah kendali Anda dan percayalah bahwa setiap fase membawa pelajaran berharga bagi pertumbuhan diri Anda.`;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
