import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get, set, update, push, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase 初始化配置
const firebaseConfig = {
  apiKey: "AIzaSyD6zAXP-Jf77Dqa8Tw-xHOwUqx0FPNg1qk",
  authDomain: "project-8205450985354959930.firebaseapp.com",
  databaseURL: "https://project-8205450985354959930-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "project-8205450985354959930",
  storageBucket: "project-8205450985354959930.firebaseapp.com",
  messagingSenderId: "1037774771201",
  appId: "1:1037774771201:web:6129567bb44c34d91adc00"
};

// Firebase 初始化
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 初始化商品資料（僅需執行一次）
async function initializeProducts() {
  const productRef = ref(database, "products");
  const products = {
    "12345": { name: "渡假村紀念吊飾", price: 150 },
    "67890": { name: "渡假村紀念T-shirt", price: 450 },
    "54321": { name: "渡假村主題玩偶", price: 600 },
  };

  try {
    await set(productRef, products);
    console.log("商品資料初始化成功！");
  } catch (error) {
    console.error("商品資料初始化失敗：", error);
  }
}

// 確保在 DOM 加載後執行
document.addEventListener("DOMContentLoaded", () => {
  initializeProducts();
});


/**
 * 翻譯文字工具函數
 * @param {string} text - 要翻譯的文字
 * @param {string} targetLang - 目標語言
 * @returns {Promise<string>} - 翻譯後的文字
 */
async function translateText(text, targetLang) {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();

    // 確保翻譯結果格式正確
    if (Array.isArray(data) && data[0] && Array.isArray(data[0][0])) {
      return data[0][0][0]; // 返回翻譯結果
    }

    console.error("翻譯 API 回應格式無效：", data);
    return text; // 如果格式不正確，回傳原始文字
  } catch (error) {
    console.error("翻譯失敗：", error);
    return text; // 如果出現錯誤，回傳原始文字
  }
}

// 確保瀏覽器支持 SpeechSynthesis API
function speak(message) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(message); // 創建語音播報對象
    speech.lang = 'zh-TW'; // 設定語言為繁體中文
    window.speechSynthesis.speak(speech); // 播報訊息
  } else {
    console.log("您的瀏覽器不支持語音播報。");
  }
}


async function showTranslatedAlert(titleKey, messageKey, icon, lang = currentLang) {
  const title = await getTranslatedMessage(titleKey, lang);
  const message = await getTranslatedMessage(messageKey, lang);

  Swal.fire({
    title: title,
    text: message,
    icon: icon,
  });
}

/**
 * 翻譯消息工具函數
 * @param {string} key 翻譯鍵或文字
 * @param {string} lang 目標語言
 * @returns {Promise<string>} 翻譯後的文字
 */
async function getTranslatedMessage(key, lang) {
  const fallback = languages[lang]?.[key] || key;
  return await translateText(fallback, lang);
}


const languages = {
  "zh-TW": {
    purchase_required_for_entry_exit: "請先購票才能使用進退場功能！",
    select_ticket: "選擇票種",
    general_ticket: "一般票（300元）",
    student_ticket: "學生票（250元）",
    senior_ticket: "老年票（200元）",
    insufficient_balance: "餘額不足，請先儲值！",
    ticket_purchase_success: "購票成功！",
    success: "成功",
    error: "錯誤",
    logout_success: "登出成功！",
    no_transactions: "目前無任何交易紀錄！",
    entry_success: "進場成功",
    welcome_entry: "歡迎進場！",
    entry_error: "無法完成進場操作，請稍後再試！",
    purchase_required: "請先購票",
    purchase_before_exit: "您必須先購票才能退場！",
    already_outside: "您已經在場外！",
    exit_success: "退場成功",
    thank_you_exit: "感謝使用，歡迎下次再來！",
    exit_error: "無法完成退場操作，請稍後再試！",
    confirm: "確定",
    cancel: "取消",
  },
  en: {
    purchase_required_for_entry_exit: "Please purchase a ticket before entering or exiting!",
    select_ticket: "Select Ticket Type",
    general_ticket: "General Ticket ($300)",
    student_ticket: "Student Ticket ($250)",
    senior_ticket: "Senior Ticket ($200)",
    insufficient_balance: "Insufficient balance, please recharge first!",
    ticket_purchase_success: "Ticket purchased successfully!",
    success: "Success",
    error: "Error",
    logout_success: "Logged out successfully!",
    no_transactions: "No transactions available!",
    entry_success: "Entry Successful",
    welcome_entry: "Welcome to the venue!",
    entry_error: "Unable to complete entry, please try again later!",
    purchase_required: "Purchase Required",
    purchase_before_exit: "You must purchase a ticket before exiting!",
    already_outside: "You are already outside!",
    exit_success: "Exit Successful",
    thank_you_exit: "Thank you for visiting, see you next time!",
    exit_error: "Unable to complete exit, please try again later!",
    confirm: "Confirm",
    cancel: "Cancel",
  },
};

