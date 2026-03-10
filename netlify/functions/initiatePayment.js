// এটি হলো আপনার ব্যাকএন্ড API। 
// আপনার প্রজেক্টের মেইন ফোল্ডারে 'netlify' নামে একটি ফোল্ডার বানাবেন। 
// তার ভেতরে 'functions' নামে আরেকটি ফোল্ডার বানাবেন। 
// তার ভেতরে এই initiatePayment.js ফাইলটি সেভ করবেন।

exports.handler = async (event, context) => {
  // শুধুমাত্র POST রিকোয়েস্ট গ্রহণ করবে
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // ফ্রন্টএন্ড থেকে আসা ডাটা রিসিভ করা
    const data = JSON.parse(event.body);
    const { name, email, phone } = data;

    // এখানে আপনি পেমেন্ট গেটওয়ের (যেমন: SSLCommerz, aamarPay, bKash) API কল করবেন।
    // ডেমো হিসেবে আমি একটি ফেক সাকসেস রেসপন্স পাঠাচ্ছি।

    console.log("Customer Info:", name, email, phone);

    // পেমেন্ট গেটওয়ের লিংক পাওয়ার পর ফ্রন্টএন্ডে পাঠিয়ে দিন
    const fakePaymentUrl = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php?payment_id=DEMO123";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "success",
        url: fakePaymentUrl, 
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
