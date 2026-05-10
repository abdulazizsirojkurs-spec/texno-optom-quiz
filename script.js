// State management
let currentStep = 0;
const totalSteps = 7;
let answers = {
    step1: '',
    step2: [],
    step3: '',
    step4: '',
    step5: '',
    step6: '',
    leadInfo: {
        name: '',
        phone: '',
        telegram: ''
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Lead form submission
    document.getElementById('lead-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        answers.leadInfo.name = document.getElementById('name').value;
        answers.leadInfo.phone = document.getElementById('phone').value;
        answers.leadInfo.telegram = document.getElementById('telegram').value;
        
        submitLead();
    });
});

// Navigation functions
function nextStep(current, next) {
    const currentEl = document.getElementById(current === 0 ? 'step-welcome' : `step-${current}`);
    const nextEl = document.getElementById(`step-${next}`);
    
    currentEl.classList.remove('active');
    
    setTimeout(() => {
        currentEl.style.display = 'none';
        nextEl.style.display = 'flex';
        
        // Force reflow for animation
        void nextEl.offsetWidth;
        
        nextEl.classList.add('active');
        updateProgress(next);
    }, 400);
}

function updateProgress(step) {
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    
    if (step > 0 && step <= totalSteps) {
        progressContainer.style.opacity = '1';
        const percentage = (step / totalSteps) * 100;
        progressBar.style.width = `${percentage}%`;
    } else {
        progressContainer.style.opacity = '0';
    }
}

// Single choice selection
function selectOption(step, value, element) {
    answers[`step${step}`] = value;
    
    // Remove selected class from siblings
    const siblings = element.parentElement.children;
    for (let sibling of siblings) {
        sibling.classList.remove('selected');
    }
    
    // Add selected class to clicked element
    element.classList.add('selected');
    
    // Move to next step automatically after a short delay
    setTimeout(() => {
        nextStep(step, step + 1);
    }, 400);
}

// Multiple choice selection (Step 2)
function toggleMultiOption(step, value, element) {
    element.classList.toggle('selected');
    
    const index = answers[`step${step}`].indexOf(value);
    if (index > -1) {
        answers[`step${step}`].splice(index, 1);
    } else {
        answers[`step${step}`].push(value);
    }
}

function nextStepMulti(step, next) {
    if (answers[`step${step}`].length === 0) {
        alert("Iltimos, kamida bitta variantni tanlang.");
        return;
    }
    nextStep(step, next);
}

// Submit lead and trigger pixel
function submitLead() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Yuborilmoqda...';
    submitBtn.disabled = true;
    
    console.log("To'plangan ma'lumotlar:", answers);

    // ==========================================
    // FACEBOOK PIXEL LEAD EVENT
    // ==========================================
    if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
            content_name: 'Gaming PC Quiz Lead',
            content_category: 'Lead Generation',
            currency: 'USD'
        });
        console.log("Facebook Pixel 'Lead' event fired!");
    } else {
        console.log("Facebook Pixel not found, but submission continued.");
    }
    // ==========================================
    
    // ==========================================
    // TELEGRAM BOT INTEGRATION
    // ==========================================
    const BOT_TOKEN = '8202479409:AAF72_jBy-xkZOhn_t8xg7-uoG0Vl5v81_8';
    const CHAT_ID = '426689201';
    
    const message = `🔥 Yangi mijoz (Quiz)

👤 Ism: ${answers.leadInfo.name}
📞 Telefon: ${answers.leadInfo.phone}
✈️ Telegram: ${answers.leadInfo.telegram || "Kiritilmadi"}

🎮 Qayerda o'ynaydi: ${answers.step1}
🎯 O'yinlar: ${answers.step2.join(', ')}
🚀 Maqsad: ${answers.step3}
💻 PC Korinishi: ${answers.step4}
💰 Byudjet: ${answers.step5}
⏳ Qachon kerak: ${answers.step6}`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Telegram response:', data);
        nextStep(7, 'thankyou');
    })
    .catch(error => {
        console.error('Error sending to Telegram:', error);
        nextStep(7, 'thankyou');
    });
}

// Format phone number input nicely
const phoneInput = document.getElementById('phone');
if(phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (!x[1]) {
            e.target.value = '+998';
            return;
        }
        
        let formatted = '+998 ';
        if(x[1] === '998') {
            formatted += (x[2] ? x[2] + ' ' : '') + (x[3] ? x[3] + ' ' : '') + (x[4] ? x[4] + ' ' : '') + (x[5] ? x[5] : '');
        } else {
            formatted += (x[1] ? x[1] + ' ' : '') + (x[2] ? x[2] + ' ' : '') + (x[3] ? x[3] + ' ' : '') + (x[4] ? x[4] : '');
        }
        
        e.target.value = formatted.trim();
    });
    
    phoneInput.addEventListener('focus', function(e) {
        if(e.target.value === '') {
            e.target.value = '+998 ';
        }
    });
}