function refreshSwalTexts() {
  Swal.update({
    confirmButtonText: languages[currentLang]?.confirm || "Confirm",
    cancelButtonText: languages[currentLang]?.cancel || "Cancel",
  });
}

function showAlert(keyTitle, keyMessage, icon) {
  Swal.fire({
    title: languages[currentLang]?.[keyTitle] || keyTitle,
    text: languages[currentLang]?.[keyMessage] || keyMessage,
    icon: icon,
  });
}


const loginForm = document.getElementById("loginForm");
const rfidInput = document.getElementById("rfidInput");


// ** 全局變量 **
let currentLang = "zh-TW"; // 默認為繁體中文
let chartInstance = null; // 初始化全局變數 chartInstance
const translateAPI = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=";



document.addEventListener("DOMContentLoaded", () => {
  const switchLangButton = document.getElementById("switch-lang");
  const logoutButton = document.getElementById("logoutButton");
  const entryButton = document.getElementById("entryButton");
  const exitButton = document.getElementById("exitButton");
  const buyTicketButton = document.getElementById("buyTicketButton");
  const depositButton = document.getElementById("depositButton");
  const transactionAmount = document.getElementById("transactionAmount");
  const balanceDisplay = document.getElementById("balanceDisplay");
  const messageArea = document.getElementById("messageArea");
  const currentUser = localStorage.getItem("currentUser");
  const userRef = ref(database, `users/${currentUser}`);
  const transactionRef = ref(database, "transactions");

  

  // ** 初始化語言翻譯功能 **
  function initializeTranslation() {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((element) => {
      element.dataset.originalText = element.textContent;
    });

    const placeholders = document.querySelectorAll("[data-translate-placeholder]");
    placeholders.forEach((element) => {
      element.dataset.originalPlaceholder = element.placeholder;
    });
  }

   // 確認按鈕存在
   if (!switchLangButton) {
    console.error("未找到 switch-lang 按鈕！");
    return;
  }

  // 添加事件監聽器
  switchLangButton.addEventListener("click", () => {
    currentLang = currentLang === "zh-TW" ? "en" : "zh-TW";
    console.log(`切換到語言: ${currentLang}`);
    translatePage(currentLang);
  });

  // ** 使用 Google Translate API 翻譯頁面 **
  function translatePage(targetLang) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((element) => {
      const originalText = element.dataset.originalText || element.textContent;
      fetch(`${translateAPI}${targetLang}&dt=t&q=${encodeURIComponent(originalText)}`)
        .then((response) => response.json())
        .then((data) => {
          const translatedText = data[0][0][0];
          element.textContent = translatedText;
        })
        .catch((error) => console.error("翻譯失敗:", error));
    });

    const placeholders = document.querySelectorAll("[data-translate-placeholder]");
    placeholders.forEach((element) => {
      const originalPlaceholder = element.dataset.originalPlaceholder || element.placeholder;
      fetch(`${translateAPI}${targetLang}&dt=t&q=${encodeURIComponent(originalPlaceholder)}`)
        .then((response) => response.json())
        .then((data) => {
          const translatedPlaceholder = data[0][0][0];
          element.placeholder = translatedPlaceholder;
        })
        .catch((error) => console.error("占位符翻譯失敗:", error));
    });
  }

  // 處理語言切換邏輯
  if (switchLangButton) {
    let currentLang = "zh-TW";
    // ** 語言切換按鈕 **
    switchLangButton.addEventListener("click", () => {
    currentLang = currentLang === "zh-TW" ? "en" : "zh-TW";
    translatePage(currentLang);
  });
  }

  // 處理登入表單邏輯
  if (loginForm && rfidInput) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const rfid = rfidInput.value.trim();
      if (rfid) {
        localStorage.setItem("currentUser", rfid);
      
        const targetLang = currentLang === "zh-TW" ? "zh-TW" : "en"; // 判斷當前語言
        const successTitle = currentLang === "zh-TW" ? "成功" : "Success";
        const successMessage = currentLang === "zh-TW" ? "登入成功！" : "Login successful!";
      
        translateText(successTitle, targetLang).then((translatedTitle) => {
          translateText(successMessage, targetLang).then((translatedMessage) => {
            // 在 SweetAlert2 彈出視窗前播放語音
            speak(translatedMessage); // 播報訊息
            // 顯示 SweetAlert2 彈出視窗
            Swal.fire(translatedTitle, translatedMessage, "success").then(() => {
              window.location.href = "dashboard.html"; // 跳轉到 dashboard 頁面
            });
          });
        });
      } else {
        Swal.fire("錯誤", "請輸入有效的 RFID！", "error").then(() => {
          // 在 SweetAlert2 彈出錯誤視窗後播放語音
          speak("請輸入有效的 RFID！"); // 播報錯誤訊息
        });
      }
    });
  }

  // 初始化翻譯功能
  initializeTranslation();

  // 封裝翻譯函數
  async function translateText(text, targetLang) {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      // 確保翻譯結果正確返回
      if (Array.isArray(data) && data[0] && Array.isArray(data[0][0])) {
        return data[0][0][0]; // 返回翻譯結果
      }
      console.error("翻譯回應格式無效：", data);
      return text; // 回退至原始文字
    } catch (error) {
      console.error("翻譯失敗：", error);
      return text; // 回退至原始文字
    }
  }

  
  const checkBalanceButton = document.getElementById("checkBalanceButton");
if (!checkBalanceButton) {
  console.error("查詢餘額按鈕未找到！");
  return;
}

checkBalanceButton.addEventListener("click", () => {
  console.log("查詢餘額按鈕被點擊！");
  queryBalance();
});

async function queryBalance() {
  try {
    console.log("開始查詢餘額...");
    if (!currentUser) {
      console.error("currentUser 未設定，請先登入！");
      speak("用戶未登入，請先登入！"); // 播報錯誤訊息
      Swal.fire("錯誤", "用戶未登入，請先登入！", "error");
      return;
    }

    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      console.warn("用戶資料不存在！");
      speak("用戶資料不存在，請先初始化！"); // 播報提示訊息
      Swal.fire("提示", "用戶資料不存在，請先初始化！", "warning");
      return;
    }

    const user = snapshot.val();
    const balance = user.balance || 0;
    console.log("成功獲取餘額：", balance);
    const balanceMessage =
      currentLang === "zh-TW"
        ? `您的目前餘額為：${balance} 元`
        : `Your current balance is: $${balance}`;

    speak("用戶資料不存在，請先初始化！"); // 播報提示訊息
    // 顯示 SweetAlert2 視窗
    await Swal.fire({
      title: currentLang === "zh-TW" ? "成功" : "Success",
      text: balanceMessage,
      icon: "info",
    });

    // 彈出視窗顯示後播放語音
    speak(balanceMessage); // 播報餘額訊息
  } catch (error) {
    console.error("查詢餘額時發生錯誤：", error);
    const errorMessage =
      currentLang === "zh-TW"
        ? "查詢餘額失敗，請稍後再試！"
        : "Failed to retrieve balance, please try again later!";

    // 顯示 SweetAlert2 視窗並播放錯誤語音
    await Swal.fire({
      title: currentLang === "zh-TW" ? "錯誤" : "Error",
      text: errorMessage,
      icon: "error",
    });

    // 播報錯誤訊息
    speak(errorMessage); // 播報錯誤訊息
  }
}
  
  
  // ** 初始化用戶資料 **
  function initializeUserData() {
    set(userRef, {
      balance: 0,
      ticketPurchased: false,
      isInside: false,
    }).then(() => checkUserStatus())
      .catch((error) => console.error("初始化用戶數據失敗:", error));
  }

 // ** 檢查用戶狀態並更新按鈕顯示 **
 function checkUserStatus() {
  get(userRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        initializeUserData();
        return;
      }

      const user = snapshot.val();
      if (!user.ticketPurchased) {
        entryButton.disabled = true;
        exitButton.disabled = true;
        messageArea.textContent = languages[currentLang].purchase_required_for_entry_exit; // 根據當前語言顯示提示信息
        messageArea.style.color = "red";
        return;
      }

      messageArea.textContent = "";
      if (user.isInside) {
        entryButton.style.display = "none";
        exitButton.style.display = "block";
      } else {
        entryButton.style.display = "block";
        exitButton.style.display = "none";
      }

      entryButton.disabled = false;
      exitButton.disabled = false;
    })
    .catch((error) => console.error("檢查用戶狀態失敗:", error));
}

  // 更新語言文字
  function updateLanguage() {
    buyTicketButton.textContent = currentLang === "zh" ? "購票" : "Buy Ticket";
    depositButton.textContent = currentLang === "zh" ? "儲值" : "Deposit";
    entryButton.textContent = currentLang === "zh" ? "進場" : "Enter";
    exitButton.textContent = currentLang === "zh" ? "退場" : "Exit";
    switchLangButton.textContent = currentLang === "zh" ? "中文 / ENGLISH" : "ENGLISH / 中文";
  }

  const buyButton = document.getElementById("buyButton");
const buynumInput = document.getElementById("buynum");

// 綁定購買按鈕事件
if (buyButton && buynumInput) {
  buyButton.addEventListener("click", async () => {
    const rfidCode = buynumInput.value.trim();

    if (!rfidCode) {
      Swal.fire(currentLang === "zh-TW" ? "錯誤" : "Error", "請輸入有效的 RFID 碼！", "error");
      return;
    }

    try {
      // 查詢商品資料
      const productRef = ref(database, `products/${rfidCode}`);
      const productSnapshot = await get(productRef);

      if (!productSnapshot.exists()) {
        speak("找不到該商品"); // 播報提示訊息
        Swal.fire(currentLang === "zh-TW" ? "錯誤" : "Error", "找不到該商品！", "error");
        return;
      }

      const product = productSnapshot.val();
      const price = product.price;

      // 確認用戶餘額
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        speak("用戶資料不存在"); // 播報提示訊息
        Swal.fire(currentLang === "zh-TW" ? "錯誤" : "Error", "用戶資料不存在！", "error");
        return;
      }

      const user = userSnapshot.val();
      const balance = user.balance || 0;

      if (balance < price) {
        speak("餘額不足"); // 播報提示訊息
        Swal.fire(currentLang === "zh-TW" ? "錯誤" : "Error", "餘額不足！", "error");
        return;
      }

      // 扣款並更新用戶餘額
      const updatedBalance = balance - price;
      await update(userRef, { balance: updatedBalance });

      // 記錄交易
      await push(transactionRef, {
        userId: currentUser,
        product: rfidCode,
        amount: -price,
        type: "purchase",
        timestamp: new Date().toISOString(),
      });

      // 提示購買成功
      speak("購買成功"); // 播報提示訊息
      Swal.fire(currentLang === "zh-TW" ? "成功" : "Success", `購買成功：${product.name} - ${price} 元`, "success");
      // 更新交易紀錄圖表
      loadTransactionHistory();

      // 更新餘額顯示
      if (balanceDisplay) {
        balanceDisplay.textContent = `${updatedBalance} 元`;
      }
    } catch (error) {
      speak("購買失敗"); // 播報提示訊息
      console.error("購買失敗：", error);
      Swal.fire(currentLang === "zh-TW" ? "錯誤" : "Error", "購買失敗，請稍後再試！", "error");
    }
  });
}



// 儲值功能
depositButton.addEventListener("click", async () => {
  const amount = parseFloat(transactionAmount.value);

  // 檢查輸入金額是否有效
  if (isNaN(amount) || amount <= 0 || !Number.isFinite(amount)) {
    speak("請輸入有效金額"); // 播報提示訊息
    const message = await translateText("請輸入有效的金額！", currentLang);
    Swal.fire({
      title: currentLang === "zh-TW" ? "錯誤" : "Error",
      text: message,
      icon: "error",
    });
    return;
  }

  try {
    // 獲取當前用戶數據
    const snapshot = await get(userRef);
    const user = snapshot.val() || {};
    const currentBalance = user.balance || 0;

    // 儲存交易紀錄
    await push(transactionRef, {
      userId: currentUser,
      amount: amount,
      type: "deposit",
      timestamp: new Date().toISOString(),
    });

    // 更新用戶餘額
    const updatedBalance = currentBalance + amount;
    await update(userRef, { balance: updatedBalance });

    // 翻譯成功訊息

    const title = await translateText("成功", currentLang);
    const message = await translateText("儲值成功！", currentLang);
    speak("儲值成功"); // 播報提示訊息
    Swal.fire({
      title: title,
      text: message,
      icon: "success",
    }).then(async () => {
      // 更新交易紀錄圖表
      loadTransactionHistory();
      location.reload(true); // 強制重新整理並忽略緩存

    });
  } catch (error) {
    speak("儲值失敗"); // 播報提示訊息
    console.error("儲值失敗：", error);

    // 翻譯錯誤訊息
    const title = await translateText("錯誤", currentLang);
    const message = await translateText("儲值失敗，請稍後再試！", currentLang);

    Swal.fire({
      title: title,
      text: message,
      icon: "error",
    });
  }
});


  // 購票功能
  buyTicketButton.addEventListener("click", () => {
    Swal.fire({
      title: languages[currentLang].select_ticket,
      input: "radio",
      inputOptions: {
        general: languages[currentLang].general_ticket,
        student: languages[currentLang].student_ticket,
        senior: languages[currentLang].senior_ticket,
      },
      inputValidator: (value) => {
        if (!value) {
          return currentLang === "zh-TW"
            ? "請選擇一個票種！"
            : "Please select a ticket type!";
        }
      },
      confirmButtonText: currentLang === "zh-TW" ? "購買" : "Purchase",
      showCancelButton: true,
      cancelButtonText: currentLang === "zh-TW" ? "取消" : "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let ticketPrice;
        switch (result.value) {
          case "general":
            ticketPrice = 300;
            break;
          case "student":
            ticketPrice = 250;
            break;
          case "senior":
            ticketPrice = 200;
            break;
          default:
            ticketPrice = 0;
        }
  
        get(userRef)
          .then((snapshot) => {
            const user = snapshot.val() || {};
            const currentBalance = user.balance || 0;
  
            if (currentBalance < ticketPrice) {
              Swal.fire(
                languages[currentLang].error,
                languages[currentLang].insufficient_balance,
                "error"
              );
              throw new Error("餘額不足");
            }
  
            return update(userRef, {
              balance: currentBalance - ticketPrice,
              ticketPurchased: true,
            });
          })
          .then(() => {
            return push(transactionRef, {
              userId: currentUser,
              amount: -ticketPrice,
              type: "ticket",
              timestamp: new Date().toISOString(),
            });
          })
          .then(() => {
            speak("購票成功"); // 播報提示訊息
            Swal.fire(
              languages[currentLang].success,
              languages[currentLang].ticket_purchase_success,
              "success"
            ).then(() => {
              checkUserStatus(); // 購票後更新狀態
              // 更新交易紀錄圖表
              loadTransactionHistory();
            });
          })
          .catch((error) => {
            if (error.message !== "餘額不足") {
              speak("購票失敗"); // 播報提示訊息
              console.error("購票失敗：", error);
              Swal.fire(
                languages[currentLang].error,
                currentLang === "zh-TW" ? "購票失敗，請稍後再試！" : "Ticket purchase failed, please try again later!",
                "error"
              );
            }
          });
      }
    });
  });

// 加載交易紀錄
function loadTransactionHistory() {
  get(transactionRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const userTransactions = Object.values(data)
        .filter((txn) => txn.userId === currentUser)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // 按時間排序

      const labels = [];
      const balances = [];
      let currentBalance = 0;

      userTransactions.forEach((txn) => {
        currentBalance += txn.amount;
        const timestamp = new Date(txn.timestamp).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
        labels.push(timestamp);
        balances.push(currentBalance);
      });

      // 如果圖表實例存在，先銷毀
      if (chartInstance) {
        chartInstance.destroy();
      }

      // 創建新的圖表實例
      const transactionChart = document.getElementById("transactionChart"); // 確保存在圖表容器
      if (transactionChart) {
        chartInstance = new Chart(transactionChart, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: currentLang === "zh-TW" ? "餘額變動" : "Balance Changes",
                data: balances,
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: currentLang === "zh-TW" ? "交易時間" : "Transaction Time",
                },
              },
              y: {
                title: {
                  display: true,
                  text: currentLang === "zh-TW" ? "餘額 (元)" : "Balance ($)",
                },
              },
            },
          },
        });
      }
    } else {
      console.log("目前無交易紀錄！");
      Swal.fire(
        currentLang === "zh-TW" ? "提示" : "Info",
        currentLang === "zh-TW" ? "目前無任何交易紀錄！" : "No transactions available!",
        "info"
      );
    }
  }).catch((error) => {
    console.error("無法加載交易紀錄：", error);
    Swal.fire(
      currentLang === "zh-TW" ? "錯誤" : "Error",
      currentLang === "zh-TW" ? "無法加載交易紀錄，請稍後再試！" : "Failed to load transactions, please try again later!",
      "error"
    );
  });
}

  loadTransactionHistory();

  // 切換語言按鈕事件
  switchLangButton.addEventListener("click", () => {
    currentLang = currentLang === "zh-TW" ? "en" : "zh-TW";
    translatePage(currentLang); // 刷新頁面內容
    refreshSwalTexts(); // 確保即時更新 SweetAlert2 文本
  });

  // 新增查詢餘額功能
async function queryBalance() {
  try {
    // 獲取當前用戶數據
    const snapshot = await get(userRef);
    const user = snapshot.val() || {};
    const balance = user.balance || 0;

    // 根據當前語言生成餘額訊息
    const balanceMessage =
      currentLang === "zh-TW"
        ? `您的目前餘額為：${balance} 元`
        : `Your current balance is: $${balance}`;

    // 顯示 SweetAlert2 彈窗
    await showTranslatedAlert("success", balanceMessage, "info");
  } catch (error) {
    console.error("查詢餘額失敗：", error);

    // 根據當前語言生成錯誤訊息
    const errorMessage =
      currentLang === "zh-TW"
        ? "查詢餘額失敗，請稍後再試！"
        : "Failed to retrieve balance, please try again later!";

    await showTranslatedAlert("error", errorMessage, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 判斷當前頁面是否有查詢餘額按鈕
  const checkBalanceButton = document.getElementById("checkBalanceButton");

  if (window.location.pathname.includes("dashboard.html")) {
    if (checkBalanceButton) {
      checkBalanceButton.addEventListener("click", () => {
        console.log("查詢餘額按鈕被點擊！");
        queryBalance();
      });
    } else {
      console.error("查詢餘額按鈕未找到！");
    }
  } else {
    console.log("當前頁面不是 dashboard.html，跳過查詢餘額按鈕事件綁定。");
  }

  // 其他頁面通用功能的事件綁定...
});


  // ** 登出功能 **
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    speak("登出成功");//播報語音訊息
    Swal.fire("成功", currentLang === "zh-TW" ? "登出成功！" : "Logout successful!", "success").then(() => {
      window.location.href = "index.html";
    });
  });


 // 進場按鈕事件
  entryButton.addEventListener("click", () => {
    get(userRef)
      .then((snapshot) => {
        const user = snapshot.val();

        if (!user.ticketPurchased) {
          Swal.fire("請先購票", "您必須先購票才能進場！", "error");
          return;
        }

        if (user.isInside) {
          Swal.fire("錯誤", "您已經在場內！", "error");
          return;
        }

        // 更新進場狀態 (isInside 為 true)
        update(userRef, { isInside: true })
        .then(() => {
          speak("進場成功"); // 播報語音訊息
          Swal.fire(
            languages[currentLang].entry_success, // 根據當前語言顯示成功信息
            languages[currentLang].welcome_entry, // 根據當前語言顯示歡迎信息
            "success"
          );
          checkUserStatus(); // 更新按鈕狀態
        })
        .catch((error) => {
          speak("進場失敗"); // 播報語音訊息
          console.error("進場失敗：", error);
          Swal.fire(
            languages[currentLang].error, // 根據當前語言顯示錯誤標題
            languages[currentLang].entry_error, // 根據當前語言顯示錯誤信息
            "error"
          );
        });

      })
      .catch((error) => {
        console.error("獲取用戶資料失敗：", error);
      });
  });


  // 退場按鈕事件
  exitButton.addEventListener("click", () => {
    get(userRef)
      .then((snapshot) => {
        const user = snapshot.val();

        if (!user.ticketPurchased) {
          Swal.fire(
            languages[currentLang].purchase_required, // 當前語言提示購票信息
            languages[currentLang].purchase_before_exit, // 當前語言購票提示
            "error"
          );
          return;
        }

        if (!user.isInside) {
          Swal.fire(
            languages[currentLang].error, // 當前語言錯誤標題
            languages[currentLang].already_outside, // 當前語言已在場外提示
            "error"
          );
          return;
        }

        // 更新退場狀態 (isInside 為 false)
        return update(userRef, { isInside: false })
          .then(() => {
            // 刪除 Firebase 上的用戶資料
            return remove(userRef); // 使用 remove 刪除該用戶資料
          })
          .then(() => {
            // 登出
            localStorage.removeItem("currentUser"); // 清除本地儲存的用戶資料
            speak("退場成功"); // 播報語音訊息
            Swal.fire(
              languages[currentLang].exit_success, // 當前語言退場成功標題
              languages[currentLang].thank_you_exit, // 當前語言感謝信息
              "success"
            ).then(() => {
              // 跳轉到登出或主頁
              window.location.href = "index.html"; // 這裡可以替換成您希望跳轉的頁面
            });
          })
          .catch((error) => {
            speak("退場失敗"); // 播報語音訊息
            console.error("退場失敗：", error);
            Swal.fire(
              languages[currentLang].error, // 當前語言錯誤標題
              languages[currentLang].exit_error, // 當前語言退場錯誤信息
              "error"
            );
          });
      })
      .catch((error) => {
        console.error("獲取用戶資料失敗：", error);
      });
  });




  // 頁面載入後，立即檢查用戶狀態
  checkUserStatus();
});

